import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Alert01Icon } from "@hugeicons/core-free-icons";
import { Switch } from "@/components/ui/switch";
import TopBar from "../../_components/topbar";
import { Toast } from "../../_components/Toast";
import { useToast } from "../../_components/use-toast";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};

export default function OfflineSharingPage() {
  const navigate = useNavigate();
  const [enableOffline, setEnableOffline] = useState(true);
  const [shareCardOnly, setShareCardOnly] = useState(true);
  const { toast, fireToast } = useToast();

  return (
    <div>
      <TopBar title="Offline Data Sharing" />

      <main className="p-4 lg:p-6 space-y-5 max-w-2xl">
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          <span className="text-13">Back to Settings</span>
        </button>

        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2
              style={fontDisplay}
              className="text-15 font-semibold text-foreground"
            >
              Offline Data Sharing
            </h2>
          </div>
          <div className="px-5 divide-y divide-border">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-14 font-medium text-foreground">
                  Enable offline access
                </p>
                <p className="text-12 text-muted-foreground">
                  Allow sharing without internet connection
                </p>
              </div>
              <Switch
                checked={enableOffline}
                onCheckedChange={(v) => {
                  setEnableOffline(v);
                  fireToast(
                    v ? "Offline access enabled" : "Offline access disabled",
                  );
                }}
                aria-label="Enable offline access"
              />
            </div>
            {enableOffline && (
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-14 font-medium text-foreground">
                    Card info only
                  </p>
                  <p className="text-12 text-muted-foreground">
                    Only share basic card and share code
                  </p>
                </div>
                <Switch
                  checked={shareCardOnly}
                  onCheckedChange={(v) => {
                    setShareCardOnly(v);
                    fireToast(
                      v
                        ? "Card info only mode enabled"
                        : "Full data sharing enabled",
                    );
                  }}
                  aria-label="Share card info only"
                />
              </div>
            )}
          </div>
          <div className="px-5 pb-4">
            <div className="rounded-lg bg-muted p-3 text-12 text-muted-foreground">
              <HugeiconsIcon
                icon={Alert01Icon}
                size={13}
                className="inline-block mr-1.5 -mt-0.5"
              />
              Offline data is stored locally on your device and encrypted. It
              will only be accessible via your PIN or biometrics.
            </div>
          </div>
        </section>
      </main>

      <Toast toast={toast} />
    </div>
  );
}
