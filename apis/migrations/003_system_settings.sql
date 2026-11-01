CREATE TABLE IF NOT EXISTS system_setting (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO system_setting (key, value)
VALUES (
  'countries',
  '[
    {"code":"US","name":"United States","region":"na"},
    {"code":"GB","name":"United Kingdom","region":"eu"},
    {"code":"CA","name":"Canada","region":"na"},
    {"code":"AU","name":"Australia","region":"apac"},
    {"code":"DE","name":"Germany","region":"eu"},
    {"code":"NL","name":"Netherlands","region":"eu"},
    {"code":"FR","name":"France","region":"eu"},
    {"code":"IT","name":"Italy","region":"eu"},
    {"code":"SE","name":"Sweden","region":"eu"},
    {"code":"CH","name":"Switzerland","region":"eu"},
    {"code":"ES","name":"Spain","region":"eu"},
    {"code":"NZ","name":"New Zealand","region":"apac"},
    {"code":"CN","name":"China","region":"apac"},
    {"code":"JP","name":"Japan","region":"apac"},
    {"code":"IN","name":"India","region":"apac"},
    {"code":"SG","name":"Singapore","region":"apac"},
    {"code":"HK","name":"Hong Kong","region":"apac"},
    {"code":"MY","name":"Malaysia","region":"apac"},
    {"code":"IE","name":"Ireland","region":"eu"},
    {"code":"ZA","name":"South Africa","region":"mea"},
    {"code":"TR","name":"Turkey","region":"mea"},
    {"code":"PT","name":"Portugal","region":"eu"},
    {"code":"NO","name":"Norway","region":"eu"},
    {"code":"AE","name":"United Arab Emirates","region":"mea"},
    {"code":"KR","name":"South Korea","region":"apac"},
    {"code":"BE","name":"Belgium","region":"eu"},
    {"code":"AT","name":"Austria","region":"eu"},
    {"code":"DK","name":"Denmark","region":"eu"},
    {"code":"FI","name":"Finland","region":"eu"},
    {"code":"PL","name":"Poland","region":"eu"},
    {"code":"CZ","name":"Czech Republic","region":"eu"},
    {"code":"HU","name":"Hungary","region":"eu"},
    {"code":"IL","name":"Israel","region":"mea"},
    {"code":"MX","name":"Mexico","region":"na"}
  ]'::jsonb
) ON CONFLICT (key) DO NOTHING;

INSERT INTO system_setting (key, value)
VALUES (
  'regions',
  '{
    "na": { "label": "North America", "countries": ["US", "CA", "MX"] },
    "eu": { "label": "Europe", "countries": ["GB", "DE", "NL", "CH", "FR", "SE", "DK", "FI", "NO", "IT", "ES", "IE", "BE", "AT", "CZ", "HU", "PL", "PT", "RO", "BG", "EE", "GR", "IS", "LT", "LU", "MT", "SK", "SI", "UA", "BY", "RU"] },
    "apac": { "label": "Asia-Pacific", "countries": ["AU", "NZ", "JP", "SG", "HK", "KR", "CN", "IN", "MY", "PH", "TH", "TW", "ID", "LK", "PK", "KH", "KZ"] },
    "mea": { "label": "Middle East & Africa", "countries": ["AE", "EG", "IL", "IR", "JO", "KE", "LB", "NA", "NE", "OM", "SA", "SY", "TR", "ZA", "ZM", "ET"] },
    "other": { "label": "Other Regions", "countries": ["JM", "XC"] }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;
