import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { statToneClasses, type StatTone } from "./stat-tone";

export function StatCard({
  icon,
  count,
  label,
  tone = "neutral",
}: {
  icon: IconSvgElement;
  count: number;
  label: string;
  tone?: StatTone;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${statToneClasses[tone]}`}
      >
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.75} />
      </div>
      <p className="text-13 text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
    </div>
  );
}
