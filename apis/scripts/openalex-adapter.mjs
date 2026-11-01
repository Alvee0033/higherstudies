import {institutionRecords,saveInstitutionAnchors} from './openalex-institution-bootstrap.mjs';
import {applyOpenAlexAuth, markKeyExhausted, getCurrentOpenAlexKey, getAvailableKeys, configuredOpenAlexKeyCount, nextOpenAlexKeyAvailableAt, OpenAlexKeyCooldownError} from './openalex-keys.mjs';
const BASE = 'https://api.openalex.org';
export function readOpenAlexAuthor(author, institution) {
  if (!/^https:\/\/openalex\.org\/A\d+$/.test(author?.id || '') || !author.display_name?.trim()) return null;
  if (!author.last_known_institutions?.some((item) => item.id === institution.openalex_id)) return null;
  return {
    externalId: author.id, sourceUrl: `${BASE}/authors/${author.id.split('/').pop()}`,
    payload: {
      name: author.display_name.trim(), institutionId: institution.id, institutionName: institution.name,
      openAlexId: author.id, orcid: author.orcid || null,
      researchTopics: (author.topics || author.x_concepts || []).map((topic) => topic.display_name).filter((topic) => typeof topic === 'string').slice(0, 10),
      worksCount: Number.isInteger(author.works_count) ? author.works_count : null,
      citedByCount: Number.isInteger(author.cited_by_count) ? author.cited_by_count : null,
      hIndex: Number.isInteger(author.summary_stats?.h_index) ? author.summary_stats.h_index : null,
      affiliationStatus: 'OpenAlex last-known affiliation; current faculty appointment requires institutional verification',
      evidenceExcerpt: `OpenAlex author ${author.id}; last-known affiliation: ${institution.name}. Research metadata only.`,
    },
  };
}

