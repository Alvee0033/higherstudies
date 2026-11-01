import 'dotenv/config';
import pg from 'pg';
import { enrichNextFaculty } from './automatic-faculty-contacts.mjs';
import { readProgrammeDetails } from './studyportals-details.mjs';
import { readProgrammeWebsite } from './studyportals-website.mjs';
import { readTuition } from './studyportals-tuition.mjs';
import { createPacer } from './collection-pacing.mjs';
import { collectOpenAlex } from './openalex-adapter.mjs';
import { OpenAlexKeyCooldownError } from './openalex-keys.mjs';
import { collectFaculty } from './faculty-adapter.mjs';
import { setTimeout as delay } from 'node:timers/promises';
import { createHash } from 'node:crypto';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
const workerId = `collector-${process.pid}`;
const apiBase = (process.env.API_BASE_URL || `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 4100}`).replace(/\/$/, '');
const internalSecret = process.env.INTERNAL_INGEST_SECRET;
const pollMs = Math.max(1000, Number(process.env.COLLECTOR_POLL_MS || 2000));
const heartbeatMs = 10_000;
let stopping = false;
let activeJobId = null;
let lastHeartbeat = 0;
let heartbeatInFlight = null;
let heartbeatTimer;
let activeAbort;
let activePacer;
let contactEnrichmentActive = false;
const contactController = new AbortController();
let contactWork;
async function checkpoint(found) {
  const result = await pool.query(`SELECT j.status,s.enabled,s.permission_status FROM crawl_job j JOIN source s ON s.id=j.source_id WHERE j.id=$1`, [activeJobId]);
  const row = result.rows[0];
  if (!row || row.status !== 'running' || !row.enabled || row.permission_status !== 'approved') { activeAbort?.abort(); throw new Error('Collection stopped or source disabled'); }
  if (found !== undefined) await pool.query(`UPDATE crawl_job SET found_count=$2 WHERE id=$1 AND status='running'`, [activeJobId, found]);
}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!internalSecret) throw new Error('INTERNAL_INGEST_SECRET is required; refusing to start collector');

const log = (event, data = {}) => process.stdout.write(`${JSON.stringify({ at: new Date().toISOString(), workerId, event, ...data })}\n`);

async function writeHeartbeat() {
  const now = Date.now();
  if (now - lastHeartbeat < heartbeatMs) return;
  lastHeartbeat = now;
  heartbeatInFlight = (async () => {
    const result = await pool.query(`
      SELECT count(*) FILTER (WHERE permission_status='approved' AND enabled)::int AS runnable
      FROM source
    `);
    const runnable = result.rows[0]?.runnable ?? 0;
    const status = {
      workerId,
      available: true,
      lastHeartbeatAt: new Date(now).toISOString(),
      activeJobId,
      message: contactEnrichmentActive ? 'Automatically finding and saving public faculty contacts.' : activeJobId
        ? 'Collector worker online and processing a job.'
        : runnable
          ? `Collector worker online. ${runnable} approved source${runnable === 1 ? '' : 's'} available.`
          : 'Collector worker online. Approve and enable a source before starting a crawl.',
    };
    await pool.query(`
      INSERT INTO system_setting(key,value,updated_at) VALUES('collector_worker',$1,now())
      ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()
    `, [JSON.stringify(status)]);
  })();
  try { await heartbeatInFlight; }
  catch (error) { lastHeartbeat = 0; throw error; }
  finally { heartbeatInFlight = null; }
}

