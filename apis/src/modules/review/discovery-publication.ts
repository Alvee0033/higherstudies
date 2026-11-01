import { BadRequestException } from '@nestjs/common';
import type { PoolClient } from 'pg';

const required = (payload:Record<string,unknown>,key:string) => {
 const value=payload[key];if(typeof value !== 'string' || !value.trim()) throw new BadRequestException(`${key} is required`);return value.trim();
};

export async function publishProgrammeListing(client:PoolClient,payload:Record<string,unknown>,sourceUrl:string,evidenceId:string) {
 const url=new URL(sourceUrl);
 if(url.protocol!=='https:' || !['www.mastersportal.com','www.phdportal.com'].includes(url.hostname)) throw new BadRequestException('Expected attributable Studyportals programme URL');
 const title=required(payload,'title');const degree=required(payload,'degree');const country=required(payload,'countryCode').toUpperCase();const name=required(payload,'institutionName');
 if(!['masters','phd'].includes(degree) || !/^[A-Z]{2}$/.test(country)) throw new BadRequestException('Valid programme degree and country required');
 await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[`${country}:${name.toLowerCase()}`]);
 let institutions=await client.query<{id:string}>(`SELECT id FROM institution WHERE lower(name)=lower($1) AND country_code=$2 ORDER BY (openalex_id IS NOT NULL) DESC, created_at ASC`,[name,country]);
 if(institutions.rows.length>1) {
  const canonicalId = institutions.rows[0].id;
  const duplicateIds = institutions.rows.slice(1).map(r => r.id);
  await client.query('UPDATE programme SET institution_id=$1 WHERE institution_id = ANY($2::uuid[])', [canonicalId, duplicateIds]);
  await client.query('UPDATE faculty_member SET institution_id=$1 WHERE institution_id = ANY($2::uuid[])', [canonicalId, duplicateIds]);
  await client.query('DELETE FROM institution WHERE id = ANY($1::uuid[])', [duplicateIds]);
  institutions = { rows: [{ id: canonicalId }] } as any;
 }
 let institutionId=institutions.rows[0]?.id;
 if(!institutionId) institutionId=(await client.query<{id:string}>(`INSERT INTO institution(name,country_code,city,evidence_id,status) VALUES($1,$2,$3,$4,'published') ON CONFLICT (lower(name), country_code) DO UPDATE SET updated_at=now() RETURNING id`,[name,country,typeof payload.city==='string'?payload.city:null,evidenceId])).rows[0].id;
 let programmeWebsiteUrl:string|null=null;
 if(typeof payload.programmeWebsiteUrl==='string') {
   try { const link=new URL(payload.programmeWebsiteUrl); if(link.protocol==='https:' && !link.username && !link.password && !/(^|\.)(prtl\.co|mastersportal\.com|phdportal\.com)$/.test(link.hostname)) programmeWebsiteUrl=link.toString(); } catch { /* Missing or invalid outbound links remain unavailable. */ }
 }
 const result=await client.query<{id:string}>(`INSERT INTO programme(institution_id,title,degree,country_code,discovery_url,evidence_id,status,application_status,admission_note,tuition,official_url,source_details)
 VALUES($1,$2,$3,$4,$5,$6,'published','unknown','Source-attributed programme listing. Admission requirements have not been verified.',$7::jsonb,$8,$9::jsonb)
 ON CONFLICT(discovery_url) DO UPDATE SET tuition=EXCLUDED.tuition,source_details=EXCLUDED.source_details,title=EXCLUDED.title,degree=EXCLUDED.degree,country_code=EXCLUDED.country_code,status='published',
 evidence_id=CASE WHEN programme.verified_at IS NULL THEN EXCLUDED.evidence_id ELSE programme.evidence_id END,
 official_url=COALESCE(programme.official_url,EXCLUDED.official_url),
 admission_note=CASE WHEN programme.verified_at IS NULL THEN EXCLUDED.admission_note ELSE programme.admission_note END,
 application_status=CASE WHEN programme.verified_at IS NULL THEN 'unknown' ELSE programme.application_status END,updated_at=now() RETURNING id`,[institutionId,title,degree,country,sourceUrl,evidenceId,JSON.stringify(Array.isArray(payload.tuition)?payload.tuition:[]),programmeWebsiteUrl,JSON.stringify(payload.sourceDetails && typeof payload.sourceDetails==='object' && !Array.isArray(payload.sourceDetails)?payload.sourceDetails:{})]);
 return result.rows[0].id;
}

export async function publishInstitutionMetadata(client:PoolClient,payload:Record<string,unknown>,sourceUrl:string,evidenceId:string) {
 const id=required(payload,'openAlexId');
 if(!/^https:\/\/openalex\.org\/I\d+$/.test(id) || sourceUrl!==`https://api.openalex.org/institutions/${id.split('/').pop()}`) throw new BadRequestException('Expected OpenAlex institution evidence');
 const name=required(payload,'name');const country=required(payload,'countryCode').toUpperCase();
 if(!/^[A-Z]{2}$/.test(country)) throw new BadRequestException('Valid country required');
 let homepage:string|null=null;
 if(typeof payload.officialUrl==='string')try{const value=new URL(payload.officialUrl);if(['http:','https:'].includes(value.protocol)&&!value.username&&!value.password)homepage=value.href;}catch{}
 if(homepage&&(await client.query('SELECT id FROM institution WHERE official_url=$1 AND openalex_id IS DISTINCT FROM $2 LIMIT 1',[homepage,id])).rows.length)homepage=null;
 const result=await client.query<{id:string}>(`INSERT INTO institution(name,country_code,city,openalex_id,evidence_id,official_url,status) VALUES($1,$2,$3,$4,$5,$6,'published') ON CONFLICT(openalex_id) DO UPDATE SET official_url=COALESCE(institution.official_url,EXCLUDED.official_url),name=EXCLUDED.name,country_code=EXCLUDED.country_code,city=EXCLUDED.city,status='published',evidence_id=CASE WHEN institution.verified_at IS NULL THEN EXCLUDED.evidence_id ELSE institution.evidence_id END,updated_at=now() RETURNING id`,[name,country,typeof payload.city==='string'?payload.city:null,id,evidenceId,homepage]);
 return result.rows[0].id;
}
