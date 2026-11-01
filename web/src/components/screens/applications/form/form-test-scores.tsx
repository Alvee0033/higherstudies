"use client";

import * as React from "react";

export function FormTestScores({initial={},onChange}:{initial?:Record<string,string>;onChange?:(key:string,value:string)=>void}) {
  const [greScore, setGreScore] = React.useState(initial.greScore??"");
  const [greSubmitted, setGreSubmitted] = React.useState<"No" | "Yes">(initial.greSubmitted==="Yes"?"Yes":"No");

  const [ieltsScore, setIeltsScore] = React.useState(initial.ieltsScore??"");
  const [ieltsSubmitted, setIeltsSubmitted] = React.useState<"No" | "Yes">(initial.ieltsSubmitted==="Yes"?"Yes":"No");

  const [toeflScore, setToeflScore] = React.useState(initial.toeflScore??"");
  const [toeflSubmitted, setToeflSubmitted] = React.useState<"No" | "Yes">(initial.toeflSubmitted==="Yes"?"Yes":"No");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
      <div className="text-[#1476F2] font-bold text-sm">
        <span>5. Test Scores</span>
      </div>

      <div className="space-y-4">
        {/* Row 1: GRE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              GRE Score <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={greScore}
              onChange={(e) => {setGreScore(e.target.value);onChange?.("greScore",e.target.value);}}
              placeholder="e.g., 320"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              GRE Submitted
            </label>
            <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50/80">
              <button
                type="button"
                onClick={() => {setGreSubmitted("No");onChange?.("greSubmitted","No");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  greSubmitted === "No"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    greSubmitted === "No" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {greSubmitted === "No" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>No</span>
              </button>

              <button
                type="button"
                onClick={() => {setGreSubmitted("Yes");onChange?.("greSubmitted","Yes");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  greSubmitted === "Yes"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    greSubmitted === "Yes" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {greSubmitted === "Yes" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>Yes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: IELTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              IELTS Score <span className="text-slate-400 font-normal">(Overall)</span>
            </label>
            <input
              type="text"
              value={ieltsScore}
              onChange={(e) => {setIeltsScore(e.target.value);onChange?.("ieltsScore",e.target.value);}}
              placeholder="e.g., 7.5"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              IELTS Submitted
            </label>
            <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50/80">
              <button
                type="button"
                onClick={() => {setIeltsSubmitted("No");onChange?.("ieltsSubmitted","No");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  ieltsSubmitted === "No"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    ieltsSubmitted === "No" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {ieltsSubmitted === "No" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>No</span>
              </button>

              <button
                type="button"
                onClick={() => {setIeltsSubmitted("Yes");onChange?.("ieltsSubmitted","Yes");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  ieltsSubmitted === "Yes"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    ieltsSubmitted === "Yes" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {ieltsSubmitted === "Yes" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>Yes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: TOEFL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              TOEFL Score <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={toeflScore}
              onChange={(e) => {setToeflScore(e.target.value);onChange?.("toeflScore",e.target.value);}}
              placeholder="e.g., 100"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              TOEFL Submitted
            </label>
            <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50/80">
              <button
                type="button"
                onClick={() => {setToeflSubmitted("No");onChange?.("toeflSubmitted","No");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  toeflSubmitted === "No"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    toeflSubmitted === "No" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {toeflSubmitted === "No" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>No</span>
              </button>

              <button
                type="button"
                onClick={() => {setToeflSubmitted("Yes");onChange?.("toeflSubmitted","Yes");}}
                className={`rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  toeflSubmitted === "Yes"
                    ? "bg-[#EAF5FF] text-[#1476F2] font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    toeflSubmitted === "Yes" ? "border-[#1476F2]" : "border-slate-300"
                  }`}
                >
                  {toeflSubmitted === "Yes" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1476F2]" />
                  )}
                </span>
                <span>Yes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
