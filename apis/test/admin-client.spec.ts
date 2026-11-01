describe('Staff CSRF token reuse for large review batches',()=>{
 beforeEach(()=>vi.resetModules());
 afterEach(()=>vi.unstubAllGlobals());
 it('reuses the session token across bulk requests and refreshes it after login',async()=>{
  const request=vi.fn(async(input:unknown)=>new Response(JSON.stringify(String(input).endsWith('/csrf')?{data:{token:'test-csrf'}}:{data:[]}),{status:200,headers:{'content-type':'application/json'}}));
  vi.stubGlobal('fetch',request);
  const {api}=await import('../../admin/src/lib/api.ts');
  for(let index=0;index<3;index++) await api('/v1/admin/review-items/bulk-decisions',{method:'POST',body:'{}'});
  expect(request.mock.calls.filter(([url])=>String(url).endsWith('/csrf'))).toHaveLength(1);
  await api('/v1/admin/auth/login',{method:'POST',body:'{}'});
  await api('/v1/admin/review-items/bulk-decisions',{method:'POST',body:'{}'});
  expect(request.mock.calls.filter(([url])=>String(url).endsWith('/csrf'))).toHaveLength(2);
 });
});
