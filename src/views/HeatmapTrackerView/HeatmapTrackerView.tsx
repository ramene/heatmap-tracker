import React from "react";
import { useEffect } from "react";
import { HeatmapBoxesList } from "src/components/HeatmapBoxesList/HeatmapBoxesList";
import { HeatmapMonthsList } from "src/components/HeatmapMonthsList/HeatmapMonthsList";
import { HeatmapWeekDays } from "src/components/HeatmapWeekDays/HeatmapWeekDays";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";

function HeatmapTrackerView() {
  const { boxes } = useHeatmapContext();

  const graphRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

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
      <div className="heatmap-tracker-graph" ref={graphRef}>
        <HeatmapMonthsList />
        <HeatmapWeekDays />

        <HeatmapBoxesList boxes={boxes} />
      </div>
    </div>
  );
}

export default HeatmapTrackerView;

/**
 * IN PROGRESS
 */
function HeatmapWeekNumbers() {
  const { trackerData } = useHeatmapContext();

  const separateMonths = trackerData.separateMonths;

  return (
    <div className="heatmap-tracker-week-numbers">
      {Array.from({ length: 53 }, (_, i) => (
        <div key={i} className="heatmap-tracker-week-number">
          {i + 1}
        </div>
      ))}
    </div>
  );
}
