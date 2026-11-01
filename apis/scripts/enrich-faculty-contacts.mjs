import 'dotenv/config';
import pg from 'pg';
import {enrichNextFaculty} from './automatic-faculty-contacts.mjs';
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:3});
const controller=new AbortController();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>controller.abort());
try {
 await pool.query(`INSERT INTO faculty_contact_task(faculty_id) SELECT id FROM faculty_member WHERE status='published' AND public_email IS NULL ORDER BY id LIMIT 1000 ON CONFLICT DO NOTHING`);
 let processed=0;
 while(processed<200&&!controller.signal.aborted&&await enrichNextFaculty(pool,controller.signal))processed++;
 console.log(JSON.stringify({event:'automatic_contact_batch_complete',processed}));
} finally {await pool.end();}
