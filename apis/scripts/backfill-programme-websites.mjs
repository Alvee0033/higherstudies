import 'dotenv/config';
import pg from 'pg';
import {readProgrammeWebsite} from './studyportals-website.mjs';
import {createPacer} from './collection-pacing.mjs';
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:3});
const lock=await pool.connect(),control=new AbortController();let job;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>control.abort());
try {
 if(!(await lock.query(`SELECT pg_try_advisory_lock(hashtext('programme-website-backfill')) AS ok`)).rows[0].ok)throw new Error('Backfill already running');
 const source=(await pool.query(`SELECT id FROM source WHERE adapter='studyportals-search' AND permission_status='approved' AND enabled=true ORDER BY id LIMIT 1`)).rows[0];
 if(!source)throw new Error('No enabled approved Studyportals source');
 job=(await pool.query(`INSERT INTO crawl_job(source_id,idempotency_key,status,depth,mode,started_at,progress) VALUES($1,'programme-websites-v1','running','shallow','refresh',now(),'{"purpose":"programme_websites","degreeIndex":0,"page":0,"linked":0}') ON CONFLICT(source_id,idempotency_key) DO UPDATE SET status=CASE WHEN crawl_job.status IN ('failed','partial') THEN 'running' ELSE crawl_job.status END,last_error=NULL RETURNING *`,[source.id])).rows[0];
 if(job.status!=='running')throw new Error(`Backfill is ${job.status}`);
 const pacer=createPacer(pool,job,control.signal);let linked=Number(job.progress.linked??0),found=Number(job.found_count??0);
 let retries=0;
 for(let di=Number(job.progress.degreeIndex??0);di<2;di++){
  const degree=['master','phd'][di];
  for(let page=di===job.progress.degreeIndex?Number(job.progress.page??0):0;page<10000;page++){
   const state=(await pool.query(`SELECT j.status,s.enabled,s.permission_status FROM crawl_job j JOIN source s ON s.id=j.source_id WHERE j.id=$1`,[job.id])).rows[0];
   if(control.signal.aborted||state.status!=='running'||!state.enabled||state.permission_status!=='approved')throw new Error('Website backfill stopped');
   await pacer.beforeRequest();
   const url=new URL('https://search-api.prtl.co/programmes/search');url.searchParams.set('educationalLevels',degree);url.searchParams.set('resultSize','25');url.searchParams.set('resultOffset',String(page*25));
   const r=await fetch(url,{headers:{Accept:'application/json','User-Agent':'HigherStudyCollector/1.0 (+admin-managed academic discovery)'},signal:AbortSignal.any([control.signal,AbortSignal.timeout(20000)]),redirect:'error'});await pacer.response(r);
   if(r.status===429||r.status>=500){if(++retries>5)throw new Error('Source retry limit reached; checkpoint preserved');page--;continue;}retries=0;if(!r.ok)throw new Error(`Source HTTP ${r.status}; checkpoint preserved`);
   const data=await r.json();if(!Array.isArray(data.programmes))throw new Error('Invalid source response');
   for(const wrapper of data.programmes){
    const card=wrapper?.card?.func??wrapper,get=k=>card?.[k]?.func??card?.[k];
    const destination=readProgrammeWebsite(get('getReferralLink'));if(!destination)continue;
    const id=String(get('getId')??wrapper.id??'');if(!/^\d+$/.test(id))continue;
    const portal=degree==='phd'?'www.phdportal.com':'www.mastersportal.com';
    const evidenceUrl=new URL(get('getProgrammeLink')?.getUrl||`/studies/${id}`,`https://${portal}`).toString();if(new URL(evidenceUrl).hostname!==portal)continue;
    const result=await pool.query(`WITH changed AS (UPDATE programme p SET official_url=$1,updated_at=now() FROM source_evidence ev WHERE p.evidence_id=ev.id AND ev.source_id=$2 AND p.discovery_url=$3 AND p.status='published' AND p.official_url IS NULL RETURNING p.id) INSERT INTO audit_event(action,entity_type,entity_id,metadata) SELECT 'programme_website_link_added','programme',id,$4::jsonb FROM changed RETURNING entity_id`,[destination,source.id,evidenceUrl,JSON.stringify({sourceUrl:evidenceUrl,destination,observedAt:new Date().toISOString(),jobId:job.id,method:'source_referral_destination',scope:'programme_website_link_only'})]);linked+=result.rowCount;
   }
   found+=data.programmes.length;const done=data.programmes.length<25;
   await pool.query(`UPDATE crawl_job SET progress=$2,found_count=$3,accepted_count=$4 WHERE id=$1 AND status='running'`,[job.id,JSON.stringify({purpose:'programme_websites',degreeIndex:done?di+1:di,page:done?0:page+1,linked}),found,linked]);
   await pacer.records(data.programmes.length);console.log(JSON.stringify({event:'website_progress',jobId:job.id,degree,page,scanned:found,linked}));
   if(done)break;if(page===9999)throw new Error('Source page bound reached');
  }
 }
 await pool.query(`UPDATE crawl_job SET status='completed',completed_at=now(),runtime=$2 WHERE id=$1 AND status='running'`,[job.id,JSON.stringify({phase:'completed',message:`Website scan complete: ${linked} direct links added. Listings without destinations remain unavailable.`})]);
}catch(error){if(job)await pool.query(`UPDATE crawl_job SET status=CASE WHEN status='cancelled' THEN status ELSE 'partial' END,last_error=$2 WHERE id=$1 AND status<>'completed'`,[job.id,error.message]);console.error(error.message);process.exitCode=1;
}finally{lock.release();await pool.end();}
