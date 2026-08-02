"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun03Icon,
  Moon02Icon,
  ComputerIcon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { getThemeMode, setThemeMode, type ThemeMode } from "../../lib/theme";

const options: { value: ThemeMode; label: string; icon: typeof Sun03Icon }[] = [
  { value: "light", label: "Light", icon: Sun03Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
  { value: "system", label: "System", icon: ComputerIcon },
];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getThemeMode());
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getThemeMode() === "system") {
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function select(m: ThemeMode) {
    setMode(m);
    setThemeMode(m);
    setOpen(false);
  }

  const CurrentIcon =
    options.find((o) => o.value === mode)?.icon ?? ComputerIcon;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={`Theme: ${mode}`}
        title="Change theme"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cloud bg-paper/30 text-ink-soft transition-colors hover:bg-paper/50"
      >
        <HugeiconsIcon icon={CurrentIcon} size={18} strokeWidth={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[220px] overflow-hidden rounded-2xl border border-cloud bg-white shadow-xl dark:bg-[#141927]">
          <div className="border-b border-cloud px-4 py-3">
            <span className="text-[13px] font-semibold text-ink">
              Appearance
            </span>
          </div>
          <div className="p-1.5">
            {options.map((opt) => {
              const active = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => select(opt.value)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "text-ink hover:bg-paper/60"
                  }`}
                >
                  <HugeiconsIcon icon={opt.icon} size={16} strokeWidth={1.75} />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {active && (
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={15}
                      strokeWidth={2}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

