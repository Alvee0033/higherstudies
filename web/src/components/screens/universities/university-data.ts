import { UniversityItem } from "./university-types";
import rawUniversities from "@/data/json/universities/universities.json";
import rawFilterOptions from "@/data/json/universities/filter-options.json";

export const UNIVERSITIES: UniversityItem[] = rawUniversities;
export const UNIVERSITY_FILTER_OPTIONS = rawFilterOptions;
