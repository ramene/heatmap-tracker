import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { View } from "src/types";

function StatisticsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chart-line"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

export function HeatmapHeader() {
  const { t } = useTranslation();
  const { currentYear, setCurrentYear, trackerData, setView } =
    useHeatmapContext();

  function onArrowBackClick() {
    setCurrentYear(currentYear - 1);
  }

  function onArrowForwardClick() {
    setCurrentYear(currentYear + 1);
  }

  return (
    <div className="heatmap-tracker-header">
      <div className="heatmap-tracker-header__main-row">
        <div className="heatmap-tracker-header__navigation">
          <div
            className="heatmap-tracker-arrow left"
            aria-label={t("header.previousYear")}
            role="button"
            onClick={onArrowBackClick}
          >
            ◀
          </div>
          <div className="heatmap-tracker-year-display">{currentYear}</div>
          <div
            className="heatmap-tracker-arrow right"
            aria-label={t("header.nextYear")}
            role="button"
            onClick={onArrowForwardClick}
          >
            ▶
          </div>
        </div>
        <div className="heatmap-tracker-header__title">
          {trackerData?.heatmapTitle ?? ""}
        </div>
        <div className="heatmap-tracker-header__statistics">
          <button
            onClick={() => setView(View.HeatmapTrackerStatistics)}
            className="clickable-icon"
            aria-label="Statistics"
          >
            <>
              <StatisticsIcon />
              <span>(beta)</span>
            </>
          </button>
        </div>
      </div>
      {trackerData?.heatmapSubtitle ? (
        <div className="heatmap-tracker-header__sub-row">
          <div className="heatmap-tracker-header__subtitle">
            {trackerData?.heatmapSubtitle ?? ""}
          </div>
        </div>
      ) : null}
    </div>
  );
}
