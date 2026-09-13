import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function QuickActionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-14 font-semibold text-foreground">{title}</p>
        <p className="truncate text-12 text-muted-foreground">{subtitle}</p>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="shrink-0 text-muted-foreground"
      />
    </button>
  );
}
