"use client";

import * as React from "react";
import {useApi} from "@/hooks/use-api";
import {useStudent} from "@/components/layout/student-session";
import {api,workspace} from "@/lib/student-api";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Check,
  Save,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import rawSettingsData from "@/data/json/settings/settings-config.json";

const ICON_MAP: Record<string, LucideIcon> = {
  User,
  Bell,
  Shield,
  CreditCard,
};

const SETTINGS_TABS = rawSettingsData.tabs.map((tab) => ({
  id: tab.id,
  label: tab.label,
  icon: ICON_MAP[tab.iconName] || User,
}));

export function SettingsView() {
  const {user,refresh}=useStudent();
  const router=useRouter();
  const result=useApi<{data:Record<string,unknown>}>(`${workspace}/settings`);
  const [error,setError]=React.useState("");
  const [saving,setSaving]=React.useState(false);
  const [activeTab, setActiveTab] = React.useState("general");
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const email=user.email;
  const [phone, setPhone] = React.useState("");
  const [timezone, setTimezone] = React.useState("");

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = React.useState(false);
  const [deadlineReminders, setDeadlineReminders] = React.useState(false);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);
  const [professorReplies, setProfessorReplies] = React.useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(()=>{if(!result.data)return;const data=result.data.data;const frame=requestAnimationFrame(()=>{setName(typeof data.name==='string'?data.name : user.displayName);
setPhone(typeof data.phone==='string'?data.phone : '');
setTimezone(typeof data.timezone==='string'?data.timezone : '');
setEmailAlerts(Boolean(data.emailAlerts));
setDeadlineReminders(Boolean(data.deadlineReminders));
setWeeklyDigest(Boolean(data.weeklyDigest));
setProfessorReplies(Boolean(data.professorReplies));});return ()=>cancelAnimationFrame(frame);},[result.data,user.displayName]);
  const handleSave = async () => {
    setSaving(true);setError('');
    try {
      if(activeTab==='security'){
        if(newPassword!==confirmPassword)throw new Error('New passwords do not match');
        await api('/v1/student/auth/password',{method:'POST',body:JSON.stringify({currentPassword,newPassword})});
        router.replace('/login');return;
      }
      await api(`${workspace}/settings`,{method:'PUT',body:JSON.stringify({data:{name,phone,timezone,emailAlerts,deadlineReminders,weeklyDigest,professorReplies}})});
      refresh();setSavedSuccess(true);
    }catch(e){setError(e instanceof Error?e.message:'Unable to save');}finally{setSaving(false);}
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-left">
      {(error||result.error)&&<p role="alert" className="text-sm text-rose-600">{error||result.error}</p>}
      {result.loading&&<p role="status">Loading settings…</p>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-[#1476F2]">
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
          disabled={saving||result.loading}
          onClick={handleSave}
          className="h-10 px-5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
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
                  ? "bg-[#1476F2] text-white shadow-xs"
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
                  src="/images/avatar-placeholder.svg"
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Avatar uploads are not available yet.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2] bg-white"
                >
                  {rawSettingsData.timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
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
                  className="w-4 h-4 rounded text-[#1476F2] focus:ring-[#1476F2] cursor-pointer"
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
                  className="w-4 h-4 rounded text-[#1476F2] focus:ring-[#1476F2] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Email Notifications</span>
                  <p className="text-slate-500 text-[11px]">Send summaries to {email}.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1476F2] focus:ring-[#1476F2] cursor-pointer"
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
                  className="w-4 h-4 rounded text-[#1476F2] focus:ring-[#1476F2] cursor-pointer"
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
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1476F2]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={saving||result.loading}
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
                You are currently on the No active subscription.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-[#1476F2] text-[10px] font-bold">
                  Not subscribed
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-heading">
                  No active subscription
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  No paid subscription or billing history is configured.
                </p>
              </div>

              <Link
                href="/pricing"
                className="h-10 px-4 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Upgrade to a plan</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
