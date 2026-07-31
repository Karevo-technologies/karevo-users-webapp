"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  ArrowLeft01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  Alert01Icon,
  Key01Icon,
  QrCodeIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

// Local design tokens matching Karevo ecosystem metrics
const c = {
  signal: "#3452D9",
  verify: "#1C8C74",
  danger: "#DF4949",
  seal: "#232B4D", // deep ink-indigo used only for the seal emblem
};

interface ActivityLog {
  id: string;
  event: string;
  device: string;
  location: string;
  time: string;
  kind: "create" | "consent" | "auth";
}

const EVENT_COLOR: Record<ActivityLog["kind"], string> = {
  create: c.signal,
  consent: c.verify,
  auth: "#8B5CF6",
};

// Overall protection score shown in the seal emblem
const PROTECTION_SCORE = 92;

export default function SafeguardPage() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityLog[]>([]);

  // Simulate premium asynchronous skeleton pipeline fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivity([
        {
          id: "1",
          event: "New Share Code Generated",
          device: "iPhone 15 Pro",
          location: "Lagos, NG",
          time: "12 mins ago",
          kind: "create",
        },
        {
          id: "2",
          event: "Consent Granted (LUTH)",
          device: "Chrome · macOS",
          location: "Lagos, NG",
          time: "2 hours ago",
          kind: "consent",
        },
        {
          id: "3",
          event: "Account Login Authorized",
          device: "Safari · iOS",
          location: "Abuja, NG",
          time: "Yesterday",
          kind: "auth",
        },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const bestPractices = [
    {
      icon: Key01Icon,
      title: "Keep share tokens temporary",
      desc: "Generate codes only when needed, and revoke unused active sessions instantly.",
    },
    {
      icon: QrCodeIcon,
      title: "Trust your sources explicitly",
      desc: "Only scan or render identity validation targets inside registered healthcare nodes.",
    },
    {
      icon: ViewIcon,
      title: "Review access permissions regularly",
      desc: "Audit your clinical consent logs weekly to keep data sharing restricted.",
    },
    {
      icon: Shield01Icon,
      title: "Enforce biometric validation",
      desc: "Never disable system application locks or share device authentication patterns.",
    },
  ];

  // Seal geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - PROTECTION_SCORE / 100);

  return (
    <div className="kv-root min-h-screen bg-[#FBFAF8] text-[var(--kv-ink)] transition-colors duration-300 dark:bg-[#0A0E1A]">
      <div className="mx-auto max-w-4xl px-6 py-14 sm:px-10">
        {/* ── HEADER ── */}
        <header className="mb-14 flex items-start justify-between">
          <Link
            to="/dashboard/home"
            className="group flex items-center gap-2 text-[13px] font-medium"
            style={{ color: "var(--kv-ink-soft)" }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
            <span className="border-b border-transparent transition-colors group-hover:border-current">
              Dashboard
            </span>
          </Link>

          <span
            className="kv-body text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "var(--kv-ink-soft)" }}
          >
            Security Center
          </span>
        </header>

        {/* ── HERO ── */}
        <section className="mb-16 flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h1
              className="kv-display font-serif text-[32px] font-normal leading-[1.15] tracking-tight sm:text-[38px]"
              style={{ color: "var(--kv-ink)" }}
            >
              Safeguard your digital identity
            </h1>
            <p
              className="kv-body mt-5 text-[14.5px] leading-relaxed"
              style={{ color: "var(--kv-ink-soft)" }}
            >
              A compromised health record does not just leak metrics it
              exposes verified demographic details, active insurance indexes,
              and complete clinical history. Guarding your digital passport
              keeps every private patient detail unreadable to outsiders.
            </p>
          </div>

          {/* Seal emblem — signature element, evokes a document / passport stamp */}
          <div className="flex shrink-0 flex-col items-center gap-2 self-center">
            <div className="relative h-[112px] w-[112px]">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="var(--kv-card-border)"
                  strokeWidth="1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={c.verify}
                  strokeWidth="1.25"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 900ms ease-out" }}
                />
                {/* fine radial ticks, like a stamp perimeter */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i / 36) * 2 * Math.PI;
                  const r1 = radius + 6;
                  const r2 = radius + 9;
                  const x1 = 50 + r1 * Math.cos(angle);
                  const y1 = 50 + r1 * Math.sin(angle);
                  const x2 = 50 + r2 * Math.cos(angle);
                  const y2 = 50 + r2 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--kv-card-border)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  size={15}
                  style={{ color: c.seal }}
                  strokeWidth={1.5}
                />
                <span
                  className="kv-display mt-1 font-serif text-2xl leading-none"
                  style={{ color: "var(--kv-ink)" }}
                >
                  {PROTECTION_SCORE}
                </span>
              </div>
            </div>
            <span
              className="kv-body text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--kv-ink-soft)" }}
            >
              Protected
            </span>
          </div>
        </section>

        <div
          className="mb-16 h-px w-full"
          style={{ background: "var(--kv-card-border)" }}
        />

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* PRACTICES */}
          <div className="lg:col-span-3">
            <h3
              className="kv-body mb-6 text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "var(--kv-ink-soft)" }}
            >
              Core Protective Parameters
            </h3>

            <div>
              {bestPractices.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 border-t py-6 first:border-t-0 first:pt-0"
                  style={{ borderColor: "var(--kv-card-border)" }}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={17}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--kv-ink-soft)" }}
                  />
                  <div>
                    <h4
                      className="kv-display text-[14.5px] font-medium"
                      style={{ color: "var(--kv-ink)" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="kv-body mt-1.5 text-[13px] leading-relaxed"
                      style={{ color: "var(--kv-ink-soft)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR: ACTIVITY + ACTIONS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3
                className="kv-body text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "var(--kv-ink-soft)" }}
              >
                Recent Security Actions
              </h3>
              <HugeiconsIcon
                icon={Clock01Icon}
                size={14}
                style={{ color: "var(--kv-ink-soft)" }}
              />
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-3 w-3/4 rounded bg-slate-200/60 dark:bg-slate-800/60" />
                      <div className="h-2.5 w-1/2 rounded bg-slate-200/40 dark:bg-slate-800/40" />
                    </div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={18}
                    className="mb-2 text-slate-400"
                  />
                  <p
                    className="kv-body text-[13px]"
                    style={{ color: "var(--kv-ink-soft)" }}
                  >
                    No recent events logged
                  </p>
                </div>
              ) : (
                <ol>
                  {activity.map((log, idx) => (
                    <li
                      key={log.id}
                      className="relative flex gap-3.5 pb-6 last:pb-0"
                    >
                      {idx !== activity.length - 1 && (
                        <span
                          aria-hidden
                          className="absolute left-[3.5px] top-3.5 h-full w-px"
                          style={{ background: "var(--kv-card-border)" }}
                        />
                      )}
                      <span
                        className="relative mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ background: EVENT_COLOR[log.kind] }}
                      />
                      <div className="flex-1">
                        <span
                          className="kv-display block text-[13.5px] font-medium"
                          style={{ color: "var(--kv-ink)" }}
                        >
                          {log.event}
                        </span>
                        <span
                          className="kv-body mt-0.5 block text-[12px]"
                          style={{ color: "var(--kv-ink-soft)" }}
                        >
                          {log.device} · {log.location}
                        </span>
                        <span
                          className="kv-body mt-1 block text-[11px]"
                          style={{ color: "var(--kv-ink-soft)" }}
                        >
                          {log.time}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div
              className="my-8 h-px w-full"
              style={{ background: "var(--kv-card-border)" }}
            />

            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard/consents"
                className="group flex items-center justify-between border-b py-3 text-[13.5px] font-medium transition-colors"
                style={{
                  borderColor: "var(--kv-card-border)",
                  color: "var(--kv-ink)",
                }}
              >
                Review active consents
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: c.seal }}
                onClick={() =>
                  alert("Deep-linking sequence to app settings framework.")
                }
              >
                Configure device locks
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}