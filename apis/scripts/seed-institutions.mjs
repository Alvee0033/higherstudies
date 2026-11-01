import 'dotenv/config';
import pg from 'pg';
import fs from 'node:fs';
import crypto from 'node:crypto';

if (process.env.ALLOW_UNVERIFIED_INSTITUTION_IMPORT !== 'true') {
  throw new Error(
    'This legacy ScholarPass import needs source review before use. Set ALLOW_UNVERIFIED_INSTITUTION_IMPORT=true only for an isolated local review database.',
  );
}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const uniDbPath =
  '/home/alvee/Desktop/Projects_and_Code/Projects/scholarhip/scholarship-scraper/data/university_sources.json';

if (!fs.existsSync(uniDbPath)) {
  console.log(`Source file not found at ${uniDbPath}. Skipping bulk load.`);
  await client.end();
  process.exit(0);
}

console.log('Loading raw university source records into PostgreSQL...');
const rawUnis = JSON.parse(fs.readFileSync(uniDbPath, 'utf8'));
console.log(
  `Found ${rawUnis.length} university source entries. Beginning direct DB bulk import...`,
);

// Default source ID for the global directory
function createProperId(seed) {
  const hash = crypto.createHash('sha256').update(String(seed)).digest('hex');
  const p1 = hash.slice(0, 8);
  const p2 = hash.slice(8, 12);
  const p3 = '4' + hash.slice(13, 16);
  const p4 =
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80)
      .toString(16)
      .padStart(2, '0') + hash.slice(18, 20);
  const p5 = hash.slice(20, 32);
  return `${p1}-${p2}-${p3}-${p4}-${p5}`;
}

const dirSourceId = createProperId('source_global_university_directory');

await client.query(
  `
  INSERT INTO source (id, name, base_url, adapter, permission_status, permission_note, enabled, refresh_hours, last_success_at)
  VALUES ($1, 'ROR Institution Candidates (legacy import)', 'https://ror.org', 'ror-directory', 'pending', 'Candidate import requires source and field verification before publication', false, 720, null)
  ON CONFLICT (base_url) DO UPDATE SET name = EXCLUDED.name, adapter = EXCLUDED.adapter, permission_status = 'pending', permission_note = EXCLUDED.permission_note, enabled = false
`,
  [dirSourceId],
);

let inserted = 0;
let updated = 0;
const batchSize = 250;

for (let i = 0; i < rawUnis.length; i += batchSize) {
  const chunk = rawUnis.slice(i, i + batchSize);
  await client.query('BEGIN');
  try {
    for (const u of chunk) {
      const name = (u.university_name || '').trim();
      if (!name) continue;

      const countryCode = (u.country_code || '').toUpperCase().slice(0, 2);
      const officialUrl = u.website || u.base_url;
      if (
        !/^[A-Z]{2}$/.test(countryCode) ||
        !officialUrl ||
        !/^https:\/\//i.test(officialUrl)
      )
        continue;
      const city = u.city || null;
      const rorId = u.ror_id || null;
      const openAlexId = u.openalex_id || null;
      const instId = createProperId(`inst_global_${name}_${countryCode}`);

      // Evidence record
      const evId = createProperId(`ev_global_${instId}`);
      await client.query(
        `
        INSERT INTO source_evidence (id, source_id, url, excerpt, content_hash, observed_at, verified_at)
        VALUES ($1, $2, $3, $4, $5, now(), null)
        ON CONFLICT (id) DO NOTHING
      `,
        [
          evId,
          dirSourceId,
          officialUrl,
          `Unreviewed institution candidate from ScholarPass seed for ${name}`,
          crypto.createHash('sha256').update(officialUrl).digest('hex'),
        ],
      );

      const res = await client.query(
        `
        INSERT INTO institution (id, name, country_code, city, official_url, ror_id, openalex_id, evidence_id, status, verified_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'staged', null)
        ON CONFLICT (official_url) DO UPDATE SET
          name = EXCLUDED.name,
          country_code = EXCLUDED.country_code,
          city = EXCLUDED.city,
          ror_id = COALESCE(institution.ror_id, EXCLUDED.ror_id),
          openalex_id = COALESCE(institution.openalex_id, EXCLUDED.openalex_id),
          evidence_id = EXCLUDED.evidence_id,
          status = 'staged',
          verified_at = null,
          updated_at = now()
        RETURNING (xmax = 0) AS is_insert
      `,
        [instId, name, countryCode, city, officialUrl, rorId, openAlexId, evId],
      );

      if (res.rows[0]?.is_insert) {
        inserted++;
      } else {
        updated++;
      }
    }
    await client.query('COMMIT');
    process.stdout.write(
      `Processed ${Math.min(i + batchSize, rawUnis.length)}/${rawUnis.length} institutions (Inserted: ${inserted}, Updated: ${updated})\r`,
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error in batch ${i}:`, err.message);
  }
}

console.log(
  `\nDirect DB Seed Complete! Total inserted: ${inserted}, Total updated: ${updated}`,
);
await client.end();
