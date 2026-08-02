"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Landmark,
  Pill,
  ShieldCheck,
  Hourglass,
  History as HistoryIcon,
  Check,
  X,
  ShieldOff,
  ChevronRight,
  CalendarClock,
  Target,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/* ---------------------------------------------------------------------- */
/* Fonts + palette                                                        */
/* ---------------------------------------------------------------------- */
/* Display: Space Grotesk (used for org names + modal titles)             */
/* Body: Inter                                                            */
/* Utility/ledger: ui-monospace (timestamps, durations, scope tags)       */
/* Palette: blue as primary, soft blue/gray for pending, neutral gray for */
/* decline/revoke — matching the home page blue + white principle.        */

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};
const fontMono = {
  fontFamily: "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
};

/* ---------------------------------------------------------------------- */
/* Types                                                                   */
/* ---------------------------------------------------------------------- */

type OrgKind = "hospital" | "insurer" | "pharmacy";

interface PendingConsent {
  id: string;
  org: string;
  kind: OrgKind;
  scope: string[];
  requestedAt: string;
  requestedDays: number;
  purpose: string;
}

interface ActiveConsent {
  id: string;
  org: string;
  kind: OrgKind;
  scope: string[];
  grantedAt: string;
  totalDays: number;
  daysLeft: number;
  purpose: string;
}

type HistoryStatus = "expired" | "revoked" | "declined";

interface HistoryConsent {
  id: string;
  org: string;
  kind: OrgKind;
  scope: string[];
  status: HistoryStatus;
  resolvedAt: string;
  note: string;
}

type ToastState = { message: string; tone: string } | null;

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

const ORG_ICON: Record<OrgKind, LucideIcon> = {
  hospital: Building2,
  insurer: Landmark,
  pharmacy: Pill,
};

const initialPending: PendingConsent[] = [
  {
    id: "p1",
    org: "Lagos University Teaching Hospital",
    kind: "hospital",
    scope: ["Lab results", "Immunization records"],
    requestedAt: "2 hours ago",
    requestedDays: 30,
    purpose:
      "To review your recent lab results ahead of your consultation on Aug 4.",
  },
  {
    id: "p2",
    org: "AXA Mansard Health Insurance",
    kind: "insurer",
    scope: ["Full medical history"],
    requestedAt: "Yesterday",
    requestedDays: 90,
    purpose: "To assess your claim under policy #AXM-22841.",
  },
];

const initialActive: ActiveConsent[] = [
  {
    id: "a1",
    org: "Reddington Hospital",
    kind: "hospital",
    scope: ["Consultation notes", "Prescriptions"],
    grantedAt: "12 days ago",
    totalDays: 30,
    daysLeft: 18,
    purpose: "Ongoing care for ENT follow-up treatment.",
  },
  {
    id: "a2",
    org: "Wellu Diagnostics",
    kind: "hospital",
    scope: ["Lab results"],
    grantedAt: "40 days ago",
    totalDays: 45,
    daysLeft: 5,
    purpose: "Quarterly diagnostic panel results.",
  },
];

const initialHistory: HistoryConsent[] = [
  {
    id: "h1",
    org: "St. Nicholas Hospital",
    kind: "hospital",
    scope: ["Vaccination records"],
    status: "expired",
    resolvedAt: "3 weeks ago",
    note: "Access period ended automatically. No action was taken by St. Nicholas Hospital after expiry.",
  },
  {
    id: "h2",
    org: "HealthPlus Pharmacy",
    kind: "pharmacy",
    scope: ["Prescription history"],
    status: "revoked",
    resolvedAt: "2 months ago",
    note: "You revoked this access early.",
  },
];

const DURATION_OPTIONS = [7, 30, 90];

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function OrgIcon({
  kind,
  tone = "primary",
}: {
  kind: OrgKind;
  tone?: "primary" | "muted";
}) {
  const Icon = ORG_ICON[kind] || Building2;
  const tones: Record<"primary" | "muted", string> = {
    primary:
      "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-blue-100 dark:ring-blue-900",
    muted: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
    >
      <Icon size={19} strokeWidth={1.75} />
    </div>
  );
}

