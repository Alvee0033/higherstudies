"use client";

import * as React from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { EmailRecord, EmailStatus } from "./email-tracker-types";
import {
  EMAIL_METRICS_DATA,
  INITIAL_EMAIL_RECORDS,
} from "./email-tracker-data";
import { EmailTrackerMetrics } from "./email-tracker-metrics";
import { EmailTrackerTable } from "./email-tracker-table";
import { EmailTrackerDetailView } from "./email-tracker-detail-view";
import { EmailAddModal } from "./email-add-modal";

export function EmailTrackerView() {
  const [emails, setEmails] = React.useState<EmailRecord[]>(INITIAL_EMAIL_RECORDS);
  const [selectedRecord, setSelectedRecord] = React.useState<EmailRecord>(
    INITIAL_EMAIL_RECORDS[0]
  );
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.location.search.includes("add=true") ||
        window.location.hash === "#add"
      ) {
        setIsAddOpen(true);
      }
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

      return matchesSearch && matchesStatus && matchesUniversity;
    });
  }, [emails, searchQuery, statusFilter, universityFilter]);

  const handleAddProfessor = (newRecord: EmailRecord) => {
    setEmails((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
  };

  return (
    <div className="w-full space-y-7">
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
              className="w-full h-10 pl-9.5 pr-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-2xs cursor-pointer"
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
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-2xs cursor-pointer"
            >
              <option>All Universities</option>
              <option>Stanford</option>
              <option>Massachusetts</option>
              <option>Toronto</option>
              <option>UC</option>
              <option>ETH</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Time Filter Dropdown */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-2xs cursor-pointer"
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
            className="h-10 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Professor</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="h-10 px-4 rounded-xl bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50/50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Export</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#4F46E5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Six Metrics Cards */}
      <EmailTrackerMetrics metrics={EMAIL_METRICS_DATA} />

      {/* 4. Full-Width Professor Mailing Tracker Table */}
      <EmailTrackerTable
        records={filteredRecords}
        selectedId={selectedRecord.id}
        onSelect={(rec) => setSelectedRecord(rec)}
      />

      {/* 5. Detailed View (for selected professor) */}
      <EmailTrackerDetailView record={selectedRecord} />

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
