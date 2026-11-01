ALTER TABLE crawl_job ADD COLUMN IF NOT EXISTS progress jsonb NOT NULL DEFAULT '{}';
ALTER TABLE faculty_member ALTER COLUMN official_profile_url DROP NOT NULL;
ALTER TABLE faculty_member ADD COLUMN IF NOT EXISTS research_metadata jsonb NOT NULL DEFAULT '{}';
ALTER TABLE faculty_member ADD COLUMN IF NOT EXISTS profile_source_url text;
ALTER TABLE review_decision ALTER COLUMN actor_id DROP NOT NULL;
ALTER TABLE review_decision ADD COLUMN IF NOT EXISTS decision_method text NOT NULL DEFAULT 'staff' CHECK (decision_method IN ('staff','source_policy'));
