ALTER TABLE programme ADD COLUMN IF NOT EXISTS tuition jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(tuition) = 'array');
UPDATE programme p SET tuition=s.payload->'tuition'
FROM staged_record s WHERE s.record_type='programme' AND s.review_state='approved'
AND s.source_url=p.discovery_url AND jsonb_typeof(s.payload->'tuition')='array';
