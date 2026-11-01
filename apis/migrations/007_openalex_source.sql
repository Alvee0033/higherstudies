INSERT INTO source(name,base_url,adapter,permission_status,permission_note,enabled,refresh_hours)
SELECT 'OpenAlex Researcher and Faculty Discovery','https://api.openalex.org','openalex-authors','approved',
'OpenAlex research metadata API; CC0 data. https://help.openalex.org/api/ . No generated emails or current employment claims. Institutional review required for publication.',true,168
WHERE NOT EXISTS (SELECT 1 FROM source WHERE adapter='openalex-authors');
