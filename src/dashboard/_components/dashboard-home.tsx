import { useNavigate } from "react-router-dom";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  FileValidationIcon,
  MedicalFileIcon,
  Shield01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "./StatCard";
import type { StatTone } from "./stat-tone";
import { QuickActionCard } from "./QuickActionCard";
import { ActivityPanel } from "./ActivityPanel";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};

const stats: {
  label: string;
  count: number;
  icon: IconSvgElement;
  tone: StatTone;
}[] = [
  { label: "Total Records", count: 4, icon: MedicalFileIcon, tone: "neutral" },
  { label: "Pending Requests", count: 2, icon: Clock01Icon, tone: "pending" },
  { label: "Active Consents", count: 3, icon: CheckmarkCircle02Icon, tone: "approved" },
  { label: "Declined", count: 1, icon: Alert01Icon, tone: "declined" },
];

const pendingRequests = [
  {
    id: "p1",
    org: "Lagos University Teaching Hospital",
    detail: "Lab results · Requested 2 hours ago",
  },
  {
    id: "p2",
    org: "AXA Mansard Health Insurance",
    detail: "Full medical history · Requested yesterday",
  },
];

const recentActivity = [
  {
    id: "a1",
    icon: CheckmarkCircle02Icon,
    title: "Consent granted",
    detail: "You approved Reddington Hospital's access request",
    time: "2 days ago",
  },
  {
    id: "a2",
    icon: EyeIcon,
    title: "Record viewed",
    detail: "Wellu Diagnostics viewed your lab results",
    time: "3 days ago",
  },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white sm:p-8"
        style={{ backgroundColor: "var(--kv-brand)" }}
      >
        <h1 style={fontDisplay} className="text-2xl font-bold sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1.5 text-14 text-white/80">
          Here's what's happening with your health records today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickActionCard
          icon={MedicalFileIcon}
          title="View Records"
          subtitle="See your uploaded health records"
          onClick={() => navigate("/dashboard/records")}
        />
        <QuickActionCard
          icon={FileValidationIcon}
          title="Consent Requests"
          subtitle="Review who has access to your data"
          onClick={() => navigate("/dashboard/consents")}
        />
        <QuickActionCard
          icon={Shield01Icon}
          title="Security Center"
          subtitle="Manage your account protection"
          onClick={() => navigate("/dashboard/security")}
        />
      </div>

      {/* Activity panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityPanel
          title="Pending Requests"
          onViewAll={() => navigate("/dashboard/consents")}
        >
          {pendingRequests.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <HugeiconsIcon icon={FileValidationIcon} size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-14 font-medium text-foreground">
                  {item.org}
                </p>
                <p className="truncate text-12 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
                Pending
              </span>
            </div>
          ))}
        </ActivityPanel>

        <ActivityPanel
          title="Recent Activity"
          onViewAll={() => navigate("/dashboard/security")}
        >
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-14 font-medium text-foreground">
                  {item.title}
                </p>
                <p className="truncate text-12 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 text-11 text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </ActivityPanel>
      </div>
    </div>
  );
}
