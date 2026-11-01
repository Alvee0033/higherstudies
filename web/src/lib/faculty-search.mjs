export function buildFacultySearchParams({
  page = 1,
  activeTab = 'all',
  sortBy = 'Name',
  searchQuery = '',
  filterSearch = '',
  institutionId = '',
  country = '',
  selectedDept = 'All Departments',
  selectedArea = 'All Research Areas',
  ranks = {},
  hIndex = 100,
  citationCount = 50000,
}) {
  const sort = activeTab === 'recent'
    ? 'newest'
    : sortBy === 'H-Index'
      ? 'h-index'
      : sortBy === 'Citations'
        ? 'citations'
        : 'title-asc';
  const params = new URLSearchParams({
    limit: '20',
    offset: String(Math.max(0, page - 1) * 20),
    sort,
  });
  const query = [searchQuery.trim(), filterSearch.trim()].filter(Boolean).join(' ');
  if (query) params.set('q', query);
  if (institutionId) params.set('institutionId', institutionId);
  if (country) params.set('country', country);
  if (selectedDept !== 'All Departments') params.set('academicUnit', selectedDept);
  if (selectedArea !== 'All Research Areas') params.set('researchTopic', selectedArea);
  const selectedRanks = Object.entries(ranks).filter(([, enabled]) => enabled).map(([rank]) => rank);
  if (selectedRanks.length) params.set('ranks', selectedRanks.join(','));
  if (hIndex < 100) params.set('hIndexMax', String(hIndex));
  if (citationCount < 50000) params.set('citationsMax', String(citationCount));
  return params;
}
