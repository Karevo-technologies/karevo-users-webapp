"use client";

import { useState } from "react";
import TopBar from "../_components/topbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Hospital01Icon,
  Building02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  ShieldMinusIcon,
  HourglassIcon,
  ShieldUserIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

type IconType = typeof Hospital01Icon;
type ConsentStatus = "pending" | "active" | "expired" | "revoked" | "declined";

interface ConsentItem {
  id: string;
  org: string;
  icon: IconType;
  scope: string[];
  metaLabel: string;
  metaValue: string;
  status: ConsentStatus;
  /** 0–100, only meaningful for active items nearing expiry */
  daysRemainingPct?: number;
  daysRemainingLabel?: string;
}

const initialPending: ConsentItem[] = [
  {
    id: "p1",
    org: "Lagos University Teaching Hospital",
    icon: Hospital01Icon,
    scope: ["Lab results", "Immunization records"],
    metaLabel: "Requested",
    metaValue: "2 hours ago · asking for 30 days access",
    status: "pending",
  },
  {
    id: "p2",
    org: "AXA Mansard Health Insurance",
    icon: Building02Icon,
    scope: ["Full medical history"],
    metaLabel: "Requested",
    metaValue: "Yesterday · asking for 90 days access",
    status: "pending",
  },
];

const initialActive: ConsentItem[] = [
  {
    id: "a1",
    org: "Reddington Hospital",
    icon: Hospital01Icon,
    scope: ["Consultation notes", "Prescriptions"],
    metaLabel: "Granted",
    metaValue: "12 days ago",
    status: "active",
    daysRemainingPct: 60,
    daysRemainingLabel: "18 days left",
  },
  {
    id: "a2",
    org: "Wellu Diagnostics",
    icon: Building02Icon,
    scope: ["Lab results"],
    metaLabel: "Granted",
    metaValue: "40 days ago",
    status: "active",
    daysRemainingPct: 11,
    daysRemainingLabel: "5 days left",
  },
];

const initialHistory: ConsentItem[] = [
  {
    id: "h1",
    org: "St. Nicholas Hospital",
    icon: Hospital01Icon,
    scope: ["Vaccination records"],
    metaLabel: "Expired",
    metaValue: "3 weeks ago",
    status: "expired",
  },
  {
    id: "h2",
    org: "HealthPlus Pharmacy",
    icon: Building02Icon,
    scope: ["Prescription history"],
    metaLabel: "Revoked",
    metaValue: "2 months ago",
    status: "revoked",
  },
];

/** Maps status → shadcn's actual Badge variants only. No colors outside the theme. */
const statusBadge: Record<
  ConsentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  expired: { label: "Expired", variant: "outline" },
  revoked: { label: "Revoked", variant: "destructive" },
  declined: { label: "Declined", variant: "outline" },
};

