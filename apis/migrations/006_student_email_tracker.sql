CREATE TABLE IF NOT EXISTS student_email_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student_user(id) ON DELETE CASCADE,
  faculty_member_id uuid REFERENCES faculty_member(id) ON DELETE SET NULL,
  professor_name text NOT NULL,
  professor_title text,
  email text NOT NULL,
  institution_name text NOT NULL,
  academic_unit text,
  website text,
  subject text,
  sent_at timestamptz,
  follow_up_at timestamptz,
  replied_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','waiting','positive_reply','negative_reply','interview')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS student_email_tracker_owner_recent_idx
  ON student_email_tracker(student_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS student_email_tracker_owner_status_idx
  ON student_email_tracker(student_id, status, created_at DESC);
