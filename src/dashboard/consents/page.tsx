import { useState, useEffect } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Building02Icon,
  LandmarkIcon,
  PillIcon,
  SecurityCheckIcon,
  HourglassIcon,
  HistoryIcon,
  CheckIcon,
  Cancel01Icon,
  ShieldMinusIcon,
  ChevronRightIcon,
  CalendarClockIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import { StatCard } from "../_components/StatCard";
import { Toast } from "../_components/Toast";
import { useToast } from "../_components/use-toast";
import TopBar from "../_components/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

const ORG_ICON: Record<OrgKind, IconSvgElement> = {
  hospital: Building02Icon,
  insurer: LandmarkIcon,
  pharmacy: PillIcon,
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
  const icon = ORG_ICON[kind] || Building02Icon;
  const tones: Record<"primary" | "muted", string> = {
    primary: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      <HugeiconsIcon icon={icon} size={19} strokeWidth={1.75} />
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
          className="rounded-md bg-muted px-2 py-1 text-10 font-medium uppercase tracking-wide text-muted-foreground"
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
        className="absolute inset-0 flex items-center justify-center text-11 font-semibold"
        style={{ color, ...fontMono }}
      >
        {daysLeft}d
      </div>
    </div>
  );
}

function EmptyState({ icon, label }: { icon: IconSvgElement; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} />
      </div>
      <p className="max-w-[240px] text-13 text-muted-foreground">{label}</p>
    </div>
  );
}

function PendingCard({
  item,
  onOpenApprove,
  onOpenDecline,
}: {
  item: PendingConsent;
  onOpenApprove: (item: PendingConsent) => void;
  onOpenDecline: (item: PendingConsent) => void;
}) {
  return (
    <div className="flex gap-3.5 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <OrgIcon kind={item.kind} tone="primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-14 font-medium text-foreground">
            {item.org}
          </p>
          <Badge className="shrink-0 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
            Pending
          </Badge>
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-11 text-muted-foreground"
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
            <HugeiconsIcon icon={CheckIcon} size={14} strokeWidth={2.25} />
            Review &amp; approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDecline(item)}
            className="gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2.25} />
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActiveCard({
  item,
  onOpenDetails,
  onOpenRevoke,
}: {
  item: ActiveConsent;
  onOpenDetails: (item: ActiveConsent) => void;
  onOpenRevoke: (item: ActiveConsent) => void;
}) {
  return (
    <div className="flex gap-3.5 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <OrgIcon kind={item.kind} tone="primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => onOpenDetails(item)}
            className="truncate text-left text-14 font-medium text-foreground hover:underline underline-offset-2"
          >
            {item.org}
          </button>
          <CountdownRing daysLeft={item.daysLeft} totalDays={item.totalDays} />
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-11 text-muted-foreground"
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
            <HugeiconsIcon icon={ChevronRightIcon} size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenRevoke(item)}
            className="gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={ShieldMinusIcon} size={14} strokeWidth={2} />
            Revoke access
          </Button>
        </div>
      </div>
    </div>
  );
}

const HISTORY_BADGE: Record<HistoryStatus, string> = {
  expired: "border-border bg-muted text-muted-foreground",
  revoked: "border-border bg-muted text-muted-foreground",
  declined:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400",
};
const HISTORY_LABEL: Record<HistoryStatus, string> = {
  expired: "Expired",
  revoked: "Revoked",
  declined: "Declined",
};

function HistoryCard({
  item,
  onOpenDetails,
}: {
  item: HistoryConsent;
  onOpenDetails: (item: HistoryConsent) => void;
}) {
  return (
    <button
      onClick={() => onOpenDetails(item)}
      className="flex w-full gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/60 sm:p-5"
    >
      <OrgIcon kind={item.kind} tone="muted" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-14 font-medium text-muted-foreground">
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
          className="mt-0.5 text-11 text-muted-foreground"
        >
          {HISTORY_LABEL[item.status]} {item.resolvedAt}
        </p>
        <ScopeChips scope={item.scope} />
      </div>
    </button>
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
            <DialogTitle style={fontDisplay} className="text-18">
              {item.org}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-13 leading-relaxed">
            {item.purpose}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="mb-2 text-12 font-medium text-muted-foreground">
              They're requesting access to
            </p>
            <ScopeChips scope={item.scope} />
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-12 font-medium text-muted-foreground">
              <HugeiconsIcon icon={CalendarClockIcon} size={13} />
              Grant access for
            </p>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  style={fontMono}
                  className={`flex-1 rounded-lg border py-2 text-13 font-medium transition-colors ${
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
              <p className="mt-2 text-11 text-muted-foreground">
                They asked for {item.requestedDays} days — you're granting{" "}
                {days}.
              </p>
            )}
          </div>

          <p className="rounded-lg bg-muted px-3 py-2 text-11 leading-relaxed text-muted-foreground">
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
            <HugeiconsIcon icon={CheckIcon} size={14} strokeWidth={2.25} />
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
            <DialogTitle style={fontDisplay} className="text-18">
              {item.org}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-12 font-medium text-muted-foreground">
              <HugeiconsIcon icon={Target01Icon} size={13} />
              Purpose
            </p>
            <p className="text-13 leading-relaxed text-muted-foreground">
              {detailText}
            </p>
          </div>

          <div>
            <p className="mb-2 text-12 font-medium text-muted-foreground">
              Data shared
            </p>
            <ScopeChips scope={item.scope} />
          </div>

          {isActive ? (
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
              <div>
                <p className="text-12 font-medium text-muted-foreground">
                  Time remaining
                </p>
                <p
                  style={fontMono}
                  className="text-11 text-muted-foreground"
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
              <p className="text-12 font-medium text-muted-foreground">
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
              <HugeiconsIcon icon={ShieldMinusIcon} size={14} />
              Revoke access
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ConsentsPage() {
  const [activeTab, setActiveTab] = useState("pending");
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

  const { toast, fireToast } = useToast();

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
    setActiveTab("active");
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
    setActiveTab("history");
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
    setActiveTab("history");
    fireToast(`Revoked access for ${item.org}`, "negative");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="Consents"
        subtitle="Manage who can see your health records, and for how long"
      />

      <main className="mx-auto max-w-4xl space-y-6 px-5 py-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={HourglassIcon}
            count={pending.length}
            label="Pending"
            tone="pending"
          />
          <StatCard
            icon={SecurityCheckIcon}
            count={active.length}
            label="Active"
            tone="approved"
          />
          <StatCard
            icon={HistoryIcon}
            count={history.length}
            label="Past"
            tone="neutral"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pending.length === 0 ? (
              <EmptyState
                icon={HourglassIcon}
                label="No pending requests right now."
              />
            ) : (
              pending.map((item) => (
                <PendingCard
                  key={item.id}
                  item={item}
                  onOpenApprove={setApproveTarget}
                  onOpenDecline={setDeclineTarget}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-3">
            {active.length === 0 ? (
              <EmptyState
                icon={SecurityCheckIcon}
                label="You haven't granted anyone access yet."
              />
            ) : (
              active.map((item) => (
                <ActiveCard
                  key={item.id}
                  item={item}
                  onOpenDetails={setDetailsTarget}
                  onOpenRevoke={setRevokeTarget}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {history.length === 0 ? (
              <EmptyState
                icon={HistoryIcon}
                label="Expired, declined, and revoked consents will show up here."
              />
            ) : (
              history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onOpenDetails={setDetailsTarget}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
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

