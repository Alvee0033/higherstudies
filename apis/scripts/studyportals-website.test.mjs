import {test} from 'node:test';import assert from 'node:assert/strict';import {readProgrammeWebsite} from './studyportals-website.mjs';
test('extracts university destination inside portal tracking metadata',()=>{
 assert.equal(readProgrammeWebsite({func:{getUrl:'track/click/?target=1',getTracking:{func:{getDescription:'https://university.example/msc?major=policy&utm_source=studyportals'}}}}),'https://university.example/msc?major=policy');
});
test('never substitutes a tracking or unsafe link for a university destination',()=>{
 for(const value of [null,{getUrl:'https://sl.prtl.co/track/click/?target=1'},{getUrl:'javascript:alert(1)'},{getUrl:'https://localhost/private'},{getUrl:'https://127.0.0.1/path'}])assert.equal(readProgrammeWebsite(value),null);
});
