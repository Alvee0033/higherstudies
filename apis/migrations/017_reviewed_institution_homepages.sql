-- Restore homepage fields that the previous metadata publisher omitted from approved records.
WITH candidates AS (
 SELECT DISTINCT ON (s.payload->>'officialUrl') i.id,s.payload->>'officialUrl' AS url
 FROM institution i JOIN staged_record s ON s.payload->>'openAlexId'=i.openalex_id
 JOIN source src ON src.id=s.source_id
 WHERE i.official_url IS NULL AND s.record_type='institution' AND s.review_state='approved'
 AND src.adapter='openalex-authors' AND src.permission_status='approved'
 AND s.payload->>'officialUrl' ~ '^https?://'
 AND NOT EXISTS(SELECT 1 FROM institution existing WHERE existing.official_url=s.payload->>'officialUrl')
 ORDER BY s.payload->>'officialUrl',i.id
)
UPDATE institution i SET official_url=c.url,updated_at=now() FROM candidates c WHERE i.id=c.id;
-- Retry automatic contact discovery after institution URLs become available.
UPDATE faculty_contact_task SET status='queued',next_attempt_at=now() WHERE status='needs_source';
