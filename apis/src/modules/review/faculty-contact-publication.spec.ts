import {publishFacultyContact} from './faculty-contact-publication.js';
const payload={name:'Wolfgang Nejdl',existingFacultyId:'064f5bc3-2085-4cb0-a580-43ce34f9cf7b',institutionId:'8ad231a1-c318-4894-a09b-5e3a97344bc9',publicEmail:'nejdl@l3s.de',officialProfileUrl:'https://www.l3s.de/people/directors/wolfgang-nejdl/'};
describe('Faculty contact publication',()=>{
 it('updates a matched existing faculty record without certifying research affiliation',async()=>{
  const query=vi.fn().mockResolvedValue({rows:[{id:payload.existingFacultyId}]});
  expect(await publishFacultyContact({query} as never,payload,'evidence')).toBe(payload.existingFacultyId);
  expect(query.mock.calls[0][0]).toContain('public_email_evidence_id');
  expect(query.mock.calls[0][0]).not.toContain('research_metadata=');
  expect(query.mock.calls[0][0]).not.toContain(',verified_at=');
 });
 it('rejects identity mismatches and invalid contact data',async()=>{
  await expect(publishFacultyContact({query:vi.fn().mockResolvedValue({rows:[]})} as never,payload,'evidence')).rejects.toThrow('identity');
  await expect(publishFacultyContact({query:vi.fn()} as never,{...payload,publicEmail:'invalid'},'evidence')).rejects.toThrow('Invalid');
 });
});
