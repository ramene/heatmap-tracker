import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";

export function HeatmapHeader() {
  const { t } = useTranslation();
  const { currentYear, setCurrentYear } = useHeatmapContext();

  function onArrowBackClick() {
    setCurrentYear(currentYear - 1);
  }

  function onArrowForwardClick() {
    setCurrentYear(currentYear + 1);
  }

  return (
    <div className="heatmap-tracker-header">
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
  );
}
