import { useTranslation } from "react-i18next";
import { HeatmapTab } from "../HeatmapTab/HeatmapTab";
import { View } from "src/types";

export function HeatmapTabs() {
  const { t } = useTranslation();

  return (
    <div className="heatmap-tracker-header__tabs">
      <HeatmapTab view={View.HeatmapTracker} label={"Heatmap"} />
      <HeatmapTab
        view={View.HeatmapTrackerStatistics}
        label={t("statistics.title")}
      />
      <HeatmapTab view={View.Documentation} label="Documentation"/>
      {/* <HeatmapTab view={View.HeatmapMenu} label={"Menu (in progress)"} disabled /> */}
    </div>
  );
}