function ScopeChips({ scope }: { scope: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {scope.map((s) => (
        <span
          key={s}
          style={fontMono}
          className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

/* Signature element: a countdown ring instead of a flat bar. It literally
   visualises the thing that makes health-data consent different from a
   normal permission toggle: it decays on its own, on a clock the person
   set when they didn't fully decide it, and they can always cut it early */
function CountdownRing({
  daysLeft,
  totalDays,
  size = 44,
}: {
  daysLeft: number;
  totalDays: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(1, daysLeft / totalDays));
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const critical = daysLeft <= Math.max(3, totalDays * 0.15);
  const warning = !critical && daysLeft <= totalDays * 0.3;
  const color = critical ? "#1d4ed8" : warning ? "#2563eb" : "#3452d9";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${daysLeft} of ${totalDays} days remaining`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
        style={{ color, ...fontMono }}
      >
        {daysLeft}d
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  count,
  label,
  tone,
}: {
  icon: LucideIcon;
  count: number;
  label: string;
  tone: "primary" | "muted";
}) {
  const tones: Record<"primary" | "muted", string> = {
    primary: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <p className="text-2xl font-semibold leading-none text-foreground">
        {count}
      </p>
      <p className="mt-1.5 text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | null;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-5 py-4">
        <h2
          className="text-[15px] font-semibold text-foreground"
          style={fontDisplay}
        >
          {title}
        </h2>
        {subtitle && (
          <span className="text-[12px] text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <div className="px-5">{children}</div>
    </section>
  );
}

function EmptyState({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <p className="max-w-[240px] text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* Timeline row wrapper — a left connector rail makes sense here because
   every list on this page genuinely is a chronological sequence of
   consent events, not a decorative numbering scheme. */
function TimelineRow({
  children,
  isLast,
}: {
  children: ReactNode;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-4 py-4">
      {!isLast && (
        <span className="absolute left-[21px] top-[52px] bottom-[-16px] w-px bg-border" />
      )}
      {children}
    </div>
  );
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  const isPositive = toast.tone === "positive";
  return (
    <div
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-foreground shadow-lg animate-in fade-in slide-in-from-top-2 dark:bg-stone-900">
        {isPositive ? (
          <CheckCircle2 size={16} className="shrink-0 text-blue-600" />
        ) : (
          <XCircle size={16} className="shrink-0 text-blue-600" />
        )}
        <span className="text-[13px]">{toast.message}</span>
      </div>
    </div>
  );
}

function PendingRow({
  item,
  isLast,
  onOpenApprove,
  onOpenDecline,
}: {
  item: PendingConsent;
  isLast: boolean;
  onOpenApprove: (item: PendingConsent) => void;
  onOpenDecline: (item: PendingConsent) => void;
}) {
  return (
    <TimelineRow isLast={isLast}>
      <OrgIcon kind={item.kind} tone="primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[14px] font-medium text-foreground">
            {item.org}
          </p>
          <Badge className="shrink-0 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Pending
          </Badge>
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-[11px] text-muted-foreground"
        >
          Requested {item.requestedAt} · asking for {item.requestedDays} days
        </p>
        <ScopeChips scope={item.scope} />
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            onClick={() => onOpenApprove(item)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700"
          >
            <Check size={14} strokeWidth={2.25} />
            Review &amp; approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDecline(item)}
            className="gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={14} strokeWidth={2.25} />
            Decline
          </Button>
        </div>
      </div>
    </TimelineRow>
  );
}

function ActiveRow({
  item,
  isLast,
  onOpenDetails,
  onOpenRevoke,
}: {
  item: ActiveConsent;
  isLast: boolean;
  onOpenDetails: (item: ActiveConsent) => void;
  onOpenRevoke: (item: ActiveConsent) => void;
}) {
  return (
    <TimelineRow isLast={isLast}>
      <OrgIcon kind={item.kind} tone="primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => onOpenDetails(item)}
            className="truncate text-left text-[14px] font-medium text-foreground hover:underline underline-offset-2"
          >
            {item.org}
          </button>
          <CountdownRing daysLeft={item.daysLeft} totalDays={item.totalDays} />
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-[11px] text-muted-foreground"
        >
          Granted {item.grantedAt}
        </p>
        <ScopeChips scope={item.scope} />
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenDetails(item)}
            className="gap-1 text-muted-foreground hover:bg-muted"
          >
            Details
            <ChevronRight size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenRevoke(item)}
            className="gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ShieldOff size={14} strokeWidth={2} />
            Revoke access
          </Button>
        </div>
      </div>
    </TimelineRow>
  );
}

const HISTORY_BADGE: Record<HistoryStatus, string> = {
  expired: "border-border bg-muted text-muted-foreground",
  revoked:
    "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
  declined: "border-border bg-muted text-muted-foreground",
};
const HISTORY_LABEL: Record<HistoryStatus, string> = {
  expired: "Expired",
  revoked: "Revoked",
  declined: "Declined",
};

function HistoryRow({
  item,
  isLast,
  onOpenDetails,
}: {
  item: HistoryConsent;
  isLast: boolean;
  onOpenDetails: (item: HistoryConsent) => void;
}) {
  return (
    <TimelineRow isLast={isLast}>
      <OrgIcon kind={item.kind} tone="muted" />
      <button
        onClick={() => onOpenDetails(item)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[14px] font-medium text-muted-foreground">
            {item.org}
          </p>
          <Badge
            variant="outline"
            className={`shrink-0 ${HISTORY_BADGE[item.status]}`}
          >
            {HISTORY_LABEL[item.status]}
          </Badge>
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-[11px] text-muted-foreground"
        >
          {HISTORY_LABEL[item.status]} {item.resolvedAt}
        </p>
        <ScopeChips scope={item.scope} />
      </button>
    </TimelineRow>
  );
}

function ApproveModal({
  item,
  open,
  onOpenChange,
  onConfirm,
}: {
  item: PendingConsent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: PendingConsent, days: number) => void;
}) {
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (item) setDays(item.requestedDays);
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <OrgIcon kind={item.kind} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              {item.org}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px] leading-relaxed">
            {item.purpose}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">
              They're requesting access to
            </p>
            <ScopeChips scope={item.scope} />
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
              <CalendarClock size={13} />
              Grant access for
            </p>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  style={fontMono}
                  className={`flex-1 rounded-lg border py-2 text-[13px] font-medium transition-colors ${
                    days === d
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
            {days !== item.requestedDays && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                They asked for {item.requestedDays} days — you're granting{" "}
                {days}.
              </p>
            )}
          </div>

          <p className="rounded-lg bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            You can revoke this at any time before it expires. They'll be
            notified once you approve.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(item, days)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700"
          >
            <Check size={14} strokeWidth={2.25} />
            Grant {days}-day access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeclineDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: {
  item: PendingConsent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: PendingConsent) => void;
}) {
  if (!item) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decline {item.org}?</AlertDialogTitle>
          <AlertDialogDescription>
            They won't get access to {item.scope.join(", ").toLowerCase()}. They
            can send a new request later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(item)}
            className="bg-muted text-foreground hover:bg-muted/70"
          >
            Decline request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RevokeDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: {
  item: ActiveConsent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: ActiveConsent) => void;
}) {
  if (!item) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke access for {item.org}?</AlertDialogTitle>
          <AlertDialogDescription>
            They'll immediately lose access to{" "}
            {item.scope.join(", ").toLowerCase()}. This can't be undone — they'd
            need to send a new request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(item)}
            className="bg-muted text-foreground hover:bg-muted/70"
          >
            Revoke access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DetailsItem = ActiveConsent | HistoryConsent;

function DetailsModal({
  item,
  open,
  onOpenChange,
  onOpenRevoke,
}: {
  item: DetailsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRevoke: (item: ActiveConsent) => void;
}) {
  if (!item) return null;
  const isActive = !("status" in item);
  const detailText = isActive ? item.purpose : item.note;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <OrgIcon kind={item.kind} tone={isActive ? "primary" : "muted"} />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              {item.org}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
              <Target size={13} />
              Purpose
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {detailText}
            </p>
          </div>

          <div>
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">
              Data shared
            </p>
            <ScopeChips scope={item.scope} />
          </div>

          {isActive ? (
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
              <div>
                <p className="text-[12px] font-medium text-muted-foreground">
                  Time remaining
                </p>
                <p
                  style={fontMono}
                  className="text-[11px] text-muted-foreground"
                >
                  Granted {item.grantedAt} · {item.totalDays}-day term
                </p>
              </div>
              <CountdownRing
                daysLeft={item.daysLeft}
                totalDays={item.totalDays}
                size={40}
              />
            </div>
          ) : (
            <div className="rounded-lg bg-muted px-3 py-2.5">
              <p className="text-[12px] font-medium text-muted-foreground">
                {HISTORY_LABEL[item.status]} {item.resolvedAt}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Close
          </Button>
          {isActive && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onOpenRevoke(item);
              }}
              variant="outline"
              className="gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ShieldOff size={14} />
              Revoke access
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ConsentsPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<PendingConsent[]>(initialPending);
  const [active, setActive] = useState<ActiveConsent[]>(initialActive);
  const [history, setHistory] = useState<HistoryConsent[]>(initialHistory);

  const [approveTarget, setApproveTarget] = useState<PendingConsent | null>(
    null,
  );
  const [declineTarget, setDeclineTarget] = useState<PendingConsent | null>(
    null,
  );
  const [revokeTarget, setRevokeTarget] = useState<ActiveConsent | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<DetailsItem | null>(null);

  const [toast, setToast] = useState<ToastState>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function fireToast(message: string, tone = "positive") {
    setToast({ message, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  function handleApprove(item: PendingConsent, days: number) {
    setPending((prev) => prev.filter((p) => p.id !== item.id));
    setActive((prev) => [
      {
        ...item,
        grantedAt: "Just now",
        totalDays: days,
        daysLeft: days,
      },
      ...prev,
    ]);
    setApproveTarget(null);
    fireToast(`Approved ${item.org} for ${days} days`, "positive");
  }

  function handleDecline(item: PendingConsent) {
    setPending((prev) => prev.filter((p) => p.id !== item.id));
    setHistory((prev) => [
      {
        ...item,
        status: "declined",
        resolvedAt: "just now",
        note: "You declined this request.",
      },
      ...prev,
    ]);
    setDeclineTarget(null);
    fireToast(`Declined ${item.org}`, "negative");
  }

  function handleRevoke(item: ActiveConsent) {
    setActive((prev) => prev.filter((a) => a.id !== item.id));
    setHistory((prev) => [
      {
        ...item,
        status: "revoked",
        resolvedAt: "just now",
        note: "You revoked this access early.",
      },
      ...prev,
    ]);
    setRevokeTarget(null);
    fireToast(`Revoked access for ${item.org}`, "negative");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1
              style={fontDisplay}
              className="text-[19px] font-semibold text-foreground"
            >
              Consents
            </h1>
            <p className="text-[12.5px] text-muted-foreground">
              Manage who can see your health records, and for how long
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-5 py-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Hourglass}
            count={pending.length}
            label="Pending"
            tone="primary"
          />
          <StatCard
            icon={ShieldCheck}
            count={active.length}
            label="Active"
            tone="primary"
          />
          <StatCard
            icon={HistoryIcon}
            count={history.length}
            label="Past"
            tone="muted"
          />
        </div>

        <SectionCard
          title="Pending requests"
          subtitle={pending.length ? `${pending.length} waiting on you` : null}
        >
          {pending.length === 0 ? (
            <EmptyState
              icon={Hourglass}
              label="No pending requests right now."
            />
          ) : (
            pending.map((item, i) => (
              <PendingRow
                key={item.id}
                item={item}
                isLast={i === pending.length - 1}
                onOpenApprove={setApproveTarget}
                onOpenDecline={setDeclineTarget}
              />
            ))
          )}
        </SectionCard>

        <SectionCard title="Active consents">
          {active.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              label="You haven't granted anyone access yet."
            />
          ) : (
            active.map((item, i) => (
              <ActiveRow
                key={item.id}
                item={item}
                isLast={i === active.length - 1}
                onOpenDetails={setDetailsTarget}
                onOpenRevoke={setRevokeTarget}
              />
            ))
          )}
        </SectionCard>

        <SectionCard title="History">
          {history.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              label="Expired, declined, and revoked consents will show up here."
            />
          ) : (
            history.map((item, i) => (
              <HistoryRow
                key={item.id}
                item={item}
                isLast={i === history.length - 1}
                onOpenDetails={setDetailsTarget}
              />
            ))
          )}
        </SectionCard>
      </main>

      <ApproveModal
        item={approveTarget}
        open={!!approveTarget}
        onOpenChange={(o) => !o && setApproveTarget(null)}
        onConfirm={handleApprove}
      />
      <DeclineDialog
        item={declineTarget}
        open={!!declineTarget}
        onOpenChange={(o) => !o && setDeclineTarget(null)}
        onConfirm={handleDecline}
      />
      <RevokeDialog
        item={revokeTarget}
        open={!!revokeTarget}
        onOpenChange={(o) => !o && setRevokeTarget(null)}
        onConfirm={handleRevoke}
      />
      <DetailsModal
        item={detailsTarget}
        open={!!detailsTarget}
        onOpenChange={(o) => !o && setDetailsTarget(null)}
        onOpenRevoke={setRevokeTarget}
      />

      <Toast toast={toast} />
    </div>
  );
}

