"use client";

import * as React from "react";
import {
  Mail,
  Clock,
  Send,
  Heart,
  Copy,
  Edit3,
  Download,
  Check,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface EmailTemplate {
  subject: string;
  paragraphs: string[];
}

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  initial: {
    subject: "Subject: PhD Application Inquiry - Fall 2025",
    paragraphs: [
      "Dear Prof. John Smith,",
      "I hope this email finds you well. My name is Ahmed Rahman, and I am currently a final year student in Computer Science at BRAC University, Bangladesh. I am very interested in pursuing a PhD under your supervision at MIT, specifically in the areas of deep learning and computer vision.",
      "I have attached my CV for your kind consideration. I would be grateful for the opportunity to contribute to your lab.",
      "Thank you for your time and consideration.",
      "Best regards,\nAhmed Rahman",
    ],
  },
  reminder: {
    subject: "Subject: Gentle Follow-up: PhD Inquiry - Fall 2025 - Ahmed Rahman",
    paragraphs: [
      "Dear Prof. John Smith,",
      "I hope you are having a pleasant week. I am writing to gently follow up on my email sent last week regarding potential PhD openings in your lab for Fall 2025.",
      "I remain deeply interested in your team's research on multimodal architectures. I have attached my CV again for your convenience.",
      "Thank you once again for your valuable time.",
      "Best regards,\nAhmed Rahman",
    ],
  },
  followup: {
    subject: "Subject: Follow-up & Recent Research Update - Ahmed Rahman",
    paragraphs: [
      "Dear Prof. John Smith,",
      "I hope all is well with you. Following up on my prospective application, I wanted to share that our recent preprint on neural vision distillation has just been published.",
      "I believe the findings closely align with the computational goals of your lab. I would welcome the opportunity to discuss this further if you have openings for Fall 2025.",
      "Thank you for your consideration.",
      "Best regards,\nAhmed Rahman",
    ],
  },
  thankyou: {
    subject: "Subject: Thank You for the Discussion - Ahmed Rahman",
    paragraphs: [
      "Dear Prof. John Smith,",
      "Thank you very much for taking the time to speak with me today about potential research opportunities in your laboratory at MIT.",
      "The discussion reinforced my enthusiasm for joining your group. Please let me know if any additional documentation or references are needed.",
      "Thank you once again for your time and mentorship.",
      "Best regards,\nAhmed Rahman",
    ],
  },
};

const TABS = [
  { id: "initial", label: "Initial Email", icon: Mail },
  { id: "reminder", label: "Reminder Email", icon: Clock },
  { id: "followup", label: "Follow-up Email", icon: Send },
  { id: "thankyou", label: "Thank You Email", icon: Heart },
];

export function AiToolsView() {
  const [activeTab, setActiveTab] = React.useState("initial");
  const [selectedProf, setSelectedProf] = React.useState("John Smith (MIT)");
  const [selectedProgram, setSelectedProgram] = React.useState("PhD in Electrical Engineering");
  const [researchInterest, setResearchInterest] = React.useState("Deep Learning, Computer Vision");
  
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [currentSubject, setCurrentSubject] = React.useState(EMAIL_TEMPLATES.initial.subject);
  const [currentBody, setCurrentBody] = React.useState(EMAIL_TEMPLATES.initial.paragraphs.join("\n\n"));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tmpl = EMAIL_TEMPLATES[tabId] || EMAIL_TEMPLATES.initial;
    setCurrentSubject(tmpl.subject);
    setCurrentBody(tmpl.paragraphs.join("\n\n"));
    setIsEditing(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const tmpl = EMAIL_TEMPLATES[activeTab] || EMAIL_TEMPLATES.initial;
      setCurrentSubject(tmpl.subject);
      setCurrentBody(tmpl.paragraphs.join("\n\n"));
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentSubject}\n\n${currentBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${currentSubject}\n\n${currentBody}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTab}_email_ahmed_rahman.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Email Type Tabs (Matching Figma 588x80 4 Card Buttons) */}
      <div className="flex flex-wrap items-center gap-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`w-[128px] h-[80px] rounded-xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5] shadow-xs"
                  : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isActive ? "text-[#4F46E5]" : "text-slate-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold leading-tight text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Two-Column Container (Left Form: 320px, Right Preview: 608px) */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Form (320px) */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-5">
          {/* Field 1: Professor */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-medium text-slate-700">
              Professor
            </label>
            <div className="relative">
              <div className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/avatars/prof-jonathan-smith.png"
                      alt="John Smith"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-sm font-normal text-slate-800 truncate">
                    {selectedProf}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
              <select
                value={selectedProf}
                onChange={(e) => setSelectedProf(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                <option value="John Smith (MIT)">John Smith (MIT)</option>
                <option value="David Lee (Stanford)">David Lee (Stanford)</option>
                <option value="Emma Brown (Toronto)">Emma Brown (Toronto)</option>
                <option value="Michael Chen (Berkeley)">Michael Chen (Berkeley)</option>
              </select>
            </div>
          </div>

          {/* Field 2: Program */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-medium text-slate-700">
              Program
            </label>
            <div className="relative">
              <div className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-normal text-slate-800 truncate">
                    {selectedProgram}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                <option value="PhD in Electrical Engineering">PhD in Electrical Engineering</option>
                <option value="PhD in Computer Science">PhD in Computer Science</option>
                <option value="MS in Artificial Intelligence">MS in Artificial Intelligence</option>
                <option value="PhD in Robotics">PhD in Robotics</option>
              </select>
            </div>
          </div>

          {/* Field 3: Your Research Interest */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-medium text-slate-700">
              Your Research Interest
            </label>
            <div className="relative">
              <div className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
                  </div>
                  <input
                    type="text"
                    value={researchInterest}
                    onChange={(e) => setResearchInterest(e.target.value)}
                    className="w-full text-sm font-normal text-slate-800 focus:outline-none bg-transparent"
                    placeholder="Deep Learning, Computer Vision"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Button: Generate Email */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full h-10 rounded-md bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isGenerating ? "Generating..." : "Generate Email"}</span>
          </button>
        </div>

        {/* Right Column: Preview (608px) */}
        <div className="w-full lg:w-[608px] bg-white border border-slate-200 rounded-xl p-6 shadow-2xs text-left">
          {/* Card Heading */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Generated Email
            </h2>
          </div>

          {/* Email Content Box */}
          <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 space-y-3.5 text-sm text-slate-700 leading-relaxed min-h-[300px]">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
                <textarea
                  rows={10}
                  value={currentBody}
                  onChange={(e) => setCurrentBody(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded bg-white text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] resize-none leading-relaxed"
                />
              </div>
            ) : (
              <>
                <p className="font-semibold text-slate-900 pb-1">
                  {currentSubject}
                </p>

                {currentBody.split("\n\n").map((para, idx) => (
                  <p key={idx} className="whitespace-pre-line text-slate-700">
                    {para}
                  </p>
                ))}
              </>
            )}
          </div>

          {/* Action Buttons: Copy, Edit, Download (558x38 3 buttons) */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-10 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="h-10 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="h-4 w-4 text-slate-500" />
              <span>{isEditing ? "Done" : "Edit"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="h-10 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
