import test from 'node:test';
import assert from 'node:assert/strict';
import { extractFaculty, publicAddress } from './faculty-adapter.mjs';

test('extracts only explicit institutional structured facts', () => {
  const html = `<script type="application/ld+json">{"@graph":[{"@type":"Person","name":"Test Researcher","url":"/faculty/researcher","jobTitle":"Professor","email":"mailto:researcher@example.edu","knowsAbout":["Robotics"]}]}</script>`;
  const [person] = extractFaculty(html, 'https://example.edu/faculty', 'institution-id');
  assert.equal(person.payload.name, 'Test Researcher');
  assert.equal(person.payload.publicEmail, 'researcher@example.edu');
  assert.deepEqual(person.payload.researchTopics, ['Robotics']);
  assert.equal(person.payload.officialProfileUrl, 'https://example.edu/faculty/researcher');
});
test('omits malformed data and external profiles without synthesizing faculty', () => {
  assert.deepEqual(extractFaculty('<h1>Faculty directory</h1>', 'https://example.edu', 'id'), []);
  assert.deepEqual(extractFaculty('<script type="application/ld+json">{"@type":"Person","name":"Other","url":"https://external.edu/person"}</script>', 'https://example.edu', 'id'), []);
});
test('blocks private, metadata, reserved and IPv6 addresses', () => {
  for (const address of ['127.0.0.1','10.1.0.1','169.254.169.254','172.16.0.1','192.168.1.1','100.64.0.1','::1','224.0.0.1']) assert.equal(publicAddress(address), false, address);
  assert.equal(publicAddress('8.8.8.8'), true);
});
