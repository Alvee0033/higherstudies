import {publishProgrammeListing} from './discovery-publication.js';
import {BadRequestException} from '@nestjs/common';
describe('Reviewed programme discovery publication',()=>{
 it('publishes an attributable listing without certifying admission requirements',async()=>{
  const client={query:vi.fn().mockResolvedValueOnce({rows:[]}).mockResolvedValueOnce({rows:[{id:'institution'}]}).mockResolvedValueOnce({rows:[{id:'programme'}]})};
  const id=await publishProgrammeListing(client as never,{title:'MSc Example',degree:'masters',countryCode:'GB',institutionName:'Example University',tuition:[{amount:57500,currency:'NZD',unit:'year'}]},'https://www.mastersportal.com/studies/123/example.html','evidence');
  expect(id).toBe('programme');
  const insert=client.query.mock.calls[2];
  expect(insert[0]).toContain('Admission requirements have not been verified');
  expect(insert[0]).not.toContain('verified_at=now()');
  expect(insert[1]).toEqual(['institution','MSc Example','masters','GB','https://www.mastersportal.com/studies/123/example.html','evidence',JSON.stringify([{amount:57500,currency:'NZD',unit:'year'}]),null,'{}']);
 });
 it('rejects a forged listing host',async()=>{
  await expect(publishProgrammeListing({query:vi.fn()} as never,{},'https://unrelated.example/listing','evidence')).rejects.toBeInstanceOf(BadRequestException);
 });
});