function StatusBadge({ status }: { status: ConsentStatus }) {
  const s = statusBadge[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function StatCard({
  icon,
  count,
  label,
}: {
  icon: IconType;
  count: number;
  label: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="px-5 pt-6 pb-6">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={icon} size={20} strokeWidth={1.75} />
        </div>
        <p className="text-2xl font-semibold leading-none text-foreground">
          {count}
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function ScopeChips({ scope }: { scope: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {scope.map((s) => (
        <span
          key={s}
          className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function IconChip({ icon, muted }: { icon: IconType; muted?: boolean }) {
  return (
    <div
      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
        muted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      <HugeiconsIcon icon={icon} size={19} strokeWidth={1.75} />
    </div>
  );
}

function PendingRow({
  item,
  isLast,
  onApprove,
  onDecline,
}: {
  item: ConsentItem;
  isLast: boolean;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  return (
    <div className={`py-4 ${!isLast ? "border-b border-border" : ""}`}>
      <IconChip icon={item.icon} />

      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {item.org}
        </p>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-0.5 text-[12px] text-muted-foreground">
        {item.metaLabel} · {item.metaValue}
      </p>
      <ScopeChips scope={item.scope} />

      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          onClick={() => onApprove(item.id)}
          className="gap-1.5"
        >
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={15}
            strokeWidth={2}
          />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDecline(item.id)}
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} />
          Decline
        </Button>
      </div>
    </div>
  );
}

function ActiveRow({
  item,
  isLast,
  onRequestRevoke,
}: {
  item: ConsentItem;
  isLast: boolean;
  onRequestRevoke: (item: ConsentItem) => void;
}) {
  const nearExpiry = (item.daysRemainingPct ?? 100) <= 20;

  return (
    <div className={`py-4 ${!isLast ? "border-b border-border" : ""}`}>
      <IconChip icon={item.icon} />

      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {item.org}
        </p>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-0.5 text-[12px] text-muted-foreground">
        {item.metaLabel} · {item.metaValue}
      </p>
      <ScopeChips scope={item.scope} />

      {item.daysRemainingPct !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${nearExpiry ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${item.daysRemainingPct}%` }}
            />
          </div>
          <p
            className={`mt-1 text-[11px] ${nearExpiry ? "text-destructive" : "text-muted-foreground"}`}
          >
            {item.daysRemainingLabel}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRequestRevoke(item)}
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <HugeiconsIcon icon={ShieldMinusIcon} size={15} strokeWidth={2} />
          Revoke access
        </Button>
      </div>
    </div>
  );
}

function HistoryRow({ item, isLast }: { item: ConsentItem; isLast: boolean }) {
  return (
    <div
      className={`py-4 opacity-70 ${!isLast ? "border-b border-border" : ""}`}
    >
      <IconChip icon={item.icon} muted />

      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-foreground">
          {item.org}
        </p>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-0.5 text-[12px] text-muted-foreground">
        {item.metaLabel} · {item.metaValue}
      </p>
      <ScopeChips scope={item.scope} />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <HugeiconsIcon icon={ShieldUserIcon} size={18} strokeWidth={1.75} />
      </div>
      <p className="text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

export default function ConsentsPage() {
  const [pending, setPending] = useState<ConsentItem[]>(initialPending);
  const [active, setActive] = useState<ConsentItem[]>(initialActive);
  const [history, setHistory] = useState<ConsentItem[]>(initialHistory);
  const [revokeTarget, setRevokeTarget] = useState<ConsentItem | null>(null);

  function handleApprove(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    setPending((prev) => prev.filter((p) => p.id !== id));
    setActive((prev) => [
      {
        ...item,
        status: "active",
        metaLabel: "Granted",
        metaValue: "Just now",
        daysRemainingPct: 100,
        daysRemainingLabel: "Full term remaining",
      },
      ...prev,
    ]);
  }

  function handleDecline(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    setPending((prev) => prev.filter((p) => p.id !== id));
    setHistory((prev) => [
      {
        ...item,
        status: "declined",
        metaLabel: "Declined",
        metaValue: "Just now",
      },
      ...prev,
    ]);
  }

  function confirmRevoke() {
    if (!revokeTarget) return;
    setActive((prev) => prev.filter((a) => a.id !== revokeTarget.id));
    setHistory((prev) => [
      {
        ...revokeTarget,
        status: "revoked",
        metaLabel: "Revoked",
        metaValue: "Just now",
        daysRemainingPct: undefined,
        daysRemainingLabel: undefined,
      },
      ...prev,
    ]);
    setRevokeTarget(null);
  }

  return (
    <div>
      <TopBar title="Consents" />
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        {/* Summary strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={HourglassIcon}
            count={pending.length}
            label="Pending requests"
          />
          <StatCard
            icon={ShieldUserIcon}
            count={active.length}
            label="Active consents"
          />
          <StatCard
            icon={Clock01Icon}
            count={history.length}
            label="Past consents"
          />
        </div>

        {/* Pending requests */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">
              Pending requests
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {pending.length === 0 ? (
              <EmptyState label="No pending requests right now." />
            ) : (
              <div className="flex flex-col">
                {pending.map((item, i) => (
                  <PendingRow
                    key={item.id}
                    item={item}
                    isLast={i === pending.length - 1}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active consents */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">
              Active consents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {active.length === 0 ? (
              <EmptyState label="You haven't granted anyone access yet." />
            ) : (
              <div className="flex flex-col">
                {active.map((item, i) => (
                  <ActiveRow
                    key={item.id}
                    item={item}
                    isLast={i === active.length - 1}
                    onRequestRevoke={setRevokeTarget}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">History</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {history.length === 0 ? (
              <EmptyState label="Expired, declined, and revoked consents will show up here." />
            ) : (
              <div className="flex flex-col">
                {history.map((item, i) => (
                  <HistoryRow
                    key={item.id}
                    item={item}
                    isLast={i === history.length - 1}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open: boolean) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Revoke access for {revokeTarget?.org}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will immediately lose access to{" "}
              {revokeTarget?.scope.join(", ").toLowerCase()}. You can't undo
              this — they'd need to send a new request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
