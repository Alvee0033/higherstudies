"use client";

import * as React from "react";

function BlueCheckIcon({ className = "w-4 h-4 text-[#493EE5] shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.2 8.2L7.2 10.2L10.8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  isPopular?: boolean;
  buttonText: string;
  isCurrent?: boolean;
  featuresTitle: string;
  features: string[];
}

const PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Free",
    subtitle: "Get started with basic tools.",
    price: "0 BDT",
    buttonText: "Current Plan",
    isCurrent: true,
    featuresTitle: "Includes:",
    features: [
      "Track up to 3 applications",
      "Access to 500+ universities",
      "Basic email tracking",
      "AI Tools (Limited)",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    subtitle: "For serious applicants.",
    price: "2000 BDT",
    isPopular: true,
    buttonText: "Purchase Now",
    featuresTitle: "Everything in Free, plus:",
    features: [
      "Track up to 20 applications",
      "Advanced email tracker",
      "AI Tools (Standard)",
      "Document templates",
      "Application deadline alerts",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "For advanced planning.",
    price: "5000 BDT",
    buttonText: "Purchase Now",
    featuresTitle: "Everything in Starter, plus:",
    features: [
      "Unlimited applications",
      "Professor & university insights",
      "AI Tools (Advanced)",
      "Personalized recommendations",
      "Visa tracking",
      "Custom reminders",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "For complete success.",
    price: "10,000 BDT",
    buttonText: "Purchase Now",
    featuresTitle: "Everything in Pro, plus:",
    features: [
      "1-on-1 expert consultation",
      "SOP & LOR review (2x/month)",
      "Interview preparation",
      "Application review",
      "Dedicated success manager",
      "24/7 premium support",
    ],
  },
];

export function PurchasePlanView() {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  return (
    <div className="w-full text-left max-w-7xl mx-auto space-y-8">
      {/* 1. Header Section */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Purchase a Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Choose the perfect plan to supercharge your study abroad journey.
        </p>
      </div>

      {/* 2. 4-Column Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch pt-2">
        {PLANS.map((plan) => {
          const isStarter = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                isStarter
                  ? "border-2 border-[#493EE5] shadow-md"
                  : "border border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Most Popular Badge for Starter */}
              {isStarter && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3.5 py-0.5 rounded-md bg-[#493EE5] text-white text-[11px] font-semibold tracking-wide shadow-xs whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[16px]">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price Display */}
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#493EE5] tracking-tight font-heading">
                    {plan.price}
                  </span>
                </div>

                {/* Plan Action Button */}
                <div>
                  {plan.isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full h-10 rounded-lg bg-[#EEF2FF] border border-[#6366F1]/40 text-[#1E1B4B] text-xs font-semibold flex items-center justify-center cursor-default text-center shadow-2xs"
                    >
                      {plan.buttonText}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(plan.name)}
                      className="w-full h-10 rounded-lg bg-[#493EE5] hover:bg-[#3E34C7] text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer text-center shadow-xs"
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>

                {/* Features List */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    {plan.featuresTitle}
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <BlueCheckIcon className="w-4 h-4 text-[#493EE5] shrink-0 mt-0.5" />
                        <span className="leading-snug text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Confirmation Modal (Interactive preview) */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Upgrade to {selectedPlan}
            </h3>
            <p className="text-xs text-slate-600">
              You are about to subscribe to the {selectedPlan} plan. Secure payment processing is simulated in this preview.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#493EE5] hover:bg-[#3E34C7] text-xs font-medium text-white shadow-xs cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
