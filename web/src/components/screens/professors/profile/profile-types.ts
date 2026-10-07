export interface AcademicDegree {
  degree: string;
  institution: string;
  year: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  institution: string;
}

export interface PublicationItem {
  title: string;
  venue: string;
  citations: string;
}

export interface ResearchProjectItem {
  title: string;
  period: string;
  funder: string;
  funderBadgeClass: string;
}

export interface FundingGrantItem {
  grant: string;
  year: string;
  amount: string;
  role: string;
}

export interface OpenPositionItem {
  title: string;
  term: string;
}

export interface ProfessorProfileData {
  id: string;
  name: string;
  verified: boolean;
  title: string;
  university: string;
  department: string;
  avatar: string;
  acceptingStudents: boolean;
  tags: string[];
  metrics: {
    hIndex: number;
    citations: string;
    publications: number;
    yearsAtMit: number;
    avgResponseTime: string;
    currentStudents: number;
  };
  about: string;
  degrees: AcademicDegree[];
  researchInterests: string[];
  experience: ExperienceItem[];
  researchAreas: string[];
  publications: PublicationItem[];
  totalPublications: number;
  contact: {
    email: string;
    phone: string;
    office: string;
    website: string;
    lastEmailSent: string;
    lastReplied: string;
  };
  atAGlance: {
    orcid: string;
    scholarUrl: string;
    researchGateUrl: string;
    linkedInUrl: string;
    twitterHandle: string;
    labWebsite: string;
  };
  openPositions: OpenPositionItem[];
  projects: ResearchProjectItem[];
  totalProjects: number;
  funding: FundingGrantItem[];
  totalGrants: number;
  teaching: string[];
}
