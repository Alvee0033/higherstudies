ALTER TABLE programme ADD COLUMN source_details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(source_details)='object');
