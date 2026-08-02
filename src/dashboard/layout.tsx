import Sidebar from "./_components/sidebar";
import { InstallBanner } from "./pwa/InstallBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      <InstallBanner />

      {/* lg:pl-60 makes room for the desktop rail; pb-20 keeps content clear of the mobile bottom bar */}
      <div className="pb-20 lg:pb-0 lg:pl-60">{children}</div>
    </div>
  );
}
