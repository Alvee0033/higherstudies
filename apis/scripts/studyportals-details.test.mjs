import {test} from 'node:test';import assert from 'node:assert/strict';import {readProgrammeDetails} from './studyportals-details.mjs';
const dt=date=>({class:'SerializableDateTime',parameters:[date+'T00:00:00+0000']});
test('extracts source-listed duration, real scores, and applicant-specific deadlines',()=>{
 const result=readProgrammeDetails({getDuration:{func:{getAmount:24,getPeriod:'months'}},getEnglishRequirements:{func:{getIELTS:6.5,canShowIELTS:true,getTOEFLInternet:79,canShowTOEFLInternet:true}},getTimings:[{func:{getStartDate:{func:{getDate:dt('2027-05-01'),getDeadlines:[{func:{getType:'international',getDate:dt('2026-11-01')}}]}}}}],isOnCampus:true});
 assert.deepEqual(result.duration,{amount:24,unit:'months'});assert.deepEqual(result.englishRequirements,[{type:'IELTS',score:6.5},{type:'TOEFL iBT',score:79}]);assert.equal(result.intakes[0].applicantCategory,'international');assert.equal(result.intakes[0].startsOn,'2027-05-01');assert.equal(result.intakes[0].deadlineOn,'2026-11-01');assert.deepEqual(result.delivery,['On campus']);
});
test('never fabricates scores, dates, waivers, or language when absent',()=>{
 const result=readProgrammeDetails({getEnglishRequirements:{func:{getIELTS:null,canShowIELTS:true,getTOEFLInternet:999,canShowTOEFLInternet:true}}});assert.deepEqual(result.englishRequirements,[]);assert.deepEqual(result.intakes,[]);assert.equal(result.language,null);
});
