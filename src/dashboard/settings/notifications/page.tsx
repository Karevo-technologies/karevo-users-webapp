"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import TopBar from "../../_components/topbar";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);
  const [toast, setToast] = useState<{ message: string; tone: string } | null>(
    null,
  );

  function fireToast(message: string, tone = "positive") {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div>
      <TopBar title="Notifications" />

      <main className="p-4 lg:p-6 space-y-5 max-w-2xl">
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-[13px]">Back to Settings</span>
        </button>

        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2
              style={fontDisplay}
              className="text-[15px] font-semibold text-foreground"
            >
              Notification Preferences
            </h2>
          </div>
          <div className="px-5 divide-y divide-border">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Email notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive updates via email
                </p>
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
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  SMS notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive updates via SMS
                </p>
              </div>
              <Switch
                checked={smsNotify}
                onCheckedChange={(v) => {
                  setSmsNotify(v);
                  fireToast(
                    v
                      ? "SMS notifications enabled"
                      : "SMS notifications disabled",
                  );
                }}
                aria-label="SMS notifications"
              />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Push notifications
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Receive in-app alerts
                </p>
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
          </div>
        </section>
      </main>

      {toast && (
        <div
          className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-foreground shadow-lg animate-in fade-in slide-in-from-top-2 dark:bg-stone-900">
            {toast.tone !== "negative" ? (
              <CheckCircle2 size={16} className="shrink-0 text-blue-600" />
            ) : (
              <XCircle size={16} className="shrink-0 text-blue-600" />
            )}
            <span className="text-[13px]">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
