"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  Link2,
  WifiOff,
  Lock,
  KeyRound,
  Fingerprint,
  Smartphone,
  Clock,
  Shield,
  FileCheck2,
  RotateCcw,
  Info,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Laptop,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import TopBar from "../_components/topbar";
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
/* Fonts                                                                   */
/* ---------------------------------------------------------------------- */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`;
const fontDisplay = { fontFamily: "'Fraunces', serif" };
const fontMono = { fontFamily: "'IBM Plex Mono', monospace" };

const AUTO_SIGN_OUT_OPTIONS = [5, 15, 30];

const initialDevices = [
  {
    id: "d1",
    name: "iPhone 14 Pro",
    detail: "Lagos, NG",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "d2",
    name: "Chrome on Windows",
    detail: "Abuja, NG",
    lastActive: "3 days ago",
    current: false,
  },
  {
    id: "d3",
    name: "Safari on iPad",
    detail: "Lagos, NG",
    lastActive: "2 weeks ago",
    current: false,
  },
];

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function RowIcon({ icon: Icon, tone }: { icon: any; tone: string }) {
  const tones: Record<string, string> = {
    primary: "bg-muted text-primary",
    destructive: "bg-destructive/10 text-destructive",
    stone: "bg-muted text-muted-foreground",
  };
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      <Icon size={18} strokeWidth={1.75} />
    </div>
  );
}

function Toast({ toast }: { toast: { message: string; tone: string } | null }) {
  if (!toast) return null;
  const isPositive = toast.tone !== "negative";
  return (
    <div
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2">
        {isPositive ? (
          <CheckCircle2 size={16} className="shrink-0 text-teal-400" />
        ) : (
          <XCircle size={16} className="shrink-0 text-rose-400" />
        )}
        <span className="text-[13px]">{toast.message}</span>
      </div>
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
      <div className="px-5">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Row                                                                      */
/* ---------------------------------------------------------------------- */

function SettingsRow({
  row,
  isLast,
  children,
}: {
  row: any;
  isLast: boolean;
  children?: React.ReactNode;
}) {
  const isDestructive = row.type === "destructive";
  const isInteractive = row.type === "link" || row.type === "destructive";

  const body = (
    <div
      className={`flex items-start gap-3.5 py-4 ${!isLast ? "border-b border-border" : ""}`}
    >
      <RowIcon
        icon={row.icon}
        tone={isDestructive ? "destructive" : "primary"}
      />

      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`text-[14px] font-medium ${isDestructive ? "text-destructive" : "text-foreground"}`}
        >
          {row.title}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
          {row.description}
        </p>
        {children}
      </div>

      <div className="flex shrink-0 items-center self-center pt-0.5">
        {row.type === "toggle" && row.control}
        {row.type === "static" && (
          <span
            style={fontMono}
            className="text-[12.5px] text-muted-foreground"
          >
            {row.value}
          </span>
        )}
        {isInteractive && (
          <ChevronRight
            size={16}
            strokeWidth={2}
            className={
              isDestructive ? "text-destructive/50" : "text-muted-foreground"
            }
          />
        )}
      </div>
    </div>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={row.onClick}
        className="-mx-1 block w-full rounded-lg px-1 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {body}
      </button>
    );
  }

  return body;
}

/* ---------------------------------------------------------------------- */
/* Modals                                                                   */
/* ---------------------------------------------------------------------- */

function PinModal({
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
  const [showPins, setShowPins] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCurrent("");
      setNext("");
      setConfirm("");
      setError("");
      setShowPins(false);
    }
  }, [open]);

  function handleSubmit() {
    if (current.length < 4) return setError("Enter your current pin.");
    if (next.length !== 4) return setError("Your new pin must be 4 digits.");
    if (next !== confirm) return setError("New pins don't match.");
    setError("");
    onConfirm();
  }

  const type = showPins ? "text" : "password";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={KeyRound} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Update pin
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px]">
            Choose a 4-digit pin you don't use anywhere else.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              Current pin
            </label>
            <Input
              type={type}
              inputMode="numeric"
              maxLength={4}
              value={current}
              onChange={(e) => setCurrent(e.target.value.replace(/\D/g, ""))}
              className="tracking-[0.3em]"
              style={fontMono}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              New pin
            </label>
            <Input
              type={type}
              inputMode="numeric"
              maxLength={4}
              value={next}
              onChange={(e) => setNext(e.target.value.replace(/\D/g, ""))}
              className="tracking-[0.3em]"
              style={fontMono}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
              Confirm new pin
            </label>
            <Input
              type={type}
              inputMode="numeric"
              maxLength={4}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
              className="tracking-[0.3em]"
              style={fontMono}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPins((s) => !s)}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
          >
            {showPins ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPins ? "Hide pins" : "Show pins"}
          </button>

          {error && (
            <p className="flex items-center gap-1.5 text-[12px] text-destructive">
              <AlertTriangle size={13} />
              {error}
            </p>
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
            className="bg-teal-700 hover:bg-teal-800"
          >
            Save new pin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeviceRow({
  device,
  onRequestRemove,
}: {
  device: any;
  onRequestRemove: (device: any) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <RowIcon
        icon={
          device.name.toLowerCase().includes("iphone") ? Smartphone : Laptop
        }
        tone="stone"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13.5px] font-medium text-foreground">
            {device.name}
          </p>
          {device.current && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-primary">
              This device
            </span>
          )}
        </div>
        <p
          style={fontMono}
          className="mt-0.5 text-[11px] text-muted-foreground"
        >
          {device.detail} · {device.lastActive}
        </p>
      </div>
      {!device.current && (
        <button
          onClick={() => onRequestRemove(device)}
          className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Remove ${device.name}`}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

