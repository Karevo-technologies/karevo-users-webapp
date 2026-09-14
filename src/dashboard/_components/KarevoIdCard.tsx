import { useState, type KeyboardEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, FlipHorizontalIcon } from "@hugeicons/core-free-icons";
import { useAuth } from "../../context/AuthContext";

/* Fixed "physical card" branding — not app theme colors, so these stay as
   literals the same way a real ID card's print colors don't re-theme. */
const cardBlueDeep = "#0A2559";
const cardBlue = "#123B8F";
const cardBlueLight = "#1E56C7";
const chipGoldFrom = "#E8D9A8";
const chipGoldTo = "#B99A55";

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
        <pattern id="kv-guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q10 4 20 20 T40 20" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M0 30 Q10 14 20 30 T40 30" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
          <path d="M0 10 Q10 -6 20 10 T40 10" fill="none" stroke="#FFFFFF" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="252" fill="url(#kv-guilloche)" />
    </svg>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="kv-mono text-8 uppercase tracking-[0.14em] text-white/45">{label}</div>
      <div className="kv-display text-13 font-semibold leading-tight text-white">{value}</div>
    </div>
  );
}

export function KarevoIdCard() {
  const { user } = useAuth();
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  const [firstName, ...rest] = (user?.name ?? "Karevo User").split(" ");
  const lastName = rest.join(" ") || "—";

  const fields = [
    { label: "First Name", value: firstName.toUpperCase() },
    { label: "Last Name", value: lastName.toUpperCase() },
    { label: "Karevo ID", value: "KV-2847-9931" },
    { label: "Status", value: "Verified" },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-8">
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
              className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                background: `linear-gradient(155deg, ${cardBlueLight} 0%, ${cardBlue} 45%, ${cardBlueDeep} 100%)`,
              }}
            >
              <SecurityPattern />
              <div
                className="kv-display pointer-events-none absolute -right-4 top-1/2 select-none text-64 font-bold text-white/[0.05]"
                style={{ transform: "translateY(-50%) rotate(-10deg)" }}
              >
                KAREVO
              </div>
              <div className="relative flex h-full flex-col justify-between p-3.5">
                <div className="flex items-start justify-between">
                  <div
                    className="h-6 w-8 rounded-[3px]"
                    style={{
                      background: `linear-gradient(155deg, ${chipGoldFrom} 0%, ${chipGoldTo} 100%)`,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div className="text-right">
                    <div className="kv-display text-13 font-bold leading-none text-white">KAREVO</div>
                    <div className="kv-mono mt-0.5 text-8 uppercase tracking-[0.16em] text-white/55">
                      Digital Health ID
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-[62px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-white/25 bg-white/[0.08]">
                    <HugeiconsIcon icon={UserIcon} size={28} className="text-white/40" />
                    <span className="kv-mono absolute bottom-0.5 text-5 uppercase tracking-wider text-white/35">
                      PHOTO
                    </span>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5">
                    {fields.map((f) => (
                      <FieldRow key={f.label} label={f.label} value={f.value} />
                    ))}
                  </div>
                </div>
                <div className="-mx-3.5 -mb-3.5 flex items-center justify-between bg-black/[0.18] px-3.5 py-2">
                  <div>
                    <div className="kv-mono text-8 uppercase tracking-[0.14em] text-white/45">
                      Karevo ID
                    </div>
                    <div className="kv-mono text-10 font-medium text-white">KV-2847-9931</div>
                  </div>
                  <div className="text-right">
                    <div className="kv-mono text-8 uppercase tracking-[0.14em] text-white/45">
                      Member since
                    </div>
                    <div className="kv-mono text-10 font-medium text-white">2024</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl shadow-xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: `linear-gradient(155deg, ${cardBlueLight} 0%, ${cardBlue} 45%, ${cardBlueDeep} 100%)`,
              }}
            >
              <SecurityPattern opacity={0.1} />
              <div className="relative flex h-full flex-col items-center justify-center gap-2 p-4">
                <div className="-mt-4 h-2.5 w-full bg-black/25" />
                <span className="kv-mono text-8 uppercase tracking-[0.2em] text-white/55">
                  Scan to verify
                </span>
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-2">
                  <div className="relative grid grid-cols-9 gap-[2px] rounded-md bg-white p-2" role="img" aria-label="Verified identity QR code">
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
                <div className="kv-mono text-10 font-medium text-white">KV-2847-9931</div>
                <p className="kv-body max-w-[220px] text-center text-8 leading-snug text-white/45">
                  Property of Karevo Health Systems. If found, please return to the nearest partner clinic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={FlipHorizontalIcon} size={14} strokeWidth={1.75} />
        <span className="kv-body text-12">Tap the card to flip</span>
      </div>
    </div>
  );
}
