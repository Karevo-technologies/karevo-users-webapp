import { useNavigate, useParams, Link } from "react-router-dom";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  DropletIcon,
  VaccineIcon,
  PillIcon,
  File01Icon,
  CalendarClockIcon,
  Clock01Icon,
  LockIcon,
  Building02Icon,
} from "@hugeicons/core-free-icons";
import { mockPatientRecords } from "./mockPatientRecords";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};
const fontMono = {
  fontFamily: "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
};

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

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Field({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-11 font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          style={mono ? fontMono : undefined}
          className="mt-0.5 text-14 text-foreground"
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function RecordDetailPage() {
  const navigate = useNavigate();
  const { recordId } = useParams<{ recordId: string }>();
  const record = mockPatientRecords.find((r) => r.id === recordId);

  if (!record) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
            <button
              onClick={() => navigate("/dashboard/records")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </button>
            <h1
              style={fontDisplay}
              className="text-18 font-semibold text-foreground"
            >
              Record not found
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-5 py-10 text-center">
          <p className="text-13 text-muted-foreground">
            This record doesn't exist or may have been removed.
          </p>
          <Link
            to="/dashboard/records"
            className="mt-3 inline-block text-13 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to My Health Records
          </Link>
        </main>
      </div>
    );
  }

  const icon = iconForType(record.type);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-5">
          <button
            onClick={() => navigate("/dashboard/records")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>
          <div>
            <h1
              style={fontDisplay}
              className="text-18 font-semibold text-foreground"
            >
              Record Details
            </h1>
            <p className="text-13 text-muted-foreground">
              Full details for this health record
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-5 py-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900">
              <HugeiconsIcon icon={icon} size={22} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p
                style={fontDisplay}
                className="truncate text-18 font-semibold text-foreground"
              >
                {record.type}
              </p>
              <p style={fontMono} className="mt-0.5 text-11 text-muted-foreground">
                Reference {record.id.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field icon={Building02Icon} label="Issued by" value={record.issuedBy} />
            <Field
              icon={CalendarClockIcon}
              label="Date issued"
              value={formatDate(record.issuedDate)}
            />
            <Field
              icon={Clock01Icon}
              label="Received into your profile"
              value={formatDateTime(record.receivedAt)}
              mono
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 style={fontDisplay} className="text-15 font-semibold text-foreground">
            Summary
          </h2>
          <p className="mt-2 text-13 leading-relaxed text-muted-foreground">
            {record.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 style={fontDisplay} className="text-15 font-semibold text-foreground">
            Full Details
          </h2>
          <p className="mt-2 text-13 leading-relaxed text-foreground">
            {record.details}
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-card px-4 py-3.5">
          <HugeiconsIcon
            icon={LockIcon}
            size={14}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-muted-foreground"
          />
          <div>
            <p className="text-12 font-semibold text-foreground">View Only</p>
            <p className="mt-0.5 text-11 leading-relaxed text-muted-foreground">
              This record cannot be edited or downloaded.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
