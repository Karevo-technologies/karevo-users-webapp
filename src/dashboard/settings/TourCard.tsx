"use client";

import { Rocket01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useTour } from "../_components/DashboardTour";
import { SettingsCard } from "./SettingsCard";

/** Lets anyone rerun the first-visit walkthrough of the dashboard. */
export function TourCard() {
  const { start } = useTour();

  return (
    <SettingsCard
      icon={Rocket01Icon}
      title="Product tour"
      description="New here, or just forgot where things live? Take the walkthrough again."
    >
      <Button
        variant="outline"
        className="border-blue-600/40 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
        onClick={start}
      >
        Replay the tour
      </Button>
    </SettingsCard>
  );
}
