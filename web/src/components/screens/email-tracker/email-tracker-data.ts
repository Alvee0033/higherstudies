import { EmailRecord, MetricCardData } from "./email-tracker-types";
import rawEmailTrackerData from "@/data/json/email-tracker/email-tracker.json";

export const EMAIL_METRICS_DATA: MetricCardData[] = rawEmailTrackerData.metrics.map(item=>({...item,count:0,subtitle:"Your saved records"})) as MetricCardData[];
export const INITIAL_EMAIL_RECORDS: EmailRecord[] = [];
