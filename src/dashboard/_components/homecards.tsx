"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  ScanIcon,
  Key01Icon,
  SparklesIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserIcon,
  FlipHorizontalIcon,
} from "@hugeicons/core-free-icons";

/** Design tokens — kept local so this drops in without a Tailwind config change. */
const c = {
  cardBlueDeep: "#0A2559",
  cardBlue: "#123B8F",
  cardBlueLight: "#1E56C7",
  signal: "#3452D9",
  verify: "#1C8C74",
  chipGoldFrom: "#E8D9A8",
  chipGoldTo: "#B99A55",
};

function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

      .kv-display { font-family: 'Space Grotesk', 'Avenir Next', 'Segoe UI', ui-sans-serif, system-ui, sans-serif; }
      .kv-body { font-family: 'Inter', 'Segoe UI', ui-sans-serif, system-ui, sans-serif; }
      .kv-mono { font-family: ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace; }

      .kv-root {
        --kv-card-bg: #FFFFFF;
        --kv-card-border: #E7E9EE;
        --kv-ink: #10151C;
        --kv-ink-soft: #63697A;
        --kv-chip-bg: rgba(52, 82, 217, 0.08);
        --kv-chip-fg: #3452D9;
        --kv-more-bg: rgba(16, 21, 28, 0.04);
        --kv-more-fg: #63697A;
        --kv-more-bg-hover: rgba(16, 21, 28, 0.07);
      }
      .dark .kv-root {
        --kv-card-bg: #141927;
        --kv-card-border: rgba(255, 255, 255, 0.08);
        --kv-ink: #F2F4F7;
        --kv-ink-soft: #9AA1B4;
        --kv-chip-bg: rgba(90, 124, 255, 0.16);
        --kv-chip-fg: #8DA2FF;
        --kv-more-bg: rgba(255, 255, 255, 0.06);
        --kv-more-fg: #C3C8D6;
        --kv-more-bg-hover: rgba(255, 255, 255, 0.1);
      }

      @keyframes kv-sheen {
        0% { transform: translateY(-140%); opacity: 0; }
        20% { opacity: 0.8; }
        60% { opacity: 0.8; }
        100% { transform: translateY(160%); opacity: 0; }
      }
      @keyframes kv-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      .kv-sheen { animation: kv-sheen 5s ease-in-out infinite; }
      .kv-live-dot { animation: kv-pulse 2.2s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .kv-sheen, .kv-live-dot { animation: none !important; }
      }
    `}</style>
  );
}

interface LedgerCardProps {
  title: string;
  description: string;
  tag?: string;
  icon: typeof Shield01Icon;
  onMore?: { label: string; onClick?: () => void };
}

const LedgerCard = ({
  title,
  description,
  tag,
  icon,
  onMore,
}: LedgerCardProps) => (
  <div className="flex flex-row items-center justify-between gap-4 w-full h-full">
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "var(--kv-chip-bg)", color: "var(--kv-chip-fg)" }}
      >
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.75} />
      </div>

      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <h3
            className="kv-display text-[17px] font-semibold tracking-tight truncate"
            style={{ color: "var(--kv-ink)" }}
          >
            {title}
          </h3>
          {tag && (
            <span
              className="kv-mono inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider shrink-0"
              style={{
                borderColor: "var(--kv-card-border)",
                color: "var(--kv-ink-soft)",
              }}
            >
              {tag}
            </span>
          )}
        </div>
        <p
          className="kv-body text-[13.5px] leading-relaxed break-words"
          style={{ color: "var(--kv-ink-soft)" }}
        >
          {description}
        </p>
      </div>
    </div>

    {onMore && (
      <div className="flex shrink-0 items-center justify-center">
        <button
          type="button"
          aria-label={onMore.label}
          onClick={onMore.onClick}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 shadow-sm"
          style={{
            background: "var(--kv-more-bg)",
            color: "var(--kv-more-fg)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--kv-more-bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--kv-more-bg)")
          }
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
        </button>
      </div>
    )}
  </div>
);

function SecurityPattern({ opacity = 0.14 }: { opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
      preserveAspectRatio="none"
      viewBox="0 0 400 252"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="kv-guilloche"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 20 Q10 4 20 20 T40 20"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
          <path
            d="M0 30 Q10 14 20 30 T40 30"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.5"
          />
          <path
            d="M0 10 Q10 -6 20 10 T40 10"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>
      <rect width="400" height="252" fill="url(#kv-guilloche)" />
    </svg>
  );
}

interface FieldRowProps {
  label: string;
  value: string;
}

const FieldRow = ({ label, value }: FieldRowProps) => (
  <div>
    <div className="kv-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
      {label}
    </div>
    <div className="kv-display text-[12.5px] font-semibold leading-tight text-white">
      {value}
    </div>
  </div>
);

function IdCardFlip() {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  const fields: FieldRowProps[] = [
    { label: "Surname", value: "ADEYEMI" },
    { label: "First Name", value: "CHIOMA" },
    { label: "Last Name", value: "NGOZI" },
    { label: "Date of Birth", value: "14 MAR 1994" },
    { label: "Gender", value: "Female" },
  ];

  return (
    <div className="w-full max-w-[320px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="group relative aspect-[1.586/1] w-full cursor-pointer outline-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="motion-reduce:transition-none relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] focus-visible:ring-2 group-focus-visible:ring-2"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionTimingFunction: "cubic-bezier(0.645, 0.045, 0.355, 1)",
          }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[16px] shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: `linear-gradient(155deg, ${c.cardBlueLight} 0%, ${c.cardBlue} 45%, ${c.cardBlueDeep} 100%)`,
            }}
          >
            <SecurityPattern />
            <div
              className="kv-display pointer-events-none absolute -right-4 top-1/2 select-none text-[64px] font-bold text-white/[0.05]"
              style={{ transform: "translateY(-50%) rotate(-10deg)" }}
            >
              KAREVO
            </div>
            <div className="relative flex h-full flex-col justify-between p-3.5">
              <div className="flex items-start justify-between">
                <div className="kv-display text-[13px] font-bold leading-none text-white">
                  KAREVO
                  <div className="kv-mono mt-0.5 text-[7px] uppercase tracking-[0.16em] text-white/55">
                    Digital Health ID
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="relative flex h-[62px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-white/25"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={28}
                    className="text-white/40"
                  />
                  <span className="kv-mono absolute bottom-0.5 text-[5px] uppercase tracking-wider text-white/35">
                    PHOTO
                  </span>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5">
                  {fields.map((f) => (
                    <FieldRow key={f.label} label={f.label} value={f.value} />
                  ))}
                </div>
              </div>
              <div
                className="-mx-3.5 -mb-3.5 flex items-center justify-between px-3.5 py-2"
                style={{ background: "rgba(0,0,0,0.18)" }}
              >
                <div>
                  <div className="kv-mono text-[7px] uppercase tracking-[0.14em] text-white/45">
                    Passport No.
                  </div>
                  <div className="kv-mono text-[10.5px] font-medium text-white">
                    A01 234567
                  </div>
                </div>
                <div className="text-right">
                  <div className="kv-mono text-[7px] uppercase tracking-[0.14em] text-white/45">
                    Karevo ID
                  </div>
                  <div className="kv-mono text-[10.5px] font-medium text-white">
                    KV-2847-9931
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[16px] shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(155deg, ${c.cardBlueLight} 0%, ${c.cardBlue} 45%, ${c.cardBlueDeep} 100%)`,
            }}
          >
            <SecurityPattern opacity={0.1} />
            <div className="relative flex h-full flex-col items-center justify-center gap-2 p-4">
              <div
                className="w-full"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  height: "10px",
                  marginTop: "-16px",
                }}
              />
              <span className="kv-mono text-[8px] uppercase tracking-[0.2em] text-white/55">
                Scan to verify
              </span>
              <div
                className="relative overflow-hidden rounded-lg p-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="kv-sheen pointer-events-none absolute left-0 top-0 h-1/3 w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <div
                  className="relative grid grid-cols-9 gap-[2px] rounded-md bg-white p-2"
                  role="img"
                  aria-label="Verified identity QR code"
                >
                  {Array.from({ length: 81 }).map((_, i) => {
                    const on = (i * 19 + (i % 9)) % 8 < 3;
                    return (
                      <div
                        key={i}
                        className="h-[6px] w-[6px] rounded-[1px]"
                        style={{ background: on ? "#10151C" : "#ECEEF2" }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="kv-mono text-[10px] font-medium text-white">
                KV-2847-9931
              </div>
              <p className="kv-body max-w-[220px] text-center text-[8.5px] leading-snug text-white/45">
                Property of Karevo Health Systems. If found, please return to
                the nearest partner clinic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KIdBadge() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 rounded-[28px] px-7 py-6 lg:py-24"
      style={{
        background: "var(--kv-chip-bg)",
        border: "1px solid var(--kv-card-border)",
      }}
    >
      <IdCardFlip />
      <div
        className="flex items-center gap-2"
        style={{ color: "var(--kv-ink-soft)" }}
      >
        <HugeiconsIcon icon={FlipHorizontalIcon} size={14} strokeWidth={1.75} />
        <span className="kv-body text-[12px]">Tap the card to flip</span>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "var(--kv-card-bg)",
  border: "1px solid var(--kv-card-border)",
};
const cardBase =
  "rounded-[24px] shadow-[0_1px_2px_rgba(16,21,28,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(16,21,28,0.06)]";

export default function HomeCards() {
  const navigate = useNavigate();
  const [activeTip, setActiveTip] = useState(0);

  const tips = [
    {
      title: "Safeguard your digital identity",
      description: "Click here to learn how to keep your identity safe",
    },
    {
      title: "Verify your ID securely",
      description: "Ensure your credentials are verified safely",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [tips.length]);

  // Master click routing handler across carousel states
  const handleCardRedirect = () => {
    navigate("/dashboard/security");
  };

  return (
    <div className="kv-root kv-body">
      <Fonts />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Hero: K-ID flip card */}
        <div className="lg:col-span-1">
          <KIdBadge />
        </div>

        {/* Right column: tips, then scan + token layout channels */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* ── UPDATED CAROUSEL CONTAINER CARD ── */}
          <Card
            className={`${cardBase} flex-1 border-0 cursor-pointer select-none focus-visible:ring-2`}
            style={cardStyle}
            onClick={handleCardRedirect}
          >
            <CardContent className="flex h-full flex-col gap-6 pt-6">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--kv-chip-bg)",
                    color: "var(--kv-chip-fg)",
                  }}
                >
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={20}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Manual control nodes are preserved. stopPropagation blocks parent row capture triggers */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTip((p) => (p - 1 + tips.length) % tips.length)
                    }
                    className="rounded-full border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      borderColor: "var(--kv-card-border)",
                      color: "var(--kv-ink-soft)",
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={14}
                      strokeWidth={2}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTip((p) => (p + 1) % tips.length)}
                    className="rounded-full border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      borderColor: "var(--kv-card-border)",
                      color: "var(--kv-ink-soft)",
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>

              {/* Layout Content wrapper stays un-compromised */}
              <div
                className="flex-1 border-t pt-5"
                style={{ borderColor: "var(--kv-card-border)" }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="kv-display text-[16px] font-semibold"
                      style={{ color: "var(--kv-ink)" }}
                    >
                      {tips[activeTip].title}
                    </h3>
                  </div>
                  <p
                    className="kv-body mt-1.5 text-[13.5px] leading-relaxed"
                    style={{ color: "var(--kv-ink-soft)" }}
                  >
                    {tips[activeTip].description}
                  </p>
                </div>
              </div>

              {/* Bottom Carousel Pagination Tracker with stopPropagation support */}
              <div
                className="flex items-center justify-between border-t pt-4"
                style={{ borderColor: "var(--kv-card-border)" }}
              >
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tips.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveTip(i)}
                      className="h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        width: i === activeTip ? "22px" : "6px",
                        background:
                          i === activeTip ? c.signal : "var(--kv-card-border)",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="kv-mono text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--kv-ink-soft)" }}
                >
                  {activeTip + 1} / {tips.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Dual balanced scan and temporary share tokens rows */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card
              className={`${cardBase} border-0 cursor-pointer select-none`}
              style={cardStyle}
              onClick={() => navigate("/dashboard/scan")}
            >
              <CardContent className="pt-6 h-full">
                <LedgerCard
                  icon={ScanIcon}
                  title="Scan a QR code"
                  description="Scan the QR code to share your identity data"
                  onMore={{
                    label: "Open QR scanner",
                    onClick: (e?: React.MouseEvent) => {
                      if (e) e.stopPropagation();
                      navigate("/dashboard/scan");
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card
              className={`${cardBase} border-0 cursor-pointer select-none`}
              style={cardStyle}
              onClick={() => navigate("/dashboard/share-token")}
            >
              <CardContent className="pt-6 h-full">
                <LedgerCard
                  icon={Key01Icon}
                  tag="Temporary access"
                  title="Create a share token"
                  description="Generate a time-limited code so a clinic can view specific records nothing more."
                  onMore={{
                    label: "Create a share token",
                    onClick: (e?: React.MouseEvent) => {
                      if (e) e.stopPropagation();
                      navigate("/dashboard/share-token");
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Primary ecosystem integrations banner */}
      <Card className={`${cardBase} mt-5 border-0`} style={cardStyle}>
        <CardContent className="pt-6">
          <LedgerCard
            icon={SparklesIcon}
            tag="Integrations"
            title="Explore the Karevo ecosystem"
            description="Connect hospital systems, confirm insurance, and keep every record request in one place."
            onMore={{ label: "View integration modules" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
