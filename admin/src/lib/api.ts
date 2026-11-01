export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100";

export interface Staff {
  id: string;
  email: string;
  role: "editor" | "admin";
}
export interface StaffMember {
  id: string;
  email: string;
  role: "editor" | "admin";
  created_at: string;
  disabled_at: string | null;
}
export interface CountryItem {
  code: string;
  name: string;
  region: string;
}
export interface RegionDefinition {
  label: string;
  countries: string[];
}
export interface SystemSettings {
  countries: CountryItem[];
  regions: Record<string, RegionDefinition>;
}
export interface AuditEvent {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor_email: string | null;
}
export interface Source {
  id: string;
  name: string;
  base_url: string;
  adapter: string;
  permission_status: string;
  enabled: boolean;
  last_success_at: string | null;
}
export interface CollectionJob {
  runtime?: { phase?: string; message?: string; waitUntil?: string | null; httpStatus?: number | null; updatedAt?: string };
  progress?: { institutionIndex?: number; institutionsTotal?: number; institutionDiscoveryComplete?: boolean; registryPages?: number; registryCandidates?: number; degreeIndex?: number; page?: number };
  id: string;
  source_id: string;
  source_name: string;
  adapter: string;
  depth?: "shallow" | "medium" | "deep";
  mode?: "discovery" | "refresh" | "full";
  status:
    "queued" | "running" | "completed" | "partial" | "failed" | "cancelled";
  found_count: number;
  accepted_count: number;
  error_count: number;
  last_error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}
export interface AutopilotConfig {
  enabled: boolean;
  intervalHours: number;
  triggerOnSchedule: boolean;
  triggerOnSourceEnabled: boolean;
  onlyDueSources: boolean;
  sourceIds: string[];
  maxSourcesPerRun: number;
  depth: "shallow" | "medium" | "deep";
  mode: "discovery" | "refresh" | "full";
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastCheckedAt: string | null;
  lastRunSummary: string | null;
}
export interface AutopilotStatus {
  config: AutopilotConfig;
  collectorWorker: { available: boolean; message: string };
}
export interface ReviewItem {
  id: string;
  record_type: string;
  source_url: string;
  payload: Record<string, unknown>;
  version: number;
  created_at: string;
  source_name: string;
  source_base_url: string;
  source_adapter: string;
  source_permission_status: "pending" | "approved" | "blocked" | "revoked";
  source_enabled: boolean;
}
export interface CatalogueItem {
  profile_source_url?: string;
  research_metadata?: { scholarProfileUrl?: string | null; provider?: string; hIndex?: number | null; citedByCount?: number | null; worksCount?: number | null; affiliationStatus?: string };
  id: string;
  name?: string;
  title?: string;
  provider?: string;
  country_code?: string;
  degree?: string;
  verified_at?: string | null;
  evidence_url?: string | null;
  source_name?: string | null;
  source_permission_status?:
    "pending" | "approved" | "blocked" | "revoked" | string | null;
  institution_id?: string;
  institution_name?: string;
  institution_official_url?: string;
  academic_unit?: string;
  language?: string | null;
  application_status?:
    "open" | "paused_external" | "closed" | "unknown" | string;
  admission_note?: string;
  source_details?: {
    duration?: {amount: number; unit: string | null} | null;
    intakes?: Array<{startsOn: string | null; deadlineOn: string | null; applicantCategory: string; startingAnytime?: boolean; applyingAnytime?: boolean}>;
    englishRequirements?: Array<{type: string; score: number}>;
    delivery?: string[]; attendance?: string[]; language?: string | null; summary?: string | null;
  };
  tuition?: Array<{amount: number | string | null; currency: string | null; unit: string | null}>;
  official_url?: string;
  discovery_url?: string;
  city?: string;
  coverage?: string;
  deadline_on?: string | null;
  next_deadline?: string | null;
  public_email?: string;
  contact_collection_status?: string | null;
  contact_collection_message?: string | null;
  public_email_verified_at?: string | null;
  public_email_source_url?: string | null;
  research_topics?: string[];
  official_profile_url?: string;
  orcid_id?: string;
  openalex_id?: string;
  intakes?: Array<{
    id: string;
    term: string;
    starts_on: string;
    deadline_on: string;
    application_url: string;
  }>;
  requirements?: Array<{
    id: string;
    type: string;
    state: string;
    value_text: string;
    value_number: number;
    unit: string;
    condition_text: string;
  }>;
  funding?: Array<{
    id: string;
    title: string;
    provider?: string;
    coverage?: string;
    deadline_on?: string;
  }>;
}

let staffCsrfToken: Promise<string> | null = null;
async function getStaffCsrfToken(): Promise<string> {
  if (!staffCsrfToken) staffCsrfToken = (async () => {
    const response = await fetch(`${API_URL}/v1/admin/auth/csrf`, {credentials:'include',cache:'no-store'});
    if(!response.ok) throw new Error(response.status===401 ? 'Session expired. Sign in again.' : 'Could not validate this action. Please wait and retry.');
    const body=await response.json() as {data:{token:string}};
    return body.data.token;
  })().catch(cause=>{staffCsrfToken=null;throw cause;});
  return staffCsrfToken;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = init.method?.toUpperCase() ?? "GET";
  if(path === '/v1/admin/auth/login') staffCsrfToken=null;
  const headers = new Headers(init.headers);
  headers.set('x-admin-app', 'true');
  if (init.body) headers.set("content-type", "application/json");
  if (!["GET", "HEAD"].includes(method) && path !== "/v1/admin/auth/login") {
    headers.set('x-csrf-token',await getStaffCsrfToken());
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    if(response.status===401 || response.status===403) staffCsrfToken=null;
    if(response.status === 429) {
      const seconds = Number(response.headers.get('retry-after'));
      throw new Error(`Too many requests. ${Number.isFinite(seconds) && seconds > 0 ? `Please wait ${Math.ceil(seconds)} seconds` : 'Please wait a moment'} before trying again.`);
    }
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      error?: { message?: string };
    } | null;
    throw new Error(
      body?.error?.message ??
        body?.message ??
        `Request failed (${response.status})`,
    );
  }
  if(path === '/v1/admin/auth/logout') staffCsrfToken=null;
  return response.json() as Promise<T>;
}

/** Load cursor-paginated admin catalogue data within the API's 1–100 limit. */
export async function apiAll<T>(path: string, pageSize = 100): Promise<T[]> {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("Page size must be between 1 and 100");
  }
  const separator = path.includes("?") ? "&" : "?";
  const results: T[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  for (let page = 0; page < 100; page += 1) {
    const query = new URLSearchParams({ limit: String(pageSize) });
    if (cursor) query.set("cursor", cursor);
    const response = await api<{
      data: T[];
      page?: { nextCursor: string | null };
    }>(`${path}${separator}${query}`);
    results.push(...response.data);
    cursor = response.page?.nextCursor ?? null;
    if (!cursor) return results;
    if (seenCursors.has(cursor)) {
      throw new Error("API returned a repeated pagination cursor");
    }
    seenCursors.add(cursor);
  }
  throw new Error("Catalogue exceeded the maximum supported page count");
}
