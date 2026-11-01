CREATE TABLE student_workspace (
 student_id uuid PRIMARY KEY REFERENCES student_user(id) ON DELETE CASCADE,
 profile jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(profile)='object'),
 settings jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(settings)='object'),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE student_application (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id uuid NOT NULL REFERENCES student_user(id) ON DELETE CASCADE,
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX student_application_owner_idx ON student_application(student_id,created_at DESC,id);
CREATE TABLE student_saved_item (
 student_id uuid NOT NULL REFERENCES student_user(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('institutions','programmes','faculty')),
 record_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(student_id,kind,record_id)
);
