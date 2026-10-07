"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Check,
  Save,
  KeyRound,
  Mail,
  Smartphone,
  ExternalLink,
} from "lucide-react";

const SETTINGS_TABS = [
  { id: "general", label: "General & Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Passwords", icon: Shield },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("John Doe");
  const [email, setEmail] = React.useState("johndoe@email.com");
  const [phone, setPhone] = React.useState("+880 1712 345678");
  const [timezone, setTimezone] = React.useState("Asia/Dhaka (GMT+6)");

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [deadlineReminders, setDeadlineReminders] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);
  const [professorReplies, setProfessorReplies] = React.useState(true);

  // Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-[#4F46E5]">
              <Settings className="h-5 w-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Account Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal profile, notifications, security credentials, and subscription.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-10 px-5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? "Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        {/* 1. General & Account */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Profile & Contact Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update how your name and details appear across HigherStudy.
              </p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="John Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 text-xs font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">JPG, PNG or WEBP under 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
                >
                  <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                  <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                  <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                  <option value="Asia/Singapore (GMT+8)">Asia/Singapore (GMT+8)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2. Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-6 max-w-2xl text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which updates and deadline reminders you want to receive.
              </p>
            </div>

            <div className="space-y-4 pt-2 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Application Deadline Alerts</span>
                  <p className="text-slate-500 text-[11px]">Receive reminders 30 days, 7 days, and 24h before submission dates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={deadlineReminders}
                  onChange={(e) => setDeadlineReminders(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Professor Email Follow-up Due</span>
                  <p className="text-slate-500 text-[11px]">Notify when cold email follow-up reminders expire.</p>
                </div>
                <input
                  type="checkbox"
                  checked={professorReplies}
                  onChange={(e) => setProfessorReplies(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Email Notifications</span>
                  <p className="text-slate-500 text-[11px]">Send summaries to johndoe@email.com.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Weekly Application Digest</span>
                  <p className="text-slate-500 text-[11px]">Get a weekly briefing of your admissions pipeline.</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 rounded text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Security */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-xl text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Security & Authentication
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your account password or configure two-factor authentication.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Billing */}
        {activeTab === "billing" && (
          <div className="space-y-6 max-w-2xl text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Subscription Plan & Invoicing
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                You are currently on the Free Tier plan.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-[#4F46E5] text-[10px] font-bold">
                  Active
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                  Free Student Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track up to 3 applications • 500+ universities
                </p>
              </div>

              <Link
                href="/pricing"
                className="h-10 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Upgrade to Starter</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
