import {test} from 'node:test';import assert from 'node:assert/strict';import {profileCandidates} from './automatic-faculty-contacts.mjs';
test('discovers named profile links without guessed URLs or external navigation',()=>{
 assert.deepEqual(profileCandidates('<a href="/people/wolfgang-nejdl">Professor</a><a href="https://evil.test/people/wolfgang-nejdl">Wolfgang Nejdl</a><a href="/other">Other Person</a>','https://uni.edu/people/','Wolfgang Nejdl'),['https://uni.edu/people/wolfgang-nejdl']);
 assert.deepEqual(profileCandidates('<a href="/people/a-wu">A Wu</a>','https://uni.edu/people/','A Wu'),[]);
});
