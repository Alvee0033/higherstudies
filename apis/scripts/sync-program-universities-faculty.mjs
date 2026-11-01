import 'dotenv/config';
import pg from 'pg';
import { prioritizeProgramUniversityFaculty } from './institution-faculty-linker.mjs';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });

async function sync() {
  const limit = Number(process.argv[2] || 50);
  console.log(`Starting sync for top ${limit} universities with programmes that have 0 faculty...`);

  const res = await pool.query(`
    SELECT i.id, i.name, i.country_code, i.city, count(p.id) as prog_count
    FROM institution i
    JOIN programme p ON p.institution_id = i.id
    WHERE NOT EXISTS (SELECT 1 FROM faculty_member f WHERE f.institution_id = i.id)
    GROUP BY i.id, i.name, i.country_code, i.city
    ORDER BY count(p.id) DESC
    LIMIT $1
  `, [limit]);

  console.log(`Found ${res.rows.length} universities to process.`);
  let totalFacultyAdded = 0;
  let successful = 0;

  for (let index = 0; index < res.rows.length; index++) {
    const uni = res.rows[index];
    console.log(`[${index + 1}/${res.rows.length}] Fetching faculty for: ${uni.name} (${uni.country_code}, ${uni.prog_count} programmes)...`);
    try {
      const result = await prioritizeProgramUniversityFaculty(pool, uni.name, uni.country_code, uni.city);
      if (result?.fetchedFacultyCount > 0) {
        successful++;
        totalFacultyAdded += result.fetchedFacultyCount;
        console.log(`   ✓ Added ${result.fetchedFacultyCount} faculty members (OpenAlex ID: ${result.openAlexId})`);
      } else {
        console.log(`   - No faculty returned or OpenAlex ID could not be matched`);
      }
    } catch (err) {
      console.warn(`   ✗ Error: ${err.message}`);
    }
    // Small pacing delay to respect OpenAlex API limits
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\nSync complete! Processed ${res.rows.length} universities, added ${totalFacultyAdded} faculty members across ${successful} universities.`);
  await pool.end();
}

sync().catch(console.error);
