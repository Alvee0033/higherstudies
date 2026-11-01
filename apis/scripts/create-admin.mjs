import 'dotenv/config';
import pg from 'pg';
import argon2 from 'argon2';
import { readFileSync } from 'node:fs';

const [email] = process.argv.slice(2);
const password = readFileSync(0, 'utf8').trimEnd();
if (!process.env.DATABASE_URL || !email || !password || password.length < 6) {
  throw new Error('Usage: provide DATABASE_URL, then pipe a 6+ character password to npm run admin:create -- email@example.com');
}
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('INSERT INTO staff_user(email,password_hash,role) VALUES(lower($1),$2,\'admin\') ON CONFLICT(email) DO NOTHING', [email, await argon2.hash(password)]);
  process.stdout.write('Admin created if email was unused.\n');
} finally { await client.end(); }
