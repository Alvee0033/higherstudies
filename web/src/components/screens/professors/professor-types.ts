export interface Professor {
  id: string;
  name: string;
  verified?: boolean;
  title: string;
  department: string;
  topics: string[];
  phd: string;
  institutionOfficialUrl?: string;
  hIndex: number | string;
  citations: string;
  publications: number | string;
  yearsAtMit: number | string;
  currentStudents: number | string;
  openings: string;
  avatar: string;
}

export interface ProfessorRanksState {
  professor: boolean;
  assoc: boolean;
  assistant: boolean;
  lecturer: boolean;
}

export interface ProfessorOpeningsState {
  phd: boolean;
  postdoc: boolean;
  researchAssociate: boolean;
}
