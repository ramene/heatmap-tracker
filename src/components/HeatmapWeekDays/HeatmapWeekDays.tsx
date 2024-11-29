import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { getShiftedWeekdays } from "src/utils/core";

export function HeatmapWeekDays() {
  const { settings } = useHeatmapContext();
  const { t } = useTranslation();

  const weekDays = useMemo(() => {
    return getShiftedWeekdays(
      [
        t("weekdaysShort.Sunday"),
        t("weekdaysShort.Monday"),
        t("weekdaysShort.Tuesday"),
        t("weekdaysShort.Wednesday"),
        t("weekdaysShort.Thursday"),
        t("weekdaysShort.Friday"),
        t("weekdaysShort.Saturday"),
      ],
      settings.weekStartDay
    );
  }, [settings.weekStartDay]);

  return (
    <div className="heatmap-tracker-days">
      {weekDays.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  );
}
