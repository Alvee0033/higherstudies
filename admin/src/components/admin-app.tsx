"use client";

import { scholarLink } from "@/lib/scholar-link";
import { FacultyMetrics } from "./faculty-metrics";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Mail,
  MapPin,
  Microscope,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Trash2,
  Users,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import {
  api,
  apiAll,
  type AutopilotConfig,
  type AutopilotStatus,
  type CatalogueItem,
  type CollectionJob,
  type CountryItem,
  type RegionDefinition,
  type ReviewItem,
  type Source,
  type Staff,
  type StaffMember,
  type SystemSettings,
} from "@/lib/api";
import { CollectionMonitor } from "@/components/collection-monitor";
import { AuditLogView } from "@/components/audit-log";
import { Modal } from "@/components/modal";
import {
  Notification,
  type NotificationState,
} from "@/components/notification";

type CatalogKey = "institutions" | "programmes" | "funding" | "faculty";
type SortOrder = "newest" | "title-asc" | "title-desc" | "country";
type Section =
  | "overview"
  | CatalogKey
  | "requirements"
  | "review"
  | "sources"
  | "jobs"
  | "audit"
  | "scraper"
  | "settings";

const supportedCollector = (adapter: string) => ["studyportals-search", "openalex-authors", "official-faculty"].includes(adapter);

const menu = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    group: "WORKSPACE",
  },
  {
    key: "institutions",
    label: "Institutions",
    icon: Building2,
    group: "WORKSPACE",
  },
  {
    key: "programmes",
    label: "Programmes",
    icon: GraduationCap,
    group: "WORKSPACE",
  },
  {
    key: "requirements",
    label: "Requirements",
    icon: FileText,
    group: "WORKSPACE",
  },
  { key: "funding", label: "Funding", icon: Database, group: "WORKSPACE" },
  { key: "faculty", label: "Faculty", icon: Microscope, group: "WORKSPACE" },
  {
    key: "review",
    label: "Review Queue",
    icon: FileCheck2,
    group: "WORKSPACE",
  },
  { key: "sources", label: "Sources", icon: Link2, group: "DATA" },
  { key: "scraper", label: "Scraper Engine", icon: Cpu, group: "DATA" },
  { key: "jobs", label: "Jobs", icon: BookOpen, group: "DATA" },
  { key: "audit", label: "Audit log", icon: ShieldCheck, group: "SYSTEM" },
  { key: "settings", label: "Settings", icon: Settings, group: "SYSTEM" },
] as const;

const emptyCatalog: Record<CatalogKey, CatalogueItem[]> = {
  institutions: [],
  programmes: [],
  funding: [],
  faculty: [],
};

const DEFAULT_AUTOPILOT_UI: AutopilotConfig = {
  enabled: false,
  intervalHours: 24,
  triggerOnSchedule: true,
  triggerOnSourceEnabled: false,
  onlyDueSources: true,
  sourceIds: [],
  maxSourcesPerRun: 10,
  depth: "shallow",
  mode: "discovery",
  nextRunAt: null,
  lastRunAt: null,
  lastCheckedAt: null,
  lastRunSummary: null,
};

const FALLBACK_REGIONS: Record<string, { label: string; countries: string[] }> =
  {
    na: { label: "North America", countries: ["US", "CA", "MX"] },
    eu: {
      label: "Europe",
      countries: [
        "GB",
        "DE",
        "NL",
        "CH",
        "FR",
        "SE",
        "DK",
        "FI",
        "NO",
        "IT",
        "ES",
        "IE",
        "BE",
        "AT",
        "CZ",
        "HU",
        "PL",
        "PT",
        "RO",
        "BG",
        "EE",
        "GR",
        "IS",
        "LT",
        "LU",
        "MT",
        "SK",
        "SI",
        "UA",
        "BY",
        "RU",
      ],
    },
    apac: {
      label: "Asia-Pacific",
      countries: [
        "AU",
        "NZ",
        "JP",
        "SG",
        "HK",
        "KR",
        "CN",
        "IN",
        "MY",
        "PH",
        "TH",
        "TW",
        "ID",
        "LK",
        "PK",
        "KH",
        "KZ",
      ],
    },
    mea: {
      label: "Middle East & Africa",
      countries: [
        "AE",
        "EG",
        "IL",
        "IR",
        "JO",
        "KE",
        "LB",
        "NA",
        "NE",
        "OM",
        "SA",
        "SY",
        "TR",
        "ZA",
        "ZM",
        "ET",
      ],
    },
    other: { label: "Other Regions", countries: ["JM", "XC"] },
  };

const FALLBACK_COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  NL: "Netherlands",
  FR: "France",
  IT: "Italy",
  SE: "Sweden",
  CH: "Switzerland",
  ES: "Spain",
  NZ: "New Zealand",
  CN: "China",
  JP: "Japan",
  IN: "India",
  SG: "Singapore",
  HK: "Hong Kong",
  MY: "Malaysia",
  IE: "Ireland",
  ZA: "South Africa",
  TR: "Turkey",
  PT: "Portugal",
  NO: "Norway",
  AE: "United Arab Emirates",
  KR: "South Korea",
  BE: "Belgium",
  AT: "Austria",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czech Republic",
  HU: "Hungary",
  IL: "Israel",
  MX: "Mexico",
};

const titleOf = (item: CatalogueItem | ReviewItem) =>
  "payload" in item
    ? String(item.payload.title ?? item.payload.name ?? "Untitled record")
    : (item.name ?? item.title ?? "Untitled record");

const dateOf = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not verified";

const pretty = (value: string) =>
  value.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());

