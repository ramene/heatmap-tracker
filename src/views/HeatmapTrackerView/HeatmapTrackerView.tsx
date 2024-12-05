import React from "react";
import { useEffect } from "react";
import { HeatmapBoxesList } from "src/components/HeatmapBoxesList/HeatmapBoxesList";
import { HeatmapHeader } from "src/components/HeatmapHeader/HeatmapHeader";
import { HeatmapMonthsList } from "src/components/HeatmapMonthsList/HeatmapMonthsList";
import { HeatmapWeekDays } from "src/components/HeatmapWeekDays/HeatmapWeekDays";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { getBoxes } from "src/utils/core";

export function HeatmapTrackerView() {
  const {
    currentYear,
    entriesWithIntensity,
    colors,
    settings,
    mergedTrackerData,
  } = useHeatmapContext();

  const graphRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const boxes = getBoxes(
    currentYear,
    entriesWithIntensity,
    colors,
    mergedTrackerData.separateMonths,
    mergedTrackerData,
    settings
  );

  useEffect(() => {
    graphRef.current?.scrollTo?.({
      top: 0,
      left:
        (graphRef.current?.querySelector(".today") as HTMLElement)?.offsetLeft -
        graphRef.current?.offsetWidth / 2,
    });

    setIsLoading(false);
  }, [boxes]);

  return (
    <div
      className={`heatmap-tracker ${
        isLoading ? "heatmap-tracker-loading" : ""
      }`}
    >
      <HeatmapHeader />
      <div className="heatmap-tracker-graph" ref={graphRef}>
        <HeatmapMonthsList />
        <HeatmapWeekDays />

        <HeatmapBoxesList boxes={boxes} />
      </div>
    </div>
  );
}
