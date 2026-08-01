"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { BellIcon } from "@hugeicons/core-free-icons";
import ThemeToggle from "./themetoggle";
import { useAuth } from "../../context/AuthContext";

export default function TopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cloud bg-paper/70 px-4 backdrop-blur lg:px-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cloud bg-paper/30 text-ink-soft transition-colors hover:bg-paper/50"
        >
          <HugeiconsIcon icon={BellIcon} size={18} strokeWidth={1.75} />
        </button>

        <ThemeToggle />

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cloud bg-paper/30 text-ink-soft">
            <span className="text-sm font-semibold">
              {useAuth().user?.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