export function AdminApp() {
  const [user, setUser] = useState<Staff | null>(null);
  const [section, setSectionState] = useState<Section>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "") as Section;
      const validSections: Section[] = [
        "overview",
        "institutions",
        "programmes",
        "funding",
        "faculty",
        "review",
        "sources",
        "scraper",
        "jobs",
        "audit",
        "settings",
      ];
      if (validSections.includes(hash)) return hash;
      const saved = localStorage.getItem("admin_active_section") as Section;
      if (validSections.includes(saved)) return saved;
    }
    return "overview";
  });

  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const setSection = useCallback((sec: Section) => {
    setSectionState(sec);
    setQuery("");
    setRegionFilter("all");
    setCountryFilter("all");
    setUniversityFilter("all");
    setDegreeFilter("all");
    setStatusFilter("all");
    setTopicFilter("all");
    setSortOrder("newest");
    setPage(1);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin_active_section", sec);
        window.history.replaceState(null, "", `#${sec}`);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "") as Section;
      const validSections: Section[] = [
        "overview",
        "institutions",
        "programmes",
        "funding",
        "faculty",
        "review",
        "sources",
        "scraper",
        "jobs",
        "audit",
        "settings",
      ];
      if (validSections.includes(hash)) {
        setSection(hash);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [setSection]);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [contactProfileUrl, setContactProfileUrl] = useState("");
  const [collectingContact, setCollectingContact] = useState(false);
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [cataloguePage, setCataloguePage] = useState<{kind?:string;data:CatalogueItem[];total:number}>({data:[],total:0});
  const [catalogueFacets, setCatalogueFacets] = useState<{kind?:string;countries:Array<{code:string;count:number}>;institutions:Array<{id:string;name:string;count:number}>;topics:string[]}>({countries:[],institutions:[],topics:[]});
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [catalogRevision, setCatalogRevision] = useState(0);
  const [catalog, setCatalog] = useState(emptyCatalog);
  const [summary, setSummary] = useState<{
    institutions: number;
    programmes: number;
    funding: number;
    faculty: number;
  } | null>(null);

  // Review Queue state
  const [selected, setSelected] = useState<ReviewItem | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [reviewReason, setReviewReason] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewSearch, setReviewSearch] = useState("");
  const [selectedReviewIds, setSelectedReviewIds] = useState<Set<string>>(
    () => new Set(),
  );
  const reviewManifest = useRef(new Map<string,{id:string;version:number;label:string}>());
  const [selectingAllReviews,setSelectingAllReviews] = useState(false);
  const [allReviewsSelected,setAllReviewsSelected] = useState(false);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);
  const [bulkReason, setBulkReason] = useState("");
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  // Sources form state
  const [discardSource, setDiscardSource] = useState(false);
  const [sourceForm, setSourceForm] = useState(false);
  const [sourceDraft, setSourceDraft] = useState({
    name: "",
    baseUrl: "",
    adapter: "official-site",
  });

  // Filters state
  // Operations: Delete and Inspect
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: CatalogKey | "sources";
    item: { id: string; title?: string; name?: string; country_code?: string };
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<CatalogueItem | null>(
    null,
  );
  const [inspectDetails, setInspectDetails] = useState<CatalogueItem | null>(
    null,
  );
  const [loadingInspect, setLoadingInspect] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [savingUrl, setSavingUrl] = useState(false);
  const [urlSaveError, setUrlSaveError] = useState<string | null>(null);

  // Scraper Engine state
  const [scraperRunning, setScraperRunning] = useState(false);
  const [scraperLogs, setScraperLogs] = useState<string[]>([
    "[SYSTEM] Checking collector worker status…",
  ]);
  const [requestIntervalSeconds, setRequestIntervalSeconds] = useState(5);
  const [restEveryRecords, setRestEveryRecords] = useState(500);
  const [restSeconds, setRestSeconds] = useState(120);
  const [collectionTarget, setCollectionTarget] = useState<"all" | "programmes" | "faculty">("all");
  const scraperDepth = "deep";
  const scraperMode = "full";
  const [autopilot, setAutopilot] =
    useState<AutopilotConfig>(DEFAULT_AUTOPILOT_UI);
  const [collectorWorkerMessage, setCollectorWorkerMessage] = useState("");
  const [collectorWorkerAvailable, setCollectorWorkerAvailable] = useState(false);
  const [savingAutopilot, setSavingAutopilot] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Settings & Team Management state
  const [settings, setSettings] = useState<SystemSettings>({
    countries: [],
    regions: {},
  });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [settingsTab, setSettingsTab] = useState<
    "team" | "countries" | "regions"
  >("team");
  const [countrySearch, setCountrySearch] = useState("");

  // Staff Modals state
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffDraft, setStaffDraft] = useState({
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  });
  const [deleteStaffTarget, setDeleteStaffTarget] =
    useState<StaffMember | null>(null);

  // Country Modals state
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [countryDraft, setCountryDraft] = useState({
    code: "",
    name: "",
    region: "na",
  });
  const [deleteCountryTarget, setDeleteCountryTarget] =
    useState<CountryItem | null>(null);

  useEffect(() => {
    if (!user || section !== "faculty" || cataloguePage.kind !== "faculty" || !cataloguePage.data.some(item => !item.public_email && (!item.contact_collection_status || ["queued", "running"].includes(item.contact_collection_status)))) return;
    const timer = window.setInterval(() => setCatalogRevision(revision => revision + 1), 15000);
    return () => window.clearInterval(timer);
  }, [user, section, cataloguePage]);

  // Dynamic Country and Region mappings
  const COUNTRY_NAMES = useMemo(() => {
    if (settings.countries.length === 0) return FALLBACK_COUNTRY_NAMES;
    const map: Record<string, string> = {};
    for (const c of settings.countries) {
      map[c.code.toUpperCase()] = c.name;
    }
    return map;
  }, [settings.countries]);

  const REGIONS = useMemo(() => {
    if (!settings.regions || Object.keys(settings.regions).length === 0)
      return FALLBACK_REGIONS;
    return settings.regions;
  }, [settings.regions]);

  const notifyCounter = useRef(0);
  const notify = (tone: NotificationState["tone"], message: string) => {
    notifyCounter.current += 1;
    setNotification({ id: notifyCounter.current, tone, message });
  };

  const closeSource = () => {
    if (
      sourceDraft.name.trim() ||
      sourceDraft.baseUrl.trim() ||
      sourceDraft.adapter !== "official-site"
    )
      setDiscardSource(true);
    else setSourceForm(false);
  };

  async function queueCollection(sourceId?: string) {
    setScraperRunning(true);
    try {
      const queued = await api<{
        data: Array<{ id: string; sourceName: string }>;
      }>("/v1/admin/jobs", {
        method: "POST",
        body: JSON.stringify({
          sourceIds: sourceId ? [sourceId] : undefined,
          target: collectionTarget,
          requestIntervalSeconds, restEveryRecords, restSeconds,
          depth: scraperDepth,
          mode: scraperMode,
        }),
      });
      const time = new Date().toLocaleTimeString();
      setScraperLogs((previous) => [
        ...previous,
        `[${time}] Queued ${queued.data.length} approved source${queued.data.length === 1 ? "" : "s"} for the collector worker.`,
        ...queued.data.map(
          (job) =>
            `[${time}] ${job.sourceName} → job ${job.id.slice(0, 8)} queued`,
        ),
      ]);
      notify(
        "success",
        `${queued.data.length} job${queued.data.length === 1 ? "" : "s"} queued for collection.`,
      );
      void refresh();
      window.setTimeout(
        () => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not queue collection";
      setScraperLogs((previous) => [
        ...previous,
        `[${new Date().toLocaleTimeString()}] ⚠ ${message}`,
      ]);
      notify("error", message);
    } finally {
      setScraperRunning(false);
    }
  }

  async function verifySource(source: Source) {
    setBusy(true);
    try {
      const result = await api<{data:{message:string;supported:boolean}}>(`/v1/admin/sources/${source.id}/verify`, { method: "POST" });
      notify(result.data.supported ? "success" : "error", `${source.name}: ${result.data.message}${result.data.supported ? "" : " Adapter is not implemented."}`);
    } catch (cause) { notify("error", cause instanceof Error ? cause.message : "Verification failed"); }
    finally { setBusy(false); }
  }

  async function approveAndEnableSource(sourceId: string) {
    setBusy(true);
    try {
      await api(`/v1/admin/sources/${sourceId}`, {
        method: "PATCH",
        body: JSON.stringify({
          permissionStatus: "approved",
          enabled: true,
        }),
      });
      notify("success", "Source approved and enabled for collection.");
      await refresh();
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to update source",
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleSourceEnabled(source: Source) {
    setBusy(true);
    try {
      await api(`/v1/admin/sources/${source.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          enabled: !source.enabled,
        }),
      });
      notify("success", `Source ${source.enabled ? "paused" : "enabled"}.`);
      await refresh();
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to toggle source",
      );
    } finally {
      setBusy(false);
    }
  }

  async function startCollectorWorker() {
    setBusy(true);
    try {
      const res = await api<{
        data: { available: boolean; message: string };
      }>("/v1/admin/jobs/worker/start", {
        method: "POST",
      });
      setCollectorWorkerAvailable(true);
      setCollectorWorkerMessage(res.data.message);
      notify("success", res.data.message);
      setScraperLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✓ ${res.data.message}`,
      ]);
      await refresh();
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to start worker",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveAutopilot() {
    setSavingAutopilot(true);
    try {
      const result = await api<{ data: { config: AutopilotConfig } }>(
        "/v1/admin/jobs/autopilot",
        {
          method: "PUT",
          body: JSON.stringify({
            enabled: autopilot.enabled,
            intervalHours: autopilot.intervalHours,
            triggerOnSchedule: autopilot.triggerOnSchedule,
            triggerOnSourceEnabled: autopilot.triggerOnSourceEnabled,
            onlyDueSources: autopilot.onlyDueSources,
            sourceIds: autopilot.sourceIds,
            maxSourcesPerRun: autopilot.maxSourcesPerRun,
            depth: autopilot.depth,
            mode: autopilot.mode,
          }),
        },
      );
      setAutopilot(result.data.config);
      notify("success", "Autopilot schedule saved.");
      void refresh();
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error
          ? cause.message
          : "Could not save autopilot settings",
      );
    } finally {
      setSavingAutopilot(false);
    }
  }

  const refresh = useCallback(async () => {
    try {
      const [
        me,
        sourceList,
        reviewList,
        institutions,
        funding,
        summaryRes,
        jobList,
        autopilotRes,
        settingsRes,
        staffRes,
      ] = await Promise.all([
        api<{ data: Staff }>("/v1/admin/auth/me"),
        api<{ data: Source[] }>("/v1/admin/sources"),
        api<{ data: ReviewItem[]; pagination: { total: number } }>(`/v1/admin/review-items?limit=100&offset=${reviewPage * 100}${reviewFilter === "all" ? "" : `&recordType=${encodeURIComponent(reviewFilter)}`}`),
        apiAll<CatalogueItem>("/v1/institutions"),
        apiAll<CatalogueItem>("/v1/funding"),
        api<{
          data: {
            institutions: number;
            programmes: number;
            funding: number;
            faculty: number;
          };
        }>("/v1/admin/catalog/summary").catch(() => null),
        api<{ data: CollectionJob[] }>("/v1/admin/jobs"),
        api<{ data: AutopilotStatus }>("/v1/admin/jobs/autopilot"),
        api<{ data: SystemSettings }>("/v1/admin/settings").catch(() => null),
        api<{ data: StaffMember[] }>("/v1/admin/staff").catch(() => null),
      ]);
      setUser(me.data);
      setSources(sourceList.data);
      setJobs(jobList.data);
      setAutopilot(autopilotRes.data.config);
      setCollectorWorkerMessage(autopilotRes.data.collectorWorker.message);
      setCollectorWorkerAvailable(autopilotRes.data.collectorWorker.available);
      setReviews(reviewList.data);
      setReviewTotal(reviewList.pagination.total);
      setCatalog((previous) => ({ ...previous, institutions, funding }));
      setCatalogRevision((revision) => revision + 1);
      if (summaryRes?.data) {
        setSummary(summaryRes.data);
      }
      if (settingsRes?.data) {
        setSettings(settingsRes.data);
      }
      if (staffRes?.data) {
        setStaffList(staffRes.data);
      }
      setError("");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not connect to the API";
      if (/401|unauthorized|session expired/i.test(message)) setUser(null);
      else setNotification({ id: Date.now(), tone: "error", message });
    } finally {
      setInitializing(false);
    }
  }, [reviewFilter, reviewPage]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [refresh]);

  useEffect(() => {
    if (
      !sourceForm ||
      !(
        sourceDraft.name.trim() ||
        sourceDraft.baseUrl.trim() ||
        sourceDraft.adapter !== "official-site"
      )
    )
      return;
    const protectDraft = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", protectDraft);
    return () => window.removeEventListener("beforeunload", protectDraft);
  }, [sourceForm, sourceDraft]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/v1/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setPassword("");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await api("/v1/admin/auth/logout", { method: "POST" });
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Sign out failed",
      );
    } finally {
      setUser(null);
      setSources([]);
      setReviews([]);
    }
  }

  async function decide(item: ReviewItem, decision: "approve" | "reject") {
    if (decision === "reject" && !reviewReason.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api(`/v1/admin/review-items/${item.id}/decisions`, {
        method: "POST",
        body: JSON.stringify({
          decision,
          reason: decision === "reject" ? reviewReason.trim() : undefined,
          expectedVersion: item.version,
        }),
      });
      setReviewAction(null);
      setSelected(null);
      setReviewReason("");
      setSelectedReviewIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
      notify(
        "success",
        `${pretty(item.record_type)} ${decision === "approve" ? "published" : "rejected"}.`,
      );
      await refresh();
    } catch (cause) {
      notify("error", cause instanceof Error ? cause.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }

  const filteredReviews = reviews.filter((item) => {
    const query = reviewSearch.trim().toLowerCase();
    return !query || [titleOf(item), item.source_name, item.source_url, item.record_type]
      .some((value) => value.toLowerCase().includes(query));
  });
  const selectedReviews = reviews.filter((item) => selectedReviewIds.has(item.id));
  const canPublishReview = (item: ReviewItem) =>
    item.source_permission_status === "approved" &&
    item.source_enabled &&
    (!item.source_adapter.toLowerCase().includes("studyportals") || item.record_type === "programme") && (item.source_adapter !== "openalex-authors" || item.record_type === "institution");

  async function selectAllReviews(checked:boolean) {
    if(!checked) {setSelectedReviewIds(new Set());setAllReviewsSelected(false);return;}
    setSelectingAllReviews(true);
    try {
      const manifest=new Map<string,{id:string;version:number;label:string}>();
      let cursor:string|null=null;let before:string|undefined;
      const seen=new Set<string>();
      do {
        const params=new URLSearchParams({limit:'1000'});
        if(reviewFilter!=='all') params.set('recordType',reviewFilter);
        if(reviewSearch.trim()) params.set('q',reviewSearch.trim());
        if(cursor) params.set('cursor',cursor);if(before) params.set('before',before);
        const result=await api<{data:Array<{id:string;version:number;label:string}>;page:{nextCursor:string|null;selectedBefore:string}}>(`/v1/admin/review-items/selection?${params}`);
        for(const item of result.data) manifest.set(item.id,item);
        before=result.page.selectedBefore;cursor=result.page.nextCursor;
        if(cursor && seen.has(cursor)) throw new Error('Repeated review selection cursor');
        if(cursor) seen.add(cursor);
      } while(cursor);
      reviewManifest.current=manifest;
      setSelectedReviewIds(new Set(manifest.keys()));setAllReviewsSelected(true);
    } catch(cause) {notify('error',cause instanceof Error?cause.message:'Could not select all records');}
    finally {setSelectingAllReviews(false);}
  }

  async function decideBulk(decision: "approve" | "reject") {
    const targets = [...selectedReviewIds].map(id=>reviewManifest.current.get(id) || (()=>{const item=reviews.find(row=>row.id===id)!;return {id,version:item.version,label:titleOf(item)};})());
    const reason = bulkReason.trim();
    if (!targets.length || (decision === "reject" && reason.length < 3)) return;
    setBusy(true);
    setBulkProgress({ done: 0, total: targets.length });
    const failures: string[] = [];
    let completed = 0;
    for (let index=0;index<targets.length;index+=25) {
      const batch=targets.slice(index,index+25);
      try {
        const result=await api<{data:Array<{id:string;success:boolean;error?:string}>}>('/v1/admin/review-items/bulk-decisions',{method:'POST',body:JSON.stringify({decision,reason:decision==='reject'?reason:undefined,items:batch.map(item=>({id:item.id,expectedVersion:item.version}))})});
        for(const outcome of result.data) if(!outcome.success) failures.push(`${batch.find(item=>item.id===outcome.id)?.label || outcome.id}: ${outcome.error || 'Review failed'}`);
      } catch(cause) {for(const item of batch) failures.push(`${item.label}: ${cause instanceof Error ? cause.message : 'Review failed'}`);}
      completed+=batch.length;
      setBulkProgress({done:completed,total:targets.length});
      if(index+25<targets.length) await new Promise(resolve=>window.setTimeout(resolve,300));
    }
    setBusy(false);
    setBulkProgress(null);
    setBulkAction(null);
    setBulkReason("");
    setSelectedReviewIds(new Set());setAllReviewsSelected(false);reviewManifest.current.clear();
    if (failures.length) {
      const succeeded = targets.length - failures.length;
      notify("error", `${succeeded} ${decision === "approve" ? "published" : "rejected"}; ${failures.length} failed. ${failures.slice(0, 2).join(" · ")}`);
    } else {
      notify("success", `${targets.length} records ${decision === "approve" ? "published" : "rejected"}.`);
    }
    await refresh();
  }

  async function addSource(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/v1/admin/sources", {
        method: "POST",
        body: JSON.stringify(sourceDraft),
      });
      setSourceForm(false);
      setSourceDraft({ name: "", baseUrl: "", adapter: "official-site" });
      notify(
        "success",
        "Source registered. Review access before enabling collection.",
      );
      await refresh();
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Could not add source",
      );
    } finally {
      setBusy(false);
    }
  }

  // Delete Action
  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.kind === "sources") {
        await api(`/v1/admin/sources/${deleteTarget.item.id}`, {
          method: "DELETE",
        });
        setSources((prev) => prev.filter((s) => s.id !== deleteTarget.item.id));
      } else {
        const kind = deleteTarget.kind as CatalogKey;
        await api(`/v1/admin/catalog/${kind}/${deleteTarget.item.id}`, {
          method: "DELETE",
        });
        setCatalog((prev) => ({
          ...prev,
          [kind]: prev[kind].filter(
            (i: CatalogueItem) => i.id !== deleteTarget.item.id,
          ),
        }));
        if (summary) {
          setSummary({
            ...summary,
            [kind]: Math.max(0, summary[kind] - 1),
          });
        }
      }
      notify(
        "success",
        `Permanently deleted ${deleteTarget.item.title || deleteTarget.item.name || "record"} (#${deleteTarget.item.id.slice(0, 8)}).`,
      );
      if (inspectTarget?.id === deleteTarget.item.id) {
        setInspectTarget(null);
        setInspectDetails(null);
      }
      setDeleteTarget(null);
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to delete record",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // Staff management actions
  async function handleAddStaff(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api<{ data: StaffMember }>("/v1/admin/staff", {
        method: "POST",
        body: JSON.stringify(staffDraft),
      });
      setStaffList((prev) => [...prev, res.data]);
      setStaffModalOpen(false);
      setStaffDraft({ email: "", password: "", role: "editor" });
      notify("success", `Team member ${res.data.email} added successfully.`);
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to add team member",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleStaffRole(staff: StaffMember) {
    const nextRole = staff.role === "admin" ? "editor" : "admin";
    setBusy(true);
    try {
      const res = await api<{ data: StaffMember }>(
        `/v1/admin/staff/${staff.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ role: nextRole }),
        },
      );
      setStaffList((prev) =>
        prev.map((s) => (s.id === staff.id ? res.data : s)),
      );
      notify("success", `Updated ${staff.email} role to ${nextRole}.`);
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to update role",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteStaff() {
    if (!deleteStaffTarget) return;
    setBusy(true);
    try {
      const res = await api<{
        data: { success: boolean; disabled?: boolean; deleted?: boolean };
      }>(`/v1/admin/staff/${deleteStaffTarget.id}`, { method: "DELETE" });
      if (res.data.disabled) {
        setStaffList((prev) =>
          prev.map((s) =>
            s.id === deleteStaffTarget.id
              ? { ...s, disabled_at: new Date().toISOString() }
              : s,
          ),
        );
        notify(
          "success",
          `Deactivated ${deleteStaffTarget.email} (audit history preserved).`,
        );
      } else {
        setStaffList((prev) =>
          prev.filter((s) => s.id !== deleteStaffTarget.id),
        );
        notify("success", `Removed ${deleteStaffTarget.email} from the team.`);
      }
      setDeleteStaffTarget(null);
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error
          ? cause.message
          : "Failed to remove staff member",
      );
    } finally {
      setBusy(false);
    }
  }

  // Country management actions
  async function handleAddCountry(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api<{
        data: {
          code: string;
          name: string;
          region: string;
          countries: CountryItem[];
          regions: Record<string, RegionDefinition>;
        };
      }>("/v1/admin/settings/countries", {
        method: "POST",
        body: JSON.stringify(countryDraft),
      });
      setSettings({
        countries: res.data.countries,
        regions: res.data.regions,
      });
      setCountryModalOpen(false);
      setCountryDraft({ code: "", name: "", region: "na" });
      notify(
        "success",
        `Destination ${res.data.name} (${res.data.code}) saved.`,
      );
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to save country",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteCountry() {
    if (!deleteCountryTarget) return;
    setBusy(true);
    try {
      const res = await api<{
        data: {
          success: boolean;
          removedCode: string;
          countries: CountryItem[];
          regions: Record<string, RegionDefinition>;
        };
      }>(`/v1/admin/settings/countries/${deleteCountryTarget.code}`, {
        method: "DELETE",
      });
      setSettings({
        countries: res.data.countries,
        regions: res.data.regions,
      });
      notify(
        "success",
        `Country ${deleteCountryTarget.name} (${deleteCountryTarget.code}) removed.`,
      );
      setDeleteCountryTarget(null);
    } catch (cause) {
      notify(
        "error",
        cause instanceof Error ? cause.message : "Failed to remove country",
      );
    } finally {
      setBusy(false);
    }
  }

  // Inspect detail loader
  async function openInspect(item: CatalogueItem) {
    setInspectTarget(item);
    setInspectDetails(item);
    setIsEditingUrl(false);
    setEditUrlValue(item.official_url || "");
    setUrlSaveError(null);
    setLoadingInspect(true);
    if (
      ["institutions", "programmes", "funding", "faculty"].includes(section)
    ) {
      try {
        const res = await api<{ data: CatalogueItem }>(
          `/v1/${section}/${item.id}`,
        );
        setInspectDetails(res.data);
        setEditUrlValue(res.data.official_url || "");
      } catch {
        // Fall back to item
      } finally {
        setLoadingInspect(false);
      }
    } else {
      setLoadingInspect(false);
    }
  }

  async function handleSaveOfficialUrl() {
    if (!inspectDetails?.id) return;
    setSavingUrl(true);
    setUrlSaveError(null);
    try {
      const res = await api<{ data: { id: string; official_url: string | null } }>(
        `/v1/admin/catalog/programmes/${inspectDetails.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ official_url: editUrlValue.trim() }),
        },
      );
      setInspectDetails((prev) => (prev ? { ...prev, official_url: res.data.official_url ?? undefined } : null));
      setInspectTarget((prev) => (prev ? { ...prev, official_url: res.data.official_url ?? undefined } : null));
      setCataloguePage(prev => ({ ...prev, data: prev.data.map(item => item.id === inspectDetails.id ? { ...item, official_url: res.data.official_url ?? undefined } : item) }));
      setIsEditingUrl(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update official URL";
      setUrlSaveError(msg);
    } finally {
      setSavingUrl(false);
    }
  }

  const resetFilters = () => {
    setQuery("");
    setRegionFilter("all");
    setCountryFilter("all");
    setUniversityFilter("all");
    setDegreeFilter("all");
    setStatusFilter("all");
    setTopicFilter("all");
    setSortOrder("newest");
    setPage(1);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    regionFilter !== "all" ||
    countryFilter !== "all" ||
    universityFilter !== "all" ||
    degreeFilter !== "all" ||
    statusFilter !== "all" ||
    topicFilter !== "all" ||
    sortOrder !== "newest";

  const active = menu.find((entry) => entry.key === section) ?? menu[0];

  useEffect(() => {
    if (!user || !['faculty','programmes'].includes(section)) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setCatalogueLoading(true);
      try {
        const params = new URLSearchParams({limit:String(pageSize),offset:String((page-1)*pageSize),sort:sortOrder});
        if(query.trim()) params.set('q',query.trim());
        if(countryFilter !== 'all') params.set('country',countryFilter);
        else if(regionFilter !== 'all' && REGIONS[regionFilter]) params.set('country',REGIONS[regionFilter].countries.join(','));
        if(universityFilter !== 'all') params.set('institutionId',universityFilter);
        if(section === 'faculty' && topicFilter !== 'all') params.set('researchTopic',topicFilter);
        if(section === 'programmes' && degreeFilter !== 'all') params.set('degree',degreeFilter);
        if(section === 'programmes' && statusFilter !== 'all') params.set('applicationStatus',statusFilter);
        const response = await api<{data:CatalogueItem[];page:{total:number}}>(`/v1/admin/catalog/${section}?${params}`);
        if(!cancelled) {
          setCataloguePage({kind:section,data:response.data,total:response.page.total});
          if(response.page.total > 0 && (page-1)*pageSize >= response.page.total) setPage(Math.ceil(response.page.total/pageSize));
        }
      } catch(cause) { if(!cancelled) setNotification({id:Date.now(),tone:'error',message:cause instanceof Error ? cause.message : 'Could not load records'}); }
      finally {if(!cancelled) setCatalogueLoading(false);}
    },300);
    return () => {cancelled=true;window.clearTimeout(timer);};
  },[user,section,query,countryFilter,regionFilter,universityFilter,topicFilter,sortOrder,page,pageSize,REGIONS,catalogRevision,degreeFilter,statusFilter]);

  useEffect(() => {
    if (!user || !['faculty','programmes'].includes(section)) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void api<{data:typeof catalogueFacets}>(`/v1/admin/catalog/${section}/facets`).then(result=>{if(!cancelled) setCatalogueFacets({...result.data,kind:section});}).catch(()=>{});
    });
    return () => {cancelled=true;cancelAnimationFrame(frame);};
  },[user,section,catalogRevision]);

  useEffect(() => {
    if(!user || section !== 'review' || busy || selectingAllReviews) return;
    let cancelled=false;let loading=false;
    const timer=window.setInterval(async()=>{
      if(loading) return;loading=true;
      try {
        const result=await api<{data:ReviewItem[];pagination:{total:number}}>(`/v1/admin/review-items?limit=100&offset=${reviewPage*100}${reviewFilter==='all'?'':`&recordType=${encodeURIComponent(reviewFilter)}`}`);
        if(!cancelled){setReviews(result.data);setReviewTotal(result.pagination.total);}
      } catch { /* Keep the last successful queue view during a transient refresh failure. */ }
      finally {loading=false;}
    },10000);
    return()=>{cancelled=true;window.clearInterval(timer);};
  },[user,section,busy,selectingAllReviews,reviewPage,reviewFilter]);

  const countryNames = useMemo(() => new Intl.DisplayNames(["en"], { type: "region" }), []);
  const countryName = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const configured = COUNTRY_NAMES[normalized];
    if (configured && configured.toUpperCase() !== normalized) return configured;
    if (!/^[A-Z]{2}$/.test(normalized)) return "Unknown country";
    const name = countryNames.of(normalized);
    return name && name !== normalized ? name : "Unknown country";
  }, [COUNTRY_NAMES, countryNames]);

  // Available countries in the active catalog tab
  const availableCountries = useMemo(() => {
    if (!["institutions", "programmes", "funding", "faculty"].includes(section))
      return [];
    if (section === 'faculty' || section === 'programmes') return (catalogueFacets.kind === section ? catalogueFacets.countries : []).map(item=>({...item,name:countryName(item.code)})).sort((a,b)=>a.name.localeCompare(b.name));
    const counts: Record<string, number> = {};
    for (const item of catalog[section as CatalogKey]) {
      const code = (item.country_code ?? "").toUpperCase();
      if (code) counts[code] = (counts[code] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([code, count]) => ({
        code,
        name: countryName(code),
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [catalog, section, countryName, catalogueFacets.countries, catalogueFacets.kind]);

  // Available universities for programmes and faculty
  const availableUniversities = useMemo(() => {
    if (section !== "programmes" && section !== "faculty") return [];
    return catalogueFacets.kind === section ? catalogueFacets.institutions : [];
  }, [section, catalogueFacets.institutions, catalogueFacets.kind]);

  const availableTopics = useMemo(() => section === 'faculty' && catalogueFacets.kind === section ? catalogueFacets.topics : [], [section,catalogueFacets.topics,catalogueFacets.kind]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    if (!["institutions", "programmes", "funding", "faculty"].includes(section))
      return [];
    if(section === 'faculty' || section === 'programmes') return cataloguePage.kind === section ? cataloguePage.data : [];
    let items = [...catalog[section as CatalogKey]];

    // Search query filter (matches title, name, institution_name, id, city, academic_unit)
    if (query.trim()) {
      const q = query.trim().toLowerCase().replace(/^#/, "");
      items = items.filter((item) => {
        const idMatch = item.id.toLowerCase().includes(q);
        const titleMatch = titleOf(item).toLowerCase().includes(q);
        const instMatch = (item.institution_name ?? "")
          .toLowerCase()
          .includes(q);
        const cityMatch = (item.city ?? "").toLowerCase().includes(q);
        const unitMatch = (item.academic_unit ?? "").toLowerCase().includes(q);
        const countryMatch = (
          COUNTRY_NAMES[(item.country_code ?? "").toUpperCase()] ?? ""
        )
          .toLowerCase()
          .includes(q);
        const requirementMatch =
          item.requirements?.some((requirement) =>
            [
              requirement.type,
              requirement.value_text,
              requirement.condition_text,
            ].some((value) => value?.toLowerCase().includes(q)),
          ) ?? false;
        const fundingMatch =
          item.funding?.some((opportunity) =>
            [
              opportunity.title,
              opportunity.provider,
              opportunity.coverage,
            ].some((value) => value?.toLowerCase().includes(q)),
          ) ?? false;
        const topicMatch =
          item.research_topics?.some((topic) =>
            topic.toLowerCase().includes(q),
          ) ?? false;
        return (
          idMatch ||
          titleMatch ||
          instMatch ||
          cityMatch ||
          unitMatch ||
          countryMatch ||
          requirementMatch ||
          fundingMatch ||
          topicMatch
        );
      });
    }

    // Region filter
    if (regionFilter !== "all" && REGIONS[regionFilter]) {
      const allowedCountries = REGIONS[regionFilter].countries;
      items = items.filter((item) =>
        allowedCountries.includes((item.country_code ?? "").toUpperCase()),
      );
    }

    // Country filter
    if (countryFilter !== "all") {
      items = items.filter(
        (item) =>
          (item.country_code ?? "").toUpperCase() ===
          countryFilter.toUpperCase(),
      );
    }

    // Sorting
    items.sort((a, b) => {
      if (sortOrder === "title-asc")
        return titleOf(a).localeCompare(titleOf(b));
      if (sortOrder === "title-desc")
        return titleOf(b).localeCompare(titleOf(a));
      if (sortOrder === "country")
        return (a.country_code ?? "").localeCompare(b.country_code ?? "");
      // default: newest verified
      const dateA = a.verified_at ? new Date(a.verified_at).getTime() : 0;
      const dateB = b.verified_at ? new Date(b.verified_at).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      return titleOf(a).localeCompare(titleOf(b));
    });

    return items;
  }, [
    catalog,
    cataloguePage.data,
    cataloguePage.kind,
    section,
    query,
    regionFilter,
    countryFilter,
    sortOrder,
    COUNTRY_NAMES,
    REGIONS,
  ]);

  // Paginated records
  const recordTotal = ['faculty','programmes'].includes(section) ? (cataloguePage.kind === section ? cataloguePage.total : 0) : filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(recordTotal / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = useMemo(() => {
    if(section === 'faculty' || section === 'programmes') return filteredRecords;
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize, section]);

  if (initializing)
    return (
      <div className="loading-screen" role="status">
        <div className="brand-logo">H</div>
        <p>Opening workspace…</p>
      </div>
    );

  if (!user)
    return (
      <main className="login-screen">
        <section className="login-visual">
          <div className="login-brand">
            <span className="login-mark">H</span>
            <strong>
              HigherStudy <span>Admin</span>
            </strong>
          </div>
          <div className="login-message">
            <span className="eyebrow light">THE EDITORIAL WORKSPACE</span>
            <h1>
              Better data.
              <br />
              Better decisions.
            </h1>
            <p>
              Manage programmes, funding, faculty and source evidence in one
              trusted workspace.
            </p>
            <div className="login-proof">
              <ShieldCheck size={22} />
              <span>
                Every published record is backed by evidence and review.
              </span>
            </div>
          </div>
          <small>HIGHERSTUDY · BUILT FOR ACCURACY</small>
        </section>
        <section className="login-panel">
          <div className="login-card">
            <span className="eyebrow">STAFF ACCESS</span>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your workspace.</p>
            <form onSubmit={login}>
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@higherstudy.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error && (
                <div className="message error" role="alert">
                  {error}
                </div>
              )}
              <button className="button primary wide" disabled={busy}>
                {busy ? "Signing in…" : "Sign in to workspace"}
                <ArrowRight size={17} />
              </button>
            </form>
            <div className="secure-note">
              <ShieldCheck size={16} /> Protected staff sign in
            </div>
          </div>
          <span className="login-help">
            Need access? Contact your workspace administrator.
          </span>
          <Notification
            value={notification}
            onDismiss={() => setNotification(null)}
          />
        </section>
      </main>
    );

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo compact">H</div>
        </div>
        <nav aria-label="Main navigation">
          {menu.filter((entry) => entry.key !== "audit" || user.role === "admin").map((entry) => {
            const Icon = entry.icon;
            return (
              <button
                key={entry.key}
                className={`nav-link ${section === entry.key ? "active" : ""}`}
                aria-current={section === entry.key ? "page" : undefined}
                onClick={() => {
                  setSection(entry.key);
                  setQuery("");
                  resetFilters();
                  setMobileMenu(false);
                }}
              >
                <Icon size={19} />
                {entry.label}
                {entry.key === "review" && reviewTotal > 0 && (
                  <b>{reviewTotal}</b>
                )}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => void logout()}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      {mobileMenu && (
        <button
          className="scrim"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Open menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={20} />
          </button>
          <div className="crumbs">
            <span className="crumb-root">HigherStudy</span>
            <span className="crumb-slash">/</span>
            <strong className="crumb-active">{active.label}</strong>
          </div>
          <div className="topbar-right">
            <button
              className="topbar-icon-btn"
              aria-label="Refresh data"
              title="Refresh"
              disabled={busy}
              onClick={() => void refresh()}
            >
              <RefreshCw size={15} className={busy ? "spinning" : ""} />
            </button>
            <div className="admin-pill" title={`Signed in as ${user.email}`}>
              <div className="admin-avatar">{user.email[0].toUpperCase()}</div>
              <div className="admin-info">
                <strong>{user.email.split("@")[0]}</strong>
                <small>{user.role}</small>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          <div className="content-heading">
            <div className="ch-left">
              <span className="eyebrow ch-eyebrow">{active.group}</span>
              <span className="ch-title">{active.label}</span>
            </div>
            <div className="ch-right">
              {section === "overview" && (
                <span className="heading-date">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {section === "sources" && user.role === "admin" && (
                <button
                  className="button primary compact-btn"
                  onClick={() => setSourceForm(true)}
                >
                  <Plus size={15} /> Add source
                </button>
              )}
            </div>
          </div>

          <Notification
            value={notification}
            onDismiss={() => setNotification(null)}
          />

          {/* OVERVIEW SECTION */}
          {section === "overview" && (
            <>
              <div className="metrics">
                <Metric
                  icon={GraduationCap}
                  label="Published programmes"
                  count={summary?.programmes ?? catalog.programmes.length}
                  detail="Real verified programmes"
                  tone="blue"
                />
                <Metric
                  icon={Building2}
                  label="Institutions"
                  count={summary?.institutions ?? catalog.institutions.length}
                  detail="Global universities & colleges"
                  tone="teal"
                />
                <Metric
                  icon={FileText}
                  label="Claims to review"
                  count={
                    reviews.filter(
                      (item) => item.record_type === "requirement_claim",
                    ).length
                  }
                  detail="Awaiting verification"
                  tone="gold"
                />
                <Metric
                  icon={Link2}
                  label="Active sources"
                  count={sources.filter((source) => source.enabled).length}
                  detail="Enabled collections"
                  tone="blue"
                />
              </div>

              <div className="overview-grid">
                <section className="panel review-panel">
                  <div className="panel-header">
                    <h2>Review queue</h2>
                    <button
                      className="text-button"
                      onClick={() => setSection("review")}
                    >
                      View all <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="review-tabs">
                    {[
                      "all",
                      "programme",
                      "requirement_claim",
                      "funding_opportunity",
                      "faculty_member",
                    ].map((type) => (
                      <button
                        key={type}
                        className={reviewFilter === type ? "active" : ""}
                        onClick={() => setReviewFilter(type)}
                      >
                        {type === "all"
                          ? "All"
                          : type === "requirement_claim"
                            ? "Requirements"
                            : type === "funding_opportunity"
                              ? "Funding"
                              : type === "faculty_member"
                                ? "Faculty"
                                : "Programmes"}{" "}
                        <span>
                          (
                          {type === "all"
                            ? reviews.length
                            : reviews.filter(
                                (item) => item.record_type === type,
                              ).length}
                          )
                        </span>
                      </button>
                    ))}
                  </div>
                  {reviews.filter(
                    (item) =>
                      reviewFilter === "all" ||
                      item.record_type === reviewFilter,
                  ).length ? (
                    <div className="table-scroll">
                      <table className="review-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Added</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews
                            .filter(
                              (item) =>
                                reviewFilter === "all" ||
                                item.record_type === reviewFilter,
                            )
                            .slice(0, 6)
                            .map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="flex items-center gap-2">
                                    <strong>{titleOf(item)}</strong>
                                    <span
                                      className="id-badge"
                                      title={`Full UUID: ${item.id}`}
                                    >
                                      #{item.id.slice(0, 8)}
                                    </span>
                                  </div>
                                  <small>{item.source_url}</small>
                                </td>
                                <td>
                                  <span className={`pill ${item.record_type}`}>
                                    {pretty(item.record_type)}
                                  </span>
                                </td>
                                <td>{item.source_name}</td>
                                <td>{dateOf(item.created_at)}</td>
                                <td>
                                  <span className="pill pending">
                                    Needs review
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="row-icon"
                                    aria-label={`Review ${titleOf(item)}`}
                                    onClick={() => setSelected(item)}
                                  >
                                    <MoreHorizontal size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty
                      icon={Check}
                      title="All caught up"
                      detail="Newly collected records will appear here for review."
                    />
                  )}
                </section>

                <div className="overview-side">
                  <section className="panel health-panel">
                    <div className="panel-header">
                      <h2>Source health</h2>
                      <button
                        className="text-button"
                        onClick={() => setSection("sources")}
                      >
                        View all <ArrowRight size={16} />
                      </button>
                    </div>
                    {sources.length ? (
                      <div className="health-content">
                        <div
                          className="health-donut"
                          style={
                            {
                              "--fill": `${(sources.filter((source) => source.enabled).length / sources.length) * 100}%`,
                            } as React.CSSProperties
                          }
                        >
                          <span>
                            <strong>{sources.length}</strong>
                            <small>sources</small>
                          </span>
                        </div>
                        <div className="health-legend">
                          <div>
                            <i className="green" /> Active{" "}
                            <strong>
                              {
                                sources.filter((source) => source.enabled)
                                  .length
                              }
                            </strong>
                          </div>
                          <div>
                            <i className="gray" /> Paused{" "}
                            <strong>
                              {
                                sources.filter((source) => !source.enabled)
                                  .length
                              }
                            </strong>
                          </div>
                          <div>
                            <i className="amber" /> Access pending{" "}
                            <strong>
                              {
                                sources.filter(
                                  (source) =>
                                    source.permission_status !== "approved",
                                ).length
                              }
                            </strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Empty
                        icon={Link2}
                        title="No sources registered"
                        detail="Add a source to begin monitoring."
                      />
                    )}
                  </section>
                </div>
              </div>
            </>
          )}

          {/* REVIEW QUEUE SECTION */}
          {section === "review" && (
            <section className="panel table-panel">
              <PanelTitle
                title="Review queue"
                count={reviewTotal}
                subtitle="Check the evidence and source access before publication. Accept source-attributed programme listings here. Admission requirements remain unverified until supported by official evidence."
              />
              <div className="review-tabs" role="group" aria-label="Filter review records">
                {[["all", "All"], ["institution", "Institutions"], ["programme", "Programmes"], ["requirement_claim", "Requirements"], ["funding_opportunity", "Funding"], ["faculty_member", "Faculty"]].map(([type, label]) => (
                  <button key={type} disabled={busy || selectingAllReviews} className={reviewFilter === type ? "active" : ""} onClick={() => { setReviewFilter(type); setReviewPage(0); setSelectedReviewIds(new Set()); setAllReviewsSelected(false); }}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="review-toolbar">
                <label className="review-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    disabled={busy || selectingAllReviews}
                    value={reviewSearch}
                    onChange={(event) => { setReviewSearch(event.target.value); setSelectedReviewIds(new Set()); setAllReviewsSelected(false); }}
                    placeholder="Search this page by record, type, or source"
                    aria-label="Search review queue"
                  />
                </label>
                <span className="review-page-count">{filteredReviews.length} shown · {reviewTotal} awaiting review</span>
              </div>
              {selectingAllReviews && <p className="collection-continuous-note" role="status">Selecting every matching pending record across all pages…</p>}
              {selectedReviewIds.size > 0 && (
                <div className="review-bulk-bar" role="region" aria-label="Bulk review actions">
                  <div><strong>{selectedReviewIds.size.toLocaleString()} selected across all pages</strong><span>Selected across pages at selection time. Newly collected records are not included.</span></div>
                  <div className="review-bulk-actions">
                    <button type="button" className="button danger" disabled={busy} onClick={() => { setBulkReason(""); setBulkAction("reject"); }}><X size={15} />Reject selected</button>
                    <button type="button" className="button primary" disabled={busy || selectingAllReviews} title={selectedReviews.some((item) => !canPublishReview(item)) ? "Selected sources must be approved and enabled for this record type." : "Accept and publish selected records"} onClick={() => setBulkAction("approve")}><Check size={15} />Accept selected</button>
                    <button type="button" className="button secondary" disabled={busy} onClick={() => {setSelectedReviewIds(new Set());setAllReviewsSelected(false);}}>Clear</button>
                  </div>
                  {selectedReviews.some((item) => !canPublishReview(item)) && <p className="review-bulk-warning"><AlertTriangle size={14} />Some sources are paused or not approved for the selected record type.</p>}
                </div>
              )}
              {filteredReviews.length ? (
                <div className="table-scroll">
                  <table className="review-queue-table">
                    <thead>
                      <tr>
                        <th className="review-select-cell"><input type="checkbox" aria-label="Select all matching pending records across every page" disabled={busy || selectingAllReviews} checked={allReviewsSelected && selectedReviewIds.size>0} onChange={(event)=>void selectAllReviews(event.target.checked)} /></th>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Source access</th>
                        <th>Collected</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviews.map((item) => (
                        <tr key={item.id}>
                          <td className="review-select-cell"><input type="checkbox" aria-label={`Select ${titleOf(item)}`} disabled={busy || selectingAllReviews} checked={selectedReviewIds.has(item.id)} onChange={(event) => { const checked = event.target.checked; reviewManifest.current.set(item.id,{id:item.id,version:item.version,label:titleOf(item)});setAllReviewsSelected(false);setSelectedReviewIds((current) => { const next = new Set(current); if (checked) next.add(item.id); else next.delete(item.id); return next; }); }} /></td>
                          <td>
                            <div className="flex items-center gap-2">
                              <strong>{titleOf(item)}</strong>
                              <span className="id-badge" title={item.id}>
                                #{item.id.slice(0, 8)}
                              </span>
                            </div>
                            <small>{item.source_url}</small>
                          </td>
                          <td>
                            <span className="pill">
                              {pretty(item.record_type)}
                            </span>
                          </td>
                          <td>
                            <strong>{item.source_name}</strong>
                            <small className={`review-source-state ${canPublishReview(item) ? "ready" : "blocked"}`}>
                              {(item.source_adapter.toLowerCase().includes("studyportals") || item.source_adapter === "openalex-authors") ? "Source-attributed listing · ready for review" : `${pretty(item.source_permission_status)} · ${item.source_enabled ? "enabled" : "disabled"}`}
                            </small>
                          </td>
                          <td>{dateOf(item.created_at)}</td>
                          <td>
                            <button
                              className="row-link"
                              onClick={() => setSelected(item)}
                            >
                              <Eye size={15} /> Details
                            </button>
                            <div className="review-row-decisions">
                              <button type="button" className="review-accept" disabled={busy || !canPublishReview(item)} title="Accept and publish" onClick={() => { setSelected(item); setReviewAction("approve"); }}><Check size={13} />Accept</button>
                              <button type="button" className="review-reject" disabled={busy} onClick={() => { setSelected(item); setReviewReason(""); setReviewAction("reject"); }}><X size={13} />Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : reviewSearch.trim() ? (
                <Empty icon={Search} title="No matching records" detail="Change the search term to find a record in this page." />
              ) : (
                <Empty
                  icon={FileCheck2}
                  title="No records to review"
                  detail="Approved source jobs will place new or changed records here."
                />
              )}
              {reviewTotal > 100 && (
                <div className="pagination review-pagination">
                  <span>Showing {reviewPage * 100 + 1}–{Math.min((reviewPage + 1) * 100, reviewTotal)} of {reviewTotal}</span>
                  <button className="button secondary" disabled={reviewPage === 0} onClick={() => { setReviewPage((value) => Math.max(0, value - 1)); }}>Previous</button>
                  <button className="button secondary" disabled={(reviewPage + 1) * 100 >= reviewTotal} onClick={() => { setReviewPage((value) => value + 1); }}>Next</button>
                </div>
              )}
            </section>
          )}

          {/* SOURCES SECTION */}
          {section === "sources" && (
            <section className="panel table-panel">
              <PanelTitle
                title="Source registry"
                count={sources.length}
                subtitle="Access decisions and collection state for every origin."
              />
              {sources.length ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Adapter</th>
                        <th>Permission</th>
                        <th>Collection</th>
                        <th>Last success</th>
                        <th style={{ width: "90px", textAlign: "right" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sources.map((source) => (
                        <tr key={source.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <strong>{source.name}</strong>
                              <span className="id-badge">
                                #{source.id.slice(0, 8)}
                              </span>
                            </div>
                            <small>{source.base_url}</small>
                          </td>
                          <td>{source.adapter}</td>
                          <td>
                            <span
                              className={`pill ${source.permission_status === "approved" ? "good" : ""}`}
                            >
                              {pretty(source.permission_status)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`pill ${source.enabled ? "good" : ""}`}
                            >
                              {!supportedCollector(source.adapter) ? "Adapter needed" : source.enabled ? "Active" : "Paused"}
                            </span>
                          </td>
                          <td>{dateOf(source.last_success_at)}</td>
                          <td>
                            <div className="action-btn-group">
                              {user.role === "admin" && <><button className="button secondary compact-btn" disabled={busy} onClick={() => void verifySource(source)}><ShieldCheck size={13} />Verify</button><button className="button primary compact-btn" disabled={scraperRunning || !source.enabled || source.permission_status !== "approved" || !supportedCollector(source.adapter)} onClick={() => setSection("scraper")}><ArrowRight size={13} />Open scraper</button></>}
                              {user.role === "admin" && (
                                <>
                                  {source.permission_status !== "approved" ? (
                                    <button
                                      className="action-btn"
                                      title="Approve & Enable source"
                                      onClick={() => void approveAndEnableSource(source.id)}
                                    >
                                      <Check size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      className="action-btn"
                                      title={source.enabled ? "Pause collection" : "Enable collection"}
                                      onClick={() => void toggleSourceEnabled(source)}
                                    >
                                      {source.enabled ? <X size={14} /> : <Zap size={14} />}
                                    </button>
                                  )}
                                </>
                              )}
                              {source.base_url && (
                                <a
                                  href={source.base_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="action-btn"
                                  title="Visit origin"
                                >
                                  <ExternalLink size={15} />
                                </a>
                              )}
                              {user.role === "admin" && (
                                <button
                                  className="action-btn delete"
                                  title="Delete source"
                                  onClick={() =>
                                    setDeleteTarget({
                                      kind: "sources",
                                      item: source,
                                    })
                                  }
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  icon={Database}
                  title="No sources yet"
                  detail="Add a source and record its access decision before collection."
                />
              )}
            </section>
          )}

          {/* CATALOGUE SECTIONS: INSTITUTIONS, PROGRAMMES, FUNDING, FACULTY */}
          {["institutions", "programmes", "funding", "faculty"].includes(
            section,
          ) && (
            <section className="panel table-panel">
              {/* Header with counts and reset */}
              <div className="panel-header table-heading">
                <div>
                  <div className="flex items-center gap-3">
                    <h2>
                      Published {active.label.toLowerCase()}{" "}
                      <span className="count">
                        {recordTotal.toLocaleString()}
                        {!['faculty','programmes'].includes(section) && filteredRecords.length !==
                          catalog[section as CatalogKey].length && (
                          <small className="count-total">
                            {" "}
                            of {catalog[section as CatalogKey].length}
                          </small>
                        )}
                      </span>
                    </h2>
                    {hasActiveFilters && (
                      <button
                        className="filter-reset-pill"
                        onClick={resetFilters}
                        title="Reset all filters"
                      >
                        <RotateCcw size={13} /> Clear filters
                      </button>
                    )}
                  </div>
                  <p>
                    Accepted, source-attributed records. Admission requirements have separate verification.
                  </p>
                </div>
              </div>

              {['faculty','programmes'].includes(section) && catalogueLoading && <p role="status" className="collection-continuous-note">Loading records…</p>}
              {/* OPERATIONAL MULTI-FILTER TOOLBAR */}
              <div className="ops-filter-toolbar">
                {/* Search */}
                <div className="ops-filter-search">
                  <Search size={16} />
                  <input
                    aria-label={`Search ${active.label}`}
                    placeholder={`Search ${active.label.toLowerCase()} by title, uni, or #ID…`}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                  />
                  {query && (
                    <button
                      className="ops-search-clear"
                      onClick={() => {
                        setQuery("");
                        setPage(1);
                      }}
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Region Filter */}
                <div className="ops-filter-select-wrap">
                  <Globe2 size={15} className="ops-select-icon" />
                  <select
                    value={regionFilter}
                    onChange={(e) => {
                      setRegionFilter(e.target.value);
                      setCountryFilter("all"); // reset specific country when region changes
                      setPage(1);
                    }}
                    title="Filter by geographic region"
                  >
                    <option value="all">All Regions (Global)</option>
                    {Object.entries(REGIONS).map(([key, reg]) => (
                      <option key={key} value={key}>
                        {reg.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div className="ops-filter-select-wrap">
                  <select
                    value={countryFilter}
                    onChange={(e) => {
                      setCountryFilter(e.target.value);
                      if (e.target.value !== "all") setRegionFilter("all");
                      setPage(1);
                    }}
                    title="Filter by country"
                  >
                    <option value="all">
                      All Countries ({availableCountries.length})
                    </option>
                    {availableCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* University / Institution Filter for Programmes and Faculty */}
                {(section === "programmes" || section === "faculty") &&
                  availableUniversities.length > 0 && (
                    <div
                      className="ops-filter-select-wrap"
                      style={{ flex: "1 1 200px" }}
                    >
                      <Building2 size={15} className="ops-select-icon" />
                      <select
                        value={universityFilter}
                        onChange={(e) => {
                          setUniversityFilter(e.target.value);
                          setPage(1);
                        }}
                        title="Filter by university / institution"
                      >
                        <option value="all">
                          All Universities ({availableUniversities.length})
                        </option>
                        {availableUniversities.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* Programme Specific: Degree Filter */}
                {section === "programmes" && (
                  <div className="ops-filter-select-wrap">
                    <GraduationCap size={15} className="ops-select-icon" />
                    <select
                      value={degreeFilter}
                      onChange={(e) => {
                        setDegreeFilter(e.target.value);
                        setPage(1);
                      }}
                      title="Filter by degree level"
                    >
                      <option value="all">All Degrees</option>
                      <option value="masters">Master’s (MS/MSc)</option>
                      <option value="phd">PhD / Doctorate</option>
                    </select>
                  </div>
                )}

                {/* Programme Specific: Application Status Filter */}
                {section === "programmes" && (
                  <div className="ops-filter-select-wrap">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      title="Filter by application status"
                    >
                      <option value="all">All Statuses</option>
                      <option value="open">Open for Admission</option>
                      <option value="paused_external">Paused</option>
                      <option value="closed">Closed</option>
                      <option value="unknown">Status Unknown</option>
                    </select>
                  </div>
                )}

                {/* Faculty Specific: Topic Filter */}
                {section === "faculty" && availableTopics.length > 0 && (
                  <div className="ops-filter-select-wrap">
                    <Microscope size={15} className="ops-select-icon" />
                    <select
                      value={topicFilter}
                      onChange={(e) => {
                        setTopicFilter(e.target.value);
                        setPage(1);
                      }}
                      title="Filter by research topic"
                    >
                      <option value="all">All Research Topics</option>
                      {availableTopics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sorting */}
                <div className="ops-filter-select-wrap">
                  <SlidersHorizontal size={15} className="ops-select-icon" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    title="Sort order"
                  >
                    <option value="newest">Sort: Newest Verified</option>
                    <option value="title-asc">Sort: Name (A–Z)</option>
                    <option value="title-desc">Sort: Name (Z–A)</option>
                    <option value="country">Sort: Country (A–Z)</option>
                  </select>
                </div>
              </div>

              {filteredRecords.some(
                (item) => item.source_permission_status !== "approved",
              ) && (
                <div className="catalogue-source-warning" role="note">
                  <AlertTriangle size={16} />
                  <span>
                    {filteredRecords
                      .filter(
                        (item) => item.source_permission_status !== "approved",
                      )
                      .length.toLocaleString()}{" "}
                    records rely on a source whose access is not approved. Treat
                    them as imported candidates until evidence and source
                    permissions are reviewed.
                  </span>
                </div>
              )}

              {/* TABLE */}
              {paginatedRecords.length ? (
                <>
                  {(
                    ["institutions", "programmes", "faculty"] as Section[]
                  ).includes(section) ? (
                    <div className={`catalogue-card-grid ${section === "programmes" ? "programme-card-grid" : section === "faculty" ? "faculty-card-grid" : ""}`}>
                      {paginatedRecords.map((item) => (
                        <CatalogueCard
                          key={item.id}
                          item={item}
                          kind={
                            section as "institutions" | "programmes" | "faculty"
                          }
                          onInspect={() => void openInspect(item)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Record / Institution</th>
                            <th>Location / Country</th>
                            <th>Degree / Field</th>
                            <th>Verified</th>
                            <th>Status</th>
                            <th style={{ width: "120px", textAlign: "right" }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedRecords.map((item) => (
                            <tr key={item.id}>
                              {/* Record details */}
                              <td>
                                <div className="flex items-center gap-2">
                                  <strong>{titleOf(item)}</strong>
                                  <span
                                    className="id-badge"
                                    title={`Full ID: ${item.id}`}
                                  >
                                    #{item.id.slice(0, 8)}
                                  </span>
                                </div>
                                {item.institution_name && (
                                  <small className="record-sub">
                                    <Building2
                                      size={12}
                                      className="inline mr-1"
                                    />
                                    {item.institution_name}
                                  </small>
                                )}
                                {item.academic_unit && (
                                  <small className="record-sub opacity-70">
                                    {item.academic_unit}
                                  </small>
                                )}
                              </td>

                              {/* Location */}
                              <td>
                                <div className="country-chip">
                                  <span className="country-code">
                                    {item.country_code ?? "—"}
                                  </span>
                                  {item.city && (
                                    <span className="city-name">
                                      {item.city}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Degree / Level / Field */}
                              <td>
                                {item.degree ? (
                                  <span
                                    className={`pill degree-${item.degree}`}
                                  >
                                    {item.degree === "masters"
                                      ? "Master's"
                                      : item.degree.toUpperCase()}
                                  </span>
                                ) : item.coverage ? (
                                  <span className="pill funding">
                                    {item.coverage}
                                  </span>
                                ) : item.research_topics?.length ? (
                                  <span className="pill faculty">
                                    {item.research_topics
                                      .slice(0, 2)
                                      .join(", ")}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>

                              {/* Verified date */}
                              <td>{dateOf(item.verified_at)}</td>

                              {/* Status badge */}
                              <td>
                                <span
                                  className={`pill ${item.application_status === "open" ? "good" : "neutral"}`}
                                >
                                  {item.application_status
                                    ? pretty(item.application_status)
                                    : "Published"}
                                </span>
                              </td>

                              {/* Row Action buttons: Inspect, External, Delete */}
                              <td>
                                <div className="action-btn-group">
                                  <button
                                    className="action-btn view"
                                    title="Inspect details"
                                    onClick={() => void openInspect(item)}
                                  >
                                    <Eye size={15} />
                                  </button>
                                  {(item.official_url ||
                                    item.official_profile_url) && (
                                    <a
                                      href={
                                        item.official_url ||
                                        item.official_profile_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="action-btn external"
                                      title="Open official site"
                                    >
                                      <ExternalLink size={15} />
                                    </a>
                                  )}
                                  <button
                                    className="action-btn delete"
                                    title="Delete record"
                                    onClick={() =>
                                      setDeleteTarget({
                                        kind: section as CatalogKey,
                                        item,
                                      })
                                    }
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* PAGINATION TOOLBAR */}
                  <div className="ops-pagination-bar">
                    <div className="ops-pagination-info">
                      Showing{" "}
                      <strong>{(currentPage - 1) * pageSize + 1}</strong>–
                      <strong>
                        {Math.min(
                          currentPage * pageSize,
                          recordTotal,
                        )}
                      </strong>{" "}
                      of{" "}
                      <strong>{recordTotal.toLocaleString()}</strong>{" "}
                      records
                    </div>

                    <div className="ops-pagination-controls">
                      <div className="ops-page-size">
                        <span>Show:</span>
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      <div className="ops-page-nav">
                        <button
                          className="page-btn"
                          disabled={currentPage <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          title="Previous page"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="page-counter">
                          Page <strong>{currentPage}</strong> of{" "}
                          <strong>{totalPages}</strong>
                        </span>
                        <button
                          className="page-btn"
                          disabled={currentPage >= totalPages}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          title="Next page"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Empty
                  icon={active.icon}
                  title={
                    hasActiveFilters
                      ? "No records match the selected filters"
                      : `No published ${active.label.toLowerCase()}`
                  }
                  detail={
                    hasActiveFilters
                      ? "Try broadening your query, changing regions, or resetting filters."
                      : "Approved records will appear here after editorial review."
                  }
                />
              )}
            </section>
          )}

          {section === "requirements" && (
            <section className="panel table-panel">
              <Empty
                icon={FileText}
                title="Review requirement claims"
                detail="Open the review queue to verify IELTS, GRE and other admission requirements."
              />
              <div className="empty-action">
                <button
                  className="button primary"
                  onClick={() => {
                    setReviewFilter("requirement_claim");
                    setSection("overview");
                  }}
                >
                  View claims <ArrowRight size={16} />
                </button>
              </div>
            </section>
          )}

          {section === "jobs" && (
            <section className="panel table-panel">
              <PanelTitle
                title="Collection jobs"
                count={jobs.length}
                subtitle="Queue state and collection outcomes from approved sources."
              />
              {jobs.length ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Adapter</th>
                        <th>Mode / depth</th>
                        <th>Status</th>
                        <th>Found</th>
                        <th>Staged</th>
                        <th>Queued</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <strong>{job.source_name}</strong>
                            <small>#{job.id.slice(0, 8)}</small>
                          </td>
                          <td>{job.adapter}</td>
                          <td>
                            {pretty(job.mode || "discovery")} ·{" "}
                            {pretty(job.depth || "shallow")}
                          </td>
                          <td>
                            <span
                              className={`pill ${job.status === "completed" ? "good" : job.status === "failed" ? "pending" : ""}`}
                            >
                              {pretty(job.status)}
                            </span>
                          </td>
                          <td>{job.found_count}</td>
                          <td>{job.accepted_count}</td>
                          <td>{dateOf(job.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  icon={BookOpen}
                  title="No collection jobs"
                  detail="Queue an approved source to create a crawl job."
                />
              )}
            </section>
          )}

          {/* SCRAPER ENGINE SECTION */}
          {section === "scraper" && (
            <div className="scraper-layout">
              {/* Controls Panel */}
              <section className="panel scraper-controls-panel">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} />
                    <h2>Start a collection run</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`pill ${scraperRunning ? "good" : collectorWorkerAvailable ? "good" : "pending"}`}
                    >
                      {scraperRunning ? "Submitting" : collectorWorkerAvailable ? "Worker Online" : "Worker Offline"}
                    </span>
                    {!collectorWorkerAvailable && user.role === "admin" && (
                      <button
                        className="button primary compact-btn"
                        style={{ height: 26, fontSize: 11, padding: "0 8px" }}
                        title="Start background worker process"
                        onClick={() => void startCollectorWorker()}
                      >
                        <Zap size={12} /> Start Worker
                      </button>
                    )}
                  </div>
                </div>

                <div className="collection-intro"><span className="collection-eyebrow">DATA COLLECTION</span><h3>Collect programmes, universities and faculty.</h3><p>Choose what to collect, then press Scrape. Programmes go to review; OpenAlex researcher metadata appears automatically in Faculty.</p></div>
                <fieldset className="collection-targets"><legend>What do you want to collect?</legend>{([['all','All data','Programmes, universities & faculty'],['programmes','Programmes','Master’s & PhD listings'],['faculty','Faculty','Researchers & university metadata']] as const).map(([value,label,detail]) => <label key={value} className={collectionTarget === value ? 'selected' : ''}><input type="radio" name="collection-target" value={value} checked={collectionTarget === value} onChange={() => setCollectionTarget(value)} disabled={scraperRunning} /><strong>{label}</strong><small>{detail}</small></label>)}</fieldset>
                <details className="collection-settings"><summary>Request pacing & rest settings</summary><div className="scraper-config"><label className="scraper-field">Seconds between requests<input type="number" min={2} max={60} value={requestIntervalSeconds} onChange={(event) => setRequestIntervalSeconds(Number(event.target.value))} /></label><label className="scraper-field">Rest after records<input type="number" min={100} max={5000} step={100} value={restEveryRecords} onChange={(event) => setRestEveryRecords(Number(event.target.value))} /></label><label className="scraper-field">Rest duration (seconds)<input type="number" min={30} max={3600} value={restSeconds} onChange={(event) => setRestSeconds(Number(event.target.value))} /></label></div></details>
                <p className="collection-continuous-note">Keeps collecting in the background until the source is exhausted or you press Stop. Interrupted runs resume from their saved position.</p>
                <div className="scraper-btn-row">
                  <button
                    className="button primary compact-btn"
                    disabled={
                      scraperRunning || requestIntervalSeconds < 2 || requestIntervalSeconds > 60 || restEveryRecords < 100 || restEveryRecords > 5000 || restSeconds < 30 || restSeconds > 3600 ||
                      user.role !== "admin" ||
                      !sources.some(
                        (source) =>
                          source.enabled &&
                          source.permission_status === "approved" && supportedCollector(source.adapter),
                      )
                    }
                    onClick={() => void queueCollection()}
                  >
                    <Play size={14} />{" "}
                    {scraperRunning ? "Starting…" : "Scrape"}
                  </button>
                  {!collectorWorkerAvailable && (
                    <button
                      className="button secondary compact-btn"
                      disabled={busy}
                      onClick={() => void startCollectorWorker()}
                    >
                      <Zap size={14} /> Start Worker
                    </button>
                  )}
                  <button
                    className="button secondary compact-btn"
                    disabled={scraperRunning}
                    onClick={() => {
                      setScraperLogs([
                        "[SYSTEM] Log cleared. See collection activity for current run status.",
                      ]);
                    }}
                  >
                    <RotateCcw size={14} /> Clear Log
                  </button>
                </div>
                {!collectorWorkerAvailable ? (
                  <div className="scraper-no-sources" role="status" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span>{collectorWorkerMessage || "Collector worker is offline."}</span>
                    {user.role === "admin" && (
                      <button
                        className="button primary compact-btn"
                        style={{ height: 26, fontSize: 11, padding: "0 8px" }}
                        onClick={() => void startCollectorWorker()}
                      >
                        <Zap size={12} /> Start Worker Now
                      </button>
                    )}
                  </div>
                ) : !sources.some(
                  (source) =>
                    source.enabled && source.permission_status === "approved" && supportedCollector(source.adapter),
                ) && (
                  <div className="scraper-no-sources" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span>No approved sources are enabled for collection.</span>
                    {sources.length > 0 && user.role === "admin" && (
                      <button
                        className="button primary compact-btn"
                        style={{ height: 26, fontSize: 11, padding: "0 8px" }}
                        onClick={() => void approveAndEnableSource(sources[0].id)}
                      >
                        <Check size={12} /> Enable {sources[0].name.slice(0, 20)}…
                      </button>
                    )}
                  </div>
                )}

                <details className="autopilot-panel">
                  <summary className="autopilot-summary">
                    <span><strong>Automation settings</strong><small>Optional scheduled runs and trigger rules</small></span>
                    <span className={`pill ${autopilot.enabled ? "good" : "neutral"}`}>{autopilot.enabled ? "Enabled" : "Paused"}</span>
                  </summary>
                  <div className="autopilot-content">
                  <div className="autopilot-heading-row">
                    <div>
                      <span className="eyebrow">SCHEDULED QUEUE</span>
                      <h3 id="autopilot-heading">Autopilot settings</h3>
                      <p>
                        Automatically create collection jobs using approved
                        sources.
                      </p>
                    </div>
                    <span
                      className={`pill ${autopilot.enabled ? "good" : "neutral"}`}
                    >
                      {autopilot.enabled ? "Enabled" : "Paused"}
                    </span>
                  </div>

                  <div className="autopilot-worker-note" role="note">
                    <AlertTriangle size={16} />
                    <span>
                      {collectorWorkerMessage || "Collector worker status unavailable."}
                    </span>
                  </div>

                  <div className="autopilot-fields">
                    <label className="autopilot-toggle">
                      <input
                        type="checkbox"
                        checked={autopilot.enabled}
                        disabled={user.role !== "admin"}
                        onChange={(event) =>
                          setAutopilot((current) => ({
                            ...current,
                            enabled: event.target.checked,
                          }))
                        }
                      />
                      <span>Enable scheduled job queueing</span>
                    </label>
                    <label className="scraper-field">
                      <span>Schedule interval</span>
                      <select
                        value={autopilot.intervalHours}
                        disabled={user.role !== "admin"}
                        onChange={(event) =>
                          setAutopilot((current) => ({
                            ...current,
                            intervalHours: Number(event.target.value),
                          }))
                        }
                      >
                        <option value={1}>Every hour</option>
                        <option value={3}>Every 3 hours</option>
                        <option value={6}>Every 6 hours</option>
                        <option value={12}>Every 12 hours</option>
                        <option value={24}>Daily</option>
                        <option value={48}>Every 2 days</option>
                        <option value={168}>Weekly</option>
                      </select>
                    </label>
                    <label className="scraper-field">
                      <span>Collection mode</span>
                      <select
                        value={autopilot.mode}
                        disabled={user.role !== "admin"}
                        onChange={(event) =>
                          setAutopilot((current) => ({
                            ...current,
                            mode: event.target.value as AutopilotConfig["mode"],
                          }))
                        }
                      >
                        <option value="discovery">Discovery</option>
                        <option value="refresh">Refresh</option>
                        <option value="full">Full collection</option>
                      </select>
                    </label>
                    <label className="scraper-field">
                      <span>Crawl depth</span>
                      <select
                        value={autopilot.depth}
                        disabled={user.role !== "admin"}
                        onChange={(event) =>
                          setAutopilot((current) => ({
                            ...current,
                            depth: event.target
                              .value as AutopilotConfig["depth"],
                          }))
                        }
                      >
                        <option value="shallow">Shallow</option>
                        <option value="medium">Medium</option>
                        <option value="deep">Deep</option>
                      </select>
                    </label>
                    <label className="scraper-field">
                      <span>Maximum sources per run</span>
                      <select
                        value={autopilot.maxSourcesPerRun}
                        disabled={user.role !== "admin"}
                        onChange={(event) =>
                          setAutopilot((current) => ({
                            ...current,
                            maxSourcesPerRun: Number(event.target.value),
                          }))
                        }
                      >
                        {[1, 3, 5, 10, 20].map((value) => (
                          <option key={value} value={value}>
                            {value} sources
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="autopilot-triggers">
                      <label className="autopilot-toggle">
                        <input
                          type="checkbox"
                          checked={autopilot.triggerOnSchedule}
                          disabled={user.role !== "admin"}
                          onChange={(event) =>
                            setAutopilot((current) => ({
                              ...current,
                              triggerOnSchedule: event.target.checked,
                            }))
                          }
                        />
                        <span>Run on schedule</span>
                      </label>
                      <label className="autopilot-toggle">
                        <input
                          type="checkbox"
                          checked={autopilot.triggerOnSourceEnabled}
                          disabled={user.role !== "admin"}
                          onChange={(event) =>
                            setAutopilot((current) => ({
                              ...current,
                              triggerOnSourceEnabled: event.target.checked,
                            }))
                          }
                        />
                        <span>Queue when an approved source is enabled</span>
                      </label>
                      <label className="autopilot-toggle">
                        <input
                          type="checkbox"
                          checked={autopilot.onlyDueSources}
                          disabled={user.role !== "admin"}
                          onChange={(event) =>
                            setAutopilot((current) => ({
                              ...current,
                              onlyDueSources: event.target.checked,
                            }))
                          }
                        />
                        <span>Respect each source refresh interval</span>
                      </label>
                    </div>
                    <fieldset className="autopilot-sources">
                      <legend>Sources</legend>
                      <label className="autopilot-toggle">
                        <input
                          type="checkbox"
                          checked={autopilot.sourceIds.length === 0}
                          disabled={user.role !== "admin"}
                          onChange={() =>
                            setAutopilot((current) => ({
                              ...current,
                              sourceIds: [],
                            }))
                          }
                        />
                        <span>All approved and enabled sources</span>
                      </label>
                      {sources
                        .filter(
                          (source) =>
                            source.enabled &&
                            source.permission_status === "approved" && supportedCollector(source.adapter),
                        )
                        .map((source) => (
                          <label className="autopilot-toggle" key={source.id}>
                            <input
                              type="checkbox"
                              checked={autopilot.sourceIds.includes(source.id)}
                              disabled={user.role !== "admin"}
                              onChange={(event) =>
                                setAutopilot((current) => ({
                                  ...current,
                                  sourceIds: event.target.checked
                                    ? [...current.sourceIds, source.id]
                                    : current.sourceIds.filter(
                                        (id) => id !== source.id,
                                      ),
                                }))
                              }
                            />
                            <span>{source.name}</span>
                          </label>
                        ))}
                    </fieldset>
                  </div>
                  <div className="autopilot-footer">
                    <div>
                      <span>
                        Next queue:{" "}
                        {autopilot.enabled && autopilot.nextRunAt
                          ? new Date(autopilot.nextRunAt).toLocaleString()
                          : "Not scheduled"}
                      </span>
                      {autopilot.lastRunSummary && (
                        <small>{autopilot.lastRunSummary}</small>
                      )}
                    </div>
                    <button
                      className="button primary compact-btn"
                      disabled={savingAutopilot || user.role !== "admin"}
                      onClick={() => void saveAutopilot()}
                    >
                      {savingAutopilot ? "Saving…" : "Save autopilot"}
                    </button>
                  </div>
                  </div>
                </details>

              </section>

              <CollectionMonitor admin={user.role === "admin"} onWorkerStatus={setCollectorWorkerAvailable} />
              <section className="panel collection-source-registry">
                {/* Source status table */}
                {sources.length > 0 && (
                  <div className="scraper-source-table">
                    <div className="scraper-section-label">
                      Registered Sources
                    </div>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Source</th>
                            <th>Adapter</th>
                            <th>Status</th>
                            <th>Last run</th>
                            <th>
                              <button
                                className="text-button"
                                onClick={() => setSection("sources")}
                              >
                                Manage <ArrowRight size={13} />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sources.map((s) => (
                            <tr key={s.id}>
                              <td>
                                <div className="flex items-center gap-2">
                                  <strong>{s.name}</strong>
                                  <span className="id-badge">
                                    #{s.id.slice(0, 8)}
                                  </span>
                                </div>
                              </td>
                              <td>{s.adapter}</td>
                              <td>
                                <span
                                  className={`pill ${s.permission_status === "approved" && s.enabled ? "good" : "neutral"}`}
                                >
                                  {!supportedCollector(s.adapter) ? "Adapter needed" : s.permission_status === "approved" &&
                                  s.enabled
                                    ? "Approved · active"
                                    : pretty(s.permission_status)}
                                </span>
                              </td>
                              <td>{dateOf(s.last_success_at)}</td>
                              <td>
                                <div className="action-btn-group">
                                  <button className="button secondary compact-btn" disabled={busy || user.role !== "admin"} onClick={() => void verifySource(s)}><ShieldCheck size={12} /> Verify</button>
                                  {s.permission_status !== "approved" || !s.enabled ? (
                                    user.role === "admin" && (
                                      <button
                                        className="button primary compact-btn"
                                        style={{ height: 26, fontSize: 11, padding: "0 8px" }}
                                        title="Approve & Enable source"
                                        onClick={() => void approveAndEnableSource(s.id)}
                                      >
                                        <Check size={12} /> Enable
                                      </button>
                                    )
                                  ) : (
                                    <>
                                      <button
                                        className="action-btn view"
                                        title="View source settings"
                                        aria-label={`Manage ${s.name}`}
                                        disabled={scraperRunning || user.role !== "admin" || !supportedCollector(s.adapter)}
                                        onClick={() => setSection("sources")}
                                      >
                                        <Zap size={13} />
                                      </button>
                                      {user.role === "admin" && (
                                        <button
                                          className="action-btn"
                                          title="Pause collection"
                                          onClick={() => void toggleSourceEnabled(s)}
                                        >
                                          <X size={13} />
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </section>
              {/* Live Log Panel */}
              <section className="panel scraper-log-panel">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Terminal size={15} />
                    <h2>Live Output</h2>
                  </div>
                  {scraperRunning && (
                    <span className="scraper-pulse">
                      <span className="pulse-dot" />
                      Live
                    </span>
                  )}
                </div>
                <div className="scraper-log-body">
                  {scraperLogs.map((line, i) => (
                    <div
                      key={i}
                      className={`log-line ${
                        line.includes("✓")
                          ? "log-success"
                          : line.includes("⚠")
                            ? "log-warn"
                            : line.startsWith("[SYSTEM]")
                              ? "log-system"
                              : ""
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </section>
            </div>
          )}

          {/* SETTINGS SECTION */}
          {section === "settings" && (
            <section className="panel table-panel">
              <div className="panel-header table-heading">
                <div>
                  <div className="flex items-center gap-3">
                    <h2>System & Team Settings</h2>
                  </div>
                  <p>
                    Manage workspace staff accounts, global country
                    destinations, and geographic regions dynamically.
                  </p>
                </div>
              </div>

              {/* SUBTABS */}
              <div className="settings-tabs">
                <button
                  className={settingsTab === "team" ? "active" : ""}
                  onClick={() => setSettingsTab("team")}
                >
                  <Users size={15} />
                  Team Management <b>{staffList.length}</b>
                </button>
                <button
                  className={settingsTab === "countries" ? "active" : ""}
                  onClick={() => setSettingsTab("countries")}
                >
                  <Globe2 size={15} />
                  Countries & Destinations <b>{settings.countries.length}</b>
                </button>
                <button
                  className={settingsTab === "regions" ? "active" : ""}
                  onClick={() => setSettingsTab("regions")}
                >
                  <SlidersHorizontal size={15} />
                  Geographic Regions{" "}
                  <b>{Object.keys(settings.regions).length}</b>
                </button>
              </div>

              {/* TAB CONTENT: TEAM MANAGEMENT */}
              {settingsTab === "team" && (
                <div className="settings-content">
                  <div className="settings-topbar">
                    <div className="settings-topbar-left">
                      <h3>Workspace Staff Members</h3>
                      <p>
                        Team members with access to HigherStudy Editorial.
                        Admins have full access to team and system
                        configuration.
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <button
                        className="button primary compact-btn"
                        onClick={() => setStaffModalOpen(true)}
                      >
                        <UserPlus size={15} /> Add Team Member
                      </button>
                    )}
                  </div>

                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th style={{ width: "120px", textAlign: "right" }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.map((member) => (
                          <tr key={member.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="admin-avatar">
                                  {member.email[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <strong>{member.email}</strong>
                                    {member.id === user.id && (
                                      <span
                                        className="pill good"
                                        style={{ fontSize: "9px" }}
                                      >
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <small className="font-mono text-xs opacity-75">
                                    #{member.id.slice(0, 8)}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`role-badge ${member.role}`}>
                                <ShieldCheck size={12} /> {pretty(member.role)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${member.disabled_at ? "disabled" : "active"}`}
                              >
                                {member.disabled_at ? "Deactivated" : "Active"}
                              </span>
                            </td>
                            <td>{dateOf(member.created_at)}</td>
                            <td>
                              <div
                                className="action-btn-group"
                                style={{ justifyContent: "flex-end" }}
                              >
                                {user.role === "admin" &&
                                  member.id !== user.id && (
                                    <>
                                      <button
                                        className="action-btn"
                                        title={
                                          member.role === "admin"
                                            ? "Demote to Editor"
                                            : "Promote to Admin"
                                        }
                                        onClick={() =>
                                          void handleToggleStaffRole(member)
                                        }
                                      >
                                        <SlidersHorizontal size={14} />
                                      </button>
                                      <button
                                        className="action-btn delete"
                                        title="Remove member"
                                        onClick={() =>
                                          setDeleteStaffTarget(member)
                                        }
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: COUNTRIES & DESTINATIONS */}
              {settingsTab === "countries" && (
                <div className="settings-content">
                  <div className="settings-topbar">
                    <div className="settings-topbar-left">
                      <h3>Configured Countries & Study Destinations</h3>
                      <p>
                        Global countries available for institution and programme
                        filtering and student navigation.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="ops-filter-search"
                        style={{ width: "220px", flex: "none" }}
                      >
                        <Search size={14} />
                        <input
                          placeholder="Search country or code…"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          style={{ height: "34px", fontSize: "12px" }}
                        />
                        {countrySearch && (
                          <button
                            className="ops-search-clear"
                            onClick={() => setCountrySearch("")}
                            style={{
                              top: "3px",
                              height: "26px",
                              width: "26px",
                            }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      {user.role === "admin" && (
                        <button
                          className="button primary compact-btn"
                          onClick={() => setCountryModalOpen(true)}
                        >
                          <Plus size={15} /> Add Country
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "80px" }}>Code</th>
                          <th>Country Name</th>
                          <th>Geographic Region</th>
                          <th>Catalog Records</th>
                          <th style={{ width: "80px", textAlign: "right" }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.countries
                          .filter((c) => {
                            if (!countrySearch.trim()) return true;
                            const q = countrySearch.trim().toLowerCase();
                            return (
                              c.code.toLowerCase().includes(q) ||
                              c.name.toLowerCase().includes(q) ||
                              (settings.regions[c.region]?.label || "")
                                .toLowerCase()
                                .includes(q)
                            );
                          })
                          .map((c) => {
                            const instCount = catalog.institutions.filter(
                              (i) =>
                                (i.country_code ?? "").toUpperCase() ===
                                c.code.toUpperCase(),
                            ).length;
                            const progCount = catalog.programmes.filter(
                              (p) =>
                                (p.country_code ?? "").toUpperCase() ===
                                c.code.toUpperCase(),
                            ).length;
                            return (
                              <tr key={c.code}>
                                <td>
                                  <div className="country-flag-code">
                                    {c.code}
                                  </div>
                                </td>
                                <td>
                                  <strong>{c.name}</strong>
                                </td>
                                <td>
                                  <span className="pill">
                                    {settings.regions[c.region]?.label ||
                                      pretty(c.region)}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-xs opacity-75">
                                    <strong>{instCount}</strong> universities ·{" "}
                                    <strong>{progCount}</strong> programmes
                                  </span>
                                </td>
                                <td>
                                  <div
                                    className="action-btn-group"
                                    style={{ justifyContent: "flex-end" }}
                                  >
                                    {user.role === "admin" && (
                                      <button
                                        className="action-btn delete"
                                        title={`Remove ${c.name}`}
                                        onClick={() =>
                                          setDeleteCountryTarget(c)
                                        }
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: GEOGRAPHIC REGIONS */}
              {settingsTab === "regions" && (
                <div className="settings-content">
                  <div className="settings-topbar">
                    <div className="settings-topbar-left">
                      <h3>Geographic Regions</h3>
                      <p>
                        Macro-regions grouping study destinations for world
                        filtering.
                      </p>
                    </div>
                  </div>

                  <div className="settings-grid-3">
                    {Object.entries(settings.regions).map(([key, reg]) => (
                      <div key={key} className="region-card">
                        <div className="region-card-top">
                          <h4>{reg.label}</h4>
                          <span className="region-card-count">
                            {reg.countries.length} destinations
                          </span>
                        </div>
                        <div className="region-card-chips">
                          {reg.countries.map((code) => (
                            <span
                              key={code}
                              className="pill"
                              title={COUNTRY_NAMES[code] || code}
                            >
                              {code}{" "}
                              {COUNTRY_NAMES[code]
                                ? `· ${COUNTRY_NAMES[code]}`
                                : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {section === "audit" && user.role === "admin" && <AuditLogView />}
        </main>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <Modal
          title="Confirm permanent deletion"
          className="confirm-dialog"
          onClose={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
        >
          <div className="confirm-delete-box">
            <div className="confirm-icon delete-danger">
              <Trash2 size={24} />
            </div>
            <h2>
              Delete this{" "}
              {deleteTarget.kind === "sources"
                ? "source"
                : deleteTarget.kind.slice(0, -1)}
              ?
            </h2>
            <p>
              This will permanently delete this record from the database. This
              action cannot be undone.
            </p>

            <div className="confirm-item-preview">
              <div className="flex items-center gap-2 mb-1">
                <strong>
                  {deleteTarget.item.title ||
                    deleteTarget.item.name ||
                    "Untitled"}
                </strong>
                <span className="id-badge">
                  #{deleteTarget.item.id.slice(0, 8)}
                </span>
              </div>
              <small className="opacity-75 font-mono text-xs block">
                ID: {deleteTarget.item.id}
              </small>
            </div>

            <div className="delete-warning-note">
              <AlertTriangle size={16} className="text-amber-500 flex-none" />
              <span>
                {deleteTarget.kind === "programmes"
                  ? "All related requirement claims, intakes, revisions, and funding links will be removed in cascade."
                  : deleteTarget.kind === "institutions"
                    ? "Ensure no programmes or departments depend on this institution before deleting."
                    : "The record will immediately disappear from the catalogue and student site."}
              </span>
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="button secondary"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button danger"
                disabled={isDeleting}
                onClick={() => void confirmDelete()}
              >
                {isDeleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* INSPECT DETAIL MODAL */}
      {inspectTarget && (
        <Modal
          title="Record details"
          className="drawer-dialog inspect-dialog"
          onClose={() => {
            setInspectTarget(null);
            setInspectDetails(null);
          }}
        >
          <section className="drawer">
            <div className="drawer-top">
              <div className="flex items-center gap-2">
                <span className="eyebrow">
                  CATALOGUE / {section.toUpperCase()}
                </span>
                <span className="id-badge">
                  #{inspectTarget.id.slice(0, 8)}
                </span>
              </div>
              <button
                className="icon-button"
                aria-label="Close inspector"
                onClick={() => {
                  setInspectTarget(null);
                  setInspectDetails(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <h2>{titleOf(inspectDetails ?? inspectTarget)}</h2>

            {/* Quick action bar */}
            <div className="inspect-quick-bar">
              {(inspectDetails?.official_url || inspectTarget.official_url) ? (
                <a
                  href={inspectDetails?.official_url || inspectTarget.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary compact-btn"
                >
                  <ExternalLink size={14} /> Programme Website
                </a>
              ) : section === "programmes" ? (
                <button
                  type="button"
                  className="button primary compact-btn"
                  onClick={() => setIsEditingUrl(true)}
                >
                  <Link2 size={14} /> Set Official URL
                </button>
              ) : null}
              {inspectDetails?.institution_official_url && (
                <a
                  href={inspectDetails.institution_official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary compact-btn"
                >
                  <Building2 size={14} /> University Site
                </a>
              )}
              {(inspectDetails?.discovery_url || inspectTarget.discovery_url) && (
                <a
                  href={inspectDetails?.discovery_url || inspectTarget.discovery_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button secondary compact-btn"
                >
                  <ExternalLink size={14} /> Studyportals Page
                </a>
              )}
              {section === "programmes" && (inspectDetails?.official_url || inspectTarget.official_url) && (
                <button
                  type="button"
                  className="button secondary compact-btn"
                  onClick={() => {
                    setEditUrlValue(inspectDetails?.official_url || inspectTarget.official_url || "");
                    setIsEditingUrl(true);
                  }}
                >
                  Edit URL
                </button>
              )}
              <button
                className="button danger compact-btn"
                onClick={() => {
                  const target = inspectDetails ?? inspectTarget;
                  setDeleteTarget({
                    kind: section as CatalogKey,
                    item: target,
                  });
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            {section === "faculty" && inspectTarget && <form className="url-edit-box p-3 my-3 bg-slate-50 border border-slate-200 rounded-lg" onSubmit={async event => {
              event.preventDefault();setCollectingContact(true);
              try {
                const profile=new URL(contactProfileUrl);
                const source=sources.find(source=>source.adapter==='official-faculty' && source.enabled && source.permission_status==='approved' && new URL(source.base_url).origin===profile.origin);
                if(!source)throw new Error("Approve an official faculty source for this domain in Sources first.");
                await api(`/v1/admin/catalog/faculty/${inspectTarget.id}/contact-jobs`,{method:"POST",body:JSON.stringify({sourceId:source.id,profileUrl:profile.href})});
                notify("success","Public contact collection queued. Check Review Queue before publication.");setContactProfileUrl("");
              } catch(error) {notify("error",error instanceof Error?error.message:"Contact collection failed");} finally {setCollectingContact(false);}
            }}>
              <label htmlFor="faculty-contact-profile" className="block text-xs font-semibold text-slate-700 mb-1">Collect public contact from an official faculty profile</label>
              <div className="flex items-center gap-2"><input id="faculty-contact-profile" type="url" required value={contactProfileUrl} onChange={event=>setContactProfileUrl(event.target.value)} placeholder="https://university.edu/people/name" className="ops-search-input text-xs" style={{flex:1}} /><button className="button primary compact-btn" disabled={collectingContact}>{collectingContact?"Queueing…":"Collect contact"}</button></div>
            </form>}

            {isEditingUrl && section === "programmes" && (
              <div className="url-edit-box p-3 my-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Programme URL (must be a valid HTTPS university website):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={editUrlValue}
                    onChange={(e) => setEditUrlValue(e.target.value)}
                    placeholder="https://university.edu/degrees/programme-name"
                    className="ops-search-input text-xs"
                    style={{ flex: 1, padding: "6px 10px" }}
                  />
                  <button
                    type="button"
                    className="button primary compact-btn"
                    disabled={savingUrl}
                    onClick={handleSaveOfficialUrl}
                  >
                    {savingUrl ? "Saving…" : "Save URL"}
                  </button>
                  <button
                    type="button"
                    className="button secondary compact-btn"
                    disabled={savingUrl}
                    onClick={() => {
                      setIsEditingUrl(false);
                      setUrlSaveError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {urlSaveError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{urlSaveError}</p>
                )}
              </div>
            )}

            {loadingInspect && (
              <div className="py-2 text-xs opacity-60">
                Loading full associations…
              </div>
            )}

            <dl className="details">
              <div>
                <dt>Record ID</dt>
                <dd className="font-mono text-xs">{inspectTarget.id}</dd>
              </div>
              {inspectDetails?.institution_name && (
                <div>
                  <dt>Institution</dt>
                  <dd>{inspectDetails.institution_name}</dd>
                </div>
              )}
              {inspectDetails?.academic_unit && (
                <div>
                  <dt>Academic Unit</dt>
                  <dd>{inspectDetails.academic_unit}</dd>
                </div>
              )}
              {inspectDetails?.degree && (
                <div>
                  <dt>Degree Level</dt>
                  <dd className="capitalize">{inspectDetails.degree}</dd>
                </div>
              )}
              {inspectDetails?.country_code && (
                <div>
                  <dt>Country</dt>
                  <dd>
                    {COUNTRY_NAMES[inspectDetails.country_code.toUpperCase()] ||
                      inspectDetails.country_code}{" "}
                    ({inspectDetails.country_code})
                  </dd>
                </div>
              )}
              {inspectDetails?.city && (
                <div>
                  <dt>City</dt>
                  <dd>{inspectDetails.city}</dd>
                </div>
              )}
              {inspectDetails?.application_status && (
                <div>
                  <dt>Application Status</dt>
                  <dd className="capitalize">
                    {pretty(inspectDetails.application_status)}
                  </dd>
                </div>
              )}
              {inspectDetails && (
                <div>
                  <dt>Public Contact Email</dt>
                  <dd>
                    {inspectDetails.public_email ? (
                      <a href={`mailto:${inspectDetails.public_email}`} className="text-primary-link" style={{ color: '#38bdf8' }}>
                        {inspectDetails.public_email}
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted text-xs">Public email not collected</span>
                        {inspectDetails.orcid_id && (
                          <a
                            href={inspectDetails.orcid_id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pill"
                            style={{ padding: '2px 8px', fontSize: '0.75rem', background: 'rgba(166, 206, 57, 0.15)', color: '#a6ce39', border: '1px solid rgba(166, 206, 57, 0.35)', textDecoration: 'none', fontWeight: 600 }}
                          >
                            ORCID Profile ↗
                          </a>
                        )}
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(
                            (inspectDetails.name || '') + ' ' + (inspectDetails.institution_name || '')
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', textDecoration: 'none' }}
                        >
                          Find Profile ↗
                        </a>
                      </div>
                    )}
                  </dd>
                </div>
              )}
              {inspectDetails?.coverage && (
                <div>
                  <dt>Funding Coverage</dt>
                  <dd>{inspectDetails.coverage}</dd>
                </div>
              )}
              {inspectDetails?.deadline_on && (
                <div>
                  <dt>Deadline</dt>
                  <dd>{dateOf(inspectDetails.deadline_on)}</dd>
                </div>
              )}
              {inspectDetails?.research_topics && (
                <div>
                  <dt>Research Topics</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {inspectDetails.research_topics.map((t, i) => (
                      <span key={i} className="pill faculty text-xs">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {inspectDetails?.admission_note && (
                <div>
                  <dt>Admission Note</dt>
                  <dd className="text-xs leading-relaxed opacity-90">
                    {inspectDetails.source_details?.englishRequirements?.length
                      ? "Source-reported language test scores collected from candidate feed. Official institutional admission review (GRE, GPA, waivers) is pending."
                      : inspectDetails.admission_note}
                  </dd>
                </div>
              )}
              <div>
                <dt>Verified Date</dt>
                <dd>
                  {dateOf(
                    inspectDetails?.verified_at ?? inspectTarget.verified_at,
                  )}
                </dd>
              </div>
            </dl>

            {inspectDetails?.research_metadata?.provider && <div className="source-box"><strong>{inspectDetails.research_metadata.provider} research metadata</strong><p>H-index: {inspectDetails.research_metadata.hIndex ?? "Not reported"} · Citations: {inspectDetails.research_metadata.citedByCount ?? "Not reported"} · Publications: {inspectDetails.research_metadata.worksCount ?? "Not reported"}</p><small>{inspectDetails.research_metadata.affiliationStatus}</small>{inspectDetails.profile_source_url && <a href={inspectDetails.profile_source_url} target="_blank" rel="noopener noreferrer">View source <ExternalLink size={13} /></a>}</div>}
            {/* Nested Intakes if available */}
            {inspectDetails?.intakes && inspectDetails.intakes.length > 0 && (
              <div className="inspect-subtable mt-4">
                <h3 className="text-sm font-semibold mb-2">Upcoming Intakes</h3>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Term</th>
                        <th>Deadline</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspectDetails.intakes.map((intake) => (
                        <tr key={intake.id}>
                          <td>{intake.term}</td>
                          <td>{dateOf(intake.deadline_on)}</td>
                          <td>
                            {intake.application_url ? (
                              <a
                                href={intake.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="row-link"
                              >
                                Apply <ExternalLink size={12} />
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Source-Listed Intakes if DB intakes are empty */}
            {(!inspectDetails?.intakes || inspectDetails.intakes.length === 0) &&
              inspectDetails?.source_details?.intakes &&
              inspectDetails.source_details.intakes.length > 0 && (
                <div className="inspect-subtable mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">
                      Upcoming Intakes & Application Deadlines ({inspectDetails.source_details.intakes.length})
                    </h3>
                    <span className="pill neutral">Source listed</span>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Applicant Category</th>
                          <th>Start Date</th>
                          <th>Application Deadline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspectDetails.source_details.intakes.map((intake, index) => (
                          <tr key={index}>
                            <td>
                              <strong className="capitalize">{pretty(intake.applicantCategory || "general")} applicants</strong>
                            </td>
                            <td>
                              {intake.startingAnytime ? "Start anytime" : intake.startsOn ? dateOf(intake.startsOn) : "Start date not collected"}
                            </td>
                            <td>
                              {intake.applyingAnytime ? "Apply anytime" : intake.deadlineOn ? dateOf(intake.deadlineOn) : "Deadline not collected"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Source-Listed English Requirements */}
            {inspectDetails?.source_details?.englishRequirements &&
              inspectDetails.source_details.englishRequirements.length > 0 && (
                <div className="inspect-subtable mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">
                      Admission Requirements (Source-Reported)
                    </h3>
                    <span className="pill neutral">Candidate Source Feed</span>
                  </div>
                  <div className="prog-chip-row mb-3">
                    {inspectDetails.source_details.englishRequirements.map((exam) => (
                      <span className="color-badge ielts" key={exam.type}>
                        <FileCheck2 size={12} />
                        <span>{exam.type} {exam.score}</span>
                      </span>
                    ))}
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Test / Requirement</th>
                          <th>Minimum Score Required</th>
                          <th>Verification Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspectDetails.source_details.englishRequirements.map((exam) => (
                          <tr key={exam.type}>
                            <td>
                              <strong>{exam.type}</strong>
                            </td>
                            <td>
                              <span className="pill good font-mono font-semibold">{exam.score}</span>
                            </td>
                            <td>
                              <span className="text-xs text-slate-500">
                                Extracted from candidate listing (official institutional verification pending)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Verified Requirements if available */}
            {inspectDetails?.requirements &&
              inspectDetails.requirements.length > 0 && (
                <div className="inspect-subtable mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">
                      Verified Requirements
                    </h3>
                    <span className="pill good">Officially Verified</span>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Condition / Value</th>
                          <th>State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspectDetails.requirements.map((req) => (
                          <tr key={req.id}>
                            <td>
                              <strong>{pretty(req.type)}</strong>
                            </td>
                            <td>
                              {req.value_text ||
                                (req.value_number
                                  ? `${req.value_number} ${req.unit || ""}`
                                  : req.condition_text || "Required")}
                            </td>
                            <td>
                              <span className="pill good">{req.state}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {section === "programmes" && !loadingInspect && (
              <div className="source-box">
                <strong>
                  {inspectDetails?.requirements?.length
                    ? "Official verification active"
                    : inspectDetails?.source_details?.englishRequirements?.length
                    ? "Official institutional verification pending"
                    : "Admission requirements not collected"}
                </strong>
                <p>
                  {inspectDetails?.requirements?.length
                    ? "Official requirement claims have been verified against institution evidence."
                    : inspectDetails?.source_details?.englishRequirements?.length
                    ? "English language scores above were extracted from the candidate discovery listing. Official institutional verification for GRE, GPA, and waivers is pending."
                    : "IELTS, TOEFL, GRE and GPA minimums have not been extracted from an official programme page. This does not mean they are waived."}
                </p>
              </div>
            )}
            {/* Nested Funding Opportunities if available */}
            {inspectDetails?.funding && inspectDetails.funding.length > 0 && (
              <div className="inspect-subtable mt-4">
                <h3 className="text-sm font-semibold mb-2">
                  Funding Opportunities
                </h3>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Provider</th>
                        <th>Coverage</th>
                        <th>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspectDetails.funding.map((f) => (
                        <tr key={f.id}>
                          <td>
                            <strong>{f.title}</strong>
                          </td>
                          <td>{f.provider || "University"}</td>
                          <td>
                            <span className="pill good">
                              {pretty(f.coverage || "Full Aid")}
                            </span>
                          </td>
                          <td>{dateOf(f.deadline_on)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </Modal>
      )}

      {/* REVIEW DECISION MODAL */}
      {bulkAction && (
        <Modal
          title={bulkAction === "approve" ? "Confirm bulk publication" : "Confirm bulk rejection"}
          className="confirm-dialog"
          onClose={() => { if (!busy) setBulkAction(null); }}
        >
          <form onSubmit={(event) => { event.preventDefault(); void decideBulk(bulkAction); }}>
            <div className={`confirm-icon ${bulkAction === "approve" ? "approve" : "reject"}`}>
              {bulkAction === "approve" ? <Check size={22} /> : <X size={22} />}
            </div>
            <h2>{bulkAction === "approve" ? `Publish ${selectedReviewIds.size} records?` : `Reject ${selectedReviewIds.size} records?`}</h2>
            <p>{bulkAction === "approve" ? "Each record will be checked against its source and version. Successful publication makes that record visible to students." : "The same review reason will be recorded for every selected item. Rejected records will not appear in the student catalogue."}</p>
            <div className="review-bulk-preview">
              {selectedReviews.slice(0, 4).map((item) => <div key={item.id}><strong>{titleOf(item)}</strong><span>{pretty(item.record_type)} · {item.source_name}</span></div>)}
              {selectedReviewIds.size > 4 && <small>and {selectedReviewIds.size - Math.min(selectedReviews.length,4)} more records</small>}
            </div>
            {bulkAction === "reject" && <div className="confirm-field"><label htmlFor="bulk-review-reason">Reason for rejection (applies to all selected records)</label><textarea id="bulk-review-reason" required minLength={3} maxLength={1000} autoFocus value={bulkReason} onChange={(event) => setBulkReason(event.target.value)} placeholder="Explain why these records should be rejected…" /></div>}
            {bulkProgress && <p className="review-bulk-progress" role="status">Processing {bulkProgress.done} of {bulkProgress.total}…</p>}
            <div className="confirm-actions">
              <button type="button" className="button secondary" disabled={busy} onClick={() => setBulkAction(null)}>Cancel</button>
              <button className={`button ${bulkAction === "reject" ? "danger" : "primary"}`} disabled={busy || !selectedReviewIds.size || (bulkAction === "reject" && bulkReason.trim().length < 3)}>
                {busy ? "Processing…" : bulkAction === "approve" ? "Accept and publish" : "Reject selected"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selected && (
        <Modal
          title="Review record"
          className="drawer-dialog"
          onClose={() => setSelected(null)}
        >
          <section className="drawer">
            <div className="drawer-top">
              <span className="eyebrow">
                REVIEW / {pretty(selected.record_type).toUpperCase()}
              </span>
              <button
                className="icon-button"
                aria-label="Close review"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </div>
            <h2>{titleOf(selected)}</h2>
            <p>
              Check the extracted fields and original evidence, then accept or reject this record.
            </p>
            <div className="source-box">
              <span>ORIGINAL SOURCE</span>
              <a
                href={selected.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selected.source_url}
                <ArrowRight size={15} />
              </a>
              <small>Registered source: {selected.source_name} · {pretty(selected.source_adapter)} · access {pretty(selected.source_permission_status)} · {selected.source_enabled ? "enabled" : "disabled"}</small>
            </div>
            {!canPublishReview(selected) && (
              <div className="catalogue-source-warning" role="status">
                {(selected.source_adapter.toLowerCase().includes("studyportals") || selected.source_adapter === "openalex-authors")
                  ? "Discovery candidate only. Verify it against an official university or funder page before publication."
                  : `Cannot publish yet: source access is ${selected.source_permission_status} and ${selected.source_enabled ? "enabled" : "disabled"}.`}
              </div>
            )}
            <div className="review-detail-meta"><span className="pill">{pretty(selected.record_type)}</span><span>Collected {dateOf(selected.created_at)}</span><span>Revision {selected.version}</span></div>
            <dl className="details review-record-fields">
              {Object.entries(selected.payload).map(([key, value]) => (
                <div key={key}>
                  <dt>{pretty(key.replace(/([a-z])([A-Z])/g, "$1 $2"))}</dt>
                  <dd>
                    {Array.isArray(value) ? (value.length ? value.map((entry, index) => <span className="review-field-value" key={index}>{typeof entry === "object" ? JSON.stringify(entry, null, 2) : String(entry)}</span>) : "Not reported") : typeof value === "object" && value !== null ? <pre>{JSON.stringify(value, null, 2)}</pre> : String(value ?? "Not reported")}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="drawer-actions">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => {
                  setReviewReason("");
                  setReviewAction("reject");
                }}
              >
                <X size={16} /> Reject
              </button>
              <button
                className="button primary"
                disabled={busy || !canPublishReview(selected)}
                onClick={() => setReviewAction("approve")}
              >
                <Check size={16} /> Accept & publish
              </button>
            </div>
          </section>
        </Modal>
      )}

      {reviewAction && selected && (
        <Modal
          title={
            reviewAction === "approve"
              ? "Confirm publication"
              : "Confirm rejection"
          }
          className="confirm-dialog"
          onClose={() => {
            if (!busy) setReviewAction(null);
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void decide(selected, reviewAction);
            }}
          >
            <div className={`confirm-icon ${reviewAction}`}>
              <ShieldCheck size={22} />
            </div>
            <h2>
              {reviewAction === "approve"
                ? "Publish this record?"
                : "Reject this record?"}
            </h2>
            <p>
              {reviewAction === "approve"
                ? "This record will become visible to students after publication."
                : "A reason is required so the collection team can correct the record."}
            </p>
            <div className="confirm-record">
              <strong>{titleOf(selected)}</strong>
              <span>{selected.source_name}</span>
            </div>
            {reviewAction === "reject" && (
              <div className="confirm-field">
                <label htmlFor="review-reason">Reason for rejection</label>
                <textarea
                  id="review-reason"
                  required
                  minLength={3}
                  maxLength={1000}
                  autoFocus
                  value={reviewReason}
                  onChange={(event) => setReviewReason(event.target.value)}
                  placeholder="Describe the incorrect or unsupported information…"
                />
              </div>
            )}
            <div className="confirm-actions">
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => setReviewAction(null)}
              >
                Cancel
              </button>
              <button
                className={`button ${reviewAction === "reject" ? "danger" : "primary"}`}
                disabled={
                  busy ||
                  (reviewAction === "reject" && reviewReason.trim().length < 3)
                }
              >
                {busy
                  ? "Saving…"
                  : reviewAction === "approve"
                    ? "Publish record"
                    : "Reject record"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {sourceForm && (
        <Modal
          title="Add source"
          className="drawer-dialog"
          onClose={closeSource}
        >
          <section className="source-dialog">
            <div className="drawer-top">
              <span className="eyebrow">SOURCE REGISTRY</span>
              <button
                className="icon-button"
                aria-label="Close source form"
                onClick={closeSource}
              >
                <X size={20} />
              </button>
            </div>
            <h2>Add a source</h2>
            <p>New sources stay disabled until access is reviewed.</p>
            <form onSubmit={addSource}>
              <label htmlFor="source-name">Source name</label>
              <input
                id="source-name"
                required
                minLength={2}
                maxLength={160}
                value={sourceDraft.name}
                onChange={(event) =>
                  setSourceDraft({ ...sourceDraft, name: event.target.value })
                }
                placeholder="University graduate admissions"
              />
              <label htmlFor="source-url">Base URL</label>
              <input
                id="source-url"
                type="url"
                required
                value={sourceDraft.baseUrl}
                onChange={(event) =>
                  setSourceDraft({
                    ...sourceDraft,
                    baseUrl: event.target.value,
                  })
                }
                placeholder="https://university.edu"
              />
              <label htmlFor="source-adapter">Adapter</label>
              <select
                id="source-adapter"
                value={sourceDraft.adapter}
                onChange={(event) =>
                  setSourceDraft({
                    ...sourceDraft,
                    adapter: event.target.value,
                  })
                }
              >
                <option value="official-site">Official site (adapter required)</option>
                <option value="openalex-authors">OpenAlex · researcher metadata</option>
                <option value="official-faculty">Official faculty · structured profiles</option>
                <option value="studyportals">Studyportals discovery</option>
              </select>
              <button className="button primary wide" disabled={busy}>
                {busy ? "Saving…" : "Create source"}
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </Modal>
      )}

      {discardSource && (
        <Modal
          title="Discard source changes"
          className="confirm-dialog"
          onClose={() => setDiscardSource(false)}
        >
          <div className="confirm-icon reject">
            <CircleAlert size={22} />
          </div>
          <h2>Discard changes?</h2>
          <p>The source details you entered have not been saved.</p>
          <div className="confirm-actions">
            <button
              className="button secondary"
              onClick={() => setDiscardSource(false)}
            >
              Keep editing
            </button>
            <button
              className="button danger"
              onClick={() => {
                setDiscardSource(false);
                setSourceForm(false);
                setSourceDraft({
                  name: "",
                  baseUrl: "",
                  adapter: "official-site",
                });
              }}
            >
              Discard changes
            </button>
          </div>
        </Modal>
      )}

      {/* ADD TEAM MEMBER MODAL */}
      {staffModalOpen && (
        <Modal
          title="Add team member"
          className="drawer-dialog"
          onClose={() => setStaffModalOpen(false)}
        >
          <section className="source-dialog">
            <div className="drawer-top">
              <span className="eyebrow">TEAM MANAGEMENT</span>
              <button
                className="icon-button"
                aria-label="Close modal"
                onClick={() => setStaffModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <h2>Add staff member</h2>
            <p>Grant access to the HigherStudy Editorial workspace.</p>
            <form onSubmit={handleAddStaff}>
              <label htmlFor="staff-email">Work email</label>
              <input
                id="staff-email"
                type="email"
                required
                placeholder="colleague@higherstudy.com"
                value={staffDraft.email}
                onChange={(e) =>
                  setStaffDraft({ ...staffDraft, email: e.target.value })
                }
              />
              <label htmlFor="staff-pass">Temporary password</label>
              <input
                id="staff-pass"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={staffDraft.password}
                onChange={(e) =>
                  setStaffDraft({ ...staffDraft, password: e.target.value })
                }
              />
              <label htmlFor="staff-role">Role & Permissions</label>
              <select
                id="staff-role"
                value={staffDraft.role}
                onChange={(e) =>
                  setStaffDraft({
                    ...staffDraft,
                    role: e.target.value as "admin" | "editor",
                  })
                }
              >
                <option value="editor">
                  Editor — Can inspect, review & publish records
                </option>
                <option value="admin">
                  Admin — Full editorial, team & system settings access
                </option>
              </select>
              <button className="button primary wide" disabled={busy}>
                {busy ? "Creating…" : "Create team member"}
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </Modal>
      )}

      {/* CONFIRM DELETE / DEACTIVATE STAFF MODAL */}
      {deleteStaffTarget && (
        <Modal
          title="Remove team member"
          className="confirm-dialog"
          onClose={() => setDeleteStaffTarget(null)}
        >
          <div className="confirm-delete-box">
            <div className="confirm-icon delete-danger">
              <Trash2 size={24} />
            </div>
            <h2>Remove {deleteStaffTarget.email}?</h2>
            <p>
              Are you sure you want to remove this staff member from the
              workspace?
            </p>

            <div className="confirm-item-preview">
              <div className="flex items-center gap-2 mb-1">
                <strong>{deleteStaffTarget.email}</strong>
                <span className={`role-badge ${deleteStaffTarget.role}`}>
                  {pretty(deleteStaffTarget.role)}
                </span>
              </div>
              <small className="opacity-75 font-mono text-xs block">
                ID: {deleteStaffTarget.id}
              </small>
            </div>

            <div className="delete-warning-note">
              <AlertTriangle size={16} className="text-amber-500 flex-none" />
              <span>
                If this user has recorded review decisions or revisions, their
                account will be deactivated and active sessions revoked to
                preserve data integrity and audit logs.
              </span>
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => setDeleteStaffTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button danger"
                disabled={busy}
                onClick={() => void handleDeleteStaff()}
              >
                {busy ? "Removing…" : "Confirm removal"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD COUNTRY DESTINATION MODAL */}
      {countryModalOpen && (
        <Modal
          title="Add country destination"
          className="drawer-dialog"
          onClose={() => setCountryModalOpen(false)}
        >
          <section className="source-dialog">
            <div className="drawer-top">
              <span className="eyebrow">DESTINATIONS CONFIGURATION</span>
              <button
                className="icon-button"
                aria-label="Close modal"
                onClick={() => setCountryModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <h2>Add country destination</h2>
            <p>
              Register an ISO-2 country destination. It will immediately appear
              in all regional filters, dropdowns, and search classifications.
            </p>
            <form onSubmit={handleAddCountry}>
              <label htmlFor="country-code">ISO-2 Country Code</label>
              <input
                id="country-code"
                required
                maxLength={2}
                placeholder="e.g. BD, JP, FR, IT"
                value={countryDraft.code}
                onChange={(e) =>
                  setCountryDraft({
                    ...countryDraft,
                    code: e.target.value.toUpperCase(),
                  })
                }
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                }}
              />
              <label htmlFor="country-name">Country Name</label>
              <input
                id="country-name"
                required
                placeholder="e.g. Bangladesh, Japan, France"
                value={countryDraft.name}
                onChange={(e) =>
                  setCountryDraft({ ...countryDraft, name: e.target.value })
                }
              />
              <label htmlFor="country-region">Geographic Region</label>
              <select
                id="country-region"
                value={countryDraft.region}
                onChange={(e) =>
                  setCountryDraft({ ...countryDraft, region: e.target.value })
                }
              >
                {Object.entries(REGIONS).map(([key, reg]) => (
                  <option key={key} value={key}>
                    {reg.label}
                  </option>
                ))}
              </select>
              <button className="button primary wide" disabled={busy}>
                {busy ? "Saving…" : "Save destination"}
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </Modal>
      )}

      {/* CONFIRM DELETE COUNTRY MODAL */}
      {deleteCountryTarget && (
        <Modal
          title="Remove country destination"
          className="confirm-dialog"
          onClose={() => setDeleteCountryTarget(null)}
        >
          <div className="confirm-delete-box">
            <div className="confirm-icon delete-danger">
              <Trash2 size={24} />
            </div>
            <h2>Remove {deleteCountryTarget.name}?</h2>
            <p>
              Remove this country from system destination dropdowns and regional
              groupings.
            </p>

            <div className="confirm-item-preview">
              <div className="flex items-center gap-2 mb-1">
                <strong>{deleteCountryTarget.name}</strong>
                <span className="country-flag-code">
                  {deleteCountryTarget.code}
                </span>
              </div>
              <small className="opacity-75 font-mono text-xs block">
                Region:{" "}
                {REGIONS[deleteCountryTarget.region]?.label ||
                  deleteCountryTarget.region}
              </small>
            </div>

            <div className="delete-warning-note">
              <AlertTriangle size={16} className="text-amber-500 flex-none" />
              <span>
                Existing catalogue records with country code &quot;
                {deleteCountryTarget.code}&quot; will keep their code, but the
                destination will no longer appear in regional filter groupings.
              </span>
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="button secondary"
                disabled={busy}
                onClick={() => setDeleteCountryTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button danger"
                disabled={busy}
                onClick={() => void handleDeleteCountry()}
              >
                {busy ? "Removing…" : "Remove country"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  count,
  detail,
  tone,
}: {
  icon: typeof Building2;
  label: string;
  count: number;
  detail: string;
  tone: string;
}) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <i className={tone}>
          <Icon size={19} />
        </i>
      </div>
      <strong>{count.toLocaleString()}</strong>
      <small>{detail}</small>
    </div>
  );
}

function CatalogueCard({
  item,
  kind,
  onInspect,
}: {
  item: CatalogueItem;
  kind: "institutions" | "programmes" | "faculty";
  onInspect: () => void;
}) {
  const institution =
    kind === "institutions"
      ? titleOf(item)
      : (item.institution_name?.trim() || "Institution not reported");
  const siteUrl =
    kind === "institutions" ? item.official_url : item.institution_official_url;
  const favicon = (() => {
    try {
      return siteUrl
        ? `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=128`
        : null;
    } catch {
      return null;
    }
  })();
  const scholar = scholarLink(item.name ?? "", institution, item.research_metadata?.scholarProfileUrl);
  const sourceDetails = item.source_details;
  const sourceIntakes = sourceDetails?.intakes ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const sourceDeadline = sourceIntakes.map(intake => intake.deadlineOn).filter((date): date is string => Boolean(date && date >= today)).sort()[0];
  const deadline = item.next_deadline ?? item.deadline_on ?? sourceDeadline;

  // Requirement parsing for programmes
  let ieltsReq: string | null = null;
  let toeflReq: string | null = null;
  let greReq: boolean | null = null;
  const otherReqs: string[] = [];

  if (Array.isArray(item.requirements) && item.requirements.length > 0) {
    for (const req of item.requirements) {
      const type = (req.type || "").toLowerCase();
      if (type.includes("ielts")) {
        ieltsReq = `IELTS ${req.value_text || req.value_number || "Not reported"} Min`;
      } else if (type.includes("toefl")) {
        toeflReq = `TOEFL ${req.value_text || req.value_number || "Not reported"} Min`;
      } else if (type.includes("gre")) {
        greReq = req.state === "required";
      } else if (type.includes("gpa")) {
        otherReqs.push(`GPA ${req.value_text || req.value_number || "Not reported"}`);
      } else if (req.value_text) {
        otherReqs.push(req.value_text);
      }
    }
  }

  const tuitionFees = [...new Set((item.tuition ?? []).flatMap(fee => {
    if (fee.amount === null || fee.amount === "" || !fee.currency || !Number.isFinite(Number(fee.amount)) || Number(fee.amount) < 0) return [];
    return [`${Number(fee.amount).toLocaleString("en-US")} ${fee.currency}${fee.unit ? ` / ${fee.unit}` : ""}`];
  }))];

  // Funding details
  let fundingBadge: string | null = null;
  if (item.funding && item.funding.length > 0) {
    fundingBadge = item.funding[0].title;
    if (item.funding[0].coverage) {
      fundingBadge += ` (${pretty(item.funding[0].coverage)})`;
    }
  }

  const applicationIntake = item.intakes?.find(
    (intake) => intake.application_url,
  );
  const universityWebsiteUrl = (() => {
    if (!item.institution_official_url) return null;
    try { const url = new URL(item.institution_official_url); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
  })();
  const directProgrammeUrl = [applicationIntake?.application_url, item.official_url].find(value => {
    if (!value) return false;
    try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !/(^|\.)(prtl\.co|mastersportal\.com|phdportal\.com|studyportals\.com)$/.test(url.hostname); } catch { return false; }
  });
  const applyUrl = kind === "programmes" ? directProgrammeUrl : applicationIntake?.application_url || item.official_url || item.discovery_url;

  return (
    <article className={`catalogue-card ${kind}`}>
      {kind === "programmes" ? (
        <>
          <div className="prog-card-header">
            <div className="inst-logo" aria-hidden="true">
              {favicon ? (
                <Image
                  src={favicon}
                  alt=""
                  width={22}
                  height={22}
                  unoptimized
                />
              ) : (
                institution.slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="inst-info">
              <p className="inst-name" title={institution}>{institution}</p>
              <h3 className="prog-title" title={titleOf(item)}>
                {titleOf(item)}
              </h3>
            </div>
            <div className="prog-card-controls">
              <span
                className={`pill ${item.application_status === "open" ? "good" : ""}`}
              >
                {item.application_status
                  ? pretty(item.application_status)
                  : "Published"}
              </span>
              <button
                className="action-btn view"
                title={`Inspect ${titleOf(item)}`}
                onClick={onInspect}
              >
                <Eye size={14} />
              </button>
            </div>
          </div>

          <div className="prog-chips-area">
            <div className="programme-compact-top">
              <span className="programme-compact-tuition">
                <strong>{tuitionFees.length ? tuitionFees.join(" · ") : "Tuition not collected"}</strong>
              </span>
              <span className="color-badge degree">
                <GraduationCap size={12} />
                <span>
                  {item.degree === "masters"
                    ? "Master’s"
                    : item.degree?.toUpperCase() || "Graduate"}
                </span>
              </span>
            </div>

            <div className="programme-source-facts compact-facts">
              {sourceDetails?.duration && (
                <div>
                  <small>Duration</small>
                  <strong>{sourceDetails.duration.amount} {sourceDetails.duration.unit}</strong>
                </div>
              )}
              <div>
                <small>Campus</small>
                <strong>{[item.city, item.country_code].filter(Boolean).join(", ") || "Not collected"}</strong>
              </div>
              {sourceDetails?.attendance?.length ? (
                <div>
                  <small>Attendance</small>
                  <strong>{sourceDetails.attendance.join(" · ")}</strong>
                </div>
              ) : null}
              <div>
                <small>Deadline</small>
                <strong>{deadline ? `${dateOf(deadline)}${!item.next_deadline && sourceDeadline ? " (source)" : ""}` : "Not collected"}</strong>
              </div>
            </div>

            {/* Concise requirements & funding chips row */}
            <div className="prog-chip-row compact-chips">
              {fundingBadge && (
                <span className="color-badge funding" title={fundingBadge}>
                  <Zap size={11} />
                  <span>{fundingBadge}</span>
                </span>
              )}
              {sourceDetails?.englishRequirements?.map((exam) => (
                <span className="color-badge ielts" key={exam.type}>
                  {exam.type} {exam.score}
                </span>
              ))}
              {ieltsReq && (
                <span className="color-badge ielts">
                  <FileCheck2 size={11} />
                  <span>{ieltsReq}</span>
                </span>
              )}
              {toeflReq && (
                <span className="color-badge toefl">
                  <span>{toeflReq}</span>
                </span>
              )}
              {greReq !== null && (
                <span className={`color-badge ${greReq ? "gre-req" : "gre-waived"}`}>
                  <span>{greReq ? "GRE Required" : "GRE Waived"}</span>
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="catalogue-card-top">
            <div className="institution-mark" aria-hidden="true">
              {favicon ? (
                <Image
                  src={favicon}
                  alt=""
                  width={26}
                  height={26}
                  unoptimized
                />
              ) : (
                institution.slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="catalogue-card-actions">
              <span
                className={`pill ${item.application_status === "open" ? "good" : ""}`}
              >
                {kind === "faculty"
                  ? "Faculty"
                  : item.application_status
                    ? pretty(item.application_status)
                    : "Published"}
              </span>
              <button
                className="action-btn view"
                title={`Inspect ${titleOf(item)}`}
                onClick={onInspect}
              >
                <Eye size={15} />
              </button>
            </div>
          </div>
          <div className="catalogue-card-main">
            <p className="card-institution">{institution}</p>
            <h3>{titleOf(item)}</h3>
            {kind === "faculty" && (
              <p className="card-subtitle">{item.title || "Faculty member"}</p>
            )}
            {kind === "institutions" && (
              <p className="card-subtitle">
                {item.city
                  ? `${item.city}, ${item.country_code ?? ""}`
                  : (item.country_code ?? "Location pending")}
              </p>
            )}
          </div>

          {kind === "faculty" && <FacultyMetrics metadata={item.research_metadata} />}

          <dl className="catalogue-card-meta">
            {kind === "faculty" && <div>
              <dt><Mail size={12} /> Public contact</dt>
              <dd>{item.public_email ? <span className="faculty-contact-value"><a className="faculty-contact-email" href={`mailto:${item.public_email}`}>{item.public_email}</a>{item.public_email_source_url && <a className="faculty-contact-source" href={item.public_email_source_url} target="_blank" rel="noopener noreferrer" title="Official source for this public email">Source <ExternalLink size={10} /></a>}</span> : <span className="faculty-contact-missing" title={item.contact_collection_message ?? undefined}>{item.contact_collection_status === "not_found" ? "No public email found" : item.contact_collection_status === "needs_source" ? "Official source needed" : item.contact_collection_status === "failed" ? "Contact lookup will retry" : "Finding public contact…"}</span>}</dd>
            </div>}
            {kind === "institutions" && (
              <div>
                <dt>
                  <MapPin size={14} /> Location
                </dt>
                <dd>
                  {[item.city, item.country_code].filter(Boolean).join(", ") ||
                    "Not published"}
                </dd>
              </div>
            )}
            {kind === "faculty" && item.research_topics?.length ? (
              <div>
                <dt>Research areas</dt>
                <dd className="card-topics">
                  {item.research_topics.slice(0, 3).map((topic) => (
                    <span className="pill faculty" key={topic}>
                      {topic}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      )}

      <footer className="catalogue-card-footer">
        {kind === "programmes" ? <>
          <button type="button" className="programme-details-button" onClick={onInspect}>View details <ArrowRight size={14} /></button>
          {universityWebsiteUrl && <a href={universityWebsiteUrl} target="_blank" rel="noopener noreferrer" className="programme-university-link">University website <ExternalLink size={12} /></a>}
          {directProgrammeUrl ? (
            <a className="card-apply-btn" href={directProgrammeUrl} target="_blank" rel="noopener noreferrer">
              Programme website <ExternalLink size={13} />
            </a>
          ) : (
            <span className="programme-link-unavailable">Direct link not collected</span>
          )}
        </> : kind === "faculty" ? <>
          <button className="programme-details-button" type="button" onClick={onInspect}>Details <ArrowRight size={12} /></button>
          <div className="faculty-profile-actions">
            {item.official_profile_url && <a href={item.official_profile_url} target="_blank" rel="noopener noreferrer">Profile <ExternalLink size={12} /></a>}
            <a className="faculty-scholar-link" href={scholar.href} target="_blank" rel="noopener noreferrer" title={scholar.confirmed ? `Google Scholar profile for ${item.name}` : `Search Google Scholar authors for ${item.name} at ${institution}`}>{scholar.label} <ExternalLink size={12} /></a>
          </div>
        </> : <>
        <div className="catalogue-provenance">
          <span>Record date {dateOf(item.verified_at)}</span>
          <span
            className={
              item.source_permission_status === "approved"
                ? "source-access-approved"
                : "source-access-pending"
            }
          >
            {item.source_permission_status === "approved"
              ? "Source access approved"
              : "Source access pending review"}
          </span>
          <span title={item.source_name || "Source evidence unavailable"}>
            {item.source_name || "Source evidence unavailable"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {applyUrl && (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-apply-btn !text-white !no-underline"
              title={
                kind === "institutions" ? "University website" : applicationIntake ? "Application portal" : "Programme page"
              }
            >
              <span className="!text-white !font-bold">{kind === "institutions" ? "University website" : applicationIntake ? "Apply" : "Visit programme website"}</span>
              <ExternalLink size={12} className="!text-white shrink-0" />
            </a>
          )}
          {!applyUrl && (item.official_url || item.official_profile_url) && (
            <a
              href={item.official_url || item.official_profile_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official site <ExternalLink size={13} />
            </a>
          )}
          {item.evidence_url && (
            <a
              href={item.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Evidence <ExternalLink size={13} />
            </a>
          )}
        </div>
        </>}
      </footer>
    </article>
  );
}

function Empty({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Building2;
  title: string;
  detail: string;
}) {
  return (
    <div className="empty">
      <div>
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}

function PanelTitle({
  title,
  count,
  subtitle,
}: {
  title: string;
  count: number;
  subtitle: string;
}) {
  return (
    <div className="panel-header table-heading">
      <div>
        <h2>
          {title} <span className="count">{count}</span>
        </h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
