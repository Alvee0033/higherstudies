export interface Professor {
  id: string;
  name: string;
  verified?: boolean;
  title: string;
  department: string;
  topics: string[];
  phd: string;
  hIndex: number;
  citations: string;
  publications: number;
  yearsAtMit: number;
  currentStudents: number;
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
