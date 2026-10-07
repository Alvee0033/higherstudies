import * as React from "react";
import { FundingGrantItem } from "./profile-types";

interface ProfileFundingCardProps {
  funding: FundingGrantItem[];
  totalGrants: number;
}

export function ProfileFundingCard({
  funding,
  totalGrants,
}: ProfileFundingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 font-heading">
          Research Funding
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-[#5D3FD3] hover:underline cursor-pointer"
        >
          View all ({totalGrants})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
              <th className="pb-2.5 font-bold">GRANT / AWARD</th>
              <th className="pb-2.5 font-bold">YEAR</th>
              <th className="pb-2.5 font-bold">AMOUNT</th>
              <th className="pb-2.5 font-bold text-right">ROLE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {funding.map((item) => (
              <tr key={item.grant} className="hover:bg-slate-50/50">
                <td className="py-2.5 font-bold text-slate-900">{item.grant}</td>
                <td className="py-2.5 text-slate-500">{item.year}</td>
                <td className="py-2.5 font-bold text-slate-900">{item.amount}</td>
                <td className="py-2.5 text-slate-500 font-medium text-right">{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#5D3FD3] font-semibold pt-1 cursor-pointer hover:underline">
        +{totalGrants - funding.length} more grants
      </p>
    </div>
  );
}
