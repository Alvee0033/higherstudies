"use client";

import { useEffect } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

export type NotificationState = {
  id: number;
  tone: "success" | "error";
  message: string;
};

export function Notification({
  value,
  onDismiss,
}: {
  value: NotificationState | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!value) return;
    const timeout = window.setTimeout(
      onDismiss,
      value.tone === "error" ? 8000 : 5000,
    );
    return () => window.clearTimeout(timeout);
  }, [value, onDismiss]);

  if (!value) return null;
  const Icon = value.tone === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div
      className={`notification ${value.tone}`}
      role={value.tone === "error" ? "alert" : "status"}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{value.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}
