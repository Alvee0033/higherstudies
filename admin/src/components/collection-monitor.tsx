"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, RefreshCw, Square, ExternalLink } from "lucide-react";
import { api, type CollectionJob, type AutopilotStatus } from "@/lib/api";

type Preview = { id: string; record_type: string; source_url: string; payload: Record<string, unknown>; review_state: string };
export function CollectionMonitor({ admin, onWorkerStatus }: { admin: boolean; onWorkerStatus?: (available: boolean) => void }) {
  const loadSequence = useRef(0);
  const [jobs, setJobs] = useState<CollectionJob[]>([]);
  const [selected, setSelected] = useState("");
  const [preview, setPreview] = useState<Preview[]>([]);
  const [error, setError] = useState("");
  const [stopping, setStopping] = useState(false);
  const [observedAt, setObservedAt] = useState(0);
  const [updated, setUpdated] = useState("");
  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    try {
      const [result, worker] = await Promise.all([api<{ data: CollectionJob[] }>("/v1/admin/jobs"),api<{data:AutopilotStatus}>("/v1/admin/jobs/autopilot")]);
      if (sequence !== loadSequence.current) return;
      onWorkerStatus?.(worker.data.collectorWorker.available);
      setJobs(result.data);
      const activeRunningJob = result.data.find(j => j.status === "running") || result.data.find(j => j.status === "queued");
      const id = selected || activeRunningJob?.id || result.data[0]?.id;
      const records = id ? (await api<{ data: Preview[] }>(`/v1/admin/jobs/${id}/preview`)).data : [];
      if (sequence !== loadSequence.current) return;
      setPreview(records);
      setObservedAt(Date.now()); setUpdated(new Date().toLocaleTimeString()); setError("");
    } catch (cause) { if (sequence !== loadSequence.current) return; onWorkerStatus?.(false); setError(cause instanceof Error ? cause.message : "Could not refresh collection"); }
  }, [selected, onWorkerStatus]);
  useEffect(() => { const frame = requestAnimationFrame(() => void load()); const timer = window.setInterval(() => void load(), 3000); return () => { cancelAnimationFrame(frame); window.clearInterval(timer); }; }, [load]);
  const runningJob = jobs.find((item) => item.status === "running") || jobs.find((item) => item.status === "queued");
  const job = jobs.find((item) => item.id === selected) || runningJob || jobs[0];
  const active = job && ["running", "queued"].includes(job.status);
  async function stopAll() {
    setStopping(true);
    try { for (const item of jobs.filter((entry) => ["queued", "running"].includes(entry.status))) await api(`/v1/admin/jobs/${item.id}/cancel`, { method: "POST" }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not stop collection"); }
    finally { setStopping(false); }
  }
  async function stop() {
    if (!job) return;
    setStopping(true);
    try { await api(`/v1/admin/jobs/${job.id}/cancel`, { method: "POST" }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not stop run"); }
    finally { setStopping(false); }
  }
  return <section className="panel collection-monitor">
    <div className="panel-header"><div><h2>Collection activity</h2><p>Live database updates every 3 seconds</p></div><button className="icon-button" onClick={() => void load()} aria-label="Refresh collection activity"><RefreshCw size={16} /></button></div>
    <div className="monitor-body">
      <div className="monitor-all-summary"><span>{jobs.filter((item) => item.status === "running").length} running · {jobs.filter((item) => item.status === "queued").length} queued</span>{admin && jobs.some((item) => ["queued", "running"].includes(item.status)) && <button className="button danger" disabled={stopping} onClick={() => void stopAll()}><Square size={13} />Stop all</button>}</div>
      {error && <p role="alert" className="monitor-error">{error}</p>}
      <div className="monitor-source-runs">{jobs.filter((item) => ["studyportals-search", "openalex-authors", "official-faculty"].includes(item.adapter) && !(item.status === "cancelled" && item.found_count === 0)).filter((item, index, supported) => supported.findIndex((entry) => entry.source_id === item.source_id) === index).slice(0, 4).map((item) => <button key={item.id} className={job?.id === item.id ? "selected" : ""} onClick={() => setSelected(item.id)}><strong>{item.adapter === "openalex-authors" ? "Universities & faculty" : item.adapter === "studyportals-search" ? "Master’s & PhD programmes" : item.source_name}</strong><span>{item.status} · {item.found_count} found</span></button>)}</div>
      <label className="monitor-run-label">Collection run<select value={job?.id || ""} onChange={(event) => setSelected(event.target.value)}><option value="" disabled>Select a run</option>{jobs.map((item) => <option key={item.id} value={item.id}>{item.source_name} · {item.status} · {new Date(item.created_at).toLocaleString()}</option>)}</select></label>
      {job ? <>
        <div className="monitor-status"><span className={`pill ${job.status === "completed" ? "good" : "pending"}`}>{job.status}</span><small>Updated {updated}</small>{active && admin && <button className="button danger" disabled={stopping} onClick={() => void stop()}><Square size={13} />{stopping ? "Stopping…" : "Stop run"}</button>}</div>
        <div className="monitor-stats"><div><strong>{job.found_count}</strong><span>Discovered</span></div><div><strong>{job.accepted_count}</strong><span>Imported / staged</span></div><div><strong>{job.error_count}</strong><span>Errors</span></div></div>
        {active && job.adapter === "openalex-authors" && job.progress?.institutionDiscoveryComplete !== true && <p className="collection-continuous-note">Discovering institutions · {job.progress?.registryPages || 0} registry pages scanned · {job.progress?.registryCandidates || 0} source candidates checked. Published institution count updates after each batch.</p>}
        {active && job.adapter === "openalex-authors" && job.progress?.institutionDiscoveryComplete === true && job.progress?.institutionsTotal && <p className="collection-continuous-note">Faculty institutions processed: {job.progress.institutionIndex || 0} / {job.progress.institutionsTotal}</p>}
        {active && job.adapter === "studyportals-search" && <p className="collection-continuous-note">{job.progress?.degreeIndex === 1 ? "PhD" : "Master’s"} listing page {(job.progress?.page || 0) + 1}</p>}
        {active && <div className="monitor-indeterminate" role="status"><span />{job.status === "queued" ? job.runtime?.phase === "cooldown" ? "Resting until the next permitted request" : "Waiting for the worker" : "Collecting and checking source pages…"}</div>}
        {job.runtime?.message && <div className={`monitor-runtime ${job.runtime.phase || ""}`} role="status"><strong>{job.runtime.phase?.replaceAll("_", " ")}</strong><p>{job.runtime.message}</p>{active && job.runtime.waitUntil && <small>Next request in {Math.max(0, Math.ceil((Date.parse(job.runtime.waitUntil) - observedAt) / 1000))}s · {new Date(job.runtime.waitUntil).toLocaleTimeString()}</small>}</div>}
        {job.last_error && <p className="monitor-error" role="alert">{job.last_error}</p>}
        <div className="monitor-preview-heading"><Eye size={15} /><h3>Collected records</h3><span>Latest 20</span></div>
        {preview.length ? <div className="monitor-preview">{preview.map((record) => <article key={record.id}><div><strong>{String(record.payload.name || record.payload.title || "Collected record")}</strong><small>{record.record_type.replaceAll("_", " ")} · {record.review_state.replaceAll("_", " ")}</small></div><a href={record.source_url} target="_blank" rel="noopener noreferrer" aria-label="Open record source"><ExternalLink size={15} /></a></article>)}</div> : <div className="monitor-empty">{active ? "Records appear after the first extraction batch is saved." : "No staged records for this run."}</div>}
      </> : <div className="monitor-empty">Start a collection run to see its status and collected records here.</div>}
    </div>
  </section>;
}
