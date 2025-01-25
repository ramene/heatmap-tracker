import { Entry, Insight } from "src/types";

export function processCustomMetrics(insights: Insight[], yearEntries: Entry[]): Record<string, string> {
  const results: Record<string, string> = {};

  insights.forEach((insight) => {
    // Calculate the result for the current metric
    const result = insight.calculate({ yearEntries });
    // Store the result with the metric name as the key
    results[insight.name] = result?.toString() || "";
  });

  return results;
}

const mostActiveDayMetric: Insight = {
  name: "The most active day of the week",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }): string => {
    const dayCounts: Record<string, number> = {};

    // Map each box to the day of the week
    yearEntries.forEach((entry) => {
      const date = new Date(entry.date);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });

      if (!dayCounts[day]) {
        dayCounts[day] = 0;
      }

      dayCounts[day]++;
    });

    // Find the day with the highest count
    const mostActiveDay = Object.entries(dayCounts).reduce(
      (maxDay, [day, count]) => (count > maxDay.count ? { day, count } : maxDay),
      { day: "", count: 0 }
    );

    return mostActiveDay.day;
  },
};

const totalValueMetric: Insight = {
  name: "Total Value",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }) => {
    const total = yearEntries.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return total.toString();
  },
};

const averageValueMetric: Insight = {
  name: "Average Value",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }) => {
    const total = yearEntries.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return (total / yearEntries.length).toFixed(2); // Two decimal places
  },
};

const mostFrequentIntensityMetric: Insight = {
  name: "Most Frequent Intensity",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }) => {
    const intensityCounts: Record<number, number> = {};

    yearEntries.forEach((entry) => {
      const intensity = entry.intensity || 0;
      intensityCounts[intensity] = (intensityCounts[intensity] || 0) + 1;
    });

    const mostFrequent = Object.entries(intensityCounts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    );

    return mostFrequent[0]; // Return the intensity level
  },
};

const highestValueDayMetric: Insight = {
  name: "Day with the Highest Value",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }) => {
    const maxEntry = yearEntries.reduce((max, entry) =>
      (entry.value || 0) > (max.value || 0) ? entry : max
    );
    return maxEntry.date || "No data";
  },
};

const intensityDistributionMetric: Insight = {
  name: "Intensity Distribution",
  calculate: ({ yearEntries }: { yearEntries: Entry[] }) => {
    const distribution: Record<number, number> = {};

    yearEntries.forEach((entry) => {
      const intensity = entry.intensity || 0;
      distribution[intensity] = (distribution[intensity] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([intensity, count]) => `Intensity ${intensity}: ${count}`)
      .join(", ");
  },
};