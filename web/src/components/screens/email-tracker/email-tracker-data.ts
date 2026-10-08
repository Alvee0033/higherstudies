import { EmailRecord, MetricCardData } from "./email-tracker-types";
import rawEmailTrackerData from "@/data/json/email-tracker/email-tracker.json";

export const EMAIL_METRICS_DATA: MetricCardData[] = rawEmailTrackerData.metrics as MetricCardData[];
export const INITIAL_EMAIL_RECORDS: EmailRecord[] = rawEmailTrackerData.records as EmailRecord[];
