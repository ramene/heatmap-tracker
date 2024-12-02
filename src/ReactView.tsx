import { Box, Colors, Entry, TrackerData, View } from "./types";
import {
  getColors,
  getDayOfYear,
  getLastDayOfYear,
  getMinMaxIntensities,
  getNumberOfEmptyDaysBeforeYearStarts,
  getPrefilledBoxes,
  mapRange,
} from "./utils/core";
import { HeatmapHeader } from "./components/HeatmapHeader/HeatmapHeader";
import { useHeatmapContext } from "./context/heatmap/heatmap.context";
import { HeatmapBoxesList } from "./components/HeatmapBoxesList/HeatmapBoxesList";
import { HeatmapWeekDays } from "./components/HeatmapWeekDays/HeatmapWeekDays";
import { HeatmapMonthsList } from "./components/HeatmapMonthsList/HeatmapMonthsList";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import React from "react";

export const ReactView = () => {
  const { i18n } = useTranslation();
  const {
    currentYear,
    currentYearEntries,
    trackerData,
    settings,
    mergedTrackerData,
    view,
    setView,
  } = useHeatmapContext();

  const graphRef = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings]);

  const colors = getColors(trackerData, settings.colors);

  function getEntriesIntensities(entries: Entry[]): number[] {
    return entries.filter((e) => e.intensity).map((e) => e.intensity as number);
  }

  function fillEntriesWithIntensity(
    entries: Entry[],
    trackerData: TrackerData,
    colors: Colors
  ): Record<number, Entry> {
    const intensities = getEntriesIntensities(entries);

    // If we can't receive min/max intensities from entries,
    // try to use them from user's config or use them from default settings.
    const [minimumIntensity, maximumIntensity] = intensities.length
      ? getMinMaxIntensities(intensities)
      : [
          trackerData.intensityScaleStart ?? settings.intensityScaleStart,
          trackerData.intensityScaleEnd ?? settings.intensityScaleEnd,
        ];

    // If user defined intensityScaleStart explicitly use them,
    // otherwise minimum and maximum from entries will be used.
    const intensityScaleStart =
      trackerData.intensityScaleStart ?? minimumIntensity;
    const intensityScaleEnd = trackerData.intensityScaleEnd ?? maximumIntensity;

    const entriesByDay: Record<number, Entry> = {};

    entries.forEach((e) => {
      const newEntry = {
        intensity: trackerData.defaultEntryIntensity,
        ...e,
      };

      const colorIntensities =
        typeof colors === "string"
          ? settings.colors[colors]
          : colors[e.color] ?? colors[Object.keys(colors)[0]];

      const numOfColorIntensities = Object.keys(colorIntensities).length;

      if (
        minimumIntensity === maximumIntensity &&
        intensityScaleStart === intensityScaleEnd
      ) {
        newEntry.intensity = numOfColorIntensities;
      } else {
        newEntry.intensity = Math.round(
          mapRange(
            newEntry.intensity,
            intensityScaleStart,
            intensityScaleEnd,
            1,
            numOfColorIntensities
          )
        );
      }

      const day = getDayOfYear(new Date(e.date));

      entriesByDay[day] = newEntry;
    });

    return entriesByDay;
  }

  function getBoxes(
    currentYear: number,
    entriesWithIntensity: Record<number, Entry>,
    colors: Colors,
    separateMonths: boolean,
    trackerData: TrackerData
  ): Box[] {
    const numberOfEmptyDaysBeforeYearStarts =
      getNumberOfEmptyDaysBeforeYearStarts(currentYear, settings.weekStartDay);

    const boxes = getPrefilledBoxes(numberOfEmptyDaysBeforeYearStarts);

    const lastDayOfYear = getLastDayOfYear(currentYear);
    const numberOfDaysInYear = getDayOfYear(lastDayOfYear);
    const todaysDayNumberLocal = getDayOfYear(new Date());

    for (let day = 1; day <= numberOfDaysInYear; day++) {
      const box: Box = {};

      const currentDate = new Date(currentYear, 0, day);

      // We don't need to add padding before January.
      if (separateMonths && day > 31) {
        const dayInMonth = Number(
          currentDate.toLocaleString("en-us", { day: "numeric" })
        );
        if (dayInMonth === 1) {
          for (let i = 0; i < 7; i++) {
            const emptyBox = {
              isSpaceBetweenBox: true,
            };
            boxes.push(emptyBox);
          }
        }
      }

      const month = currentDate.toLocaleString("en-US", { month: "short" });
      box.name = `month-${month.toLowerCase()}`;

      if (day === todaysDayNumberLocal) {
        box.isToday = true;
        box.showBorder = trackerData.showCurrentDayBorder;
      }

      if (entriesWithIntensity[day]) {
        box.hasData = true;
        const entry = entriesWithIntensity[day];

        box.date = entry.date;

        if (entry.content) {
          box.content = entry.content;
        }

        const currentDayColors = entry.color
          ? colors[entry.color]
          : colors[Object.keys(colors)[0]];

        box.backgroundColor = currentDayColors[(entry.intensity as number) - 1];
      } else {
        box.hasData = false;
      }

      boxes.push(box);
    }

    return boxes;
  }

  const entriesWithIntensity = fillEntriesWithIntensity(
    currentYearEntries,
    mergedTrackerData,
    colors
  );

  const boxes = getBoxes(
    currentYear,
    entriesWithIntensity,
    colors,
    mergedTrackerData.separateMonths,
    mergedTrackerData
  );

  useEffect(() => {
    graphRef.current?.scrollTo?.({
      top: 0,
      left:
        (graphRef.current?.querySelector(".today") as HTMLElement)?.offsetLeft -
        graphRef.current?.offsetWidth / 2,
    });

    setIsLoading(false);
  }, [boxes]);

  if (!currentYear) {
    return null;
  }

  return (
    <div>
      {view === View.HeatmapTracker ? (
        <div
          className={`heatmap-tracker ${
            isLoading ? "heatmap-tracker-loading" : null
          }`}
        >
          <HeatmapHeader />
          <div className="heatmap-tracker-graph" ref={graphRef}>
            <HeatmapMonthsList />
            <HeatmapWeekDays />

            <HeatmapBoxesList boxes={boxes} />
          </div>
        </div>
      ) : (
        <div>
          Settings
          <button onClick={() => setView(View.HeatmapTracker)}>back</button>
        </div>
      )}
    </div>
  );
};
