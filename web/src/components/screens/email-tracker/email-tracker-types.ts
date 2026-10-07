export type EmailStatus =
  | "Positive Reply"
  | "Interview"
  | "No Response"
  | "Reminder Due"
  | "Not Sent"
  | "Waiting"
  | "Negative Reply";

export interface EmailRecord {
  id: string;
  professorName: string;
  professorTitle: string;
  avatar: string;
  universityName: string;
  universitySub: string;
  universityLogoType: "stanford" | "mit" | "toronto" | "berkeley" | "eth";
  email: string;
  sentDate: string;
  sentTime: string;
  reminderDate: string;
  reminderTime: string;
  reminderOverdue?: boolean;
  replyDate?: string;
  replyTime?: string;
  status: EmailStatus;
  notes: string;
  subject?: string;
  location?: string;
  website?: string;
  interviewDate?: string;
  interviewTime?: string;
  attachments?: {
    name: string;
    size: string;
    type: "pdf" | "doc";
  }[];
  lastUpdated?: {
    date: string;
    author: string;
  };
}

export interface MetricCardData {
  title: string;
  count: string | number;
  subtitle: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  type: "professors" | "sent" | "replies" | "reminders" | "interviews" | "applications";
}
