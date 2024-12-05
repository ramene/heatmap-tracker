import { View } from "./types";
import { useHeatmapContext } from "./context/heatmap/heatmap.context";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HeatmapTrackerView } from "./views/HeatmapTrackerView/HeatmapTrackerView";
import { StatisticsView } from "./views/StatisticsView/StatisticsView";

export const ReactApp = () => {
  const { i18n } = useTranslation();
  const { currentYear, settings, view, setView } = useHeatmapContext();

  useEffect(() => {
    if (view !== View.HeatmapTracker) {
      setView(View.HeatmapTracker);
    }
  },[]);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings]);

  if (!currentYear) {
    return null;
  }

  return (
    <div className="heatmap-tracker__container">
      {view === View.HeatmapTracker ? (
        <HeatmapTrackerView />
      ) : (
        <StatisticsView />
      )}
    </div>
  );
};
