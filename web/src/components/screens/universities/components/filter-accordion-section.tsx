import * as React from "react";
import { ChevronDown } from "lucide-react";

export interface FilterAccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function FilterAccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: FilterAccordionSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-left">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-sm font-bold text-slate-900 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pt-3 text-xs text-slate-500 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
