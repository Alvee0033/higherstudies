import * as React from "react";

interface ProfileTeachingCardProps {
  courses: string[];
}

export function ProfileTeachingCard({ courses }: ProfileTeachingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-left">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Teaching</h2>
        <button
          type="button"
          className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer"
        >
          View all courses &gt;
        </button>
      </div>
      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
        {courses.map((course) => (
          <li key={course}>• {course}</li>
        ))}
      </ul>
    </div>
  );
}
