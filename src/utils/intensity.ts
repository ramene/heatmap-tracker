import { ColorsList, Entry, IntensityConfig, TrackerData } from "src/types";
import { mapRange } from "./core";
import { getDayOfYear } from "./date";

export function getEntriesIntensities(entries: Entry[]): number[] {
  return entries.filter((e) => e.intensity).map((e) => e.intensity as number);
}

export function getIntensitiesRanges(numberOfIntensities: number, intensityStart: number, intensityEnd: number) {
  const intensityRanges = [];

  for (let i = 0; i < numberOfIntensities; i++) {
    const min = mapRange(i, 0, numberOfIntensities, intensityStart, intensityEnd);
    const max = mapRange(i + 1, 0, numberOfIntensities, intensityStart, intensityEnd);

    intensityRanges.push({ min, max, intensity: i + 1 });
  }

  console.log('### intensityRanges', intensityRanges);

  return intensityRanges;
}

export function getIntensitiesInfo(intensities: number[], intensityConfig: IntensityConfig, colorsList: ColorsList) {
  const [minimumIntensity, maximumIntensity] = intensities.length ? getMinMaxIntensities(intensities) : [1, 5];

  const numberOfColorIntensities = colorsList.length;

  return getIntensitiesRanges(numberOfColorIntensities, intensityConfig.scaleStart ?? minimumIntensity, intensityConfig.scaleEnd ?? maximumIntensity);
}

export function fillEntriesWithIntensity(
  entries: Entry[],
  trackerData: TrackerData,
  colorsList: ColorsList,
): Record<number, Entry> {
  const entriesByDay: Record<number, Entry> = {};

  const intensities = getEntriesIntensities(entries);
  const intensitiesMap = getIntensitiesInfo(intensities, trackerData.intensityConfig, colorsList);

  entries.forEach((e) => {
    const currentIntensity = e.intensity ?? trackerData.intensityConfig.defaultIntensity;
    const foundIntensityInfo = intensitiesMap.find((o) => currentIntensity >= o.min && currentIntensity <= o.max);

    const newEntry = {
      ...e,
      intensity: foundIntensityInfo ? foundIntensityInfo.intensity : currentIntensity,
    };

    const day = getDayOfYear(new Date(e.date));

    entriesByDay[day] = newEntry;
  });

  return entriesByDay;
}

export function getMinMaxIntensities(intensities: number[]): [number, number] {
  return [
    Math.min(...intensities),
    Math.max(...intensities),
  ];
}