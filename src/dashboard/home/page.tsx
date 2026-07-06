import TopBar from "../_components/topbar";
import HomeCards from "../_components/homecards";

export default function HomePage() {
  return (
    <div>
      <TopBar title="Home" />
      <div className="mx-auto max-w-6xl p-4 lg:p-6">
        <HomeCards />
      </div>
    </div>
  );
}
