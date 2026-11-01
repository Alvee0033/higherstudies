import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('CREATE TABLE IF NOT EXISTS schema_migration (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  for (const name of readdirSync(new URL('../migrations/', import.meta.url)).filter((file) => file.endsWith('.sql')).sort()) {
    const existing = await client.query('SELECT 1 FROM schema_migration WHERE name=$1', [name]);
    if (existing.rowCount) continue;
    const sql = readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migration(name) VALUES($1)', [name]);
      await client.query('COMMIT');
      process.stdout.write(`Applied ${name}\n`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
} finally {
  await client.end();
}
