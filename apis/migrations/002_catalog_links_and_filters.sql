ALTER TABLE programme ADD COLUMN IF NOT EXISTS academic_unit text;
ALTER TABLE programme ADD COLUMN IF NOT EXISTS application_status text NOT NULL DEFAULT 'unknown'
  CHECK (application_status IN ('unknown','open','paused_external','closed'));
ALTER TABLE programme ADD COLUMN IF NOT EXISTS admission_note text;
ALTER TABLE faculty_member ADD COLUMN IF NOT EXISTS academic_unit text;

CREATE INDEX IF NOT EXISTS programme_public_unit_idx
  ON programme(institution_id,academic_unit,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS faculty_public_unit_idx
  ON faculty_member(institution_id,academic_unit,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS programme_public_degree_idx
  ON programme(degree,country_code,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS programme_public_status_idx
  ON programme(application_status,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS faculty_public_name_idx
  ON faculty_member(institution_id,name,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS programme_title_trgm_idx
  ON programme USING gin(title gin_trgm_ops) WHERE status='published';
CREATE INDEX IF NOT EXISTS funding_title_trgm_idx
  ON funding_opportunity USING gin(title gin_trgm_ops) WHERE status='published';