async function claimJob() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const found = await client.query(`
      SELECT j.id,j.source_id,j.depth,j.mode,j.progress,s.name AS source_name,s.base_url,s.adapter
      FROM crawl_job j JOIN source s ON s.id=j.source_id LEFT JOIN source_collection_state cs ON cs.source_id=s.id
      WHERE j.status='queued' AND s.enabled=true AND s.permission_status='approved' AND (cs.cooldown_until IS NULL OR cs.cooldown_until<=clock_timestamp())
      ORDER BY j.started_at ASC NULLS FIRST,j.created_at,j.id FOR UPDATE OF j SKIP LOCKED LIMIT 1
    `);
    if (!found.rowCount) {
      await client.query('COMMIT');
      return null;
    }
    const job = found.rows[0];
    await client.query(`UPDATE crawl_job SET status='running',started_at=now(),last_error=NULL WHERE id=$1`, [job.id]);
    await client.query('COMMIT');
    return job;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function readPortalCard(wrapper, degree) {
  const item = wrapper?.card?.func ?? wrapper;
  const get = (key) => item?.[key]?.func ?? item?.[key];
  const id = String(get('getId') ?? wrapper?.id ?? '').trim();
  const title = String(get('getTitle') ?? '').trim();
  const university = get('getUniversityLink') ?? {};
  const location = get('getLocation') ?? {};
  const city = location?.getCity?.func?.getDescription ?? get('getLocationText') ?? null;
  const countryCode = String(get('getCountryIsoCode') ?? location?.getCountryIso ?? '').toUpperCase();
  const path = get('getProgrammeLink')?.getUrl ?? '';
  const portal = degree === 'phd' ? 'www.phdportal.com' : 'www.mastersportal.com';
  let sourceUrl;
  try {
    const parsed = new URL(path || `/studies/${encodeURIComponent(id)}`, `https://${portal}`);
    if (parsed.protocol !== 'https:' || parsed.hostname !== portal) return null;
    sourceUrl = parsed.toString();
  } catch { return null; }
  const institutionName = university?.getDescription;
  if (!id || !title || !institutionName || !/^[A-Z]{2}$/.test(countryCode)) return null;
  const tuition = get('getTuitionFees');
  const tuitionInfo = readTuition(tuition);
  return {
    externalId: id,
    sourceUrl,
    payload: {
      title,
      degree,
      institutionName: String(institutionName).trim(),
      countryCode,
      city: city ? String(city).trim() : null,
      duration: get('getDuration') ?? null,
      sourceDetails: readProgrammeDetails(item),
      tuition: tuitionInfo,
      programmeWebsiteUrl: readProgrammeWebsite(get('getReferralLink')),
    },
  };
}

async function requestPage(baseUrl, degree, size, offset) {
  const url = new URL('/programmes/search', baseUrl);
  url.searchParams.set('educationalLevels', degree === 'phd' ? 'phd' : 'master');
  url.searchParams.set('resultSize', String(size));
  url.searchParams.set('resultOffset', String(offset));
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await activePacer.beforeRequest();
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'HigherStudyCollector/1.0 (+admin-managed academic discovery)' },
        signal: AbortSignal.any([AbortSignal.timeout(15_000), activeAbort.signal]),
        redirect: 'error',
      });
      await activePacer.response(response,attempt);
      if (response.ok) {
        const data = await response.json();
        const programmes = Array.isArray(data.programmes) ? data.programmes : [];
        const records = programmes.map((item) => readPortalCard(item, degree)).filter(Boolean);
        records.hasMore = programmes.length === size;
        return records;
      }
      if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) {
        throw new Error(`Studyportals adapter returned HTTP ${response.status}`);
      }
      const retryAfter = Number(response.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 60_000)
        : Math.min(1000 * (2 ** attempt), 10_000);
      await delay(waitMs);
    } catch (err) {
      if (activeAbort.signal.aborted) throw err;
      if (attempt === 2) throw err;
      await delay(Math.min(1500 * (2 ** attempt), 10_000));
    }
  }
  return [];
}

