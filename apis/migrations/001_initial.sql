CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS staff_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('editor','admin')),
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS staff_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES staff_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  csrf_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS staff_session_user_idx ON staff_session(user_id, expires_at);

CREATE TABLE IF NOT EXISTS institution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code char(2) NOT NULL,
  city text,
  official_url text UNIQUE,
  evidence_id uuid,
  ror_id text UNIQUE,
  openalex_id text UNIQUE,
  status text NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','published','stale','archived')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS institution_public_idx ON institution(country_code, name, id) WHERE status='published';
CREATE INDEX IF NOT EXISTS institution_name_trgm_idx ON institution USING gin(name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS department (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institution(id),
  name text NOT NULL,
  UNIQUE(institution_id,name)
);
CREATE TABLE IF NOT EXISTS subject (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  parent_id uuid REFERENCES subject(id)
);
CREATE TABLE IF NOT EXISTS programme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institution(id),
  subject_id uuid REFERENCES subject(id),
  title text NOT NULL,
  degree text NOT NULL CHECK (degree IN ('masters','phd')),
  country_code char(2) NOT NULL,
  language text,
  mode text,
  official_url text UNIQUE,
  discovery_url text UNIQUE,
  evidence_id uuid,
  status text NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','published','stale','archived')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS programme_public_idx ON programme(country_code,degree,subject_id,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS programme_institution_idx ON programme(institution_id,id);
CREATE INDEX IF NOT EXISTS programme_search_idx ON programme USING gin(to_tsvector('simple',title));
CREATE TABLE IF NOT EXISTS programme_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id uuid NOT NULL REFERENCES programme(id),
  term text,
  starts_on date,
  deadline_on date,
  application_url text,
  UNIQUE(programme_id,term,starts_on)
);
CREATE INDEX IF NOT EXISTS intake_deadline_idx ON programme_intake(deadline_on,programme_id) WHERE deadline_on IS NOT NULL;

CREATE TABLE IF NOT EXISTS source (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  base_url text NOT NULL UNIQUE,
  adapter text NOT NULL,
  permission_status text NOT NULL DEFAULT 'pending' CHECK (permission_status IN ('pending','approved','blocked','revoked')),
  permission_note text,
  enabled boolean NOT NULL DEFAULT false,
  refresh_hours integer NOT NULL DEFAULT 168 CHECK (refresh_hours BETWEEN 1 AND 8760),
  last_success_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS source_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES source(id),
  url text NOT NULL,
  excerpt text,
  content_hash text,
  observed_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE institution ADD CONSTRAINT institution_evidence_fk FOREIGN KEY(evidence_id) REFERENCES source_evidence(id);
ALTER TABLE programme ADD CONSTRAINT programme_evidence_fk FOREIGN KEY(evidence_id) REFERENCES source_evidence(id);
CREATE INDEX IF NOT EXISTS evidence_source_time_idx ON source_evidence(source_id,observed_at DESC);

CREATE TABLE IF NOT EXISTS requirement_claim (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id uuid NOT NULL REFERENCES programme(id),
  intake_id uuid REFERENCES programme_intake(id),
  evidence_id uuid NOT NULL REFERENCES source_evidence(id),
  type text NOT NULL,
  state text NOT NULL CHECK (state IN ('required','optional','waived','not_accepted','unknown')),
  value_text text,
  value_number numeric(8,2),
  unit text,
  condition_text text,
  applicant_group text,
  status text NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','published','stale','archived')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS requirement_programme_idx ON requirement_claim(programme_id,type,status);

CREATE TABLE IF NOT EXISTS funding_opportunity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institution(id),
  evidence_id uuid NOT NULL REFERENCES source_evidence(id),
  title text NOT NULL,
  provider text NOT NULL,
  official_url text NOT NULL UNIQUE,
  coverage text,
  amount numeric(14,2),
  currency char(3),
  eligibility text,
  deadline_on date,
  status text NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','published','stale','archived')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS funding_public_deadline_idx ON funding_opportunity(deadline_on,id) WHERE status='published';
CREATE TABLE IF NOT EXISTS programme_funding (
  programme_id uuid NOT NULL REFERENCES programme(id),
  funding_id uuid NOT NULL REFERENCES funding_opportunity(id),
  evidence_id uuid NOT NULL REFERENCES source_evidence(id),
  PRIMARY KEY(programme_id,funding_id)
);

CREATE TABLE IF NOT EXISTS faculty_member (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES institution(id),
  department_id uuid REFERENCES department(id),
  evidence_id uuid NOT NULL REFERENCES source_evidence(id),
  name text NOT NULL,
  title text,
  official_profile_url text NOT NULL UNIQUE,
  public_email text,
  research_topics text[] NOT NULL DEFAULT '{}',
  orcid_id text UNIQUE,
  openalex_id text UNIQUE,
  status text NOT NULL DEFAULT 'staged' CHECK (status IN ('staged','published','stale','archived')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS faculty_public_institution_idx ON faculty_member(institution_id,department_id,id) WHERE status='published';
CREATE INDEX IF NOT EXISTS faculty_topics_idx ON faculty_member USING gin(research_topics);
CREATE INDEX IF NOT EXISTS faculty_name_trgm_idx ON faculty_member USING gin(name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS crawl_job (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES source(id),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','partial','failed','cancelled')),
  idempotency_key text NOT NULL,
  found_count integer NOT NULL DEFAULT 0,
  accepted_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  last_error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS crawl_job_source_time_idx ON crawl_job(source_id,created_at DESC);
CREATE TABLE IF NOT EXISTS ingestion_batch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES source(id),
  idempotency_key text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_id,idempotency_key)
);
CREATE TABLE IF NOT EXISTS staged_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES source(id),
  job_id uuid REFERENCES crawl_job(id),
  record_type text NOT NULL CHECK (record_type IN ('institution','programme','requirement_claim','funding_opportunity','faculty_member')),
  external_id text,
  source_url text NOT NULL,
  payload jsonb NOT NULL,
  content_hash text NOT NULL,
  review_state text NOT NULL DEFAULT 'needs_review' CHECK (review_state IN ('needs_review','approved','rejected')),
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS staged_external_idx ON staged_record(source_id,record_type,external_id) WHERE external_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS staged_url_idx ON staged_record(source_id,record_type,source_url) WHERE external_id IS NULL;
CREATE INDEX IF NOT EXISTS staged_review_idx ON staged_record(review_state,created_at,id) WHERE review_state='needs_review';

CREATE TABLE IF NOT EXISTS review_decision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staged_record_id uuid NOT NULL REFERENCES staged_record(id),
  actor_id uuid NOT NULL REFERENCES staff_user(id),
  decision text NOT NULL CHECK (decision IN ('approve','reject','correct')),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS record_revision (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type text NOT NULL,
  record_id uuid NOT NULL,
  staged_record_id uuid REFERENCES staged_record(id),
  snapshot jsonb NOT NULL,
  actor_id uuid REFERENCES staff_user(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revision_record_idx ON record_revision(record_type,record_id,created_at DESC);
CREATE TABLE IF NOT EXISTS audit_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES staff_user(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_time_idx ON audit_event(created_at DESC,id);
