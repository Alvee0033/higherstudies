const https = require('https');
const { Client } = require('pg');

async function main() {
  const worldUnis = await new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json', { headers: { 'User-Agent': 'HigherStudy/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  console.log('Loaded world universities:', worldUnis.length);

  function cleanName(n) {
    return n.replace(/\(.*?\)/g, '')
      .replace(/^(the|university of|college of)\s+/i, '')
      .replace(/[\s\-]+/g, ' ')
      .trim()
      .toLowerCase();
  }

  const domainMap = new Map();
  for (const u of worldUnis) {
    const domains = u.domains || [];
    const webPages = u.web_pages || [];
    const targetUrl = webPages[0] || (domains[0] ? 'https://' + domains[0] : null);
    if (!targetUrl) continue;
    const orig = (u.name || '').trim().toLowerCase();
    domainMap.set(orig, targetUrl);
    const cn = cleanName(u.name || '');
    if (!domainMap.has(cn)) domainMap.set(cn, targetUrl);
  }

  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5433/higherstudy_dev'
  });
  await client.connect();

  const { rows } = await client.query('SELECT id, name, official_url FROM institution');
  let updated = 0;

  for (const row of rows) {
    if (row.official_url) continue;
    const nameLower = row.name.toLowerCase().trim();
    let url = domainMap.get(nameLower);
    if (!url) url = domainMap.get(cleanName(row.name));
    if (!url) {
      const base = row.name.split(/[,–\-\(]/)[0].trim();
      url = domainMap.get(base.toLowerCase()) || domainMap.get(cleanName(base));
    }

    if (url) {
      await client.query('UPDATE institution SET official_url =  WHERE id = ', [url, row.id]);
      updated++;
    }
  }

  console.log('Updated institutions count:', updated);
  const total = await client.query('SELECT count(*) FROM institution WHERE official_url IS NOT NULL');
  console.log('Total institutions with official_url now:', total.rows[0].count);
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
