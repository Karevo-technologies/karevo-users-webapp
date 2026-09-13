export type StatTone = "neutral" | "pending" | "approved" | "declined";

export const statToneClasses: Record<StatTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  approved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  declined: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
};