function DevicesModal({
  open,
  onOpenChange,
  devices,
  onRequestRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devices: any[];
  onRequestRemove: (device: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={Smartphone} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Devices
            </DialogTitle>
          </div>
          <DialogDescription className="text-left text-[13px]">
            Devices that have access to your K-ID account.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border">
          {devices.map((d) => (
            <DeviceRow
              key={d.id}
              device={d}
              onRequestRemove={onRequestRemove}
            />
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

function RemoveDeviceDialog({
  device,
  open,
  onOpenChange,
  onConfirm,
}: {
  device: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (device: any) => void;
}) {
  if (!device) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {device.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This device will be signed out immediately and will need your pin or
            biometrics to sign back in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(device)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove device
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function NinLockOffDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Turn off NIN Lock?</AlertDialogTitle>
          <AlertDialogDescription>
            Your NIN will be shareable with anyone who requests it through K-ID
            until you lock it again. Only turn this off if you're expecting a
            request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it locked</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Turn off
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ResetDeviceDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  useEffect(() => {
    if (open) setConfirmText("");
  }, [open]);

  const canConfirm = confirmText.trim().toUpperCase() === "RESET";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={AlertTriangle} tone="destructive" />
            <AlertDialogTitle>Reset this device?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This permanently deletes all K-ID data stored on this device,
            including your linked IDs and offline records. Your account itself
            isn't deleted — you can sign back in on any device. This can't be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="pb-1">
          <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
            Type RESET to confirm
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="RESET"
            style={fontMono}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!canConfirm}
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
          >
            Delete all data on this device
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* Legal content modals */

function PrivacyPolicyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={Shield} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Privacy Policy
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Information We Collect</strong>
            <br />
            We collect information you provide directly, including your name,
            National Identification Number (NIN), biometric data, and health
            records. We also collect device information and usage data to
            improve our services.
          </p>
          <p>
            <strong className="text-foreground">How We Use Your Data</strong>
            <br />
            Your data is used solely for identity verification, authentication,
            and facilitating secure data sharing with authorized healthcare
            providers. We never sell your personal information.
          </p>
          <p>
            <strong className="text-foreground">Data Sharing</strong>
            <br />
            We only share your data with organizations you explicitly consent
            to. You can revoke access at any time through your consent
            management dashboard.
          </p>
          <p>
            <strong className="text-foreground">Data Retention</strong>
            <br />
            We retain your data for as long as your account is active. You may
            request deletion of your data at any time by contacting our support
            team.
          </p>
          <p>
            <strong className="text-foreground">Security</strong>
            <br />
            We implement industry-standard encryption and security measures to
            protect your data. This includes end-to-end encryption for all data
            in transit and at rest.
          </p>
          <p>
            <strong className="text-foreground">Your Rights</strong>
            <br />
            You have the right to access, correct, or delete your personal data.
            You may also export your data in a portable format at any time.
          </p>
        </div>

        <DialogFooter>
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

function TermsOfServiceModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <RowIcon icon={FileCheck2} tone="primary" />
            <DialogTitle style={fontDisplay} className="text-[18px]">
              Terms of Service
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Acceptance of Terms</strong>
            <br />
            By using K-ID, you agree to these terms. If you do not agree, do not
            use the service.
          </p>
          <p>
            <strong className="text-foreground">
              Account Responsibilities
            </strong>
            <br />
            You are responsible for maintaining the confidentiality of your
            credentials, including your PIN and biometric data. Notify us
            immediately of any unauthorized use.
          </p>
          <p>
            <strong className="text-foreground">Acceptable Use</strong>
            <br />
            You agree to use K-ID only for lawful purposes and in accordance
            with applicable regulations. You may not use the service for any
            fraudulent or malicious activity.
          </p>
          <p>
            <strong className="text-foreground">Service Availability</strong>
            <br />
            We strive to maintain high availability but do not guarantee
            uninterrupted service. We reserve the right to suspend or terminate
            access for violations of these terms.
          </p>
          <p>
            <strong className="text-foreground">Limitation of Liability</strong>
            <br />
            K-ID shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the service.
          </p>
          <p>
            <strong className="text-foreground">Changes to Terms</strong>
            <br />
            We may update these terms from time to time. Continued use of K-ID
            after changes constitutes acceptance of the new terms.
          </p>
        </div>

        <DialogFooter>
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
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

export default function SettingsPage() {
  const navigate = useNavigate();
  const [ninLock, setNinLock] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [autoSignOut, setAutoSignOut] = useState(true);
  const [autoSignOutMinutes, setAutoSignOutMinutes] = useState(5);

  const [devices, setDevices] = useState(initialDevices);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [devicesModalOpen, setDevicesModalOpen] = useState(false);
  const [removeDeviceTarget, setRemoveDeviceTarget] = useState<any>(null);
  const [ninLockOffOpen, setNinLockOffOpen] = useState(false);
  const [resetDeviceOpen, setResetDeviceOpen] = useState(false);

  // Legal modals
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; tone: string } | null>(
    null,
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function fireToast(message: string, tone = "positive") {
    setToast({ message, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  function handleNinLockToggle(value: boolean) {
    if (!value) {
      setNinLockOffOpen(true);
      return;
    }
    setNinLock(true);
    fireToast("NIN Lock turned on");
  }

  function confirmNinLockOff() {
    setNinLock(false);
    setNinLockOffOpen(false);
    fireToast("NIN Lock turned off", "negative");
  }

  function handleRemoveDevice(device: any) {
    setDevices((prev) => prev.filter((d: any) => d.id !== device.id));
    setRemoveDeviceTarget(null);
    fireToast(`Removed ${device.name}`, "negative");
  }

  function handlePinUpdated() {
    setPinModalOpen(false);
    fireToast("Pin updated");
  }

  function handleResetDevice() {
    setResetDeviceOpen(false);
    fireToast("Device reset. All local data was deleted.", "negative");
  }

  const accountRows = [
    {
      type: "link",
      icon: Activity,
      title: "Integrity Index",
      description: "View your identity trust score",
      onClick: () => navigate("/dashboard/security"),
    },
    {
      type: "link",
      icon: Bell,
      title: "Notifications",
      description: "Manage alerts and verification updates",
      onClick: () => navigate("/dashboard/settings/notifications"),
    },
    {
      type: "link",
      icon: Link2,
      title: "Linked IDs",
      description: "View connected identity documents",
      onClick: () => navigate("/dashboard/settings/linked-ids"),
    },
    {
      type: "link",
      icon: WifiOff,
      title: "Offline Data Sharing",
      description: "Enable offline access to your health records",
      onClick: () => navigate("/dashboard/settings/offline-sharing"),
    },
  ];

  const securityRows = [
    {
      type: "toggle",
      icon: Lock,
      title: "NIN Lock",
      description:
        "Prevent organisations from sharing your NIN without your explicit approval",
      control: (
        <Switch checked={ninLock} onCheckedChange={handleNinLockToggle} />
      ),
    },
    {
      type: "toggle",
      icon: Fingerprint,
      title: "Biometrics",
      description: "Use fingerprint or face ID for quick access and approvals",
      control: <Switch checked={biometrics} onCheckedChange={setBiometrics} />,
    },
    {
      type: "static",
      icon: Clock,
      title: "Auto sign-out",
      description: "Automatically sign out after inactivity",
      value: autoSignOut ? `${autoSignOutMinutes} min` : "Off",
    },
    {
      type: "link",
      icon: Smartphone,
      title: "Devices",
      description: "Manage devices that have access to your account",
      value: `${devices.filter((d) => !d.current).length} other device${devices.filter((d) => !d.current).length !== 1 ? "s" : ""}`,
      onClick: () => setDevicesModalOpen(true),
    },
    {
      type: "link",
      icon: KeyRound,
      title: "PIN",
      description: "Update your 4-digit security pin",
      onClick: () => setPinModalOpen(true),
    },
  ];

  const privacyRows = [
    {
      type: "link",
      icon: Shield,
      title: "Privacy Policy",
      description: "Review how your data is handled",
      onClick: () => setPrivacyPolicyOpen(true),
    },
    {
      type: "link",
      icon: FileCheck2,
      title: "Terms of Service",
      description: "Read the terms governing your use of K-ID",
      onClick: () => setTermsOfServiceOpen(true),
    },
    {
      type: "static",
      icon: Info,
      title: "Licenses",
      description: "Open source licenses and attributions",
      value: "v1.0.0",
    },
  ];

  const destructiveRows = [
    {
      type: "destructive",
      icon: RotateCcw,
      title: "Reset this device",
      description: "Remove all local data from this device",
      onClick: () => setResetDeviceOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{FONT_IMPORT}</style>

      <TopBar
        title="Settings"
        subtitle="Manage your account, security, and preferences"
      />

      <main className="mx-auto max-w-2xl space-y-5 px-5 py-6">
        <SectionCard title="Account">
          {accountRows.map((row, i) => (
            <SettingsRow
              key={row.title}
              row={row}
              isLast={i === accountRows.length - 1}
            />
          ))}
        </SectionCard>

        <SectionCard title="Security">
          {securityRows.map((row, i) => (
            <SettingsRow
              key={row.title}
              row={row}
              isLast={i === securityRows.length - 1}
            />
          ))}
        </SectionCard>

        <SectionCard title="Privacy">
          {privacyRows.map((row, i) => (
            <SettingsRow
              key={row.title}
              row={row}
              isLast={i === privacyRows.length - 1}
            />
          ))}
        </SectionCard>

        <SectionCard title="Danger zone">
          {destructiveRows.map((row, i) => (
            <SettingsRow
              key={row.title}
              row={row}
              isLast={i === destructiveRows.length - 1}
            />
          ))}
        </SectionCard>
      </main>

      <PinModal
        open={pinModalOpen}
        onOpenChange={setPinModalOpen}
        onConfirm={handlePinUpdated}
      />
      <DevicesModal
        open={devicesModalOpen}
        onOpenChange={setDevicesModalOpen}
        devices={devices}
        onRequestRemove={setRemoveDeviceTarget}
      />
      <RemoveDeviceDialog
        device={removeDeviceTarget}
        open={!!removeDeviceTarget}
        onOpenChange={(o) => !o && setRemoveDeviceTarget(null)}
        onConfirm={handleRemoveDevice}
      />
      <NinLockOffDialog
        open={ninLockOffOpen}
        onOpenChange={setNinLockOffOpen}
        onConfirm={confirmNinLockOff}
      />
      <ResetDeviceDialog
        open={resetDeviceOpen}
        onOpenChange={setResetDeviceOpen}
        onConfirm={handleResetDevice}
      />
      <PrivacyPolicyModal
        open={privacyPolicyOpen}
        onOpenChange={setPrivacyPolicyOpen}
      />
      <TermsOfServiceModal
        open={termsOfServiceOpen}
        onOpenChange={setTermsOfServiceOpen}
      />

      <Toast toast={toast} />
    </div>
  );
}
