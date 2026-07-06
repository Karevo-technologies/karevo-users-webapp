"use client";

import { useState } from "react";
import TopBar from "../_components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Notification01Icon,
  Link01Icon,
  WifiDisconnectedIcon,
  SquareLock02Icon,
  LockPasswordIcon,
  FingerPrintScanIcon,
  SmartPhone01Icon,
  Clock01Icon,
  ShieldUserIcon,
  DocumentValidationIcon,
  RefreshIcon,
  InformationCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

type IconType = typeof Analytics01Icon;

interface BaseRow {
  icon: IconType;
  title: string;
  description: string;
}

interface LinkRow extends BaseRow {
  type: "link";
  onClick?: () => void;
}

interface ToggleRow extends BaseRow {
  type: "toggle";
  key: string;
}

interface StaticRow extends BaseRow {
  type: "static";
  value: string;
}

interface DestructiveRow extends BaseRow {
  type: "destructive";
  onClick?: () => void;
}

type Row = LinkRow | ToggleRow | StaticRow | DestructiveRow;

function SettingsRow({
  row,
  checked,
  onToggle,
  isLast,
}: {
  row: Row;
  checked?: boolean;
  onToggle?: (key: string, value: boolean) => void;
  isLast: boolean;
}) {
  const isDestructive = row.type === "destructive";

  const content = (
    <div
      className={`flex items-start gap-3.5 py-4 ${!isLast ? "border-b border-border" : ""}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isDestructive
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        }`}
      >
        <HugeiconsIcon icon={row.icon} size={19} strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`text-sm font-medium ${isDestructive ? "text-destructive" : "text-foreground"}`}
        >
          {row.title}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
          {row.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center self-center pt-0.5">
        {row.type === "toggle" && (
          <Switch
            checked={checked}
            onCheckedChange={(value: boolean) => onToggle?.(row.key, value)}
            aria-label={row.title}
          />
        )}
        {row.type === "static" && (
          <span className="text-sm text-muted-foreground">{row.value}</span>
        )}
        {(row.type === "link" || row.type === "destructive") && (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            strokeWidth={2}
            className={
              isDestructive ? "text-destructive/60" : "text-muted-foreground"
            }
          />
        )}
      </div>
    </div>
  );

  if (row.type === "link" || row.type === "destructive") {
    return (
      <button
        type="button"
        onClick={row.onClick}
        className="block w-full text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg -mx-1 px-1"
      >
        {content}
      </button>
    );
  }

  return content;
}

function SettingsSection({ title, rows }: { title: string; rows: Row[] }) {
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({
    ninLock: true,
    biometrics: false,
    autoSignOut: true,
  });

  function handleToggle(key: string, value: boolean) {
    setToggleState((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col">
          {rows.map((row, i) => (
            <SettingsRow
              key={row.title}
              row={row}
              checked={row.type === "toggle" ? toggleState[row.key] : undefined}
              onToggle={handleToggle}
              isLast={i === rows.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const accountRows: Row[] = [
    {
      type: "link",
      icon: Analytics01Icon,
      title: "Integrity Index",
      description: "View your identity trust score",
    },
    {
      type: "link",
      icon: Notification01Icon,
      title: "Notifications",
      description: "Manage alerts and verification updates",
    },
    {
      type: "link",
      icon: Link01Icon,
      title: "Linked IDs",
      description: "View and manage connected identity documents",
    },
    {
      type: "link",
      icon: WifiDisconnectedIcon,
      title: "Offline Data Sharing",
      description: "Control what data is shared without internet",
    },
    {
      type: "toggle",
      key: "ninLock",
      icon: SquareLock02Icon,
      title: "NIN Lock",
      description: "Prevent your NIN from being shared until you unlock it",
    },
  ];

  const securityRows: Row[] = [
    {
      type: "link",
      icon: LockPasswordIcon,
      title: "Update Pin",
      description: "Change your pin",
    },
    {
      type: "toggle",
      key: "biometrics",
      icon: FingerPrintScanIcon,
      title: "Biometrics",
      description:
        "Enable biometrics strictly for offline login — only card info and share code will be available for quick view",
    },
    {
      type: "link",
      icon: SmartPhone01Icon,
      title: "Devices",
      description: "Manage devices that have access to your account",
    },
    {
      type: "toggle",
      key: "autoSignOut",
      icon: Clock01Icon,
      title: "Auto-sign Out",
      description: "Sign out automatically after 5 minutes of inactivity",
    },
  ];

  const legalRows: Row[] = [
    {
      type: "link",
      icon: ShieldUserIcon,
      title: "Privacy Policy",
      description: "How we protect your personal data",
    },
    {
      type: "link",
      icon: DocumentValidationIcon,
      title: "Terms of Service",
      description: "Rules and guidelines for K-ID",
    },
  ];

  const otherRows: Row[] = [
    {
      type: "destructive",
      icon: RefreshIcon,
      title: "Reset Device",
      description: "Delete all data from this K-ID account",
    },
    {
      type: "static",
      icon: InformationCircleIcon,
      title: "Version",
      description: "Current app build",
      value: "1.0.0",
    },
  ];

  return (
    <div>
      <TopBar title="Settings" />
      <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
        <SettingsSection title="Your account" rows={accountRows} />
        <SettingsSection title="Security" rows={securityRows} />
        <SettingsSection title="Legal and Compliance" rows={legalRows} />
        <SettingsSection title="Others" rows={otherRows} />
      </div>
    </div>
  );
}
