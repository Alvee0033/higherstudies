"use client";

import * as React from "react";
import { Info, ChevronDown } from "lucide-react";

interface FormAdditionalInfoProps {
  feeStatus: string;
  setFeeStatus: (val: string) => void;
  feeAmount: string;
  setFeeAmount: (val: string) => void;
  appMethod: string;
  setAppMethod: (val: string) => void;
  trackingId: string;
  setTrackingId: (val: string) => void;
}

export function FormAdditionalInfo({
  feeStatus,
  setFeeStatus,
  feeAmount,
  setFeeAmount,
  appMethod,
  setAppMethod,
  trackingId,
  setTrackingId,
}: FormAdditionalInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left max-w-[640px] mx-auto w-full">
      <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
        <Info className="h-4 w-4" />
        <span>6. Additional Information</span>
      </div>

      {/* Row 1: Fee Status & Fee Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Application Fee Status
          </label>
          <div className="relative">
            <select
              value={feeStatus}
              onChange={(e) => setFeeStatus(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Waived">Waived</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Fee Amount <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            placeholder="e.g., 100"
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      {/* Row 2: Application Method & Tracking ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Application Method
          </label>
          <div className="relative">
            <select
              value={appMethod}
              onChange={(e) => setAppMethod(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select method</option>
              <option value="Online Portal">University Online Portal</option>
              <option value="Common App">Common Application</option>
              <option value="Email / Direct">Email / Direct Submission</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Tracking ID / Reference <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID or reference"
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>
      </div>
    </div>
  );
}
