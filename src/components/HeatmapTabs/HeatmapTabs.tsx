import { useTranslation } from "react-i18next";
import HeatmapTab from "../HeatmapTab/HeatmapTab";
import { View } from "src/types";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";

export function HeatmapTabs() {
  const { settings } = useHeatmapContext();
  const { t } = useTranslation();

  return (
    <div className="heatmap-tracker-header__tabs">
      {settings.enableChristmasMood ? <div className="santa-claus-hat">🎄</div> : null}
      <HeatmapTab view={View.HeatmapTracker} label={"Heatmap"} />
      <HeatmapTab
        view={View.HeatmapTrackerStatistics}
        label={t("statistics.title")}
      />
      <HeatmapTab view={View.Documentation} label="Documentation" />
      {/* <HeatmapTab view={View.HeatmapMenu} label={"Menu (in progress)"} disabled /> */}
    </div>
  );
}