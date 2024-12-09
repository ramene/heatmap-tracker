import { useTranslation } from "react-i18next";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { Entry } from "src/types";

interface StatisticsMetricProps {
  label: string;
  value: number;
}

type StreakResult = {
  currentStreak: number;
  longestStreak: number;
};

function calculateStreaks(entries: Entry[]): StreakResult {
  if (!entries.length) return { currentStreak: 0, longestStreak: 0 };

  // Sort the data by date in ascending order
  const sortedData = entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let longestStreak = 1;
  let currentStreak = 1;
  let maxStreak = 1;
  const dayDifference = 1000 * 60 * 60 * 24;

  for (let i = 1; i < sortedData.length; i++) {
    const currentDate = new Date(sortedData[i].date);
    const previousDate = new Date(sortedData[i - 1].date);

    // Calculate the difference in days between the current and previous date
    const differenceInDays = Math.ceil(
      (currentDate.getTime() - previousDate.getTime()) / dayDifference
    );

    if (differenceInDays === 1) {
      // If the dates are consecutive, increase the current streak
      currentStreak++;
    } else {
      // Otherwise, reset the current streak
      currentStreak = 1;
    }

    // Update the longest streak
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  // Calculate the current streak
  const today = new Date();
  const lastDate = new Date(sortedData[sortedData.length - 1].date);
  const differenceWithToday = Math.ceil(
    (today.getTime() - lastDate.getTime()) / dayDifference
  );

  if (differenceWithToday === 0 || differenceWithToday === 1) {
    longestStreak = maxStreak;
  } else {
    longestStreak = maxStreak;
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
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

  const { currentStreak, longestStreak } = calculateStreaks(
    trackerData.entries
  );

  return (
    <div className="heatmap-statistics">
      <div className="heatmap-statistics__content">
        <StatisticsMetric
          label={t("statistics.totalTrackingDaysThisYear")}
          value={Object.keys(entriesWithIntensity).length}
        />
        <StatisticsMetric
          label={t("statistics.totalTrackingDays")}
          value={Object.keys(trackerData.entries).length}
        />
        <br />
        <StatisticsMetric
          label={t("statistics.currentStreak")}
          value={currentStreak}
        />
        <StatisticsMetric
          label={t("statistics.longestStreak")}
          value={longestStreak}
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
