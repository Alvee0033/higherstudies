import test from 'node:test';
import assert from 'node:assert/strict';
import {configuredOpenAlexKeyCount,fetchWithKeyRotation,getAvailableKeys} from './openalex-keys.mjs';
test('deduplicates numbered and list environment keys',()=>{
 const names=['OPENALEX_API_KEY','OPENALEX_API_KEY_2','OPENALEX_API_KEYS'];const old=names.map(name=>process.env[name]);
 try{process.env.OPENALEX_API_KEY='test-primary-1';process.env.OPENALEX_API_KEY_2='test-secondary-2';process.env.OPENALEX_API_KEYS='test-secondary-2,test-tertiary-3';assert.equal(configuredOpenAlexKeyCount(),3);}
 finally{names.forEach((name,index)=>{if(old[index]===undefined)delete process.env[name];else process.env[name]=old[index];});}
});
test('rotates keys on rate limit without leaking a prior key into the next URL',async()=>{
 const old=[process.env.OPENALEX_API_KEY,process.env.OPENALEX_API_KEYS],oldFetch=globalThis.fetch,used=[];
 try{
  process.env.OPENALEX_API_KEY='test-rotate-a';process.env.OPENALEX_API_KEYS='test-rotate-b';
  globalThis.fetch=async url=>{used.push(new URL(url).searchParams.get('api_key'));return used.length===1?{status:429,ok:false,headers:new Headers({'retry-after':'60'})}:{status:200,ok:true,headers:new Headers()};};
  const response=await fetchWithKeyRotation('https://api.openalex.org/institutions?per_page=1');
  assert.equal(response.status,200);assert.equal(new Set(used).size,2);assert.equal(getAvailableKeys().includes(used[0]),false);
 }finally{globalThis.fetch=oldFetch;if(old[0]===undefined)delete process.env.OPENALEX_API_KEY;else process.env.OPENALEX_API_KEY=old[0];if(old[1]===undefined)delete process.env.OPENALEX_API_KEYS;else process.env.OPENALEX_API_KEYS=old[1];}
});
