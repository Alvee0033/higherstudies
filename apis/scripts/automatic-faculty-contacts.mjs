import {fetchOfficial} from './faculty-adapter.mjs';
import {extractPublicContact} from './faculty-contact.mjs';
import {createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
const clean=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const cache=new Map(),nextRequest=new Map();
export function profileCandidates(html,pageUrl,name){
 const expected=clean(name),tokens=expected.split(' ').filter(token=>token.length>2);
 if(tokens.length<2)return [];
 const base=new URL(pageUrl),links=[];
 for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
  try{const url=new URL(match[1].replaceAll('&amp;','&'),base);const label=clean(match[2].replace(/<[^>]+>/g,' ')),path=clean(decodeURIComponent(url.pathname));
   if(url.origin===base.origin&&url.protocol==='https:'&&!url.username&&!url.password&&(label===expected||tokens.every(token=>path.split(' ').includes(token)))){url.hash='';links.push(url.href);}
  }catch{/* Invalid source links are omitted. */}
 }
 return [...new Set(links)].slice(0,5);
}
async function readPage(url,signal){
 const stored=cache.get(url);if(stored&&stored.expires>Date.now()){if(stored.error)throw new Error(stored.error);return stored.html;}
 const origin=new URL(url).origin;await delay(Math.max(0,(nextRequest.get(origin)||0)-Date.now()),undefined,{signal});nextRequest.set(origin,Date.now()+2500);
 let html;try{html=await fetchOfficial(url,signal);}catch(error){if(cache.size>=200)cache.delete(cache.keys().next().value);cache.set(url,{error:error.message,expires:Date.now()+3600000});throw error;}if(cache.size>=200)cache.delete(cache.keys().next().value);cache.set(url,{html,expires:Date.now()+15*60000});return html;
}
async function institutionSource(pool,person,signal) {
 if(!person.institution_url)return [];
 const base=new URL(person.institution_url);if(base.protocol==='http:')base.protocol='https:';if(base.protocol!=='https:'||base.username||base.password)return [];
 const registered=(await pool.query('SELECT id,base_url,permission_status,enabled FROM source WHERE base_url=$1',[base.href])).rows[0];
 if(registered)return registered.permission_status==='approved'&&registered.enabled?[registered]:[];
 const robots=await readPage(new URL('/robots.txt',base).href,signal);
 const rules=[...robots.matchAll(/^Disallow:\s*(\S+)/gim)].map(match=>match[1].split('*')[0]);
 if(rules.some(rule=>base.pathname.startsWith(rule)))return [];
 const homepage=await readPage(base.href,signal);
 const terms=[];
 for(const match of homepage.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
   try{const link=new URL(match[1].replaceAll('&amp;','&'),base);if(link.origin===base.origin && /terms of use|terms and conditions|legal notice|website terms/i.test(match[2].replace(/<[^>]*>/g,' ')) && !terms.includes(link.href))terms.push(link.href);}catch{}
 }
 if(!terms.length)return []; // No terms available for automatic access review: retain needs_source.
 for(const url of terms.slice(0,2)) {
   if(rules.some(rule=>new URL(url).pathname.startsWith(rule)))return [];
   const termsText=(await readPage(url,signal)).replace(/<[^>]*>/g,' ');
   if(/(?:prohibit|not permit|not allow|must not|may not|forbid)[^.]{0,200}(?:scrap|harvest|automat|robot|crawl)|(?:scrap|harvest|automat|robot|crawl)[^.]{0,200}(?:prohibit|not permit|not allow|forbid)/i.test(termsText))return [];
 }
 // Dedicated, scoped access policy for public business-contact facts; no private data or employment certification.
 const rows=await pool.query(`INSERT INTO source(name,base_url,adapter,permission_status,enabled,permission_note) VALUES($1,$2,'official-faculty','approved',true,$3) ON CONFLICT(base_url) DO NOTHING RETURNING id,base_url`,['Official public contacts · '+base.hostname,base.href,JSON.stringify({policy:'user_authorized_public_contact_discovery',institutionId:person.institution_id,robotsUrl:new URL('/robots.txt',base).href,termsUrls:terms.slice(0,2),checkedAt:new Date().toISOString(),scope:'Published professional contact facts on named institutional profiles only; no detected automated-access prohibition'})]);
 if(rows[0])await pool.query(`INSERT INTO audit_event(action,entity_type,entity_id,metadata) VALUES('automatic_contact_source_access_check','source',$1,$2)`,[rows[0].id,JSON.stringify({institutionId:person.institution_id,termsUrls:terms.slice(0,2)})]);
 return rows;
}
async function discover(person,sources,signal){
 for(const source of sources){
  const base=new URL(source.base_url),robots=await readPage(new URL('/robots.txt',base).href,signal);
  const rules=[...robots.matchAll(/^Disallow:\s*(\S+)/gim)].map(match=>match[1].split('*')[0]);
  const allowed=url=>!rules.some(rule=>new URL(url).pathname.startsWith(rule));
  const queue=[person.official_profile_url,source.base_url].filter(url=>{try{return url&&new URL(url).origin===base.origin&&allowed(url);}catch{return false;}});
  const visited=new Set();
  while(queue.length&&visited.size<5){
   const url=queue.shift();if(visited.has(url))continue;visited.add(url);
   const html=await readPage(url,signal);const contact=extractPublicContact(html,person.name,url);if(contact)return {source,contact};
   const profiles=profileCandidates(html,url,person.name).filter(link=>allowed(link)&&!visited.has(link));
   if(profiles.length>1)return null; // Multiple possible identities require a stronger source match.
   queue.push(...profiles);
   // Directory entry points must be linked by the approved source; never guessed.
   if(visited.size===1)for(const match of html.matchAll(/href=["']([^"']+)["']/gi)){
    try{const link=new URL(match[1].replaceAll('&amp;','&'),url);if(link.origin===base.origin&&!link.search&&/\/(people|faculty|staff|directory|faculty-staff|faculty-and-staff)(\/|$)/i.test(link.pathname)&&allowed(link.href)&&queue.length<10)queue.push(link.href);}catch{}
   }
  }
 }
 return null;
}
export async function enrichNextFaculty(pool,signal){
 signal=AbortSignal.any([signal,AbortSignal.timeout(120000)]);
 const task=(await pool.query(`WITH next AS (SELECT faculty_id FROM faculty_contact_task WHERE next_attempt_at<=now() AND (status IN ('queued','failed','not_found','needs_source') OR (status='running' AND lease_until<now())) ORDER BY next_attempt_at,faculty_id FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE faculty_contact_task t SET status='running',attempts=attempts+1,lease_until=now()+interval '3 minutes',updated_at=now() FROM next WHERE t.faculty_id=next.faculty_id RETURNING t.faculty_id`)).rows[0];
 if(!task)return false;
 let state='not_found',message='No unambiguous public email found in approved official sources.';
 try{
  const person=(await pool.query(`SELECT f.id,f.name,f.institution_id,f.official_profile_url,f.public_email,i.official_url AS institution_url FROM faculty_member f JOIN institution i ON i.id=f.institution_id WHERE f.id=$1 AND f.status='published'`,[task.faculty_id])).rows[0];
  if(!person||person.public_email){state='found';message='Contact already collected, or record no longer published.';return true;}
  let sources=(await pool.query(`SELECT id,base_url FROM source WHERE adapter='official-faculty' AND enabled=true AND permission_status='approved' ORDER BY id LIMIT 100`)).rows.filter(source=>{
   const host=new URL(source.base_url).hostname;
   return [person.official_profile_url,person.institution_url].some(value=>{try{const official=new URL(value).hostname;return host===official||host.endsWith('.'+official)||official.endsWith('.'+host);}catch{return false;}});
  });
  if(!sources.length)sources=await institutionSource(pool,person,signal);
  if(!sources.length){state='needs_source';message='No approved official contact source matches this institution/profile.';return true;}
  const result=await discover(person,sources,signal);if(!result)return true;
  const {source,contact}=result,payload={...contact,name:person.name,institutionId:person.institution_id,existingFacultyId:person.id,enrichmentKind:'public_contact'};
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const permission=await client.query(`SELECT id FROM source WHERE id=$1 AND enabled=true AND permission_status='approved' FOR SHARE`,[source.id]);if(!permission.rowCount)throw new Error('Contact source no longer approved');
   const evidence=(await client.query(`INSERT INTO source_evidence(source_id,url,excerpt,observed_at,verified_at) VALUES($1,$2,$3,$4,now()) RETURNING id`,[source.id,contact.officialProfileUrl,contact.evidenceExcerpt,contact.observedAt])).rows[0];
   const updated=await client.query(`UPDATE faculty_member SET public_email=$1,official_profile_url=COALESCE(official_profile_url,$2),public_email_evidence_id=$3,public_email_verified_at=now(),updated_at=now() WHERE id=$4 AND name=$5 AND institution_id=$6 AND public_email IS NULL RETURNING id`,[contact.publicEmail,contact.officialProfileUrl,evidence.id,person.id,person.name,person.institution_id]);
   if(updated.rowCount){
    const staged=(await client.query(`INSERT INTO staged_record(source_id,record_type,external_id,source_url,payload,content_hash,review_state) VALUES($1,'faculty_member',$2,$3,$4,$5,'approved') ON CONFLICT(source_id,record_type,external_id) WHERE external_id IS NOT NULL DO UPDATE SET payload=EXCLUDED.payload,source_url=EXCLUDED.source_url,content_hash=EXCLUDED.content_hash,review_state='approved',version=staged_record.version+1,updated_at=now() RETURNING id`,[source.id,`automatic-contact:${person.id}`,contact.officialProfileUrl,JSON.stringify(payload),createHash('sha256').update(JSON.stringify(payload)).digest('hex')])).rows[0];
    await client.query(`INSERT INTO review_decision(staged_record_id,decision,decision_method,reason) VALUES($1,'approve','source_policy','User-authorized automatic public contact enrichment: matching named official profile and one explicit public email')`,[staged.id]);
    await client.query(`INSERT INTO record_revision(record_type,record_id,staged_record_id,snapshot) VALUES('faculty_member',$1,$2,$3)`,[person.id,staged.id,JSON.stringify(payload)]);
    await client.query(`INSERT INTO audit_event(action,entity_type,entity_id,metadata) VALUES('auto_publish_public_contact','faculty_member',$1,$2)`,[person.id,JSON.stringify({sourceId:source.id,evidenceId:evidence.id,stagedId:staged.id})]);
   }
   await client.query('COMMIT');state='found';message='Public contact matched and saved automatically.';
  }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
 }catch(error){state='failed';message=error instanceof Error?error.message:'Contact enrichment failed';}
 finally{await pool.query(`UPDATE faculty_contact_task SET status=$2,message=$3,lease_until=NULL,next_attempt_at=now()+CASE WHEN $2 IN ('failed','needs_source') THEN interval '1 hour' ELSE interval '30 days' END,updated_at=now() WHERE faculty_id=$1`,[task.faculty_id,state,message]);}
 return true;
}
