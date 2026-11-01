import { setTimeout as delay } from 'node:timers/promises';

export function retryAfterMs(value, now = Date.now()) {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : 0;
}
export function nextRestCount(current, added, threshold) {
  const total = current + added;
  return { rest: total >= threshold, remaining: total % threshold };
}

export function createPacer(pool, job, signal) {
  const runtime = async (phase, message, waitUntil = null, httpStatus = null) => {
    await pool.query(`UPDATE crawl_job SET runtime=$2 WHERE id=$1 AND status='running'`, [job.id,JSON.stringify({phase,message,waitUntil,httpStatus,updatedAt:new Date().toISOString()})]);
  };
  return {
    async beforeRequest() {
      await pool.query(`INSERT INTO source_collection_state(source_id) VALUES($1) ON CONFLICT DO NOTHING`,[job.source_id]);
      // Atomic reservation prevents simultaneous workers from exceeding per-source spacing.
      const result = await pool.query(`UPDATE source_collection_state SET next_request_at=GREATEST(clock_timestamp(),next_request_at,COALESCE(cooldown_until,clock_timestamp()))+make_interval(secs=>request_interval_seconds),updated_at=clock_timestamp() WHERE source_id=$1 RETURNING next_request_at-make_interval(secs=>request_interval_seconds) AS ready_at,cooldown_until`,[job.source_id]);
      const row=result.rows[0]; const readyAt=new Date(row.ready_at).getTime();
      const wait=Math.max(0,readyAt-Date.now());
      if(wait) {
        const cooling=row.cooldown_until && new Date(row.cooldown_until).getTime()>Date.now();
        await runtime(cooling?'cooldown':'waiting',cooling?'Resting before the next source request.':'Waiting for the configured request interval.',new Date(readyAt).toISOString());
        while (Date.now() < readyAt) await delay(Math.min(60000, readyAt-Date.now()),undefined,{signal});
      }
      if(signal.aborted) throw signal.reason;
      await runtime('requesting','Requesting the next source page.');
    },
    async response(response, attempt=0) {
      if(response.status===429 || [500,502,503,504].includes(response.status)) {
        const rawWait = retryAfterMs(response.headers.get('retry-after'));
        const wait = Math.min(60000, Math.max(rawWait || 0, 5000 * 2 ** attempt));
        await pool.query(`UPDATE source_collection_state SET cooldown_until=GREATEST(COALESCE(cooldown_until,clock_timestamp()),clock_timestamp()+($2::double precision*interval '1 millisecond')) WHERE source_id=$1`,[job.source_id,wait]);
        await runtime('cooldown',`Source returned HTTP ${response.status}; waiting before retry.`,new Date(Date.now()+wait).toISOString(),response.status);
      } else if([401,403].includes(response.status)) {
        await runtime('blocked',`Source returned HTTP ${response.status}. Access is paused; the checkpoint is preserved.`,null,response.status);
      } else if(response.ok) await runtime('collecting','Extracting source data and saving records.',null,response.status);
    },
    async records(count) {
      const result=await pool.query(`UPDATE source_collection_state SET records_since_rest=(records_since_rest+$2)%rest_every_records,cooldown_until=CASE WHEN records_since_rest+$2>=rest_every_records THEN GREATEST(COALESCE(cooldown_until,clock_timestamp()),clock_timestamp()+make_interval(secs=>rest_seconds)) ELSE cooldown_until END,updated_at=clock_timestamp() WHERE source_id=$1 RETURNING cooldown_until`,[job.source_id,count]);
      const until=result.rows[0]?.cooldown_until;
      if(until && new Date(until)>new Date()) { await runtime('cooldown','Periodic rest after the configured record threshold.',new Date(until).toISOString()); return true; }
      return false;
    },
  };
}
