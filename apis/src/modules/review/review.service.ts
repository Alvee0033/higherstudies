import { publishFacultyContact } from './faculty-contact-publication.js';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { publishProgrammeListing, publishInstitutionMetadata } from './discovery-publication.js';
import type { PoolClient } from 'pg';
import { DatabaseService } from '../../database/database.service.js';

interface Staged { id:string; source_id:string; record_type:string; source_url:string; payload:Record<string,unknown>; review_state:string; version:number }
const required = (obj: Record<string,unknown>, key: string) => {
  const value = obj[key];
  if (typeof value !== 'string' || !value.trim()) throw new BadRequestException(`${key} is required`);
  return value.trim();
};
const optional = (obj: Record<string,unknown>, key: string) => typeof obj[key] === 'string' ? (obj[key] as string).trim() || null : null;

@Injectable()
export class ReviewService {
  constructor(private readonly db: DatabaseService) {}

  async list(state = 'needs_review', limit = 30, offset = 0, recordType?: string) {
    const types = ['institution','programme','requirement_claim','funding_opportunity','faculty_member'];
    if (!['needs_review','approved','rejected'].includes(state) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0 || (recordType && !types.includes(recordType))) throw new BadRequestException();
    const filterType = recordType ?? null;
    const [data, count] = await Promise.all([
      this.db.query(`SELECT sr.*,s.name AS source_name,s.base_url AS source_base_url,s.adapter AS source_adapter,
      s.permission_status AS source_permission_status,s.enabled AS source_enabled
      FROM staged_record sr JOIN source s ON s.id=sr.source_id
      WHERE sr.review_state=$1 AND ($2::text IS NULL OR sr.record_type=$2) ORDER BY sr.created_at DESC,sr.id LIMIT $3 OFFSET $4`, [state,filterType,limit,offset]),
      this.db.query<{total:string}>(`SELECT count(*)::text AS total FROM staged_record WHERE review_state=$1 AND ($2::text IS NULL OR record_type=$2)`, [state,filterType]),
    ]);
    return { data, pagination: { limit, offset, total: Number(count[0]?.total ?? 0) } };
  }

  async selection(recordType?:string,q='',cursor?:string,before?:string,limit=1000) {
    const types=['institution','programme','requirement_claim','funding_opportunity','faculty_member'];
    const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if((recordType && !types.includes(recordType)) || (cursor && !uuid.test(cursor)) || !Number.isInteger(limit) || limit<1 || limit>1000 || q.length>200 || (before && !Number.isFinite(Date.parse(before)))) throw new BadRequestException('Invalid review selection');
    const selectedBefore=before || new Date().toISOString();
    const rows=await this.db.query<{id:string;version:number;label:string}>(`SELECT sr.id,sr.version,COALESCE(sr.payload->>'title',sr.payload->>'name',sr.id::text) AS label FROM staged_record sr JOIN source s ON s.id=sr.source_id WHERE sr.review_state='needs_review' AND ($1::text IS NULL OR sr.record_type=$1) AND sr.created_at<=$2::timestamptz AND ($3::uuid IS NULL OR sr.id>$3::uuid) AND ($4='' OR strpos(lower(concat_ws(' ',sr.payload->>'title',sr.payload->>'name',s.name,sr.source_url,sr.record_type)),lower($4))>0) ORDER BY sr.id LIMIT $5`,[recordType || null,selectedBefore,cursor || null,q,limit+1]);
    const data=rows.slice(0,limit);
    return {data,page:{selectedBefore,nextCursor:rows.length>limit ? data.at(-1)?.id : null}};
  }

  async detail(id: string) {
    const rows = await this.db.query(`SELECT sr.*,s.name AS source_name,s.base_url AS source_base_url,s.adapter AS source_adapter,
      s.permission_status AS source_permission_status,s.enabled AS source_enabled
      FROM staged_record sr JOIN source s ON s.id=sr.source_id WHERE sr.id=$1`, [id]);
    if (!rows[0]) throw new NotFoundException();
    return { data: rows[0] };
  }

