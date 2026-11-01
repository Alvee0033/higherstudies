export interface UniversityItem {
  id: string;
  name: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
  location: string;
  officialUrl?: string;
  verifiedAt?: string;
  programmeCount: number;
  facultyCount: number;
  evidenceUrl?: string;
  sourceName?: string;
  logo: string;
  badge?: string;
}

export interface UniversityFiltersState {
  searchQuery: string;
  selectedCountries: string[];
  sortBy: string;
}
