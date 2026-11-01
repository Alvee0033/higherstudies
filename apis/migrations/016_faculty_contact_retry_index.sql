DROP INDEX IF EXISTS faculty_contact_task_due_idx;
CREATE INDEX faculty_contact_task_due_idx ON faculty_contact_task(next_attempt_at,faculty_id) WHERE status IN ('queued','running','failed','not_found','needs_source');
