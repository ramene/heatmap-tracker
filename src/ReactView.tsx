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
import React from "react";

export const ReactView = () => {
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

  const colors = getColors(trackerData, settings.colors);

  function getEntriesIntensities(entries: Entry[]): number[] {
    return entries.filter((e) => e.intensity).map((e) => e.intensity as number);
  }

  function fillEntriesWithIntensity(
    entries: Entry[],
    trackerData: TrackerData,
    colors: Colors
  ): Entry[] {
    const intensities = getEntriesIntensities(entries);

    const [minimumIntensity, maximumIntensity] = getMinMaxIntensities(
      intensities,
      [trackerData.intensityScaleStart, trackerData.intensityScaleEnd]
    );

    const intensityScaleStart =
      trackerData.intensityScaleStart ?? minimumIntensity;
    const intensityScaleEnd = trackerData.intensityScaleEnd ?? maximumIntensity;

    const entriesWithIntensity: Entry[] = [];

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
      entriesWithIntensity[day] = newEntry;
    });

    return entriesWithIntensity;
  }

  function getBoxes(
    currentYear: number,
    entriesWithIntensity: Entry[],
    colors: Colors,
    separateMonths: boolean,
    trackerData: TrackerData
  ): Box[] {
    const showCurrentDayBorder = trackerData.showCurrentDayBorder;
    const numberOfEmptyDaysBeforeYearStarts =
      getNumberOfEmptyDaysBeforeYearStarts(currentYear, settings.weekStartDay);

    const boxes = getPrefilledBoxes(numberOfEmptyDaysBeforeYearStarts);

    const lastDayOfYear = getLastDayOfYear(currentYear);
    const numberOfDaysInYear = getDayOfYear(lastDayOfYear);
    const todaysDayNumberLocal = getDayOfYear(new Date());

    for (let day = 1; day <= numberOfDaysInYear; day++) {
      const box: Box = {
        classNames: [],
      };

      const currentDate = new Date(currentYear, 0, day);

      // We don't need to add padding before January.
      if (separateMonths && day > 31) {
        const dayInMonth = Number(
          currentDate.toLocaleString("en-us", { day: "numeric" })
        );
        if (dayInMonth === 1) {
          for (let i = 0; i < 7; i++) {
            const emptyBox = {
              backgroundColor: "transparent",
              classNames: ["space-between"],
            };
            boxes.push(emptyBox);
          }
        }
      }

      const month = currentDate.toLocaleString("en-US", { month: "short" });
      box.classNames?.push(`month-${month.toLowerCase()}`);

      if (day === todaysDayNumberLocal) {
        box.classNames?.push("today");

        if (showCurrentDayBorder) {
          box.classNames?.push("with-border");
        }
      }

      if (entriesWithIntensity[day]) {
        box.classNames?.push("hasData");
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
        box.classNames?.push("isEmpty");
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
    graphRef.current?.scrollTo({
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
