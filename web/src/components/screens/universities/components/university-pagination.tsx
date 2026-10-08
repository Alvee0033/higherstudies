import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface UniversityPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export function UniversityPagination({
  currentPage,
  totalPages = 12,
  onPageChange,
}: UniversityPaginationProps) {
  return (
    <div className="flex items-center justify-between pt-3">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer disabled:opacity-50"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1 text-xs">
        {[1, 2, 3, 4, 5].map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium cursor-pointer transition-colors ${
              pageNum > 2 ? "hidden sm:flex" : "flex"
            } ${
              currentPage === pageNum
                ? "bg-[#5D3FD3] text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {pageNum}
          </button>
        ))}
        <span className="hidden sm:inline px-1 text-slate-400">...</span>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={`hidden sm:flex w-8 h-8 rounded-lg items-center justify-center font-medium cursor-pointer ${
            currentPage === totalPages
              ? "bg-[#5D3FD3] text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {totalPages}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
      >
        <span>Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
