"use client";

import * as React from "react";
import { Plus, GripVertical, ChevronRight, Layers, ArrowRightLeft } from "lucide-react";
import { ApplicationItem, ApplicationStatus } from "./application-types";

interface ApplicationKanbanBoardProps {
  applications: ApplicationItem[];
  onViewDetails: (app: ApplicationItem) => void;
  onAddApplication: (status?: ApplicationStatus) => void;
  onStatusChange?: (appId: string, newStatus: ApplicationStatus) => void;
}

interface ColumnConfig {
  status: ApplicationStatus;
  title: string;
  dotColor: string;
}

const COLUMNS: ColumnConfig[] = [
  { status: "Not Started", title: "Not Started", dotColor: "bg-slate-400" },
  { status: "Preparing", title: "Preparing", dotColor: "bg-[#3B82F6]" },
  { status: "Submitted", title: "Submitted", dotColor: "bg-[#8B5CF6]" },
  { status: "Interview", title: "Interview", dotColor: "bg-[#F97316]" },
];

export function ApplicationKanbanBoard({
  applications,
  onViewDetails,
  onAddApplication,
  onStatusChange,
}: ApplicationKanbanBoardProps) {
  // Drag and drop state
  const [draggedAppId, setDraggedAppId] = React.useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<ApplicationStatus | null>(null);

  // Mobile column switcher state
  const [mobileActiveTab, setMobileActiveTab] = React.useState<ApplicationStatus | "all">("Preparing");

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("text/plain", appId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedAppId(appId);
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: ApplicationStatus) => {
    // Only clear if leaving to another element outside this column container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("text/plain") || draggedAppId;
    if (appId && onStatusChange) {
      onStatusChange(appId, targetStatus);
    }
    setDraggedAppId(null);
    setDragOverColumn(null);
  };

  const renderStatusPill = (status: ApplicationStatus) => {
    switch (status) {
      case "Not Started":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            Not Started
          </span>
        );
      case "Preparing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF6FF] text-[#3B82F6]">
            Preparing
          </span>
        );
      case "Submitted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F3FF] text-[#7C3AED]">
            Submitted
          </span>
        );
      case "Interview":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF7ED] text-[#C2410C]">
            Interview
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 📱 Mobile Column Switcher (Visible on small screens < xl) */}
      <div className="xl:hidden flex flex-col gap-2 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-[#4F46E5]" />
            <span>Kanban Stage View</span>
          </div>
          <span className="text-[11px] text-slate-400">Tap tab or swipe</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {COLUMNS.map((col) => {
            const count = applications.filter((a) => a.status === col.status).length;
            const isTabActive = mobileActiveTab === col.status;

            return (
              <button
                key={col.status}
                type="button"
                onClick={() => setMobileActiveTab(col.status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isTabActive
                    ? "bg-[#4F46E5] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isTabActive ? "bg-white" : col.dotColor
                  }`}
                />
                <span>{col.title}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isTabActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMobileActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              mobileActiveTab === "all"
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            All Columns ({applications.length})
          </button>
        </div>
      </div>

      {/* 🚀 Main Kanban Grid (Responsive: 1 col on mobile if filtered, 4 cols on xl) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start text-left">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((app) => app.status === col.status);
          const isOverThisColumn = dragOverColumn === col.status;

          // Mobile filtering: hide column if mobile view is set to a single column and not this one
          const isHiddenOnMobile =
            mobileActiveTab !== "all" && mobileActiveTab !== col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={(e) => handleDragLeave(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`space-y-4 rounded-2xl transition-all duration-200 p-1 ${
                isHiddenOnMobile ? "hidden xl:block" : "block"
              } ${
                isOverThisColumn
                  ? "bg-indigo-50/50 ring-2 ring-indigo-400 ring-dashed"
                  : ""
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="text-sm font-bold text-slate-800">
                    {col.title}{" "}
                    <span className="text-slate-400 font-normal">
                      ({colApps.length})
                    </span>
                  </h3>
                </div>

                {isOverThisColumn && (
                  <span className="text-[11px] font-semibold text-[#4F46E5] animate-pulse">
                    Drop here
                  </span>
                )}
              </div>

              {/* Applications List & Drop Zone */}
              <div className="space-y-3.5 min-h-[120px]">
                {colApps.map((app) => {
                  const isFocused = app.isActiveFocus;
                  const isBeingDragged = draggedAppId === app.id;

                  return (
                    <div
                      key={app.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-2xl p-4 text-left transition-all group relative cursor-grab active:cursor-grabbing ${
                        isBeingDragged
                          ? "opacity-40 scale-95 border-dashed border-2 border-indigo-400"
                          : isFocused
                          ? "border-2 border-[#3B82F6] shadow-sm"
                          : "border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300"
                      }`}
                    >
                      {/* Top Header: Title + Drag Handle */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {app.universityName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {app.program}
                          </p>
                        </div>

                        <div
                          className="text-slate-300 group-hover:text-slate-500 transition-colors p-0.5 shrink-0"
                          title="Drag to move status"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Metadata Rows */}
                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        {app.submittedDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Submitted:</span>
                            <span className="font-medium text-slate-700">
                              {app.submittedDate}
                            </span>
                          </div>
                        )}

                        {app.interviewDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Interview Date:</span>
                            <span className="font-medium text-slate-700">
                              {app.interviewDate}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Intake:</span>
                          <span className="font-medium text-slate-700">
                            {app.intake}
                          </span>
                        </div>

                        {app.deadline && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Deadline:</span>
                            <span className="font-medium text-slate-700">
                              {app.deadline}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Country:</span>
                          <span className="font-medium text-slate-700">
                            {app.country}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 gap-2">
                        {/* Status Pill with Quick Mobile/Click Changer */}
                        <div className="relative group/status">
                          <div className="cursor-pointer flex items-center gap-1">
                            {renderStatusPill(app.status)}
                          </div>
                          {/* Quick stage selector dropdown on click/hover for touchscreen accessibility */}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              onStatusChange?.(app.id, e.target.value as ApplicationStatus)
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            title="Move to another stage"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.status} value={c.status}>
                                Move to {c.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => onViewDetails(app)}
                          className="px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Drop Zone Placeholder if no cards */}
                {colApps.length === 0 && (
                  <div
                    className={`py-8 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400 ${
                      isOverThisColumn ? "bg-indigo-50 border-[#4F46E5]" : ""
                    }`}
                  >
                    <span>Drop applications here</span>
                  </div>
                )}

                {/* + Add Application button at the bottom of the column */}
                <button
                  type="button"
                  onClick={() => onAddApplication(col.status)}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200/90 hover:border-slate-300 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white/40 hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Application</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
