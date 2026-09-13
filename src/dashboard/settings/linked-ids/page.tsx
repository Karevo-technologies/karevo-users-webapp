import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Link01Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
import TopBar from "../../_components/topbar";

const fontDisplay = {
  fontFamily: "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif",
};
const fontMono = {
  fontFamily: "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
};

const linkedIds = [
  { type: "National ID (NIN)", number: "123-456-789-01", status: "Verified" },
  { type: "Passport", number: "A01 234567", status: "Verified" },
  { type: "Driver's License", number: "DL-987654", status: "Verified" },
  { type: "Voter's Card", number: "VTR-84-291-AA", status: "Verified" },
];

export default function LinkedIdsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <TopBar title="Linked IDs" />

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
              Connected Identity Documents
            </h2>
          </div>
          <div className="px-5 divide-y divide-border">
            {linkedIds.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <HugeiconsIcon icon={Link01Icon} size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-14 font-medium text-foreground">
                      {item.type}
                    </p>
                    <p
                      style={fontMono}
                      className="text-12 text-muted-foreground"
                    >
                      {item.number}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-11 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <HugeiconsIcon icon={SecurityCheckIcon} size={12} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
