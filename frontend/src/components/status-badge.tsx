"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "processing" | "completed" | "failed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    },
    processing: {
      label: "Processing",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    completed: {
      label: "Completed",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
