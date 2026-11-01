import { extractPublicContact } from './faculty-contact.mjs';
import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { isIP } from 'node:net';

export function publicAddress(address) {
  if (isIP(address) !== 4) return false;
  const [a, b] = address.split('.').map(Number);
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) || (a === 100 && b >= 64 && b <= 127) || a === 198);
}

export async function fetchOfficial(url, signal) {
  const target = new URL(url);
  if (target.protocol !== 'https:' || target.username || target.password || (target.port && target.port !== '443')) throw new Error('Only public HTTPS pages on port 443 are supported');
  const addresses = await lookup(target.hostname, { all: true, family: 4 });
  if (!addresses.length || addresses.some(({ address }) => !publicAddress(address))) throw new Error('Source resolves to a non-public address');
  return new Promise((resolve, reject) => {
    const req = request(target, {
      signal, timeout: 15000,
      headers: { 'User-Agent': 'HigherStudyCollector/1.0', Accept: 'text/html,text/plain' },
      lookup: (_host, options, callback) => options.all ? callback(null, [{ address: addresses[0].address, family: 4 }]) : callback(null, addresses[0].address, 4),
    }, (res) => {
      if (res.statusCode !== 200) { res.resume(); reject(new Error(`Source returned HTTP ${res.statusCode}; redirects are not followed`)); return; }
      let text = ''; let bytes = 0;
      res.on('data', (chunk) => { bytes += chunk.length; if (bytes > 2_000_000) req.destroy(new Error('Page exceeds 2MB limit')); else text += chunk; });
      res.on('end', () => resolve(text));
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error('Source request timed out')));
    req.on('error', reject); req.end();
  });
}

export function extractFaculty(html, pageUrl, institutionId) {
  const people = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach(visit); return; }
    const types = [].concat(value['@type'] || []);
    if (types.includes('Person') && typeof value.name === 'string' && value.name.trim()) {
      let profile;
      try { profile = new URL(value.url || pageUrl, pageUrl); } catch { return; }
      if (profile.origin !== new URL(pageUrl).origin || profile.protocol !== 'https:') return;
      const email = typeof value.email === 'string' ? value.email.replace(/^mailto:/, '') : null;
      people.push({ externalId: profile.href + '#' + value.name.trim(), sourceUrl: pageUrl, payload: {
        name: value.name.trim(), institutionId, officialProfileUrl: profile.href,
        title: typeof value.jobTitle === 'string' ? value.jobTitle : null,
        publicEmail: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
        researchTopics: [].concat(value.knowsAbout || []).filter((v) => typeof v === 'string').slice(0, 30),
        evidenceExcerpt: `Institutional structured data: ${value.name.trim()}${typeof value.jobTitle === 'string' ? ' — ' + value.jobTitle : ''}`,
      } });
    }
    Object.values(value).forEach(visit);
  };
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { visit(JSON.parse(match[1])); } catch { /* Malformed source data is omitted. */ }
  }
  return [...new Map(people.map((p) => [p.externalId, p])).values()];
}

export async function collectFaculty(job, pool, checkpoint, signal) {
  const base = new URL(job.base_url);
  if (Array.isArray(job.progress?.contactTargets)) {
    const robots = await fetchOfficial(new URL('/robots.txt', base), signal);
    const blocked = [...robots.matchAll(/^Disallow:\s*(\S+)/gim)].map(match=>match[1].split('*')[0]);
    const records=[];
    for(const target of job.progress.contactTargets.slice(0,20)) {
      await checkpoint();
      const page=new URL(target.profileUrl);
      if(page.origin!==base.origin || blocked.some(path=>page.pathname.startsWith(path)))throw new Error('Profile outside approved source or blocked by robots');
      const faculty=(await pool.query('SELECT id,name,institution_id FROM faculty_member WHERE id=$1',[target.facultyId])).rows[0];
      if(!faculty)continue;
      const contact=extractPublicContact(await fetchOfficial(page,signal),faculty.name,page.href);
      if(!contact)continue;
      records.push({externalId:`public-contact:${faculty.id}`,sourceUrl:page.href,payload:{...contact,name:faculty.name,institutionId:faculty.institution_id,existingFacultyId:faculty.id,enrichmentKind:'public_contact'}});
    }
    if(!records.length)throw new Error('No unambiguous public contact found on the supplied official profiles');
    return records;
  }
  const institutions = await pool.query(`SELECT id,official_url FROM institution WHERE official_url IS NOT NULL UNION SELECT i.id,f.official_profile_url AS official_url FROM institution i JOIN faculty_member f ON f.institution_id=i.id WHERE f.official_profile_url=$1`,[base.href]);
  const institution = institutions.rows.find((row) => { try { const h = new URL(row.official_url).hostname; return base.hostname === h || base.hostname.endsWith('.' + h); } catch { return false; } });
  if (!institution) throw new Error('Add an institution with an official URL matching this source before collecting faculty');
  const robots = await fetchOfficial(new URL('/robots.txt', base), signal);
  // Conservative handling: a matching disallow rule in any group blocks this adapter.
  const disallowed = [...robots.matchAll(/^Disallow:\s*(\S+)/gim)].map((m) => m[1]);
  const allowed = (url) => !disallowed.some((rule) => new URL(url).pathname.startsWith(rule.split('*')[0]));
  const queue = [base.href]; const visited = new Set(); const items = [];
  const limit = ({ shallow: 1, medium: 5, deep: 15 })[job.depth] || 1;
  while (queue.length && visited.size < limit) {
    await checkpoint(); const url = queue.shift();
    if (visited.has(url) || !allowed(url)) continue;
    visited.add(url);
    const html = await fetchOfficial(url, signal);
    items.push(...extractFaculty(html, url, institution.id));
    const matches = await pool.query('SELECT id,name,institution_id FROM faculty_member WHERE institution_id=$1 AND official_profile_url=$2 LIMIT 20',[institution.id,url]);
    for (const faculty of matches.rows) {
      const contact=extractPublicContact(html,faculty.name,url);
      if(contact)items.push({externalId:`public-contact:${faculty.id}`,sourceUrl:url,payload:{...contact,name:faculty.name,institutionId:faculty.institution_id,existingFacultyId:faculty.id,enrichmentKind:'public_contact'}});
    }
    await checkpoint(items.length);
    for (const match of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
      try { const link = new URL(match[1].replaceAll('&amp;', '&'), url); if (link.origin === base.origin && !link.search && /faculty|people|professor|staff|profile/i.test(link.pathname) && !visited.has(link.href) && queue.length < 100) queue.push(link.href); } catch { /* Invalid links are ignored. */ }
    }
    if (queue.length && visited.size < limit) await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  const unique = [...new Map(items.map((item) => [item.externalId, item])).values()];
  if (!unique.length) throw new Error('No structured Person records found. This page needs a source-specific faculty adapter; no records were invented');
  return unique;
}
