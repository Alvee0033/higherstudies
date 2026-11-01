import {publishInstitutionMetadata} from '../review/discovery-publication.js';
import { BadRequestException } from '@nestjs/common';
import type { PoolClient } from 'pg';

/** Source-policy publication preserves OpenAlex attribution without certifying employment. */
export async function publishResearchMetadata(client: PoolClient, sourceId: string, stagedId: string, sourceUrl: string, payload: Record<string, unknown>) {
  const id = payload.openAlexId;
  if (typeof id !== 'string' || !/^https:\/\/openalex\.org\/A\d+$/.test(id) || sourceUrl !== `https://api.openalex.org/authors/${id.split('/').pop()}`) throw new BadRequestException('Invalid OpenAlex author evidence');
  if (typeof payload.name !== 'string' || !payload.name.trim() || typeof payload.institutionId !== 'string') throw new BadRequestException('Researcher name and institution are required');
  const topics = Array.isArray(payload.researchTopics) ? payload.researchTopics.filter((value): value is string => typeof value === 'string').slice(0, 30) : [];
  const metadata = { provider: 'OpenAlex', hIndex: payload.hIndex ?? null, citedByCount: payload.citedByCount ?? null, worksCount: payload.worksCount ?? null, affiliationStatus: 'Last-known research affiliation; current appointment not verified' };
  const orcid = typeof payload.orcid === 'string' && /^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(payload.orcid) ? payload.orcid : null;
  const publicEmail = typeof payload.publicEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.publicEmail) ? payload.publicEmail : null;
  const officialProfileUrl = typeof payload.officialProfileUrl === 'string' && /^https?:\/\//.test(payload.officialProfileUrl) ? payload.officialProfileUrl : null;
  let safeOrcid = orcid;
  if (orcid) {
    const existing = await client.query<{id:string}>(`SELECT id FROM faculty_member WHERE orcid_id=$1 AND openalex_id<>$2 LIMIT 1`, [orcid, id]);
    if (existing.rows.length) safeOrcid = null;
  }
  let safeProfileUrl = officialProfileUrl;
  if (officialProfileUrl) {
    const existing = await client.query<{id:string}>(`SELECT id FROM faculty_member WHERE official_profile_url=$1 AND openalex_id<>$2 LIMIT 1`, [officialProfileUrl, id]);
    if (existing.rows.length) safeProfileUrl = null;
  }
  const evidence = await client.query<{id:string}>(`INSERT INTO source_evidence(source_id,url,excerpt,observed_at) VALUES($1,$2,$3,now()) RETURNING id`, [sourceId, sourceUrl, String(payload.evidenceExcerpt || 'OpenAlex research metadata')]);
  const result = await client.query<{id:string}>(`INSERT INTO faculty_member(institution_id,evidence_id,name,research_topics,openalex_id,research_metadata,profile_source_url,orcid_id,public_email,official_profile_url,status)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published') ON CONFLICT(openalex_id) DO UPDATE SET institution_id=EXCLUDED.institution_id,name=EXCLUDED.name,research_topics=EXCLUDED.research_topics,research_metadata=EXCLUDED.research_metadata,profile_source_url=EXCLUDED.profile_source_url,orcid_id=COALESCE(EXCLUDED.orcid_id, faculty_member.orcid_id),public_email=COALESCE(EXCLUDED.public_email, faculty_member.public_email),official_profile_url=COALESCE(EXCLUDED.official_profile_url, faculty_member.official_profile_url),evidence_id=CASE WHEN faculty_member.verified_at IS NULL THEN EXCLUDED.evidence_id ELSE faculty_member.evidence_id END, status='published',updated_at=now() RETURNING id`, [payload.institutionId,evidence.rows[0].id,payload.name.trim(),topics,id,JSON.stringify(metadata),sourceUrl,safeOrcid,publicEmail,safeProfileUrl]);
  await client.query(`INSERT INTO faculty_contact_task(faculty_id) VALUES($1) ON CONFLICT DO NOTHING`,[result.rows[0].id]);
  await client.query(`UPDATE staged_record SET review_state='approved',updated_at=now() WHERE id=$1`, [stagedId]);
  await client.query(`INSERT INTO review_decision(staged_record_id,decision,reason,decision_method) VALUES($1,'approve','Automatic import from approved OpenAlex source; research metadata, not verified employment','source_policy')`, [stagedId]);
  await client.query(`INSERT INTO record_revision(record_type,record_id,staged_record_id,snapshot) VALUES('faculty_member',$1,$2,$3)`, [result.rows[0].id,stagedId,JSON.stringify(payload)]);
  await client.query(`INSERT INTO audit_event(action,entity_type,entity_id,metadata) VALUES('auto_publish_research_metadata','faculty_member',$1,$2)`, [result.rows[0].id,JSON.stringify({sourceId,stagedId})]);
}

/** Automatic institution registry metadata, explicitly authorized for fresh-start discovery. */
export async function publishInstitutionRegistryMetadata(client:PoolClient,sourceId:string,stagedId:string,sourceUrl:string,payload:Record<string,unknown>) {
 const id=payload.openAlexId;
 if(typeof id!=='string'||!/^https:\/\/openalex\.org\/I\d+$/.test(id)||sourceUrl!==`https://api.openalex.org/institutions/${id.split('/').pop()}`)throw new BadRequestException('Invalid institution registry evidence');
 const evidence=(await client.query<{id:string}>(`INSERT INTO source_evidence(source_id,url,excerpt,observed_at) VALUES($1,$2,$3,now()) RETURNING id`,[sourceId,sourceUrl,String(payload.evidenceExcerpt||'OpenAlex institution registry metadata')])).rows[0];
 const publishedId=await publishInstitutionMetadata(client,payload,sourceUrl,evidence.id);
 await client.query(`UPDATE staged_record SET review_state='approved',updated_at=now() WHERE id=$1`,[stagedId]);
 await client.query(`INSERT INTO review_decision(staged_record_id,decision,reason,decision_method) VALUES($1,'approve','User-authorized automatic institution registry import; source-listed homepage, no admission or funding verification','source_policy')`,[stagedId]);
 await client.query(`INSERT INTO record_revision(record_type,record_id,staged_record_id,snapshot) VALUES('institution',$1,$2,$3)`,[publishedId,stagedId,JSON.stringify(payload)]);
 await client.query(`INSERT INTO audit_event(action,entity_type,entity_id,metadata) VALUES('auto_publish_institution_metadata','institution',$1,$2)`,[publishedId,JSON.stringify({sourceId,stagedId})]);
 return publishedId;
}
