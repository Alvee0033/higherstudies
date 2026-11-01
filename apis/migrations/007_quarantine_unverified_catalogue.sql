-- The legacy catalogue importer promoted Studyportals discovery records and
-- generated requirement/faculty claims into the public catalogue. Studyportals
-- is a discovery source only; these rows must remain unpublished until
-- official institutional/funder evidence is collected and reviewed.
UPDATE institution
SET status = 'stale', verified_at = NULL, updated_at = now()
WHERE status = 'published'
  AND (evidence_id IS NULL OR evidence_id IN (
    SELECT evidence.id
    FROM source_evidence AS evidence
    JOIN source ON source.id = evidence.source_id
    WHERE source.adapter LIKE 'studyportals%'
  ));

UPDATE programme
SET status = 'stale', verified_at = NULL, updated_at = now()
WHERE status = 'published'
  AND (evidence_id IS NULL OR evidence_id IN (
    SELECT evidence.id
    FROM source_evidence AS evidence
    JOIN source ON source.id = evidence.source_id
    WHERE source.adapter LIKE 'studyportals%'
  ));

UPDATE requirement_claim
SET status = 'stale', verified_at = NULL
WHERE status = 'published'
  AND evidence_id IN (
    SELECT evidence.id
    FROM source_evidence AS evidence
    JOIN source ON source.id = evidence.source_id
    WHERE source.adapter LIKE 'studyportals%'
  );

UPDATE faculty_member
SET status = 'stale', verified_at = NULL, updated_at = now()
WHERE status = 'published'
  AND evidence_id IN (
    SELECT evidence.id
    FROM source_evidence AS evidence
    JOIN source ON source.id = evidence.source_id
    WHERE source.adapter LIKE 'studyportals%'
  );

UPDATE funding_opportunity
SET status = 'stale', verified_at = NULL, updated_at = now()
WHERE status = 'published'
  AND evidence_id IN (
    SELECT evidence.id
    FROM source_evidence AS evidence
    JOIN source ON source.id = evidence.source_id
    WHERE source.adapter LIKE 'studyportals%'
  );
