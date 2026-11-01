import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readTuition} from './studyportals-tuition.mjs';
test('keeps actual portal fees and periods, including nested values',()=>{
 assert.deepEqual(readTuition([{func:{getAmount:57500,getCurrency:'NZD',getUnit:'year'}}]),[{amount:57500,currency:'NZD',unit:'year'}]);
 assert.deepEqual(readTuition({func:[{func:{getAmount:{func:1200},getCurrency:{func:'EUR'},getUnit:{func:'semester'}}}]}),[{amount:1200,currency:'EUR',unit:'semester'}]);
});
test('retains free tuition, rejects missing or invalid amounts, and removes duplicates',()=>{
 const fee={getAmount:12,getCurrency:'EUR',getUnit:'year'};
 assert.deepEqual(readTuition([{isFree:true,getCurrency:'EUR'},fee,fee,{getAmount:null,getCurrency:'USD'},{getAmount:-10,getCurrency:'USD'}]),[{amount:0,currency:'EUR',unit:null},{amount:12,currency:'EUR',unit:'year'}]);
 assert.deepEqual(readTuition(null),[]);
});
