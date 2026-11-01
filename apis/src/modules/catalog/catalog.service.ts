import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { assertPublicCatalogueReleased } from './public-catalogue-release.js';

type Kind = 'institutions' | 'programmes' | 'funding' | 'faculty';
type Query = Record<string, string | undefined>;
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const date = /^\d{4}-\d{2}-\d{2}$/;
const allowed: Record<Kind, Set<string>> = {
  institutions: new Set(['q', 'country', 'cursor', 'limit']),
  programmes: new Set([
    'q',
    'country',
    'degree',
    'institutionId',
    'applicationStatus',
    'language',
    'funding',
    'deadlineBefore',
    'cursor',
    'limit',
  ]),
  funding: new Set([
    'q',
    'country',
    'degree',
    'institutionId',
    'provider',
    'deadlineBefore',
    'cursor',
    'limit',
  ]),
  faculty: new Set([
    'q',
    'country',
    'institutionId',
    'researchTopic',
    'academicUnit',
    'cursor',
    'limit',
  ]),
};
const lists: Record<
  Kind,
  { from: string; fields: string; alias: string; search: string }
> = {
  institutions: {
    from: 'institution i LEFT JOIN source_evidence ev ON ev.id=i.evidence_id LEFT JOIN source src ON src.id=ev.source_id',
    fields:
      'i.id,i.name,i.country_code,i.city,i.official_url,i.verified_at,ev.url AS evidence_url,src.name AS source_name,src.permission_status AS source_permission_status,(SELECT count(*)::int FROM programme p WHERE p.institution_id=i.id AND p.status=\'published\') AS programme_count,(SELECT count(*)::int FROM faculty_member f WHERE f.institution_id=i.id AND f.status=\'published\') AS faculty_count',
    alias: 'i',
    search: 'i.name',
  },
  programmes: {
    from: 'programme p JOIN institution i ON i.id=p.institution_id LEFT JOIN source_evidence ev ON ev.id=p.evidence_id LEFT JOIN source src ON src.id=ev.source_id',
    fields: `p.id,p.institution_id,i.name AS institution_name,i.city,i.official_url AS institution_official_url,p.title,p.degree,p.country_code,p.language,p.academic_unit,p.application_status,p.admission_note,p.tuition,p.source_details,p.official_url,p.discovery_url,p.verified_at,ev.url AS evidence_url,src.name AS source_name,src.permission_status AS source_permission_status,(SELECT count(*)::int FROM faculty_member f WHERE f.institution_id=i.id AND f.status='published') AS faculty_count,(SELECT min(pi.deadline_on) FROM programme_intake pi WHERE pi.programme_id=p.id AND pi.deadline_on >= CURRENT_DATE) AS next_deadline,(SELECT COALESCE(json_agg(json_build_object('id', r.id, 'type', r.type, 'state', r.state, 'value_text', r.value_text, 'value_number', r.value_number, 'unit', r.unit)), '[]'::json) FROM requirement_claim r JOIN source_evidence rev ON rev.id=r.evidence_id JOIN source rs ON rs.id=rev.source_id WHERE r.programme_id=p.id AND r.status='published' AND rs.permission_status='approved') AS requirements,(SELECT COALESCE(json_agg(json_build_object('id', f.id, 'title', f.title, 'provider', f.provider, 'coverage', f.coverage, 'deadline_on', f.deadline_on)), '[]'::json) FROM programme_funding pf JOIN funding_opportunity f ON f.id=pf.funding_id JOIN source_evidence fev ON fev.id=f.evidence_id JOIN source fs ON fs.id=fev.source_id WHERE pf.programme_id=p.id AND f.status='published' AND fs.permission_status='approved') AS funding`,
    alias: 'p',
    search: 'p.title',
  },
  funding: {
    from: 'funding_opportunity f LEFT JOIN institution i ON i.id=f.institution_id LEFT JOIN source_evidence ev ON ev.id=f.evidence_id LEFT JOIN source src ON src.id=ev.source_id',
    fields:
      'f.id,f.institution_id,i.name AS institution_name,f.title,f.provider,f.official_url,f.coverage,f.deadline_on,f.verified_at,ev.url AS evidence_url,src.name AS source_name,src.permission_status AS source_permission_status',
    alias: 'f',
    search: 'f.title',
  },
  faculty: {
    from: 'faculty_member f LEFT JOIN faculty_contact_task ct ON ct.faculty_id=f.id LEFT JOIN source_evidence cev ON cev.id=f.public_email_evidence_id JOIN institution i ON i.id=f.institution_id LEFT JOIN source_evidence ev ON ev.id=f.evidence_id LEFT JOIN source src ON src.id=ev.source_id',
    fields:
      'f.id,f.institution_id,i.name AS institution_name,i.country_code,i.official_url AS institution_official_url,f.department_id,f.name,f.title,f.academic_unit,f.official_profile_url,f.public_email,ct.status AS contact_collection_status,ct.message AS contact_collection_message,f.public_email_verified_at,cev.url AS public_email_source_url,f.research_topics,f.research_metadata,f.profile_source_url,f.orcid_id,f.openalex_id,f.verified_at,f.created_at,ev.url AS evidence_url,src.name AS source_name,src.permission_status AS source_permission_status',
    alias: 'f',
    search: 'f.name',
  },
};

