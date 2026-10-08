"use client";

import * as React from "react";
import { Plus, X, Check } from "lucide-react";
import rawProfileData from "@/data/json/profile/student-profile.json";

const PROFILE_TABS = rawProfileData.tabs;

export function StudentProfileView() {
  const [activeTab, setActiveTab] = React.useState("preferences");

  // Preferences Form State matching Figma
  const [fundingPref, setFundingPref] = React.useState(rawProfileData.preferences.defaultFunding);
  const [targetIntake, setTargetIntake] = React.useState(rawProfileData.preferences.defaultIntake);
  const [countries, setCountries] = React.useState<string[]>(rawProfileData.preferences.countries);
  const [isAddingCountry, setIsAddingCountry] = React.useState(false);
  const [newCountryName, setNewCountryName] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  // Other Tabs State
  const [fullName, setFullName] = React.useState(rawProfileData.personal.fullName);
  const [email, setEmail] = React.useState(rawProfileData.personal.email);
  const [phone, setPhone] = React.useState(rawProfileData.personal.phone);
  const [university, setUniversity] = React.useState(rawProfileData.academic.university);
  const [degree, setDegree] = React.useState(rawProfileData.academic.degree);
  const [cgpa, setCgpa] = React.useState(rawProfileData.academic.cgpa);
  const [greScore, setGreScore] = React.useState(rawProfileData.testScores.greScore);
  const [ieltsScore, setIeltsScore] = React.useState(rawProfileData.testScores.ieltsScore);

  const handleAddCountry = () => {
    if (newCountryName.trim() && !countries.includes(newCountryName.trim())) {
      setCountries([...countries, newCountryName.trim()]);
      setNewCountryName("");
      setIsAddingCountry(false);
    }
  };

  const handleRemoveCountry = (c: string) => {
    setCountries(countries.filter((item) => item !== c));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full space-y-6 text-left max-w-5xl">
      {/* 1. Profile Tabs matching Figma 08_Student_Profile (960x55) */}
      <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto pb-0">
        {PROFILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 pt-1 text-sm font-medium transition-all cursor-pointer whitespace-nowrap relative ${
                isActive
                  ? "text-[#4F46E5] font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Settings Card (matching Figma 960x634 Settings Card) */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs space-y-8">
        {activeTab === "preferences" && (
          <>
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Preferences
              </h1>
            </div>

            {/* Section 1: FUNDING PREFERENCE */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                FUNDING PREFERENCE
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {rawProfileData.preferences.fundingOptions.map((opt) => {
                  const isSelected = fundingPref === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFundingPref(opt)}
                      className={`w-[192px] h-[54px] rounded-lg border px-4 flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#F5F5FF] border-[#4F46E5] text-[#4F46E5]"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#4F46E5] bg-[#4F46E5]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: TARGET INTAKE */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                TARGET INTAKE
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {rawProfileData.preferences.intakeOptions.map((opt) => {
                  const isSelected = targetIntake === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTargetIntake(opt)}
                      className={`w-[192px] h-[54px] rounded-lg border px-4 flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#F5F5FF] border-[#4F46E5] text-[#4F46E5]"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#4F46E5] bg-[#4F46E5]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: PREFERRED COUNTRIES */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                PREFERRED COUNTRIES
              </h2>
              <div className="min-h-[80px] p-4 bg-[#F8FAFC]/50 rounded-lg border border-slate-200 flex flex-wrap items-center gap-2.5">
                {countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#4F46E5]/30 text-[#4F46E5] text-xs font-medium shadow-2xs"
                  >
                    <span>{country}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(country)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {isAddingCountry ? (
                  <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2 py-1 shadow-2xs">
                    <input
                      type="text"
                      value={newCountryName}
                      onChange={(e) => setNewCountryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCountry();
                        if (e.key === "Escape") setIsAddingCountry(false);
                      }}
                      placeholder="Country name..."
                      className="text-xs text-slate-800 outline-none w-28 px-1"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCountry}
                      className="text-[#4F46E5] hover:text-[#4338CA] text-xs font-bold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCountry(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCountry(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Country</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Footer: Save Changes (176x48) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
              <button
                type="button"
                onClick={handleSave}
                className="w-[176px] h-[48px] rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </>
        )}

        {/* Other Tabs Support */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-sm">
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSave}
                className="w-[176px] h-[48px] rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-xs"
              >
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "academic" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-sm">
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">University</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">Undergraduate CGPA</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSave}
                className="w-[176px] h-[48px] rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-xs"
              >
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "testscores" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Test Scores</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-sm">
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">GRE Score</label>
                <input
                  type="text"
                  value={greScore}
                  onChange={(e) => setGreScore(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-600 font-medium text-xs">IELTS Score</label>
                <input
                  type="text"
                  value={ieltsScore}
                  onChange={(e) => setIeltsScore(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSave}
                className="w-[176px] h-[48px] rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-xs"
              >
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "research" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research & Publications</h1>
            {rawProfileData.research.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-2 max-w-xl">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "experience" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Experience</h1>
            {rawProfileData.experience.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-2 max-w-xl">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
