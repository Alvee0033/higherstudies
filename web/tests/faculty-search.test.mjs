import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildFacultySearchParams } from '../src/lib/faculty-search.mjs';

describe('buildFacultySearchParams', () => {
  it('maps visible search and filter values to supported catalogue parameters', () => {
    const params = buildFacultySearchParams({
      page: 2,
      activeTab: 'recent',
      searchQuery: 'machine learning',
      filterSearch: '',
      institutionId: 'inst-1',
      country: 'DE',
      selectedDept: 'Computer Science',
      selectedArea: 'Robotics',
      ranks: { professor: true, assoc: false, assistant: false, lecturer: false },
      hIndex: 75,
      citationCount: 12000,
    });

    assert.equal(params.get('offset'), '20');
    assert.equal(params.get('sort'), 'newest');
    assert.equal(params.get('q'), 'machine learning');
    assert.equal(params.get('institutionId'), 'inst-1');
    assert.equal(params.get('country'), 'DE');
    assert.equal(params.get('academicUnit'), 'Computer Science');
    assert.equal(params.get('researchTopic'), 'Robotics');
    assert.equal(params.get('ranks'), 'professor');
    assert.equal(params.get('hIndexMax'), '75');
    assert.equal(params.get('citationsMax'), '12000');
    assert.equal(params.has('onlyActiveResearchers'), false);
  });

  it('uses the supported alphabetical sort when relevance is not available', () => {
    const params = buildFacultySearchParams({ page: 1, sortBy: 'Name' });
    assert.equal(params.get('sort'), 'title-asc');
  });
});
