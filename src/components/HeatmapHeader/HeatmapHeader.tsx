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
      className="lucide lucide-notebook-text"
    >
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12H16" />
      <path d="M9.5 16H14" />
    </svg>
  );
}

function HeatmapIcon() {
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
      className="lucide lucide-grid-3x3"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function MenuIcon() {
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
      className="lucide lucide-ellipsis-vertical"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

const IconForView: Record<View, React.ReactNode> = {
  [View.HeatmapTracker]: <HeatmapIcon />,
  [View.HeatmapTrackerStatistics]: <StatisticsIcon />,
  [View.HeatmapMenu]: <MenuIcon />,
};

function HeatmapTab({ view, label, disabled }: { view: View; label: string, disabled?: boolean }) {
  const { view: selectedView, setView } = useHeatmapContext();

  const isSelected = view === selectedView;

  function handleClick() {
    setView(view);
  }

  return (
    <button
      aria-label={label}
      className={`heatmap-tracker-tab clickable-icon ${
        isSelected ? "is-active" : ""
      }`}
      disabled={disabled}
      onClick={handleClick}
    >
      {IconForView[view]}
    </button>
  );
}

function HeatmapTabs() {
  const { t } = useTranslation();

  return (
    <div className="heatmap-tracker-header__tabs">
      <HeatmapTab view={View.HeatmapTracker} label={"Heatmap"} />
      <HeatmapTab
        view={View.HeatmapTrackerStatistics}
        label={t("statistics.title")}
      />
      <HeatmapTab view={View.HeatmapMenu} label={"Menu (in progress)"} disabled />
    </div>
  );
}

export function HeatmapHeader() {
  const { t } = useTranslation();
  const { currentYear, setCurrentYear, trackerData } = useHeatmapContext();

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
          <button
            className="heatmap-tracker-arrow left clickable-icon"
            aria-label={t("header.previousYear")}
            onClick={onArrowBackClick}
          >
            ◀
          </button>
          <div className="heatmap-tracker-year-display">{currentYear}</div>
          <button
            className="heatmap-tracker-arrow right clickable-icon"
            aria-label={t("header.nextYear")}
            onClick={onArrowForwardClick}
          >
            ▶
          </button>
        </div>
        <div className="heatmap-tracker-header__title">
          {trackerData?.heatmapTitle ?? ""}
        </div>
        <HeatmapTabs />
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
