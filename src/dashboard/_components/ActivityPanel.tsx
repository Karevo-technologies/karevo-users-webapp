import type { ReactNode } from "react";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};

export function ActivityPanel({
  title,
  onViewAll,
  children,
}: {
  title: string;
  onViewAll?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 style={fontDisplay} className="text-15 font-semibold text-foreground">
          {title}
        </h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-13 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-border px-5">{children}</div>
    </section>
  );
}
