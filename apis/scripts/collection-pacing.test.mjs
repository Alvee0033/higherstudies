import test from 'node:test';
import assert from 'node:assert/strict';
import {retryAfterMs,nextRestCount,createPacer} from './collection-pacing.mjs';
test('honors numeric and HTTP-date Retry-After without truncating provider waits',()=>{
 assert.equal(retryAfterMs('120'),120000);
 assert.equal(retryAfterMs('Thu, 01 Jan 1970 00:02:00 GMT',0),120000);
 assert.equal(retryAfterMs('invalid'),0);
});
test('rests at 500 records and carries overflow into the next window',()=>{
 assert.deepEqual(nextRestCount(475,25,500),{rest:true,remaining:0});
 assert.deepEqual(nextRestCount(450,100,500),{rest:true,remaining:50});
 assert.deepEqual(nextRestCount(100,25,500),{rest:false,remaining:125});
});
test('records HTTP 403 as blocked instead of scheduling automatic retries',async()=>{
 const calls=[];const pool={query:async(sql,args)=>{calls.push({sql,args});return {rows:[]}}};
 const pacer=createPacer(pool,{id:'job',source_id:'source'},new AbortController().signal);
 await pacer.response({status:403,ok:false,headers:new Headers()},0);
 assert.equal(calls.length,1);
 assert.equal(JSON.parse(calls[0].args[1]).phase,'blocked');
});
test('cancellation interrupts a source cooldown before a request is sent',async()=>{
 const controller=new AbortController();
 const pool={query:async(sql)=>({rows:sql.includes('RETURNING')?[{ready_at:new Date(Date.now()+60000),cooldown_until:new Date(Date.now()+60000)}]:[]})};
 const pacer=createPacer(pool,{id:'job',source_id:'source'},controller.signal);
 const waiting=pacer.beforeRequest();
 setTimeout(()=>controller.abort(),5);
 await assert.rejects(waiting,{name:'AbortError'});
});