  async decide(id: string, actorId: string, decision: 'approve'|'reject', expectedVersion: number, reason?: string) {
    if (decision === 'reject' && !reason?.trim()) throw new BadRequestException('Reason required for rejection');
    return this.db.transaction(async (client) => {
      const result = await client.query<Staged>('SELECT * FROM staged_record WHERE id=$1 FOR UPDATE', [id]);
      const staged = result.rows[0];
      if (!staged) throw new NotFoundException();
      if (staged.version !== expectedVersion || staged.review_state !== 'needs_review') throw new ConflictException('Review item changed');
      let publishedId: string | null = null;
      if (decision === 'approve') {
        const sources = await client.query<{permission_status:string;adapter:string;base_url:string;enabled:boolean}>(
          'SELECT permission_status,adapter,base_url,enabled FROM source WHERE id=$1', [staged.source_id],
        );
        const source = sources.rows[0];
        if (!source || source.permission_status !== 'approved' || !source.enabled) {
          throw new ForbiddenException('Source access must be approved and enabled before publication');
        }
        const portalListing = source.adapter.toLowerCase().includes('studyportals') && staged.record_type === 'programme';
        const institutionMetadata = source.adapter === 'openalex-authors' && staged.record_type === 'institution';
        if ((source.adapter.toLowerCase().includes('studyportals') || source.adapter === 'openalex-authors') && !portalListing && !institutionMetadata) throw new ForbiddenException('This discovery source cannot establish admission or funding claims');
        if (!portalListing && !institutionMetadata) this.assertOfficialEvidence(staged, source.base_url);
        const evidence = await client.query<{id:string}>(`INSERT INTO source_evidence(source_id,url,excerpt,content_hash,observed_at,verified_at)
          VALUES($1,$2,$3,$4,now(),$5) RETURNING id`, [staged.source_id,staged.source_url,optional(staged.payload,'evidenceExcerpt'),null,portalListing || institutionMetadata ? null : new Date()]);
        publishedId = portalListing ? await publishProgrammeListing(client,staged.payload,staged.source_url,evidence.rows[0].id)
          : institutionMetadata ? await publishInstitutionMetadata(client,staged.payload,staged.source_url,evidence.rows[0].id)
          : await this.publish(client, staged, evidence.rows[0].id);
        await client.query(`INSERT INTO record_revision(record_type,record_id,staged_record_id,snapshot,actor_id)
          VALUES($1,$2,$3,$4,$5)`, [staged.record_type,publishedId,id,JSON.stringify(staged.payload),actorId]);
      }
      await client.query('UPDATE staged_record SET review_state=$2,version=version+1,updated_at=now() WHERE id=$1', [id,decision === 'approve' ? 'approved' : 'rejected']);
      await client.query('INSERT INTO review_decision(staged_record_id,actor_id,decision,reason) VALUES($1,$2,$3,$4)', [id,actorId,decision,reason ?? null]);
      await client.query(`INSERT INTO audit_event(actor_id,action,entity_type,entity_id,metadata) VALUES($1,$2,'staged_record',$3,$4)`, [actorId,decision,id,JSON.stringify({publishedId})]);
      return { data: { id, decision, publishedId } };
    });
  }

