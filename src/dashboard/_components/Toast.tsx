import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";
import type { ToastState } from "./use-toast";

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  const isPositive = toast.tone !== "negative";
  return (
    <div
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-foreground shadow-lg animate-in fade-in slide-in-from-top-2 dark:bg-stone-900">
        {isPositive ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <HugeiconsIcon icon={CancelCircleIcon} size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
        )}
        <span className="text-13">{toast.message}</span>
      </div>
    </div>
  );
}
