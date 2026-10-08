export interface UniversityItem {
  id: string;
  name: string;
  location: string;
  badge?: string;
  qsRank: number;
  acceptanceRate: string;
  annualTuition: string;
  matchScore: number;
  greRequired: boolean;
  ieltsScore: string;
  fundingAvailable: boolean;
  logo: string;
}

export interface UniversityFiltersState {
  degreeLevel: string;
  fieldOfStudy: string;
  specialization: string;
  gpaMin: number;
  ieltsMin: number;
  studyDestination: string;
  selectedCountries: string[];
  excludeCountry: string;
}
