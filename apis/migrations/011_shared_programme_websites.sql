-- Universities may use one programme-family page for several specialisations.
ALTER TABLE programme DROP CONSTRAINT IF EXISTS programme_official_url_key;
CREATE INDEX IF NOT EXISTS programme_official_url_idx ON programme(official_url) WHERE official_url IS NOT NULL;
