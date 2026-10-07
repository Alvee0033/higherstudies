export type ApplicationStatus =
  | "Not Started"
  | "Preparing"
  | "Submitted"
  | "Interview"
  | "Waiting"
  | "Accepted"
  | "Rejected"
  | "Visa";

export interface ApplicationItem {
  id: string;
  universityName: string;
  program: string;
  department?: string;
  applicationId?: string;
  intake: string;
  deadline?: string;
  submittedDate?: string;
  interviewDate?: string;
  country: string;
  status: ApplicationStatus;
  isActiveFocus?: boolean; // For MIT card which has the active blue border in Figma
  progressPercent?: number;
  checklist?: {
    task: string;
    status: "Completed" | "Pending";
    date?: string;
  }[];
}

export interface ApplicationMetric {
  title: string;
  count: number;
  percentage: string;
  type: ApplicationStatus;
}
