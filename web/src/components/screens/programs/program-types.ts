export interface ProgramItem {
  id: string;
  title: string;
  degree: string;
  institutionId?: string;
  institutionName: string;
  countryCode?: string;
  city?: string;
  location: string;
  academicUnit?: string;
  institutionOfficialUrl?: string;
  language?: string;
  applicationStatus?: string;
  admissionNote?: string;
  tuitionText: string;
  requirements: {
    ielts?: string;
    toefl?: string;
    greRequired?: boolean;
    greWaived?: boolean;
    all: { id?: string; type: string; state: string; value_number?: number; value_text?: string }[];
  };
  fundingAvailable: boolean;
  fundingOpportunities: { id: string; title: string; provider?: string }[];
  nextDeadline?: string;
  officialUrl?: string;
  verifiedAt?: string;
  facultyCount?: number;
}

export interface ProgramFiltersState {
  degreeLevel: string;
  searchQuery: string;
  selectedCountry: string;
  sortBy: string;
}
