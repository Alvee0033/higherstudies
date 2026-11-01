"use client";

import * as React from "react";
import {useApi} from "@/hooks/use-api";
import {api,workspace,exportCsv} from "@/lib/student-api";
import { Search, Download, Plus } from "lucide-react";
import { ApplicationItem, ApplicationStatus } from "./application-types";
import {
  APPLICATION_METRICS_DATA,

} from "./application-data";
import { ApplicationMetrics } from "./application-metrics";
import { ApplicationKanbanBoard } from "./application-kanban-board";
import { ApplicationDetailsModal } from "./application-details-modal";
import { ApplicationFormModal } from "./application-form-modal";

export function ApplicationTrackerView() {
  const result=useApi<{data:ApplicationItem[]}>(`${workspace}/applications`);
  const applications=React.useMemo(()=>result.data?.data??[],[result.data]);
  const [error,setError]=React.useState('');
  const [statusFilter,setStatusFilter]=React.useState('');
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal states
  const [selectedAppForDetails, setSelectedAppForDetails] =
    React.useState<ApplicationItem | null>(null);
  const [editingApp,setEditingApp]=React.useState<ApplicationItem|null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [addInitialStatus, setAddInitialStatus] =
    React.useState<ApplicationStatus>("Preparing");

  // Check URL query parameters for automated verification & navigation
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const hash = window.location.hash;

      const frame = window.requestAnimationFrame(() => {
        if (search.includes("add=true") || hash === "#add") {
          setIsAddOpen(true);
        } else if (search.includes("details=") || hash === "#details") {
          const mitApp =
            applications.find((a) => a.id === new URLSearchParams(search).get("details")) || applications[0];
          setSelectedAppForDetails(mitApp??null);
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [applications]);

  const filteredApplications = React.useMemo(() => {
    const visible=statusFilter?applications.filter(app=>app.status===statusFilter):applications;
    if (!searchQuery.trim()) return visible;
    const q = searchQuery.toLowerCase();
    return visible.filter(
      (app) =>
        app.universityName.toLowerCase().includes(q) ||
        app.program.toLowerCase().includes(q) ||
        app.country.toLowerCase().includes(q) ||
        app.status.toLowerCase().includes(q)
    );
  }, [applications, searchQuery,statusFilter]);

  const dynamicMetrics = React.useMemo(() => {
    const total = applications.length || 1;
    const countStatus = (s: ApplicationStatus) =>
      applications.filter((a) => a.status === s).length;

    return APPLICATION_METRICS_DATA.map((m) => {
      const count = countStatus(m.type);
      const percentage = Math.round((count / total) * 100);
      return {
        ...m,
        count,
        percentage: `${percentage}%`,
      };
    });
  }, [applications]);

  const handleStatusChange = async (appId:string,newStatus:ApplicationStatus) => {
    setError('');try{await api(`${workspace}/applications/${appId}`,{method:'PATCH',body:JSON.stringify({data:{status:newStatus}})});result.reload();}catch(e){setError(e instanceof Error?e.message:'Unable to update');}
  };

  const handleOpenAdd = (status?: ApplicationStatus) => {
    if (status) setAddInitialStatus(status);
    setIsAddOpen(true);
  };

  const handleAddApplication = async (newApp:ApplicationItem) => {
    const payload={...newApp};delete (payload as Partial<ApplicationItem>).id;
    await api(`${workspace}/applications${editingApp?`/${editingApp.id}`:""}`,{method:editingApp?"PATCH":"POST",body:JSON.stringify({data:payload})});setEditingApp(null);result.reload();
  };

  return (
    <div className="w-full space-y-7 text-left">
      {(error||result.error)&&<p role="alert" className="text-sm text-rose-600">{error||result.error}</p>}
      {result.loading&&<p role="status">Loading applications…</p>}
      {/* 1. Header & Action Row matching Figma Screen 09 */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage your university applications in one place.
          </p>
        </div>

        {/* Right Search & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9.5 pr-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs"
            />
          </div>

          <select aria-label="Application status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs"><option value="">All statuses</option>{APPLICATION_METRICS_DATA.map(row=><option key={row.type}>{row.type}</option>)}</select>

          {/* Export Button */}
          <button
            onClick={()=>exportCsv("applications.csv",filteredApplications.map(row=>({...row,checklist:undefined})))}
            type="button"
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* + Add Application Primary Button */}
          <button
            type="button"
            onClick={() => handleOpenAdd("Preparing")}
            className="h-10 px-5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* 2. Top 8 Metrics Row matching Figma (dynamic live counts) */}
      <ApplicationMetrics metrics={dynamicMetrics} />

      {/* 3. 4-Column Kanban Board with Drag & Drop + Mobile Stage Navigation */}
      <ApplicationKanbanBoard
        applications={filteredApplications}
        onViewDetails={(app) => setSelectedAppForDetails(app)}
        onAddApplication={(status) => handleOpenAdd(status)}
        onStatusChange={handleStatusChange}
      />

      {/* 4. Details Modal matching Figma Screen 10 (Overview) */}
      {selectedAppForDetails && (
        <ApplicationDetailsModal
          application={selectedAppForDetails}
          onClose={() => setSelectedAppForDetails(null)}
          onEdit={(app) => {
            setSelectedAppForDetails(null);
            setEditingApp(app);handleOpenAdd(app.status);
          }}
        />
      )}

      {/* 5. Add Application Modal matching Figma Screen 11 */}
      {isAddOpen && (
        <ApplicationFormModal
          initialApplication={editingApp??undefined}
          initialStatus={addInitialStatus}
          onClose={() => {setIsAddOpen(false);setEditingApp(null);}}
          onAdd={handleAddApplication}
        />
      )}
    </div>
  );
}