@Injectable()
export class CatalogService {
  constructor(private readonly db: DatabaseService) {}

  async summary(staffPage = false) {
    if (!staffPage) assertPublicCatalogueReleased();
    const rows = await this.db.query<{
      institutions: string;
      programmes: string;
      funding: string;
      faculty: string;
    }>(`SELECT
      (SELECT count(*) FROM institution i LEFT JOIN source_evidence ev ON ev.id=i.evidence_id LEFT JOIN source s ON s.id=ev.source_id WHERE i.status='published' AND (s.permission_status IS NULL OR s.permission_status='approved')) AS institutions,
      (SELECT count(*) FROM programme p JOIN source_evidence ev ON ev.id=p.evidence_id JOIN source s ON s.id=ev.source_id WHERE p.status='published' AND s.permission_status='approved') AS programmes,
      (SELECT count(*) FROM funding_opportunity f JOIN source_evidence ev ON ev.id=f.evidence_id JOIN source s ON s.id=ev.source_id WHERE f.status='published' AND s.permission_status='approved') AS funding,
      (SELECT count(*) FROM faculty_member f JOIN source_evidence ev ON ev.id=f.evidence_id JOIN source s ON s.id=ev.source_id WHERE f.status='published' AND s.permission_status='approved') AS faculty`);
    const row = rows[0];
    return {
      data: {
        institutions: Number(row.institutions),
        programmes: Number(row.programmes),
        funding: Number(row.funding),
        faculty: Number(row.faculty),
      },
    };
  }

