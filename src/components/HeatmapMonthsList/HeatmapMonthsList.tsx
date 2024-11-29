import { useTranslation } from "react-i18next";

export function HeatmapMonthsList() {
  const { t } = useTranslation();
  return (
    <ul className="heatmap-tracker-months">
      {[
        t("monthsShort.January"),
        t("monthsShort.February"),
        t("monthsShort.March"),
        t("monthsShort.April"),
        t("monthsShort.May"),
        t("monthsShort.June"),
        t("monthsShort.July"),
        t("monthsShort.August"),
        t("monthsShort.September"),
        t("monthsShort.October"),
        t("monthsShort.November"),
        t("monthsShort.December"),
      ].map((month) => (
        <li key={month}>{month}</li>
      ))}
    </ul>
  );
}
