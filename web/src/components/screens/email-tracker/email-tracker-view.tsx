"use client";

import * as React from "react";
import {useApi} from "@/hooks/use-api";
import {api,exportCsv} from "@/lib/student-api";
import {emailRecord,emailPayload,type TrackedEmail} from "@/lib/email-tracker";
import { Search, Plus, ChevronDown } from "lucide-react";
import { EmailRecord } from "./email-tracker-types";
import {
  EMAIL_METRICS_DATA,

} from "./email-tracker-data";
import { EmailTrackerMetrics } from "./email-tracker-metrics";
import { EmailTrackerTable } from "./email-tracker-table";
import { EmailTrackerDetailView } from "./email-tracker-detail-view";
import { EmailAddModal } from "./email-add-modal";

export function EmailTrackerView() {
  const [now]=React.useState(()=>Date.now());
  const result=useApi<{data:TrackedEmail[];pagination:{total:number}}>('/v1/student/email-tracker?limit=100');
  const emails=React.useMemo(()=>(result.data?.data??[]).map(emailRecord),[result.data]);
  const [selectedId,setSelectedId]=React.useState('');
  const selectedRecord=emails.find(row=>row.id===selectedId)??emails[0];
  const [error,setError]=React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const frame = window.requestAnimationFrame(() => {
        if (
          window.location.search.includes("add=true") ||
          window.location.hash === "#add"
        ) {
          setIsAddOpen(true);
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All Status");
  const [universityFilter, setUniversityFilter] = React.useState<string>("All Universities");
  const [timeFilter, setTimeFilter] = React.useState<string>("All Time");

  const filteredRecords = React.useMemo(() => {
    return emails.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.professorName.toLowerCase().includes(q) ||
        item.universityName.toLowerCase().includes(q) ||
        item.universitySub.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchesUniversity =
        universityFilter === "All Universities" ||
        item.universityName.toLowerCase().includes(universityFilter.toLowerCase());

      const days=timeFilter.includes("Week")?7:timeFilter.includes("Month")?30:Infinity;
      const matchesTime=days===Infinity||!!item.sentDate&&Date.parse(item.sentDate)>=now-days*86400000;
      return matchesSearch && matchesStatus && matchesUniversity && matchesTime;
    });
  }, [emails, searchQuery, statusFilter, universityFilter,timeFilter,now]);

  const handleAddProfessor = async (newRecord:EmailRecord) => {
    const response=await api<{data:TrackedEmail}>('/v1/student/email-tracker',{method:'POST',body:JSON.stringify(emailPayload(newRecord))});
    setSelectedId(response.data.id);result.reload();
  };
  const update=async(data:Record<string,unknown>)=>{if(!selectedRecord)return;setError('');try{await api(`/v1/student/email-tracker/${selectedRecord.id}`,{method:'PATCH',body:JSON.stringify(data)});result.reload();}catch(e){setError(e instanceof Error?e.message:'Unable to update');}};
  const metrics=EMAIL_METRICS_DATA.map(item=>({...item,count:item.type==='professors'?result.data?.pagination.total??0:item.type==='sent'?emails.filter(row=>row.sentDate).length:item.type==='replies'?emails.filter(row=>['Positive Reply','Negative Reply','Interview'].includes(row.status)).length:item.type==='reminders'?emails.filter(row=>row.reminderDate).length:item.type==='interviews'?emails.filter(row=>row.status==='Interview').length:0,subtitle:'Your saved records'}));

  return (
    <div className="w-full space-y-7">
      {(error||result.error)&&<p role="alert" className="text-sm text-rose-600">{error||result.error}</p>}
      {result.loading&&<p role="status">Loading email tracker…</p>}
      {/* 1. Page Header matching Screen 12 */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          Professor Mailing Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track your emails, reminders, and responses in one place
        </p>
      </div>

      {/* 2. Top Search, Filters & Actions Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search professors, university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9.5 pr-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs cursor-pointer"
            >
              <option>All Status</option>
              <option>Positive Reply</option>
              <option>Interview</option>
              <option>No Response</option>
              <option>Reminder Due</option>
              <option>Not Sent</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* University Dropdown */}
          <div className="relative">
            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs cursor-pointer"
            >
              <option>All Universities</option>
              {Array.from(new Set(emails.map(row=>row.universityName))).map(name=><option key={name}>{name}</option>)}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Time Filter Dropdown */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#1476F2] shadow-2xs cursor-pointer"
            >
              <option>All Time</option>
              <option>Past 7 days</option>
              <option>This month</option>
              <option>Past 3 months</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Professor</span>
          </button>

          <div className="relative">
            <button
              onClick={()=>exportCsv("email-tracker.csv",filteredRecords.map(row=>({...row,lastUpdated:undefined})))}
              type="button"
              className="h-10 px-4 rounded-xl bg-white border border-[#1476F2] text-[#1476F2] hover:bg-indigo-50/50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Export</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#1476F2]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Six Metrics Cards */}
      <EmailTrackerMetrics metrics={metrics} />

      {/* 4. Full-Width Professor Mailing Tracker Table */}
      <EmailTrackerTable
        records={filteredRecords}
        selectedId={selectedRecord?.id??""}
        onSelect={(rec) => setSelectedId(rec.id)}
      />

      {/* 5. Detailed View (for selected professor) */}
      {selectedRecord?<EmailTrackerDetailView key={selectedRecord.id} record={selectedRecord} onUpdate={update}/>:<p className="p-6 bg-white border border-slate-200 rounded-2xl text-sm text-slate-500">No tracked emails yet. Add a professor to begin recording outreach.</p>}

      {/* 6. Add New Professor Modal matching Screen 13 */}
      {isAddOpen && (
        <EmailAddModal
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddProfessor}
        />
      )}
    </div>
  );
}
