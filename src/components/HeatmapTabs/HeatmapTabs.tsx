import { useTranslation } from "react-i18next";
import HeatmapTab from "../HeatmapTab/HeatmapTab";
import { IHeatmapView } from "src/types";

export function HeatmapTabs() {
  const { t } = useTranslation();

  return (
    <div className="heatmap-tracker-header__tabs">
      <HeatmapTab view={IHeatmapView.Donation} label={"Donate"} />
      <HeatmapTab view={IHeatmapView.HeatmapTracker} label={"Heatmap"} />
      <HeatmapTab
        view={IHeatmapView.HeatmapTrackerStatistics}
        label={t("statistics.title")}
      />
      <HeatmapTab view={IHeatmapView.Documentation} label="Documentation" />
      <HeatmapTab view={IHeatmapView.Legend} label={"Legend"} />
    </div>
  );
}
