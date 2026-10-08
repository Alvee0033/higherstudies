import { ProfessorProfileData } from "./profile-types";
import rawProfiles from "@/data/json/professors/professor-profiles.json";

export const PROFILES_REGISTRY: Record<string, ProfessorProfileData> = rawProfiles;

export const JONATHAN_SMITH_PROFILE: ProfessorProfileData = rawProfiles["jonathan-smith"];

export function getProfessorProfile(id?: string): ProfessorProfileData {
  if (id && PROFILES_REGISTRY[id]) {
    return PROFILES_REGISTRY[id];
  }
  return JONATHAN_SMITH_PROFILE;
}
