"use client";

import * as React from "react";
import {
  X,
  Mail,
  User,
  Flag,
  Bell,
  Calendar,
  Clock,
  Send,
  ChevronDown,
} from "lucide-react";
import { EmailRecord } from "./email-tracker-types";

interface EmailAddModalProps {
  onClose: () => void;
  onAdd: (record: EmailRecord) => void;
}

export function EmailAddModal({ onClose, onAdd }: EmailAddModalProps) {
  // Form State
  const [professorName, setProfessorName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [positionTitle, setPositionTitle] = React.useState("");
  const [department, setDepartment] = React.useState("Computer Science");
  const [university, setUniversity] = React.useState("Stanford University");
  const [country, setCountry] = React.useState("United States");
  const [website, setWebsite] = React.useState("");
  const [timeZone, setTimeZone] = React.useState("PST (UTC-8)");

  const [subject, setSubject] = React.useState("");
  const [templateType, setTemplateType] = React.useState("Cold Outreach (PhD)");
  const [fromEmail, setFromEmail] = React.useState("johndoe@email.com");
  const [sentDate, setSentDate] = React.useState("May 18, 2024");
  const [sentTime, setSentTime] = React.useState("10:30 AM");

  const [currentStatus, setCurrentStatus] = React.useState("Sent");
  const [replyReceived, setReplyReceived] = React.useState<"No" | "Yes">("No");
  const [replyType, setReplyType] = React.useState<"Positive Reply" | "Negative Reply" | "No Response">("Positive Reply");
  const [interviewScheduled, setInterviewScheduled] = React.useState<"No" | "Yes">("No");
  const [applicationSubmitted, setApplicationSubmitted] = React.useState<"No" | "Yes">("No");

  const [reminder1Date, setReminder1Date] = React.useState("May 25, 2024");
  const [reminder1Time, setReminder1Time] = React.useState("10:30 AM");
  const [reminder2Date, setReminder2Date] = React.useState("Jun 1, 2024");
  const [reminder2Time, setReminder2Time] = React.useState("10:30 AM");
  const [reminderNotes, setReminderNotes] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: EmailRecord = {
      id: `email-${Date.now()}`,
      professorName: professorName || "Prof. Alex Rivera",
      professorTitle: positionTitle || "Associate Professor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      universityName: university.split(" ")[0] || "University",
      universitySub: university.split(" ").slice(1).join(" ") || "Department",
      universityLogoType: "stanford",
      email: email || "prof.rivera@stanford.edu",
      sentDate: sentDate,
      sentTime: sentTime,
      reminderDate: reminder1Date,
      reminderTime: reminder1Time,
      replyDate: replyReceived === "Yes" ? "May 20, 2024" : undefined,
      replyTime: replyReceived === "Yes" ? "02:00 PM" : undefined,
      status: replyReceived === "Yes" ? "Positive Reply" : "Not Sent",
      notes: reminderNotes || "Follow-up initiated via HigherStudy Email Tracker.",
      subject: subject || "PhD Opportunity - Fall 2025",
      location: country,
      website: website || "https://stanford.edu",
      attachments: [
        { name: "MY_CV.pdf", size: "2.4 MB", type: "pdf" },
      ],
      lastUpdated: {
        date: "Today at " + sentTime,
        author: "John Doe",
      },
    };

    onAdd(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[960px] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header matching Figma 13_Email_Add_Form */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Add New Professor
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add professor details and email tracking information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Body (2 Columns) */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* 1. Professor & University Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
                  <User className="h-4 w-4" />
                  <span>1. Professor &amp; University Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Professor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={professorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      placeholder="e.g., John Smith"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., john.smith@stanford.edu"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Position / Title
                    </label>
                    <input
                      type="text"
                      value={positionTitle}
                      onChange={(e) => setPositionTitle(e.target.value)}
                      placeholder="e.g., Professor of Computer Science"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>Computer Science</option>
                        <option>Electrical Engineering</option>
                        <option>Artificial Intelligence</option>
                        <option>Data Science</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      University <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>Stanford University</option>
                        <option>Massachusetts Institute of Technology</option>
                        <option>University of Toronto</option>
                        <option>UC Berkeley</option>
                        <option>ETH Zurich</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      University Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Switzerland</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      University Website (Optional)
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g., https://stanford.edu"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Time Zone
                    </label>
                    <div className="relative">
                      <select
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>PST (UTC-8)</option>
                        <option>EST (UTC-5)</option>
                        <option>CST (UTC-6)</option>
                        <option>GMT (UTC+0)</option>
                        <option>CET (UTC+1)</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Email & Communication Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
                  <Mail className="h-4 w-4" />
                  <span>2. Email &amp; Communication Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Email Subject (Initial) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., PhD Opportunity - Fall 2025"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Email Template / Type
                    </label>
                    <div className="relative">
                      <select
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>Cold Outreach (PhD)</option>
                        <option>Research Assistantship Inquiry</option>
                        <option>Postdoc Application</option>
                        <option>General Inquiry</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      From Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="e.g., youremail@gmail.com"
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Mail Sent Date &amp; Time <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={sentDate}
                          onChange={(e) => setSentDate(e.target.value)}
                          className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                        />
                        <Calendar className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={sentTime}
                          onChange={(e) => setSentTime(e.target.value)}
                          className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                        />
                        <Clock className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* 3. Email Tracking Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
                  <Flag className="h-4 w-4" />
                  <span>3. Email Tracking Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Current Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      >
                        <option>Sent</option>
                        <option>Waiting</option>
                        <option>Replied</option>
                        <option>Interview Scheduled</option>
                        <option>Closed</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Reply Received?
                    </label>
                    <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setReplyReceived("No")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          replyReceived === "No"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyReceived("Yes")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          replyReceived === "Yes"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Reply Type <span className="text-slate-400 font-normal">(Select if received)</span>
                  </label>
                  <div className="flex items-center gap-4 flex-wrap pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                      <input
                        type="radio"
                        name="replyType"
                        checked={replyType === "Positive Reply"}
                        onChange={() => setReplyType("Positive Reply")}
                        className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Positive Reply
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                      <input
                        type="radio"
                        name="replyType"
                        checked={replyType === "Negative Reply"}
                        onChange={() => setReplyType("Negative Reply")}
                        className="text-slate-600 focus:ring-slate-500 h-4 w-4"
                      />
                      <span>Negative Reply</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800">
                      <input
                        type="radio"
                        name="replyType"
                        checked={replyType === "No Response"}
                        onChange={() => setReplyType("No Response")}
                        className="text-slate-600 focus:ring-slate-500 h-4 w-4"
                      />
                      <span>No Response</span>
                    </label>
                  </div>
                </div>

                {/* Interview & Application Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Interview Scheduled?
                    </label>
                    <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setInterviewScheduled("No")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          interviewScheduled === "No"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterviewScheduled("Yes")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          interviewScheduled === "Yes"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Application Submitted?
                    </label>
                    <div className="grid grid-cols-2 h-10 rounded-xl border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setApplicationSubmitted("No")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          applicationSubmitted === "No"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicationSubmitted("Yes")}
                        className={`rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          applicationSubmitted === "Yes"
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Reminders */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm">
                  <Bell className="h-4 w-4" />
                  <span>4. Reminders</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Reminder 1 Date &amp; Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={reminder1Date}
                        onChange={(e) => setReminder1Date(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      />
                      <Calendar className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={reminder1Time}
                        onChange={(e) => setReminder1Time(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      />
                      <Clock className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Reminder 2 Date &amp; Time <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={reminder2Date}
                        onChange={(e) => setReminder2Date(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      />
                      <Calendar className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={reminder2Time}
                        onChange={(e) => setReminder2Time(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                      />
                      <Clock className="h-4 w-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Reminder Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    placeholder="e.g., Follow up on research interests, share CV again..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Form Footer matching Figma */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
              <span>Add Professor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