export async function collectOpenAlex(job, pool, checkpoint, signal, stage, pacer) {
  if (new URL(job.base_url).origin !== BASE) throw new Error('OpenAlex source must use https://api.openalex.org');

  // Complete registry discovery first, even when the database already has institutions.
  // A saved cursor belongs to this job; the mere presence of rows is not a completion marker.
  if (!job.progress?.institutionDiscoveryComplete) {
    const url = new URL('/institutions', BASE);
    url.searchParams.set('filter', 'type:education');
    url.searchParams.set('sort', 'works_count:desc');
    url.searchParams.set('per_page', '100');
    const discoveryCursor = job.progress?.institutionDiscoveryCursor || '*';
    url.searchParams.set('cursor', discoveryCursor);
    const body = await request(url);
    const records = institutionRecords(body);
    await saveInstitutionAnchors(pool, job.source_id, records);
    const result = await stage(records, `registry-${discoveryCursor}`, 'institution');
    const found = Number(job.progress?.found || 0) + records.length;
    const accepted = Number(job.progress?.accepted || 0) + result.accepted;
    const nextCursor = body.meta?.next_cursor;
    job.progress = {
      ...job.progress,
      registryBootstrap: true,
      institutionDiscoveryCursor: nextCursor || null,
      institutionDiscoveryComplete: !nextCursor || nextCursor === discoveryCursor || !body.results?.length,
      registryPages: Number(job.progress?.registryPages || 0) + 1,
      registryCandidates: Number(job.progress?.registryCandidates || 0) + records.length,
      found,
      accepted,
    };
    await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`, [job.id, JSON.stringify(job.progress), found, accepted]);
    await pacer?.records(records.length);
    return { found, accepted, more: true };
  }

  // Stable order keeps saved offsets meaningful across worker cycles.
  const institutions = (await pool.query(`
    SELECT id, name, country_code, openalex_id FROM institution
    WHERE
      EXISTS(SELECT 1 FROM programme p WHERE p.institution_id = institution.id)
      OR openalex_id ~ '^https://openalex[.]org/I[0-9]+$'
    ORDER BY id
  `)).rows;

  let found = Number(job.progress?.found || 0);
  let accepted = Number(job.progress?.accepted || 0);
  let processedPages = 0;
  let institutionIndex = Number(job.progress?.institutionIndex || 0);
  let cursor = job.progress?.cursor || '*';

  async function request(url) {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      await checkpoint();
      await pacer?.beforeRequest();
      const activeKey = getCurrentOpenAlexKey();
      if (configuredOpenAlexKeyCount() && !activeKey) throw new OpenAlexKeyCooldownError(nextOpenAlexKeyAvailableAt());
      const requestUrl = new URL(url);
      applyOpenAlexAuth(requestUrl, activeKey);
      try {
        const response = await fetch(requestUrl, {
          redirect: 'error',
          signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
          headers: { Accept: 'application/json', 'User-Agent': 'HigherStudyCollector/1.0' },
        });
        await pacer?.response(response, attempt);
        if (response.ok) return await response.json();
        if ([401, 403, 429].includes(response.status)) {
          const retryAfter = Number(response.headers.get('retry-after')) || 3600;
          markKeyExhausted(activeKey, retryAfter);
          if (getAvailableKeys().length) continue;
          if (activeKey) throw new OpenAlexKeyCooldownError(nextOpenAlexKeyAvailableAt());
        }
        if (![500, 502, 503, 504].includes(response.status) || attempt === 5) {
          throw new Error(`OpenAlex returned HTTP ${response.status}${[401, 403].includes(response.status) ? '; daily quota reached or configure OPENALEX_API_KEY from openalex.org/settings/api-key' : '; run can resume from its checkpoint'}`);
        }
        await new Promise((resolve) => setTimeout(resolve, Math.min(30000, 2000 * 2 ** attempt)));
      } catch (err) {
        if (signal?.aborted) throw err;
        if (err instanceof OpenAlexKeyCooldownError) throw err;
        if (/OpenAlex returned HTTP (401|403|429)/.test(String(err))) throw err;
        if (attempt === 5) throw err;
        await new Promise((resolve) => setTimeout(resolve, Math.min(10000, 1500 * 2 ** attempt)));
      }
    }
  }

  if (!institutions.length) return { found, accepted };

  // === PHASE 1: Resolve openalex_id for institutions that have programmes but lack it ===
  // This is the key fix: institutions created from Studyportals (e.g. BRAC University) won't have
  // openalex_id set. We resolve them now so they appear in the faculty fetch phase below.
  let resolveOffset = Number(job.progress?.resolveOffset ?? institutions.length); // default: skip if checkpoint already past this
  // Only run resolve phase if it hasn't been done yet (resolveOffset < institutions.length means in progress)
  if (job.progress?.resolveOffset !== undefined) {
    resolveOffset = Number(job.progress.resolveOffset);
  } else {
    resolveOffset = 0; // fresh job — start from beginning
  }
  let resolveBatches = 0;
  while (resolveOffset < institutions.length) {
    await checkpoint();
    const inst = institutions[resolveOffset];
    if (!inst.openalex_id) {
      try {
        const searchUrl = new URL('/institutions', BASE);
        searchUrl.searchParams.set('search', inst.name);
        if (inst.country_code) searchUrl.searchParams.set('filter', `country_code:${inst.country_code.toLowerCase()}`);
        searchUrl.searchParams.set('per_page', '1');
        const data = await request(searchUrl);
        if (data) {
          const hit = data.results?.[0];
          if (hit?.id && /^https:\/\/openalex\.org\/I\d+$/.test(hit.id)) {
            const existing = (await pool.query('SELECT id FROM institution WHERE openalex_id=$1 LIMIT 1', [hit.id])).rows[0];
            if (existing && existing.id !== inst.id) {
              // Merge into canonical institution that already has this openalex_id
              await pool.query('UPDATE programme SET institution_id=$1 WHERE institution_id=$2', [existing.id, inst.id]);
              await pool.query('UPDATE faculty_member SET institution_id=$1 WHERE institution_id=$2', [existing.id, inst.id]);
              await pool.query('DELETE FROM institution WHERE id=$1', [inst.id]);
              inst.id = existing.id;
              inst.openalex_id = hit.id;
            } else {
              const officialUrl = (() => { try { const u = new URL(hit.homepage_url || ''); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; } })();
              await pool.query('UPDATE institution SET openalex_id=$1, official_url=COALESCE(official_url,$2) WHERE id=$3', [hit.id, officialUrl, inst.id]);
              inst.openalex_id = hit.id;
            }
          }
        }
      } catch (error) {
        // Quota/authentication errors must pause the job without advancing the checkpoint.
        if (/OpenAlex returned HTTP (401|403|429)/.test(String(error))) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // polite pacing between resolve calls
    }
    resolveOffset += 1;
    resolveBatches += 1;
    const progress = { ...job.progress, resolveOffset, institutionIndex, institutionsTotal: institutions.length, cursor, found, accepted };
    await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`, [job.id, JSON.stringify(progress), found, accepted]);
    // Yield after every 5 resolve calls so the job can checkpoint between worker cycles
    if (resolveBatches >= 5 && resolveOffset < institutions.length) return { found, accepted, more: true };
  }

  const withOpenAlex = institutions.filter(i => i.openalex_id && /^https:\/\/openalex\.org\/I\d+$/.test(i.openalex_id));
  // The saved index is relative to this filtered list. Recover by ID after registry growth.
  if (job.progress?.institutionId) {
    const savedIndex = withOpenAlex.findIndex(item => item.id === job.progress.institutionId);
    if (savedIndex >= 0) institutionIndex = savedIndex;
  }

  // === PHASE 2: Fetch authors (faculty) per institution ===
  // withOpenAlex is already ordered: institutions with programmes but no faculty come first.
  const maxPagesPerInst = job.depth === 'deep' ? 5 : job.depth === 'medium' ? 3 : 2;
  let institutionPages = Number(job.progress?.institutionPages || 0);
  while (institutionIndex < withOpenAlex.length) {
    const institution = withOpenAlex[institutionIndex];
    await checkpoint();
    const url = new URL('/authors', BASE);
    url.searchParams.set('filter', `last_known_institutions.id:${institution.openalex_id.split('/').pop()}`);
    url.searchParams.set('sort', 'cited_by_count:desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('cursor', cursor);
    const body = await request(url);
    const items = (Array.isArray(body.results) ? body.results : []).map((author) => readOpenAlexAuthor(author, institution)).filter(Boolean);
    const result = await stage(items, `${institution.id}-${cursor}`);
    found += items.length; accepted += result.accepted;
    const cooling = await pacer?.records(items.length);
    const next = body.meta?.next_cursor;
    institutionPages += 1;
    if (!next || !body.results?.length || next === cursor || institutionPages >= maxPagesPerInst) {
      institutionIndex += 1;
      cursor = '*';
      institutionPages = 0;
    } else {
      cursor = next;
    }
    const progress = { ...job.progress, resolveOffset, metadataOffset: Number(job.progress?.metadataOffset || 0), institutionIndex, institutionId: withOpenAlex[institutionIndex]?.id || null, institutionsTotal: withOpenAlex.length, cursor, institutionPages, found, accepted };
    await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`, [job.id, JSON.stringify(progress), found, accepted]);
    processedPages += 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if ((processedPages >= 2 || cooling) && institutionIndex < withOpenAlex.length) return { found, accepted, more: true };
  }

  // === PHASE 3: Batch-enrich institution metadata from OpenAlex (only those with openalex_id now) ===
  let metadataOffset = Number(job.progress?.metadataOffset || 0);
  let metadataBatches = 0;
  while (metadataOffset < withOpenAlex.length) {
    await checkpoint();
    const chunk = withOpenAlex.slice(metadataOffset, metadataOffset + 100);
    const url = new URL('/institutions', BASE);
    url.searchParams.set('filter', `ids.openalex:${chunk.map(item => item.openalex_id.split('/').pop()).join('|')}`);
    url.searchParams.set('per_page', '100');
    const body = await request(url);
    const allowed = new Set(chunk.map(item => item.openalex_id));
    const items = (Array.isArray(body.results) ? body.results : [])
      .filter(data => allowed.has(data.id) && data.display_name && /^[A-Z]{2}$/.test(data.country_code || ''))
      .map(data => ({ externalId: data.id, sourceUrl: `${BASE}/institutions/${data.id.split('/').pop()}`, payload: { name: data.display_name, countryCode: data.country_code, city: data.geo?.city || null, officialUrl: data.homepage_url || null, rorId: data.ror || null, openAlexId: data.id, evidenceExcerpt: `OpenAlex institutional metadata for ${data.display_name}` } }));
    const result = await stage(items, `institution-batch-${metadataOffset}`, 'institution');
    found += items.length; accepted += result.accepted; metadataOffset += chunk.length;
    const cooling = await pacer?.records(items.length);
    const progress = { ...job.progress, resolveOffset, institutionIndex, institutionId: withOpenAlex[institutionIndex]?.id || null, institutionsTotal: institutions.length, cursor, metadataOffset, found, accepted };
    await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`, [job.id, JSON.stringify(progress), found, accepted]);
    metadataBatches++;
    if ((metadataBatches >= 2 || cooling) && metadataOffset < withOpenAlex.length) return { found, accepted, more: true };
  }

  return { found, accepted };
}
