CREATE TABLE faculty_contact_task (
 faculty_id uuid PRIMARY KEY REFERENCES faculty_member(id) ON DELETE CASCADE,
 status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','found','not_found','needs_source','failed')),
 attempts integer NOT NULL DEFAULT 0,
 next_attempt_at timestamptz NOT NULL DEFAULT now(),
 lease_until timestamptz,
 message text,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX faculty_contact_task_due_idx ON faculty_contact_task(next_attempt_at,faculty_id) WHERE status IN ('queued','running','failed');
