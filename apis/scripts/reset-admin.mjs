import 'dotenv/config';
import pg from 'pg';
import argon2 from 'argon2';
import { readFileSync } from 'node:fs';

const [email] = process.argv.slice(2);
const password = readFileSync(0, 'utf8').trimEnd();
if (!process.env.DATABASE_URL || !email || password.length < 6) {
  throw new Error('Usage: pipe a 6+ character password to npm run admin:reset -- admin@example.com');
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const result = await client.query(
    `UPDATE staff_user SET password_hash=$2 WHERE email=lower($1) AND disabled_at IS NULL RETURNING email`,
    [email, await argon2.hash(password)],
  );
  if (!result.rowCount) throw new Error('Active admin account not found');
  process.stdout.write(`Password reset for ${result.rows[0].email}.\n`);
} finally {
  await client.end();
}
