ALTER TABLE crawl_job ADD COLUMN IF NOT EXISTS runtime jsonb NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS source_collection_state (
 source_id uuid PRIMARY KEY REFERENCES source(id) ON DELETE CASCADE,
 request_interval_seconds integer NOT NULL DEFAULT 10 CHECK(request_interval_seconds BETWEEN 2 AND 60),
 rest_every_records integer NOT NULL DEFAULT 300 CHECK(rest_every_records BETWEEN 100 AND 5000),
 rest_seconds integer NOT NULL DEFAULT 300 CHECK(rest_seconds BETWEEN 30 AND 3600),
 records_since_rest integer NOT NULL DEFAULT 0,
 next_request_at timestamptz NOT NULL DEFAULT now(),
 cooldown_until timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now()
);
