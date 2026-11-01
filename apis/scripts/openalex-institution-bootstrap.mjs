export function institutionRecords(body) {
 return (Array.isArray(body?.results)?body.results:[]).filter(item=>/^https:\/\/openalex\.org\/I\d+$/.test(item.id||'') && typeof item.display_name==='string' && /^[A-Z]{2}$/.test(item.country_code||'')).map(item=>({externalId:item.id,sourceUrl:`https://api.openalex.org/institutions/${item.id.split('/').pop()}`,payload:{name:item.display_name.trim(),countryCode:item.country_code,city:item.geo?.city??null,openAlexId:item.id,officialUrl:item.homepage_url??null,rorId:item.ror??null,evidenceExcerpt:`OpenAlex institution registry: ${item.display_name}. Source-listed institution and homepage, not independently verified.`}}));
}
export async function saveInstitutionAnchors(pool,sourceId,records) {
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  for(const record of records){
   const p=record.payload;let homepage=null;
   try{const url=new URL(p.officialUrl);if(['https:','http:'].includes(url.protocol)&&!url.username&&!url.password)homepage=url.href;}catch{}
   await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[p.openAlexId]);
   await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[`${p.countryCode}:${p.name.toLowerCase()}`]);
   const matches=await client.query('SELECT id FROM institution WHERE lower(name)=lower($1) AND country_code=$2 AND openalex_id IS NULL LIMIT 2',[p.name,p.countryCode]);
   if(matches.rows.length===1)await client.query('UPDATE institution SET openalex_id=$2 WHERE id=$1 AND openalex_id IS NULL',[matches.rows[0].id,p.openAlexId]);
   await client.query(`WITH evidence AS (INSERT INTO source_evidence(source_id,url,excerpt,observed_at) VALUES($1,$2,$3,now()) RETURNING id) INSERT INTO institution(name,country_code,city,openalex_id,official_url,evidence_id,status) SELECT $4,$5,$6,$7,CASE WHEN EXISTS(SELECT 1 FROM institution WHERE official_url=$8 AND openalex_id IS DISTINCT FROM $7) THEN NULL ELSE $8 END,id,'staged' FROM evidence ON CONFLICT(openalex_id) DO UPDATE SET official_url=COALESCE(institution.official_url,EXCLUDED.official_url),evidence_id=COALESCE(institution.evidence_id,EXCLUDED.evidence_id)`,[sourceId,record.sourceUrl,p.evidenceExcerpt,p.name,p.countryCode,p.city,p.openAlexId,homepage]);
  }
  await client.query('COMMIT');
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
