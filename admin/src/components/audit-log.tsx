"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { api, type AuditEvent } from "@/lib/api";

type AuditPage = { data: AuditEvent[]; page: { limit: number; offset: number } };

export function AuditLogView() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 50;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api<AuditPage>(`/v1/admin/audit-events?limit=${pageSize}&offset=${offset}`);
      setEvents(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load audit events.");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { void load(); });
    return () => cancelAnimationFrame(frame);
  }, [load]);

  return (
    <section className="panel audit-log-panel" aria-labelledby="audit-log-title">
      <div className="panel-header">
        <div>
          <h2 id="audit-log-title">Audit log</h2>
          <p>Recent staff and system actions, newest first.</p>
        </div>
        <button className="button secondary" onClick={() => void load()} disabled={loading}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && <p className="audit-log-error" role="alert">{error}</p>}
      {loading && <p className="audit-log-state" role="status">Loading audit events…</p>}
      {!loading && !error && events.length === 0 && (
        <p className="audit-log-state">No audit events have been recorded yet.</p>
      )}
      {!loading && events.length > 0 && (
        <>
          <div className="audit-log-table-wrap">
            <table className="audit-log-table">
              <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Record</th><th>Details</th></tr></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time></td>
                    <td>{event.actor_email || "System"}</td>
                    <td>{event.action.replaceAll("_", " ")}</td>
                    <td>{event.entity_type}{event.entity_id ? ` · ${event.entity_id.slice(0, 8)}` : ""}</td>
                    <td>
                      {event.metadata && Object.keys(event.metadata).length > 0
                        ? <details><summary>View</summary><pre>{JSON.stringify(event.metadata, null, 2)}</pre></details>
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="audit-log-pagination">
            <span>Showing {offset + 1}–{offset + events.length}</span>
            <div>
              <button className="button secondary" disabled={loading || offset === 0} onClick={() => setOffset(Math.max(0, offset - pageSize))}>Previous</button>
              <button className="button secondary" disabled={loading || events.length < pageSize} onClick={() => setOffset(offset + pageSize)}>Next</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