  async list(kind: Kind, query: Query, staffPage = false) {
    if (!staffPage) assertPublicCatalogueReleased();
    for (const key of Object.keys(query))
      if (!allowed[kind].has(key) && !['offset','sort','excludeCountry',...(kind==='programmes'?['gpaMax','ieltsMax']:kind==='faculty'?['ranks','hIndexMax','citationsMax']:[])].includes(key))
        throw new BadRequestException(`Unsupported filter: ${key}`);
    const limit = query.limit ? Number(query.limit) : 20;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100)
      throw new BadRequestException('limit must be 1-100');
    if (query.cursor && !uuid.test(query.cursor))
      throw new BadRequestException('Invalid cursor');
    if (query.institutionId && !uuid.test(query.institutionId))
      throw new BadRequestException('Invalid institutionId');
    const countries = query.country?.split(',').map((value) => value.trim().toUpperCase()).filter(Boolean);
    if ((countries?.length ?? 0) > (staffPage ? 100 : 20) || countries?.some((country) => !/^[A-Z]{2}$/.test(country)))
      throw new BadRequestException('country must contain ISO two-letter codes');
    if (query.degree && !['masters', 'phd'].includes(query.degree))
      throw new BadRequestException('degree must be masters or phd');
    if (
      query.applicationStatus &&
      !['open', 'paused_external', 'closed', 'unknown'].includes(
        query.applicationStatus,
      )
    )
      throw new BadRequestException('Invalid applicationStatus');
    if (query.funding && !['yes', 'no'].includes(query.funding))
      throw new BadRequestException('funding must be yes or no');
    if (
      query.deadlineBefore &&
      (!date.test(query.deadlineBefore) ||
        Number.isNaN(Date.parse(query.deadlineBefore)))
    )
      throw new BadRequestException('Invalid deadlineBefore');
    const spec = lists[kind];
    const params: unknown[] = [];
    // The source permission gate applies to publication visibility, not collection
    // enablement: pausing a source must not hide previously reviewed records.
    const where = [`${spec.alias}.status='published'`];
    if (kind === 'institutions') {
      where.push(`(src.permission_status IS NULL OR src.permission_status='approved')`);
    } else {
      where.push(`src.permission_status='approved'`);
    }
    if(!staffPage && kind==='programmes')where.push("(p.degree <> 'masters' OR p.title !~* '^(bachelor|bsc|ba |undergraduate)')");
    const add = (sql: string, value: unknown) => {
      params.push(value);
      where.push(sql.replace('?', `$${params.length}`));
    };
    if (query.cursor) add(`${spec.alias}.id > ?`, query.cursor);
    if (query.q?.trim()) {
      if(staffPage || kind==='programmes' || kind==='faculty') {
        params.push(`%${query.q.trim().slice(0,100)}%`); const term=`$${params.length}`;
        where.push(`(${spec.search} ILIKE ${term} OR i.name ILIKE ${term} OR ${spec.alias}.id::text ILIKE ${term}${kind==='faculty' ? ` OR array_to_string(f.research_topics,',') ILIKE ${term} OR f.academic_unit ILIKE ${term}` : ''})`);
      } else { params.push(`%${query.q.trim().slice(0,100)}%`);const term=`$${params.length}`;where.push(`(${spec.search} ILIKE ${term} OR i.name ILIKE ${term})`); }
    }
    if (countries?.length)
      add(
        kind === 'faculty' || kind === 'funding'
          ? 'i.country_code::text = ANY(?::text[])'
          : `${spec.alias}.country_code::text = ANY(?::text[])`,
        countries,
      );
    if(query.excludeCountry){if(!/^[A-Z]{2}$/.test(query.excludeCountry))throw new BadRequestException('Invalid excluded country');add('i.country_code <> ?',query.excludeCountry);}
    for(const [key,type] of [['gpaMax','gpa'],['ieltsMax','ielts']] as const){if(kind==='programmes'&&query[key]){const score=Number(query[key]);if(!Number.isFinite(score)||score<0||score>(type==='ielts'?9:4))throw new BadRequestException('Invalid score');params.push(type,score);where.push(`EXISTS(SELECT 1 FROM requirement_claim rc JOIN source_evidence re ON re.id=rc.evidence_id JOIN source rs ON rs.id=re.source_id WHERE rc.programme_id=p.id AND rc.type=$${params.length-1} AND rc.value_number <= $${params.length} AND rc.status='published' AND rs.permission_status='approved')`);}}
    if (query.institutionId)
      add(`${spec.alias}.institution_id = ?`, query.institutionId);
    if (kind === 'programmes') {
      if (query.degree) add('p.degree = ?', query.degree);
      if (query.applicationStatus)
        add('p.application_status = ?', query.applicationStatus);
      if (query.language)
        add('p.language ILIKE ?', query.language.slice(0, 60));
      if (query.funding)
        where.push(
          `${query.funding === 'yes' ? '' : 'NOT '}EXISTS (SELECT 1 FROM programme_funding pf JOIN funding_opportunity fo ON fo.id=pf.funding_id AND fo.status='published' WHERE pf.programme_id=p.id)`,
        );
      if (query.deadlineBefore)
        add(
          'EXISTS (SELECT 1 FROM programme_intake pi WHERE pi.programme_id=p.id AND pi.deadline_on <= ?)',
          query.deadlineBefore,
        );
    }
    if (kind === 'funding') {
      if (query.provider)
        add('f.provider ILIKE ?', `%${query.provider.slice(0, 100)}%`);
      if (query.deadlineBefore) add('f.deadline_on <= ?', query.deadlineBefore);
      if (query.degree)
        add(
          "EXISTS (SELECT 1 FROM programme_funding pf JOIN programme p ON p.id=pf.programme_id WHERE pf.funding_id=f.id AND p.degree=? AND p.status='published')",
          query.degree,
        );
    }
    if(kind==='faculty'){
      if(query.ranks){const ranks=query.ranks.split(',');const names:Record<string,string>={professor:'Professor',assoc:'Associate Professor',assistant:'Assistant Professor',lecturer:'Lecturer'};if(ranks.some(rank=>!names[rank]))throw new BadRequestException('Invalid rank');add('f.title = ANY(?::text[])',ranks.map(rank=>names[rank]));}
      for(const [key,field] of [['hIndexMax','hIndex'],['citationsMax','citedByCount']]){if(query[key]){const value=Number(query[key]);if(!Number.isInteger(value)||value<0||value>1000000000)throw new BadRequestException('Invalid metric');add(`(f.research_metadata->>'${field}')::numeric <= ?`,value);}}
    }
    if (kind === 'faculty' && query.researchTopic)
      add(
        'EXISTS (SELECT 1 FROM unnest(f.research_topics) topic WHERE topic ILIKE ?)',
        `%${query.researchTopic.slice(0, 100)}%`,
      );
    if (kind === 'faculty' && query.academicUnit)
      add('f.academic_unit ILIKE ?', `%${query.academicUnit.slice(0, 100)}%`);
    let total: number | undefined;
    let suffix = '';
    let order = `${spec.alias}.id`;
    if (staffPage || query.offset !== undefined || query.sort) {
      const offset = Number(query.offset || 0);
      if (!Number.isInteger(offset) || offset < 0 || offset > 10000000) throw new BadRequestException('Invalid offset');
      const progOrderPrefix = kind === 'programmes' ? '((SELECT count(*) FROM faculty_member f WHERE f.institution_id=i.id AND f.status=\'published\') > 0) DESC, (p.official_url IS NOT NULL) DESC, ' : '';
      const instOrderPrefix = kind === 'institutions' ? '((SELECT count(*) FROM faculty_member f WHERE f.institution_id=i.id AND f.status=\'published\') > 0) DESC, (SELECT count(*) FROM faculty_member f WHERE f.institution_id=i.id AND f.status=\'published\') DESC, ' : '';
      const sorts: Record<string,string> = { 'newest': `${instOrderPrefix}${progOrderPrefix}${spec.alias}.created_at DESC,${spec.alias}.id`, 'title-asc': `${instOrderPrefix}${progOrderPrefix}${spec.search} ASC,${spec.alias}.id`, 'title-desc': `${instOrderPrefix}${progOrderPrefix}${spec.search} DESC,${spec.alias}.id`, 'country': `${instOrderPrefix}${progOrderPrefix}i.country_code,${spec.alias}.id` };
      if(kind==='faculty'){sorts['h-index']="(f.research_metadata->>'hIndex')::numeric DESC NULLS LAST,f.id";sorts.citations="(f.research_metadata->>'citedByCount')::numeric DESC NULLS LAST,f.id";}
      if(kind==='institutions'){sorts['faculty']="(SELECT count(*) FROM faculty_member f WHERE f.institution_id=i.id AND f.status='published') DESC, i.name ASC, i.id";}
      order = sorts[query.sort || 'newest'];
      if (!order) throw new BadRequestException('Invalid sort');
      const count = await this.db.query<{total:string}>(`SELECT count(*)::text AS total FROM ${spec.from} WHERE ${where.join(' AND ')}`, params);
      total = Number(count[0]?.total || 0);
      suffix = ` OFFSET ${offset}`;
    }
    params.push(limit + 1);
    const rows = await this.db.query<Record<string, unknown>>(
      `SELECT ${spec.fields} FROM ${spec.from} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT $${params.length}${suffix}`,
      params,
    );
    const data = rows.slice(0, limit);
    return {
      data,
      page: { nextCursor: rows.length > limit ? data.at(-1)?.id : null, ...(total !== undefined ? {total} : {}) },
    };
  }

  async catalogueFacets(kind: 'faculty' | 'programmes' | 'institutions' = 'faculty', staffPage = false) {
    if (!staffPage) assertPublicCatalogueReleased();
    const spec = lists[kind];
    const from = `FROM ${spec.from} WHERE ${spec.alias}.status='published' AND src.permission_status='approved'`;
    const [countries, institutions, topics, departments] = await Promise.all([
      this.db.query<{ code: string; count: number }>(`SELECT i.country_code AS code,count(*)::int AS count ${from} GROUP BY i.country_code ORDER BY count(*) DESC`),
      kind === 'institutions' ? Promise.resolve([]) : this.db.query<{ id: string; name: string; count: number }>(`SELECT i.id,i.name,count(*)::int AS count ${from} GROUP BY i.id,i.name ORDER BY i.name LIMIT 1000`),
      kind === 'faculty' ? this.db.query<{topic:string}>(`SELECT DISTINCT unnest(f.research_topics) AS topic ${from} ORDER BY topic LIMIT 1000`) : Promise.resolve([]),
      kind === 'faculty' ? this.db.query<{name:string}>(`SELECT DISTINCT f.academic_unit AS name ${from} AND f.academic_unit IS NOT NULL ORDER BY name LIMIT 1000`) : Promise.resolve([]),
    ]);
    return {data:{countries,institutions,topics:topics.map(row=>row.topic),departments:departments.map(row=>row.name)}};
  }

  async detail(kind: Kind, id: string) {
    assertPublicCatalogueReleased();
    if (!uuid.test(id)) throw new BadRequestException('Invalid id');
    const spec = lists[kind];
    const rows = await this.db.query<Record<string, unknown>>(
      `SELECT ${spec.fields} FROM ${spec.from} WHERE ${spec.alias}.id=$1 AND ${spec.alias}.status='published' AND src.permission_status='approved'`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException();
    const data = rows[0];
    if (kind === 'programmes') {
      data.intakes = await this.db.query(
        'SELECT id,term,starts_on,deadline_on,application_url FROM programme_intake WHERE programme_id=$1 ORDER BY deadline_on NULLS LAST LIMIT 30',
        [id],
      );
      data.requirements = await this.db.query(
        `SELECT r.id,r.type,r.state,r.value_text,r.value_number,r.unit,r.condition_text,r.applicant_group,r.verified_at,e.url AS source_url,e.observed_at FROM requirement_claim r JOIN source_evidence e ON e.id=r.evidence_id JOIN source s ON s.id=e.source_id WHERE r.programme_id=$1 AND r.status='published' AND s.permission_status='approved' ORDER BY r.type,r.id LIMIT 100`,
        [id],
      );
      data.funding = await this.db.query(
        `SELECT f.id,f.title,f.provider,f.deadline_on FROM programme_funding pf JOIN funding_opportunity f ON f.id=pf.funding_id JOIN source_evidence ev ON ev.id=f.evidence_id JOIN source s ON s.id=ev.source_id WHERE pf.programme_id=$1 AND f.status='published' AND s.permission_status='approved' ORDER BY f.deadline_on NULLS LAST LIMIT 30`,
        [id],
      );
      data.faculty = await this.db.query(
        `SELECT f.id,f.name,f.title,f.research_topics,f.official_profile_url,f.public_email,e.url AS source_url,'academic_unit_affiliation' AS relationship FROM faculty_member f JOIN source_evidence e ON e.id=f.evidence_id JOIN source s ON s.id=e.source_id WHERE f.institution_id=$1 AND f.academic_unit=$2 AND f.status='published' AND s.permission_status='approved' ORDER BY f.name LIMIT 50`,
        [data.institution_id, data.academic_unit],
      );
    }
    if (kind === 'faculty') {
      data.programmes = await this.db.query(
        `SELECT p.id,p.title,p.degree,p.application_status,p.official_url,'academic_unit_affiliation' AS relationship FROM programme p JOIN source_evidence e ON e.id=p.evidence_id JOIN source s ON s.id=e.source_id WHERE p.institution_id=$1 AND p.academic_unit=$2 AND p.status='published' AND s.permission_status='approved' ORDER BY p.title LIMIT 30`,
        [data.institution_id, data.academic_unit],
      );
    }
    return { data };
  }

  async deleteItem(kind: Kind, id: string, staffId: string) {
    if (!uuid.test(id)) throw new BadRequestException('Invalid id');
    return this.db.transaction(async (client) => {
      if (kind === 'programmes') {
        await client.query(
          'DELETE FROM requirement_claim WHERE programme_id=$1',
          [id],
        );
        await client.query(
          'DELETE FROM programme_funding WHERE programme_id=$1',
          [id],
        );
        await client.query(
          'DELETE FROM programme_intake WHERE programme_id=$1',
          [id],
        );
        await client.query(
          'DELETE FROM record_revision WHERE record_type=$1 AND record_id=$2',
          ['programme', id],
        );
        const res = await client.query(
          'DELETE FROM programme WHERE id=$1 RETURNING id, title',
          [id],
        );
        if (!res.rowCount) throw new NotFoundException('Programme not found');
        await client.query(
          `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata) VALUES($1, 'delete', 'programme', $2, $3)`,
          [staffId, id, JSON.stringify(res.rows[0])],
        );
        return { data: { success: true, deleted: res.rows[0] } };
      }
      if (kind === 'institutions') {
        await client.query(
          'DELETE FROM requirement_claim WHERE programme_id IN (SELECT id FROM programme WHERE institution_id=$1)',
          [id],
        );
        await client.query(
          'DELETE FROM programme_funding WHERE programme_id IN (SELECT id FROM programme WHERE institution_id=$1)',
          [id],
        );
        await client.query(
          'DELETE FROM programme_intake WHERE programme_id IN (SELECT id FROM programme WHERE institution_id=$1)',
          [id],
        );
        await client.query('DELETE FROM programme WHERE institution_id=$1', [
          id,
        ]);
        await client.query(
          'DELETE FROM faculty_member WHERE institution_id=$1',
          [id],
        );
        await client.query('DELETE FROM department WHERE institution_id=$1', [
          id,
        ]);
        await client.query(
          'DELETE FROM record_revision WHERE record_type=$1 AND record_id=$2',
          ['institution', id],
        );
        const res = await client.query(
          'DELETE FROM institution WHERE id=$1 RETURNING id, name',
          [id],
        );
        if (!res.rowCount) throw new NotFoundException('Institution not found');
        await client.query(
          `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata) VALUES($1, 'delete', 'institution', $2, $3)`,
          [staffId, id, JSON.stringify(res.rows[0])],
        );
        return { data: { success: true, deleted: res.rows[0] } };
      }
      if (kind === 'funding') {
        await client.query(
          'DELETE FROM programme_funding WHERE funding_id=$1',
          [id],
        );
        await client.query(
          'DELETE FROM record_revision WHERE record_type=$1 AND record_id=$2',
          ['funding_opportunity', id],
        );
        const res = await client.query(
          'DELETE FROM funding_opportunity WHERE id=$1 RETURNING id, title',
          [id],
        );
        if (!res.rowCount)
          throw new NotFoundException('Funding opportunity not found');
        await client.query(
          `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata) VALUES($1, 'delete', 'funding_opportunity', $2, $3)`,
          [staffId, id, JSON.stringify(res.rows[0])],
        );
        return { data: { success: true, deleted: res.rows[0] } };
      }
      if (kind === 'faculty') {
        await client.query(
          'DELETE FROM record_revision WHERE record_type=$1 AND record_id=$2',
          ['faculty_member', id],
        );
        const res = await client.query(
          'DELETE FROM faculty_member WHERE id=$1 RETURNING id, name',
          [id],
        );
        if (!res.rowCount)
          throw new NotFoundException('Faculty member not found');
        await client.query(
          `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata) VALUES($1, 'delete', 'faculty_member', $2, $3)`,
          [staffId, id, JSON.stringify(res.rows[0])],
        );
        return { data: { success: true, deleted: res.rows[0] } };
      }
      throw new BadRequestException('Unsupported catalog kind');
    });
  }

  async updateProgramme(
    id: string,
    body: { official_url?: string },
    staffId: string,
  ) {
    if (!uuid.test(id)) throw new BadRequestException('Invalid id');
    let officialUrl: string | null = null;
    if (typeof body?.official_url === 'string') {
      const trimmed = body.official_url.trim();
      if (trimmed) {
        try {
          const url = new URL(trimmed);
          if (
            url.protocol !== 'https:' ||
            url.username ||
            url.password ||
            /(^|\.)(prtl\.co|mastersportal\.com|phdportal\.com|studyportals\.com)$/.test(
              url.hostname,
            )
          ) {
            throw new BadRequestException(
              'A valid HTTPS official university URL is required',
            );
          }
          officialUrl = url.toString();
        } catch (e) {
          if (e instanceof BadRequestException) throw e;
          throw new BadRequestException('Invalid official URL');
        }
      }
    }
    return this.db.transaction(async (client) => {
      const existing = await client.query<{ id: string; official_url: string | null }>(
        'SELECT id, title, official_url FROM programme WHERE id=$1',
        [id],
      );
      if (!existing.rows[0]) throw new NotFoundException('Programme not found');
      const updated = await client.query<{ id: string; official_url: string | null }>(
        'UPDATE programme SET official_url=$1, updated_at=now() WHERE id=$2 RETURNING id, official_url',
        [officialUrl, id],
      );
      await client.query(
        `INSERT INTO audit_event(actor_id, action, entity_type, entity_id, metadata) VALUES($1, 'programme_official_url_updated', 'programme', $2, $3)`,
        [
          staffId,
          id,
          JSON.stringify({
            previousUrl: existing.rows[0].official_url,
            newUrl: officialUrl,
          }),
        ],
      );
      return { data: updated.rows[0] };
    });
  }
}

