"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Droplet,
  Syringe,
  Pill,
  FileText,
  Eye,
  CalendarClock,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  mockPatientRecords,
  type PatientRecord,
} from "./mockPatientRecords";

/* ---------------------------------------------------------------------- */
/* Fonts — matches src/dashboard/consents/page.tsx exactly                */
/* ---------------------------------------------------------------------- */

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};
const fontMono = {
  fontFamily: "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
};

/* ---------------------------------------------------------------------- */
/* Record type → icon                                                     */
/* ---------------------------------------------------------------------- */

const TYPE_ICON: Record<string, LucideIcon> = {
  "Blood Test Result": Droplet,
  "Vaccination History": Syringe,
  Prescription: Pill,
};

function iconForType(type: string): LucideIcon {
  return TYPE_ICON[type] || FileText;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function RecordIcon({ type }: { type: string }) {
  const Icon = iconForType(type);
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900">
      <Icon size={18} strokeWidth={1.75} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <FileText size={20} strokeWidth={1.5} />
      </div>
      <p className="max-w-[280px] text-[13px] text-muted-foreground">
        Your records will appear here once a verified lab or hospital sends
        them to your K-ID profile.
      </p>
    </div>
  );
}

function RecordCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-2.5 h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-20 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

function RecordCard({
  record,
  onView,
}: {
  record: PatientRecord;
  onView: (record: PatientRecord) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <RecordIcon type={record.type} />
      <p
        style={fontDisplay}
        className="mt-4 text-[15px] font-semibold text-foreground"
      >
        {record.type}
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Issued by {record.issuedBy}
      </p>
      <p style={fontMono} className="mt-1.5 text-[11px] text-muted-foreground">
        {formatDate(record.issuedDate)}
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onView(record)}
        className="mt-4 gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Eye size={14} strokeWidth={2} />
        View
      </Button>
    </div>
  );
}

function RecordModal({
  record,
  open,
  onOpenChange,
}: {
  record: PatientRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RecordIcon type={record.type} />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              {record.type}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px]">
            Issued by {record.issuedBy}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
              <CalendarClock size={13} />
              Date issued
            </p>
            <p style={fontMono} className="text-[12.5px] text-foreground">
              {formatDate(record.issuedDate)}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">
              Summary
            </p>
            <p className="text-[13px] leading-relaxed text-foreground">
              {record.summary}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">
              Details
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {record.details}
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-muted px-3 py-2.5">
            <Lock size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[12px] font-semibold text-foreground">
                View Only
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                This record cannot be edited or downloaded.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                   */
/* ---------------------------------------------------------------------- */

export default function PatientRecordsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [selected, setSelected] = useState<PatientRecord | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(mockPatientRecords);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
              My Health Records
            </h1>
            <p className="text-[12.5px] text-muted-foreground">
              Records sent to your K-ID profile by verified labs and
              hospitals
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <RecordCardSkeleton key={i} />
            ))}
          </div>
        ) : records.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onView={setSelected}
              />
            ))}
          </div>
        )}
      </main>

      <RecordModal
        record={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
}
