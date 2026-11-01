import 'dotenv/config';
import { openAlexUrl, fetchWithKeyRotation } from './openalex-keys.mjs';

const OPENALEX_BASE = 'https://api.openalex.org';
const USER_AGENT = 'HigherStudy/1.0 (+https://higherstudy.internal; academic-faculty-linker)';


/**
 * 1. Resolves OpenAlex ID for an institution if missing.
 * If an institution with this openalex_id already exists, cleanly merges them!
 */
export async function resolveInstitutionOpenAlex(clientOrPool, institutionId, name, countryCode) {
  if (!name) return null;

  // Check if institution already has openalex_id
  const current = await clientOrPool.query(
    'SELECT id, name, country_code, openalex_id, official_url FROM institution WHERE id=$1',
    [institutionId]
  );
  if (current.rows[0]?.openalex_id) {
    return { openAlexId: current.rows[0].openalex_id, canonicalId: institutionId };
  }

  async function mergeInto(canonicalId, targetOpenAlexId, officialUrl) {
    if (canonicalId === institutionId) {
      await clientOrPool.query(
        'UPDATE institution SET openalex_id=$1, official_url=COALESCE(official_url, $2) WHERE id=$3',
        [targetOpenAlexId, officialUrl, institutionId]
      );
      return { openAlexId: targetOpenAlexId, canonicalId: institutionId };
    }
    // Re-link foreign keys to canonical institution
    await clientOrPool.query('UPDATE programme SET institution_id=$1 WHERE institution_id=$2', [canonicalId, institutionId]);
    await clientOrPool.query('UPDATE faculty_member SET institution_id=$1 WHERE institution_id=$2', [canonicalId, institutionId]);
    await clientOrPool.query('UPDATE funding_opportunity SET institution_id=$1 WHERE institution_id=$2', [canonicalId, institutionId]);
    await clientOrPool.query('UPDATE department SET institution_id=$1 WHERE institution_id=$2', [canonicalId, institutionId]);
    await clientOrPool.query('DELETE FROM institution WHERE id=$1', [institutionId]);
    if (officialUrl) {
      await clientOrPool.query('UPDATE institution SET official_url=COALESCE(official_url, $1) WHERE id=$2', [officialUrl, canonicalId]);
    }
    return { openAlexId: targetOpenAlexId, canonicalId };
  }

  // Also check if another institution with exact same name and country has openalex_id
  const match = await clientOrPool.query(
    'SELECT id, openalex_id, official_url FROM institution WHERE (lower(name)=lower($1) OR lower(name)=lower($2)) AND country_code=$3 AND openalex_id IS NOT NULL LIMIT 1',
    [name, name.replace(/^The\s+/i, ''), countryCode]
  );
  if (match.rows[0]?.openalex_id) {
    return mergeInto(match.rows[0].id, match.rows[0].openalex_id, match.rows[0].official_url);
  }

  // Query OpenAlex API with smart search candidate patterns
  const searchCandidates = [
    { search: name, country: countryCode },
    { search: name.replace(/^The\s+/i, ''), country: countryCode },
    { search: name.replace(/\s+at\s+.*$/i, ''), country: countryCode },
    { search: name, country: undefined },
    { search: name.replace(/^The\s+/i, ''), country: undefined },
  ].filter((c, i, arr) => c.search && arr.findIndex(o => o.search === c.search && o.country === c.country) === i);

  for (const candidate of searchCandidates) {
    try {
      const url = openAlexUrl('/institutions', {
        search: candidate.search,
        filter: candidate.country ? `country_code:${candidate.country.toLowerCase()}` : undefined,
        per_page: 1,
      });
      const res = await fetchWithKeyRotation(url, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const inst = data.results?.[0];
      if (inst?.id && /^https:\/\/openalex\.org\/I\d+$/.test(inst.id)) {
        let homepage = null;
        if (inst.homepage_url) {
          try {
            const u = new URL(inst.homepage_url);
            if (['http:', 'https:'].includes(u.protocol) && !u.username && !u.password) {
              homepage = u.href;
            }
          } catch {}
        }
        const existingRow = (await clientOrPool.query(
          'SELECT id FROM institution WHERE openalex_id=$1 LIMIT 1',
          [inst.id]
        )).rows[0];

        if (existingRow) {
          return mergeInto(existingRow.id, inst.id, homepage);
        } else {
          return mergeInto(institutionId, inst.id, homepage);
        }
      }
    } catch {
      // Try next candidate
    }
  }
  return null;
}

/**
 * 2. Fetches top faculty members for an institution from OpenAlex and publishes them immediately.
 */
export async function fetchAndPublishFacultyForInstitution(clientOrPool, institutionId, openAlexId, institutionName, limit = 20) {
  if (!openAlexId || !/^https:\/\/openalex\.org\/I\d+$/.test(openAlexId)) return 0;

  // Find approved OpenAlex source
  const sourceRes = await clientOrPool.query(
    "SELECT id FROM source WHERE adapter='openalex-authors' AND enabled=true AND permission_status='approved' LIMIT 1"
  );
  const sourceId = sourceRes.rows[0]?.id;
  if (!sourceId) return 0;

  const shortOpenAlexId = openAlexId.split('/').pop();
  const authorsUrl = openAlexUrl('/authors', {
    filter: `last_known_institutions.id:${shortOpenAlexId}`,
    sort: 'cited_by_count:desc',
    per_page: limit,
  });

  let results = [];
  try {
    const res = await fetchWithKeyRotation(authorsUrl, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    results = Array.isArray(data.results) ? data.results : [];
  } catch {
    return 0;
  }

  let published = 0;
  for (const author of results) {
    if (!author?.id || !author.display_name?.trim()) continue;
    const topics = (author.topics || author.x_concepts || [])
      .map((t) => (typeof t === 'string' ? t : t?.display_name))
      .filter((t) => typeof t === 'string')
      .slice(0, 15);

    const metadata = {
      provider: 'OpenAlex',
      hIndex: Number.isInteger(author.summary_stats?.h_index) ? author.summary_stats.h_index : null,
      citedByCount: Number.isInteger(author.cited_by_count) ? author.cited_by_count : null,
      worksCount: Number.isInteger(author.works_count) ? author.works_count : null,
      affiliationStatus: 'Last-known research affiliation; current appointment not verified',
    };
    const orcid = typeof author.orcid === 'string' && /^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(author.orcid)
      ? author.orcid
      : null;
    const sourceUrl = `${OPENALEX_BASE}/authors/${author.id.split('/').pop()}`;
    const evidenceExcerpt = `OpenAlex author ${author.id}; affiliation: ${institutionName || 'Institution'}`;

    try {
      const evidence = await clientOrPool.query(
        'INSERT INTO source_evidence(source_id, url, excerpt, observed_at) VALUES($1, $2, $3, now()) RETURNING id',
        [sourceId, sourceUrl, evidenceExcerpt]
      );
      const inserted = await clientOrPool.query(
        `INSERT INTO faculty_member(institution_id, evidence_id, name, research_topics, openalex_id, research_metadata, profile_source_url, orcid_id, status)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, 'published')
         ON CONFLICT(openalex_id) DO UPDATE SET
           institution_id=EXCLUDED.institution_id,
           name=EXCLUDED.name,
           research_topics=EXCLUDED.research_topics,
           research_metadata=EXCLUDED.research_metadata,
           status='published',
           updated_at=now()
         RETURNING id`,
        [
          institutionId,
          evidence.rows[0].id,
          author.display_name.trim(),
          topics,
          author.id,
          JSON.stringify(metadata),
          sourceUrl,
          orcid,
        ]
      );
      if (inserted.rows[0]?.id) {
        await clientOrPool.query(
          'INSERT INTO faculty_contact_task(faculty_id) VALUES($1) ON CONFLICT DO NOTHING',
          [inserted.rows[0].id]
        );
        published++;
      }
    } catch {
      // Ignore conflict/duplicate insert error
    }
  }
  return published;
}

/**
 * 3. Master function: Called whenever a programme is fetched.
 * Ensures the university is created/resolved, OpenAlex ID is linked, and its faculty is fetched first!
 */
export async function prioritizeProgramUniversityFaculty(clientOrPool, institutionName, countryCode, city = null, evidenceId = null) {
  if (!institutionName || typeof institutionName !== 'string') return null;
  const name = institutionName.trim();
  const country = (countryCode || '').toUpperCase();

  // Find or create institution
  let institution = (
    await clientOrPool.query(
      'SELECT id, name, country_code, city, openalex_id, official_url, evidence_id FROM institution WHERE lower(name)=lower($1) AND country_code=$2 LIMIT 1',
      [name, country]
    )
  ).rows[0];

  if (!evidenceId) {
    try {
      const srcRow = (await clientOrPool.query(
        "SELECT id FROM source WHERE adapter IN ('openalex-authors','studyportals-search') AND enabled=true AND permission_status='approved' ORDER BY adapter='openalex-authors' DESC LIMIT 1"
      )).rows[0];
      if (srcRow?.id) {
        const ev = await clientOrPool.query(
          "INSERT INTO source_evidence(source_id, url, excerpt, observed_at) VALUES($1, $2, $3, now()) RETURNING id",
          [srcRow.id, `https://openalex.org/institutions?search=${encodeURIComponent(name)}`, `Attributable discovery evidence for ${name}`]
        );
        evidenceId = ev.rows[0]?.id;
      }
    } catch {}
  }

  if (!institution) {
    const inserted = await clientOrPool.query(
      "INSERT INTO institution(name, country_code, city, status, evidence_id) VALUES($1, $2, $3, 'published', $4) ON CONFLICT (lower(name), country_code) DO UPDATE SET evidence_id=COALESCE(institution.evidence_id, EXCLUDED.evidence_id), updated_at=now() RETURNING id, name, country_code, city, openalex_id, official_url, evidence_id",
      [name, country, city, evidenceId]
    );
    institution = inserted.rows[0];
  } else if (!institution.evidence_id && evidenceId) {
    await clientOrPool.query('UPDATE institution SET evidence_id=$1 WHERE id=$2', [evidenceId, institution.id]);
    institution.evidence_id = evidenceId;
  }

  // Resolve OpenAlex ID if missing (or merge into canonical institution)
  let openAlexInfo = { openAlexId: institution.openalex_id, canonicalId: institution.id };
  if (!institution.openalex_id) {
    const resolved = await resolveInstitutionOpenAlex(clientOrPool, institution.id, name, country);
    if (resolved) openAlexInfo = resolved;
  }
  const targetId = openAlexInfo.canonicalId || institution.id;
  const targetOpenAlexId = openAlexInfo.openAlexId;

  // Check if institution already has faculty members
  const facultyCountRes = await clientOrPool.query(
    'SELECT count(*)::int as count FROM faculty_member WHERE institution_id=$1',
    [targetId]
  );
  const facultyCount = facultyCountRes.rows[0]?.count || 0;

  // If 0 faculty members, fetch and publish faculty immediately!
  let newFacultyCount = 0;
  if (facultyCount === 0 && targetOpenAlexId) {
    newFacultyCount = await fetchAndPublishFacultyForInstitution(
      clientOrPool,
      targetId,
      targetOpenAlexId,
      name,
      25
    );
  }

  return {
    institutionId: targetId,
    openAlexId: targetOpenAlexId,
    existingFacultyCount: facultyCount,
    fetchedFacultyCount: newFacultyCount,
  };
}
