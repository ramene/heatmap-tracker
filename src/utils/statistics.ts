import { Entry } from "src/types";

interface CustomMetric {
  name: string;
  calculate: (props: { entries: Entry[] }) => string;
}

export const mostActiveDayMetric: CustomMetric = {
  name: "The most active day of the week",
  calculate: ({ entries }: { entries: Entry[] }): string => {
    const dayCounts: Record<string, number> = {};

    // Map each box to the day of the week
    entries.forEach((entry) => {
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

export function processCustomMetrics(metrics: CustomMetric[], entries: Entry[]): Record<string, string> {
  const results: Record<string, string> = {};

  metrics.forEach((metric) => {
    // Calculate the result for the current metric
    const result = metric.calculate({ entries });
    // Store the result with the metric name as the key
    results[metric.name] = result;
  });

  return results;
}

export const totalValueMetric: CustomMetric = {
  name: "Total Value",
  calculate: ({ entries }: { entries: Entry[] }) => {
    const total = entries.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return total.toString();
  },
};

export const averageValueMetric: CustomMetric = {
  name: "Average Value",
  calculate: ({ entries }: { entries: Entry[] }) => {
    const total = entries.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return (total / entries.length).toFixed(2); // Two decimal places
  },
};

export const mostFrequentIntensityMetric: CustomMetric = {
  name: "Most Frequent Intensity",
  calculate: ({ entries }: { entries: Entry[] }) => {
    const intensityCounts: Record<number, number> = {};

    entries.forEach((entry) => {
      const intensity = entry.intensity || 0;
      intensityCounts[intensity] = (intensityCounts[intensity] || 0) + 1;
    });

    const mostFrequent = Object.entries(intensityCounts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    );

    return mostFrequent[0]; // Return the intensity level
  },
};

export const highestValueDayMetric: CustomMetric = {
  name: "Day with the Highest Value",
  calculate: ({ entries }: { entries: Entry[] }) => {
    const maxEntry = entries.reduce((max, entry) =>
      (entry.value || 0) > (max.value || 0) ? entry : max
    );
    return maxEntry.date || "No data";
  },
};

export const intensityDistributionMetric: CustomMetric = {
  name: "Intensity Distribution",
  calculate: ({ entries }: { entries: Entry[] }) => {
    const distribution: Record<number, number> = {};

    entries.forEach((entry) => {
      const intensity = entry.intensity || 0;
      distribution[intensity] = (distribution[intensity] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([intensity, count]) => `Intensity ${intensity}: ${count}`)
      .join(", ");
  },
};