  private assertOfficialEvidence(staged: Staged, sourceBaseUrl: string) {
    let sourceUrl: URL;
    let baseUrl: URL;
    try {
      sourceUrl = new URL(staged.source_url);
      baseUrl = new URL(sourceBaseUrl);
    } catch {
      throw new BadRequestException('A valid source URL is required');
    }
    if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== baseUrl.hostname) {
      throw new BadRequestException('Evidence must be an HTTPS page on the registered official source domain');
    }
    const officialUrlKey = staged.record_type === 'faculty_member' ? 'officialProfileUrl' : 'officialUrl';
    if (['programme','faculty_member','funding_opportunity','institution'].includes(staged.record_type)) {
      const officialUrl = optional(staged.payload, officialUrlKey);
      if (!officialUrl) throw new BadRequestException(`${officialUrlKey} is required for publication`);
      try {
        if (new URL(officialUrl).hostname !== sourceUrl.hostname) {
          throw new BadRequestException('The published official URL must match the evidence source domain');
        }
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        throw new BadRequestException(`${officialUrlKey} must be a valid URL`);
      }
    }
  }

  private async publish(client: PoolClient, staged: Staged, evidenceId: string): Promise<string> {
    const p = staged.payload;
    let result;
    switch (staged.record_type) {
      case 'institution':
        if (!optional(p,'officialUrl') && !optional(p,'rorId')) throw new BadRequestException('officialUrl or rorId required');
        result = await client.query<{id:string}>(`INSERT INTO institution(name,country_code,city,official_url,ror_id,evidence_id,status,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,'published',now())
          ON CONFLICT(${optional(p,'rorId') ? 'ror_id' : 'official_url'}) DO UPDATE SET name=EXCLUDED.name,country_code=EXCLUDED.country_code,city=EXCLUDED.city,
          official_url=EXCLUDED.official_url,evidence_id=EXCLUDED.evidence_id,status='published',verified_at=now(),updated_at=now() RETURNING id`,
          [required(p,'name'),required(p,'countryCode').toUpperCase(),optional(p,'city'),optional(p,'officialUrl'),optional(p,'rorId'),evidenceId]);
        break;
      case 'programme': {
        const institutionId = required(p,'institutionId');
        const country = await client.query<{country_code:string}>('SELECT country_code FROM institution WHERE id=$1', [institutionId]);
        if (!country.rows[0]) throw new BadRequestException('Unknown institutionId');
        const degree = required(p,'degree');
        if (!['masters','phd'].includes(degree)) throw new BadRequestException('Invalid degree');
        result = await client.query<{id:string}>(`INSERT INTO programme(institution_id,title,degree,country_code,language,mode,official_url,discovery_url,evidence_id,academic_unit,application_status,admission_note,status,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published',now())
          ON CONFLICT(${optional(p,'officialUrl') ? 'official_url' : 'discovery_url'}) DO UPDATE SET title=EXCLUDED.title,degree=EXCLUDED.degree,country_code=EXCLUDED.country_code,
          language=EXCLUDED.language,mode=EXCLUDED.mode,evidence_id=EXCLUDED.evidence_id,academic_unit=EXCLUDED.academic_unit,
          application_status=EXCLUDED.application_status,admission_note=EXCLUDED.admission_note,status='published',verified_at=now(),updated_at=now() RETURNING id`,
          [institutionId,required(p,'title'),degree,country.rows[0].country_code,optional(p,'language'),optional(p,'mode'),optional(p,'officialUrl'),staged.source_url,evidenceId,
            optional(p,'academicUnit'),['open','paused_external','closed'].includes(String(p.applicationStatus)) ? p.applicationStatus : 'unknown',optional(p,'admissionNote')]);
        break;
      }
      case 'requirement_claim': {
        const state = required(p,'state');
        if (!['required','optional','waived','not_accepted','unknown'].includes(state)) throw new BadRequestException('Invalid state');
        result = await client.query<{id:string}>(`INSERT INTO requirement_claim(programme_id,intake_id,evidence_id,type,state,value_text,value_number,unit,condition_text,applicant_group,status,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published',now()) RETURNING id`,
          [required(p,'programmeId'),optional(p,'intakeId'),evidenceId,required(p,'type'),state,optional(p,'valueText'),typeof p.valueNumber === 'number' ? p.valueNumber : null,optional(p,'unit'),optional(p,'conditionText'),optional(p,'applicantGroup')]);
        break;
      }
      case 'funding_opportunity':
        result = await client.query<{id:string}>(`INSERT INTO funding_opportunity(institution_id,evidence_id,title,provider,official_url,coverage,eligibility,deadline_on,status,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,'published',now())
          ON CONFLICT(official_url) DO UPDATE SET title=EXCLUDED.title,provider=EXCLUDED.provider,coverage=EXCLUDED.coverage,
          eligibility=EXCLUDED.eligibility,deadline_on=EXCLUDED.deadline_on,evidence_id=EXCLUDED.evidence_id,status='published',verified_at=now(),updated_at=now() RETURNING id`,
          [optional(p,'institutionId'),evidenceId,required(p,'title'),required(p,'provider'),required(p,'officialUrl'),optional(p,'coverage'),optional(p,'eligibility'),optional(p,'deadlineOn')]);
        break;
      case 'faculty_member':
        if(p.enrichmentKind==='public_contact') return publishFacultyContact(client,p,evidenceId);
        result = await client.query<{id:string}>(`INSERT INTO faculty_member(institution_id,department_id,evidence_id,name,title,official_profile_url,public_email,research_topics,academic_unit,status,verified_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'published',now())
          ON CONFLICT(official_profile_url) DO UPDATE SET name=EXCLUDED.name,title=EXCLUDED.title,public_email=EXCLUDED.public_email,
          research_topics=EXCLUDED.research_topics,evidence_id=EXCLUDED.evidence_id,academic_unit=EXCLUDED.academic_unit,status='published',verified_at=now(),updated_at=now() RETURNING id`,
          [required(p,'institutionId'),optional(p,'departmentId'),evidenceId,required(p,'name'),optional(p,'title'),required(p,'officialProfileUrl'),optional(p,'publicEmail'),Array.isArray(p.researchTopics) ? p.researchTopics.filter((x):x is string => typeof x === 'string') : [],optional(p,'academicUnit')]);
        break;
      default: throw new BadRequestException('Unsupported record type');
    }
    return result.rows[0].id;
  }
}
