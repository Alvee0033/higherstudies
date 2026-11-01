import { publishResearchMetadata } from './research-publication.js';
import { BadRequestException } from '@nestjs/common';

describe('OpenAlex source-policy publication', () => {
  it('rejects forged source URLs before writing', async () => {
    const client = { query: vi.fn() };
    await expect(publishResearchMetadata(client as never,'source','stage','https://other.example/author',{name:'Researcher',institutionId:'institution',openAlexId:'https://openalex.org/A123'})).rejects.toBeInstanceOf(BadRequestException);
    expect(client.query).not.toHaveBeenCalled();
  });
  it('records an automatic decision and leaves employment unverified', async () => {
    const client = { query: vi.fn().mockResolvedValue({rows:[{id:'record'}]}) };
    await publishResearchMetadata(client as never,'source','stage','https://api.openalex.org/authors/A123',{name:'Researcher',institutionId:'institution',openAlexId:'https://openalex.org/A123',hIndex:4});
    const calls = client.query.mock.calls;
    expect(calls.some(([sql]) => String(sql).includes("'source_policy'"))).toBe(true);
    const faculty = calls.find(([sql]) => String(sql).includes('INSERT INTO faculty_member'))!;
    expect(String(faculty[0])).not.toContain("verified_at=now()");
    expect(String(faculty[1][5])).toContain('current appointment not verified');
  });
});

describe('Automatic institution registry metadata',()=>{
 it('validates institution source identity before writing',async()=>{
  const {publishInstitutionRegistryMetadata}=await import('./research-publication.js');
  const client={query:vi.fn()};
  await expect(publishInstitutionRegistryMetadata(client as never,'source','stage','https://other.example/institution',{openAlexId:'https://openalex.org/I1'})).rejects.toBeInstanceOf(BadRequestException);
  expect(client.query).not.toHaveBeenCalled();
 });
 it('records source policy without certifying admission or institutional facts',async()=>{
  const {publishInstitutionRegistryMetadata}=await import('./research-publication.js');
  const client={query:vi.fn().mockImplementation(async sql=>({rows:String(sql).startsWith('SELECT id FROM institution WHERE official_url')?[]:[{id:'record'}]}))};
  await publishInstitutionRegistryMetadata(client as never,'source','stage','https://api.openalex.org/institutions/I1',{openAlexId:'https://openalex.org/I1',name:'Institution',countryCode:'US',officialUrl:'https://example.edu'});
  expect(client.query.mock.calls.some(([sql])=>String(sql).includes("'source_policy'"))).toBe(true);
  expect(client.query.mock.calls.some(([sql])=>String(sql).includes('verified_at=now()'))).toBe(false);
 });
});
