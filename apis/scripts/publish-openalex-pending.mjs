import 'dotenv/config';
import pg from 'pg';
import { publishResearchMetadata } from '../dist/modules/ingestion/research-publication.js';
const pool = new pg.Pool({connectionString:process.env.DATABASE_URL});
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const rows = await client.query(`SELECT sr.* FROM staged_record sr JOIN source s ON s.id=sr.source_id WHERE s.adapter='openalex-authors' AND s.enabled AND s.permission_status='approved' AND sr.record_type='faculty_member' AND sr.review_state='needs_review' FOR UPDATE OF sr`);
  for (const row of rows.rows) await publishResearchMetadata(client,row.source_id,row.id,row.source_url,row.payload);
  await client.query('COMMIT');
  console.log(`Imported ${rows.rowCount} source-attributed researcher records under the OpenAlex publication policy.`);
} catch(error) { await client.query('ROLLBACK'); throw error; }
finally {client.release(); await pool.end();}
