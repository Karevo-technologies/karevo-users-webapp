import { HugeiconsIcon } from "@hugeicons/react";

/**
 * Raw Hugeicons icon data — an array of [name, attrs] tuples accepted by the
 * `HugeiconsIcon` renderer from `@hugeicons/react`.
 */
type HugeIconData = readonly (readonly [
  string,
  { readonly [key: string]: string | number },
])[];

/**
 * Consistent settings card wrapper: an icon + title + description header with
 * action content rendered below. Matches the blue/white shell tokens.
 */
export function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: HugeIconData;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-cloud bg-card p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