async function discoverStudyportals(job) {
  const sourceUrl = new URL(job.base_url);
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'search-api.prtl.co') {
    throw new Error('Studyportals adapter only permits the registered HTTPS search-api.prtl.co endpoint.');
  }
  const resultSize = 25;
  let processedPages = 0;
  let found = Number(job.progress?.found || 0);
  let accepted = Number(job.progress?.accepted || 0);
  // Scrape both Masters and PhDs concurrently/interleaved per crawl iteration
  let mastersPage = Number(job.progress?.mastersPage || 0);
  let phdPage = Number(job.progress?.phdPage || 0);

  for (const degree of ['phd', 'masters']) {
    let page = degree === 'phd' ? phdPage : mastersPage;
    await checkpoint();
    const batch = await requestPage(sourceUrl, degree, resultSize, page * resultSize);
    if (batch.length > 0) {
      const result = await stageItems(job, batch, 'programme', `${degree}-${page}`);
      found += batch.length; accepted += result.accepted;
      
      if (degree === 'phd') phdPage += 1;
      else mastersPage += 1;
      processedPages += 1;

      const coolingDown = await activePacer.records(batch.length);
      if (coolingDown) {
        log('periodic_cooldown_started', { jobId: job.id, degree, page, found, accepted });
        break;
      }
    }
  }

  const progress = { mastersPage, phdPage, found, accepted };
  await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`, [job.id, JSON.stringify(progress), found, accepted]);
  return { found, accepted, more: true };
}

async function stageItems(job, unique, recordType, batchKey = '') {
  let accepted = 0;
  for (let index = 0; index < unique.length; index += 100) {
    await checkpoint();
    const items = unique.slice(index, index + 100);
    let staged = false;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(`${apiBase}/v1/internal/ingestion/batches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-internal-key': internalSecret },
          signal: AbortSignal.timeout(30_000),
          body: JSON.stringify({
            schemaVersion: 1,
            sourceId: job.source_id,
            runId: job.id,
            idempotencyKey: `job-${job.id}-${createHash('sha256').update(batchKey).digest('hex').slice(0,24)}-${index}`,
            recordType,
            items,
          }),
        });
        if (!response.ok) throw new Error(`Staging API returned HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
        const result = await response.json();
        accepted += result.accepted ?? 0;
        staged = true;
        break;
      } catch (err) {
        if (activeAbort?.signal?.aborted) throw err;
        if (attempt === 2) throw err;
        await delay(Math.min(1500 * (2 ** attempt), 6000));
      }
    }
    if (!staged) throw new Error('Failed to stage batch after 3 attempts');
  }


  return { found: unique.length, accepted };
}

async function runJob(job) {
  activeJobId = job.id;
  activeAbort = new AbortController();
  activePacer = createPacer(pool, job, activeAbort.signal);
  const cancellationTimer = setInterval(() => { checkpoint().catch(() => activeAbort?.abort()); }, 1000);
  lastHeartbeat = 0;
  await writeHeartbeat();
  log('job_started', { jobId: job.id, source: job.source_name, adapter: job.adapter, depth: job.depth });
  try {
    let result;
    if (job.adapter === 'studyportals-search') result = await discoverStudyportals(job);
    else if (job.adapter === 'openalex-authors') result = await collectOpenAlex(job, pool, checkpoint, activeAbort.signal, (items, key, recordType = 'faculty_member') => stageItems(job, items, recordType, key), activePacer);
    else if (job.adapter === 'official-faculty') result = await stageItems(job, await collectFaculty(job, pool, checkpoint, activeAbort.signal), 'faculty_member');
    else throw new Error(`No collector adapter is implemented for '${job.adapter}'. Job was not crawled.`);
    await checkpoint();
    if (result.more) {
      await pool.query(`UPDATE crawl_job SET status='queued',found_count=$2,accepted_count=$3 WHERE id=$1 AND status='running'`, [job.id,result.found,result.accepted]);
      log('job_checkpoint', {jobId:job.id,found:result.found,accepted:result.accepted});
      return;
    }
    await pool.query(`UPDATE crawl_job SET runtime=jsonb_build_object('phase','completed','message','Collection completed.'),status='completed',found_count=$2,accepted_count=$3,error_count=0,completed_at=now() WHERE id=$1 AND status='running'`, [job.id, result.found, result.accepted]);
    await pool.query(`UPDATE source SET last_success_at=now(),updated_at=now() WHERE id=$1`, [job.source_id]);
    log('job_completed', { jobId: job.id, ...result });
  } catch (error) {
    if (error instanceof OpenAlexKeyCooldownError && error.waitUntil) {
      await pool.query(`INSERT INTO source_collection_state(source_id,cooldown_until) VALUES($1,$2) ON CONFLICT(source_id) DO UPDATE SET cooldown_until=GREATEST(COALESCE(source_collection_state.cooldown_until,clock_timestamp()),EXCLUDED.cooldown_until)`, [job.source_id,error.waitUntil]);
      await pool.query(`UPDATE crawl_job SET status='queued',runtime=$2 WHERE id=$1 AND status='running'`,[job.id,JSON.stringify({phase:'cooldown',message:error.message,waitUntil:error.waitUntil.toISOString(),updatedAt:new Date().toISOString()})]);
      log('job_cooling_down',{jobId:job.id,waitUntil:error.waitUntil.toISOString()});
      return;
    }
    const message = error instanceof Error ? error.message.slice(0, 1000) : 'Unknown collector error';
    const stack = error instanceof Error ? error.stack : undefined;
    const cause = error?.cause ? (error.cause.message || String(error.cause)) : undefined;
    await pool.query(`UPDATE crawl_job SET runtime=CASE WHEN runtime->>'phase'='blocked' THEN runtime ELSE jsonb_build_object('phase','failed','message',$2::text) END,status='failed',error_count=1,last_error=$2,completed_at=now() WHERE id=$1 AND status='running'`, [job.id, message]);
    log('job_failed', { jobId: job.id, error: message, stack, cause });
  } finally {
    clearInterval(cancellationTimer);
    activeAbort = null;
    activeJobId = null;
    lastHeartbeat = 0;
    await writeHeartbeat();
  }
}

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  activeAbort?.abort();
  contactController.abort();
  await contactWork?.catch(()=>{});
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  log('shutdown', { signal });
  try {
    await pool.query(`UPDATE system_setting SET value=jsonb_set(value,'{available}','false'::jsonb)||jsonb_build_object('lastHeartbeatAt',now()::text,'message','Collector worker stopped.') ,updated_at=now() WHERE key='collector_worker'`);
    await pool.end();
  } finally { process.exit(0); }
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

log('worker_started', { apiBase, pollMs });
heartbeatTimer = setInterval(() => {
  writeHeartbeat().catch((error) => log('heartbeat_failed', { error: error instanceof Error ? error.message : String(error) }));
}, heartbeatMs);
// Contact lookups run independently so slow university pages never stall catalogue scraping.
contactWork = (async () => {
  while (!stopping) {
    try {
      await pool.query(`INSERT INTO faculty_contact_task(faculty_id) SELECT f.id FROM faculty_member f WHERE f.status='published' AND f.public_email IS NULL AND NOT EXISTS(SELECT 1 FROM faculty_contact_task t WHERE t.faculty_id=f.id) ORDER BY f.id LIMIT 500 ON CONFLICT DO NOTHING`);
      contactEnrichmentActive=true;
      const processed=await enrichNextFaculty(pool,contactController.signal);
      contactEnrichmentActive=false;
      if(!processed)await delay(3000,undefined,{signal:contactController.signal});
    } catch(error) {
      contactEnrichmentActive=false;
      if(stopping)break;
      log('contact_enrichment_error',{message:error instanceof Error?error.message:'Contact lookup failed'});
      await delay(5000,undefined,{signal:contactController.signal}).catch(()=>{});
    }
  }
})();
while (!stopping) {
  try {
    await writeHeartbeat();
    const job = await claimJob();
    if (job) await runJob(job);
    else await delay(pollMs);
  } catch (error) {
    log('worker_error', { error: error instanceof Error ? error.message : String(error) });
    await delay(Math.min(pollMs * 3, 15_000));
  }
}
