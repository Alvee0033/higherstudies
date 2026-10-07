"use client";

import * as React from "react";
import { Landmark, Calendar, ChevronDown } from "lucide-react";

interface FormUniversityDetailsProps {
  university: string;
  setUniversity: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  program: string;
  setProgram: (val: string) => void;
  degreeLevel: string;
  setDegreeLevel: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  programType: string;
  setProgramType: (val: string) => void;
  intake: string;
  setIntake: (val: string) => void;
  round: string;
  setRound: (val: string) => void;
}

export function FormUniversityDetails({
  university,
  setUniversity,
  country,
  setCountry,
  program,
  setProgram,
  degreeLevel,
  setDegreeLevel,
  department,
  setDepartment,
  programType,
  setProgramType,
  intake,
  setIntake,
  round,
  setRound,
}: FormUniversityDetailsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
        <Landmark className="h-4 w-4" />
        <span>1. University &amp; Program Details</span>
      </div>

      {/* Row 1: University Name & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            University Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Search and select university</option>
              <option value="Harvard University">Harvard University</option>
              <option value="MIT">Massachusetts Institute of Technology (MIT)</option>
              <option value="Stanford University">Stanford University</option>
              <option value="University of Oxford">University of Oxford</option>
              <option value="University of Toronto">University of Toronto</option>
              <option value="ETH Zurich">ETH Zurich</option>
              <option value="Georgia Tech">Georgia Tech</option>
              <option value="TUM Munich">TUM Munich</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Germany">Germany</option>
              <option value="Singapore">Singapore</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Program / Subject & Degree Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Program / Subject <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select program or subject</option>
              <option value="PhD in Computer Science">PhD in Computer Science</option>
              <option value="PhD in EECS">PhD in EECS</option>
              <option value="PhD in AI">PhD in AI</option>
              <option value="PhD in Robotics">PhD in Robotics</option>
              <option value="PhD in Data Science">PhD in Data Science</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Degree Level <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select degree level</option>
              <option value="Doctorate / PhD">Doctorate / PhD</option>
              <option value="Master's">Master&apos;s</option>
              <option value="Bachelor's">Bachelor&apos;s</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 3: Department (Optional) & Program Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Department <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department"
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Program Type
          </label>
          <div className="relative">
            <select
              value={programType}
              onChange={(e) => setProgramType(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select program type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Online / Distance">Online / Distance</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 4: Intake / Term & Application Round */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Intake / Term <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
              placeholder="Select intake / term"
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
            <Calendar className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Application Round
          </label>
          <div className="relative">
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            >
              <option value="">Select round</option>
              <option value="Round 1">Round 1 (Fall)</option>
              <option value="Round 2">Round 2 (Spring)</option>
              <option value="Rolling">Rolling Admissions</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
