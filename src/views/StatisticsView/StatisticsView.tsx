import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";

interface StatisticsMetricProps {
  label: string;
  value: number;
}

function StatisticsMetric({ label, value }: StatisticsMetricProps) {
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export function StatisticsView() {
  const { t } = useTranslation();
  const { entriesWithIntensity, trackerData } = useHeatmapContext();

  return (
    <div className="heatmap-statistics">
      <hr />
      <div className="heatmap-statistics__content">
        <StatisticsMetric
          label={t("statistics.totalTrackingDaysThisYear")}
          value={Object.keys(entriesWithIntensity).length}
        />
        <StatisticsMetric
          label={t("statistics.totalTrackingDays")}
          value={Object.keys(trackerData.entries).length}
        />
        <hr />
        <div>{t("statistics.developmentNote")}</div>
      </div>
    </div>
  );
}

/**
 *   const activityByMonth = Object.values(entriesWithIntensity).reduce(
    (acc, entry) => {
      const month = new Date(entry.date).toLocaleString("en-US", {
        month: "long",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
 */

// Ideas for metrics
/**
 * <div>
        <div>
          Average intensity:
          {(
            Object.values(entriesWithIntensity).reduce(
              (sum, entry) => sum + (entry.intensity as number),
              0
            ) / Object.keys(entriesWithIntensity).length
          ).toFixed(2)}
        </div>
        <div>
          Maximum intensity:{" "}
          {Math.max(
            ...Object.values(entriesWithIntensity).map(
              (entry) => entry.intensity as number
            )
          )}
        </div>
        <div>
          Minimum intensity:{" "}
          {Math.min(
            ...Object.values(entriesWithIntensity).map(
              (entry) => entry.intensity as number
            )
          )}
        </div>
        <div>
          {(() => {
            return (
              <div>
                <div>Activity distribution by month:</div>
                <ul>
                  {Object.entries(activityByMonth).map(([month, days]) => (
                    <li key={month}>
                      {month}: {days} days
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
        <div>
          Самый активный месяц:{" "}
          {
            Object.entries(activityByMonth).reduce(
              (max, entry) => (entry[1] > max[1] ? entry : max),
              ["", 0]
            )[0]
          }
        </div>
        <div>
          Самая длинная последовательность дней с активностью:{" "}
          {(() => {
            let maxStreak = 0;
            let currentStreak = 0;
            let lastDate: any = null;

            Object.values(entriesWithIntensity).forEach((entry) => {
              const currentDate = new Date(entry.date);
              if (
                lastDate &&
                (currentDate.getTime() - lastDate.getTime()) /
                  (1000 * 3600 * 24) ===
                  1
              ) {
                currentStreak++;
              } else {
                currentStreak = 1;
              }
              if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
              }
              lastDate = currentDate;
            });

            return maxStreak;
          })()}
        </div>
      </div>
 */
