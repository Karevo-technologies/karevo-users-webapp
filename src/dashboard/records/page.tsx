import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  DropletIcon,
  VaccineIcon,
  PillIcon,
  File01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
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

const TYPE_ICON: Record<string, IconSvgElement> = {
  "Blood Test Result": DropletIcon,
  "Vaccination History": VaccineIcon,
  Prescription: PillIcon,
};

function iconForType(type: string): IconSvgElement {
  return TYPE_ICON[type] || File01Icon;
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
  const icon = iconForType(type);
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900">
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <HugeiconsIcon icon={File01Icon} size={20} strokeWidth={1.5} />
      </div>
      <p className="max-w-[280px] text-13 text-muted-foreground">
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
        className="mt-4 text-15 font-semibold text-foreground"
      >
        {record.type}
      </p>
      <p className="mt-1 text-13 text-muted-foreground">
        Issued by {record.issuedBy}
      </p>
      <p style={fontMono} className="mt-1.5 text-11 text-muted-foreground">
        {formatDate(record.issuedDate)}
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onView(record)}
        className="mt-4 gap-1.5 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <HugeiconsIcon icon={EyeIcon} size={14} strokeWidth={2} />
        View
      </Button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                   */
/* ---------------------------------------------------------------------- */

export default function PatientRecordsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PatientRecord[]>([]);

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
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>
          <div>
            <h1
              style={fontDisplay}
              className="text-18 font-semibold text-foreground"
            >
              My Health Records
            </h1>
            <p className="text-13 text-muted-foreground">
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
                onView={(r) => navigate(`/dashboard/records/${r.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
