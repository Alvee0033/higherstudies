import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProfessorPaginationProps {
  currentPage: number;
  totalCount?: string;
  onPageChange: (page: number) => void;
}

export function ProfessorPagination({
  currentPage,
  totalCount = "1,247",
  onPageChange,
}: ProfessorPaginationProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs text-slate-500">
        Showing 1 to 10 of {totalCount} professors
      </p>

      <div className="flex items-center gap-1.5 text-xs">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(1)}
          className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
            currentPage === 1 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onPageChange(2)}
          className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
            currentPage === 2 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onPageChange(3)}
          className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
            currentPage === 3 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          3
        </button>
        <span className="px-1 text-slate-400">...</span>
        <button
          type="button"
          onClick={() => onPageChange(125)}
          className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center cursor-pointer ${
            currentPage === 125 ? "bg-[#5D3FD3] text-white" : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          125
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
