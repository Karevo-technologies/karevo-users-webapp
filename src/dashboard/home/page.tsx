import TopBar from "../_components/topbar";
import DashboardHome from "../_components/dashboard-home";

export default function HomePage() {
  return (
    <div>
      <TopBar title="Home" />
      <div className="mx-auto max-w-6xl p-4 lg:p-6">
        <DashboardHome />
      </div>
    </div>
  );
}
