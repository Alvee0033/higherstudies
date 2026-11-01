ALTER TABLE crawl_job
  ADD COLUMN IF NOT EXISTS depth text NOT NULL DEFAULT 'shallow'
    CHECK (depth IN ('shallow', 'medium', 'deep')),
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'discovery'
    CHECK (mode IN ('discovery', 'refresh', 'full'));

INSERT INTO system_setting (key, value)
VALUES (
  'autopilot',
  '{
    "enabled": false,
    "intervalHours": 24,
    "triggerOnSchedule": true,
    "triggerOnSourceEnabled": false,
    "onlyDueSources": true,
    "sourceIds": [],
    "maxSourcesPerRun": 10,
    "depth": "shallow",
    "mode": "discovery",
    "nextRunAt": null,
    "lastRunAt": null,
    "lastCheckedAt": null,
    "lastRunSummary": null
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;
