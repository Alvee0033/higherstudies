import test from 'node:test';
import assert from 'node:assert/strict';
import { collectOpenAlex, readOpenAlexAuthor } from './openalex-adapter.mjs';
const institution = { id: 'local-id', name: 'Example University', openalex_id: 'https://openalex.org/I1' };
const sourceInstitution = id => ({ id: `https://openalex.org/I${id}`, display_name: `University ${id}`, country_code: 'US', homepage_url: `https://university${id}.edu` });
function fakePool(existing = [institution]) {
  const writes = [];
  const client = { query: async (sql, args) => { writes.push({ sql, args }); return { rows: [] }; }, release() {} };
  return { writes, connect: async () => client, query: async (sql, args) => {
    if (sql.includes('SELECT id, name, country_code, openalex_id')) return { rows: existing };
    writes.push({ sql, args }); return { rows: [] };
  } };
}
const ok = body => ({ ok: true, status: 200, headers: new Headers(), json: async () => body });
test('keeps metrics without inventing contacts', () => {
  const item = readOpenAlexAuthor({ id: 'https://openalex.org/A123', display_name: 'Researcher', last_known_institutions: [{ id: institution.openalex_id }], cited_by_count: 45, summary_stats: { h_index: 4 } }, institution);
  assert.equal(item.payload.hIndex, 4); assert.equal(item.payload.citedByCount, 45);
  assert.equal(item.payload.publicEmail, undefined); assert.equal(item.payload.title, undefined);
});
test('continues registry discovery with existing institutions and saved cursor', async () => {
  const old = globalThis.fetch; const urls = [];
  globalThis.fetch = async url => { urls.push(new URL(url)); return ok({ results: [sourceInstitution(2)], meta: { next_cursor: 'page-three' } }); };
  try {
    const pool = fakePool(); const staged = [];
    const job = { id: 'job', source_id: 'source', base_url: 'https://api.openalex.org', progress: { institutionDiscoveryCursor: 'page-two', found: 100, accepted: 90 } };
    const result = await collectOpenAlex(job, pool, async()=>{}, new AbortController().signal, async(items,key,type) => { staged.push({items,key,type}); return { accepted: items.length }; });
    assert.equal(urls[0].searchParams.get('cursor'), 'page-two'); assert.equal(staged[0].type, 'institution');
    assert.equal(result.found, 101); assert.equal(result.more, true);
    assert.equal(job.progress.institutionDiscoveryCursor, 'page-three');
    assert.ok(pool.writes.some(({sql}) => sql.includes('INSERT INTO institution')));
  } finally { globalThis.fetch = old; }
});
test('marks final registry page complete', async () => {
  const old = globalThis.fetch; globalThis.fetch = async () => ok({results:[sourceInstitution(3)],meta:{next_cursor:null}});
  try {
    const job={id:'job',source_id:'source',base_url:'https://api.openalex.org',progress:{institutionDiscoveryCursor:'final'}};
    const result=await collectOpenAlex(job,fakePool(),async()=>{},new AbortController().signal,async items=>({accepted:items.length}));
    assert.equal(result.more,true); assert.equal(job.progress.institutionDiscoveryComplete,true);
  } finally {globalThis.fetch=old;}
});
test('resumes saved author cursor after registry completion', async () => {
  const old=globalThis.fetch; const urls=[];
  globalThis.fetch=async url=>{urls.push(new URL(url));return ok({results:[],meta:{next_cursor:null}});};
  try {
    const job={id:'job',base_url:'https://api.openalex.org',progress:{institutionDiscoveryComplete:true,resolveOffset:1,metadataOffset:1,institutionIndex:0,institutionId:institution.id,cursor:'saved-author-cursor',found:40,accepted:35}};
    const result=await collectOpenAlex(job,fakePool(),async()=>{},new AbortController().signal,async()=>({accepted:0}));
    assert.equal(urls.length,1);assert.equal(urls[0].pathname,'/authors');assert.equal(urls[0].searchParams.get('cursor'),'saved-author-cursor');assert.equal(result.found,40);
  }finally{globalThis.fetch=old;}
});
