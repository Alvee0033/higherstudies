ALTER TABLE faculty_member ADD COLUMN public_email_evidence_id uuid REFERENCES source_evidence(id);
ALTER TABLE faculty_member ADD COLUMN public_email_verified_at timestamptz;
