import { ApplicationItem, ApplicationMetric } from "./application-types";
import rawApplicationsData from "@/data/json/applications/applications.json";

export const APPLICATION_METRICS_DATA: ApplicationMetric[] = rawApplicationsData.metrics as ApplicationMetric[];
export const INITIAL_APPLICATIONS_DATA: ApplicationItem[] = rawApplicationsData.applications as ApplicationItem[];
