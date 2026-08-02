"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Laptop,
  UserX,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import TopBar from "../_components/topbar";
import { useAuth } from "../../context/AuthContext";
import { getThemeMode, setThemeMode, type ThemeMode } from "../../lib/theme";
import { useTour } from "../_components/DashboardTour";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};
const fontMono = {
  fontFamily: "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
};

function Toast({
  toast,
}: {
  toast: { message: string; tone: string } | null;
}) {
  if (!toast) return null;
  const isPositive = toast.tone !== "negative";
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

function RowIcon({ icon: Icon, tone }: { icon: LucideIcon; tone: string }) {
  const tones: Record<string, string> = {
    primary: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
    destructive: "bg-muted text-muted-foreground",
  };
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      <Icon size={18} strokeWidth={1.75} />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2
          style={fontDisplay}
          className="text-[15px] font-semibold text-foreground"
        >
          {title}
        </h2>
      </div>
      <div className="divide-y divide-border px-5">{children}</div>
    </section>
  );
}

const appearanceOptions: {
  value: ThemeMode;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { start } = useTour();

  // Notification settings
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);

  // Appearance
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() =>
    getThemeMode(),
  );

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; tone: string } | null>(
    null,
  );

  function fireToast(message: string, tone = "positive") {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  }

  function handleAppearanceChange(value: ThemeMode) {
    setThemeModeState(value);
    setThemeMode(value);
    fireToast(`Appearance set to ${value}`);
  }

  function handleDeactivate() {
    setDeactivateOpen(false);
    fireToast("Account deactivated.", "negative");
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Profile" subtitle="Manage your account and preferences" />

      <main className="mx-auto max-w-3xl space-y-5 px-5 py-6">
        <button
          onClick={() => navigate("/dashboard/home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-[13px]">Back to Home</span>
        </button>

        {/* Header */}
        <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <h2
              style={fontDisplay}
              className="truncate text-[17px] font-semibold text-foreground"
            >
              {user?.name ?? "User"}
            </h2>
            <p className="truncate text-[13px] text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>
        </section>

        {/* Notification settings */}
        <SectionCard title="Notifications">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={Bell} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Email notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotify}
              onCheckedChange={(v) => {
                setEmailNotify(v);
                fireToast(
                  v
                    ? "Email notifications enabled"
                    : "Email notifications disabled",
                );
              }}
              aria-label="Email notifications"
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={Bell} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  SMS notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive updates via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={smsNotify}
              onCheckedChange={(v) => {
                setSmsNotify(v);
                fireToast(
                  v ? "SMS notifications enabled" : "SMS notifications disabled",
                );
              }}
              aria-label="SMS notifications"
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={Bell} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Push notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive in-app alerts
                </p>
              </div>
            </div>
            <Switch
              checked={pushNotify}
              onCheckedChange={(v) => {
                setPushNotify(v);
                fireToast(
                  v
                    ? "Push notifications enabled"
                    : "Push notifications disabled",
                );
              }}
              aria-label="Push notifications"
            />
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard title="Appearance">
          <div className="py-4">
            <div className="grid grid-cols-3 gap-3">
              {appearanceOptions.map((opt) => {
                const active = themeMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAppearanceChange(opt.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <opt.icon size={18} strokeWidth={1.75} />
                    <span className="text-[13px] font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* Product tour */}
        <SectionCard title="Getting started">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={Sparkles} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Product tour
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Take a guided tour around the app
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={start}>
              Start tour
            </Button>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={ShieldCheck} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Two-factor authentication
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={(v) => {
                setTwoFactor(v);
                fireToast(
                  v
                    ? "Two-factor authentication enabled"
                    : "Two-factor authentication disabled",
                );
              }}
              aria-label="Two-factor authentication"
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={KeyRound} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Password
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Change your account password
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordOpen(true)}
            >
              Change password
            </Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={Laptop} tone="primary" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Active sessions
                </p>
                <p className="text-[12px] text-muted-foreground">
                  View devices signed in to your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionsOpen(true)}
            >
              View sessions
            </Button>
          </div>
        </SectionCard>

        {/* Danger zone */}
        <SectionCard title="Danger zone">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <RowIcon icon={UserX} tone="destructive" />
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Deactivate account
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Temporarily disable your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeactivateOpen(true)}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Deactivate
            </Button>
          </div>
        </SectionCard>
      </main>

      {/* Change password modal */}
      <PasswordModal
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onConfirm={() => {
          setPasswordOpen(false);
          fireToast("Password changed successfully");
        }}
      />

      {/* Active sessions modal */}
      <SessionsModal
        open={sessionsOpen}
        onOpenChange={setSessionsOpen}
        onSignedOut={(name) => fireToast(`Signed out ${name}`, "negative")}
      />

      {/* Deactivate account dialog */}
      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be signed out and your profile won't be visible until you
              reactivate. Your data stays intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-muted text-foreground hover:bg-muted/70"
            >
              Deactivate account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toast toast={toast} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Password modal                                                          */
/* ---------------------------------------------------------------------- */
function PasswordModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (current.length < 6) return setError("Enter your current password.");
    if (next.length < 6) return setError("New password must be 6+ characters.");
    if (next !== confirm) return setError("Passwords don't match.");
    setError("");
    onConfirm();
  }

  const type = show ? "text" : "password";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={KeyRound} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Change password
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px]">
            Choose a strong password you don't use anywhere else.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              Current password
            </label>
            <Input
              type={type}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              New password
            </label>
            <Input
              type={type}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              Confirm new password
            </label>
            <Input
              type={type}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
            {show ? "Hide passwords" : "Show passwords"}
          </button>
          {error && (
            <p className="text-[12px] text-destructive">{error}</p>
          )}
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
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save new password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------------- */
/* Active sessions modal                                                   */
/* ---------------------------------------------------------------------- */
type Session = {
  id: string;
  name: string;
  detail: string;
  lastActive: string;
  current: boolean;
};

const initialSessions: Session[] = [
  {
    id: "s1",
    name: "iPhone 14 Pro",
    detail: "Lagos, NG",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "s2",
    name: "Chrome on Windows",
    detail: "Abuja, NG",
    lastActive: "3 days ago",
    current: false,
  },
  {
    id: "s3",
    name: "Safari on iPad",
    detail: "Lagos, NG",
    lastActive: "2 weeks ago",
    current: false,
  },
];

function SessionsModal({
  open,
  onOpenChange,
  onSignedOut,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignedOut: (name: string) => void;
}) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  function signOut(id: string, name: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    onSignedOut(name);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={Laptop} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Active sessions
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px]">
            Devices currently signed in to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-3">
              <RowIcon icon={Laptop} tone="primary" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13.5px] font-medium text-foreground">
                    {s.name}
                  </p>
                  {s.current && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-primary">
                      This device
                    </span>
                  )}
                </div>
                <p
                  style={fontMono}
                  className="mt-0.5 text-[11px] text-muted-foreground"
                >
                  {s.detail} · {s.lastActive}
                </p>
              </div>
              {!s.current && (
                <button
                  onClick={() => signOut(s.id, s.name)}
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full border-border sm:w-auto"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

