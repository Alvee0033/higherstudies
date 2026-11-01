"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, X } from "lucide-react";

import { api } from "@/lib/student-api";

interface LoginFormProps {
  register?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export function LoginForm({ onClose, isModal = false, register = false }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [displayName,setDisplayName] = React.useState("");
  const [error,setError] = React.useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();setIsSubmitting(true);setError("");
    try {
      await api(`/v1/student/auth/${register?'register':'login'}`,{method:'POST',body:JSON.stringify({email,password,...(register?{displayName}:{})})});
      onClose?.();
      window.location.href = '/dashboard';
    } catch(error) {setError(error instanceof Error?error.message:'Unable to sign in');}
    finally {setIsSubmitting(false);}
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(79,70,229,0.08)] border border-slate-100 relative text-left">
      {/* Optional Close Button (for modal mode) or Back to Home */}
      {isModal ? (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      ) : (
        <Link
          href="/"
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Back to home"
        >
          <X className="h-5 w-5" />
        </Link>
      )}

      {/* Header */}
      <div className="text-center space-y-1.5 mb-8">
        <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight font-heading flex items-center justify-center gap-2">
          <span>{register ? "Create your account" : "Welcome Back!"}</span>
          <span className="text-2xl">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {register ? "Create an account to start your HigherStudy journey." : "Log in to continue your journey with HigherStudy."}
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={()=>setError("Social sign-in is not configured. Use your email and password.")}
          className="flex items-center justify-center gap-2.5 h-12 px-4 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 transition-all text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer group"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
            />
          </svg>
          <span className="truncate">Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={()=>setError("Social sign-in is not configured. Use your email and password.")}
          className="flex items-center justify-center gap-2.5 h-12 px-4 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 transition-all text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer group"
        >
          <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.11-1 .04-2.18.66-2.88 1.48-.61.71-1.14 1.88-1 3 1.11.09 2.23-.55 2.89-1.37z" />
          </svg>
          <span className="truncate">Continue with Apple</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-full border-t border-slate-100" />
        <span className="absolute bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          or continue with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
        {register && <label className="block text-xs font-bold text-slate-700">Full name<input required minLength={2} maxLength={100} value={displayName} onChange={e=>setDisplayName(e.target.value)} autoComplete="name" className="mt-2 w-full h-11 px-3 rounded-xl border border-slate-200" /></label>}
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="studentX@gmail.com"
              className="w-full h-11.5 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1476F2] focus:border-transparent transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              maxLength={128}
              autoComplete={register?"new-password":"current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11.5 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1476F2] focus:border-transparent transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <span className="text-xs font-medium text-slate-600">Sessions last 30 days</span>
          {!register && (
            <button
              type="button"
              onClick={() => setError("Password recovery is not configured. Contact support for account assistance.")}
              className="border-0 bg-transparent p-0 text-xs font-bold text-[#1476F2] hover:text-[#0963D6] transition-colors"
            >
              Forgot Password?
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-[#5244E3] hover:bg-[#0963D6] text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70 mt-2"
        >
          <span>{isSubmitting ? "Please wait..." : register ? "Create Account" : "Log In"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Security Disclaimer Box */}
      <div className="mt-6 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 flex items-center gap-3 text-left">
        <div className="h-7 w-7 rounded-lg bg-white border border-indigo-100 text-[#1476F2] flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <p className="text-[11.5px] leading-snug text-indigo-900/80 font-medium">
          Your data is safe with us. We never share your information with anyone.
        </p>
      </div>

      {/* Sign Up Footer */}
      <div className="mt-8 text-center text-xs text-slate-600">
        {register ? "Already have an account? " : "Don't have an account? "}
        <Link
          href={register ? "/login" : "/register"}
          className="font-bold text-[#1476F2] hover:text-[#0963D6] transition-colors"
        >
          {register ? "Log in" : "Sign up"}
        </Link>
      </div>
    </div>
  );
}
