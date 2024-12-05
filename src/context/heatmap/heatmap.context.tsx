import React, { useMemo } from "react";
import { Colors, Entry, TrackerData, TrackerSettings, View } from "src/types";
import { fillEntriesWithIntensity, getColors, getEntriesForYear } from "src/utils/core";

export const HeatmapContext = React.createContext<HeatmapContextProps | null>(
  null
);

interface HeatmapProviderProps {
  children: React.ReactNode;
  trackerData: TrackerData;
  settings: TrackerSettings;
}

export function HeatmapProvider({
  children,
  trackerData,
  settings,
}: HeatmapProviderProps) {
  const [view, setView] = React.useState(View.HeatmapTracker);

  const defaultYear = useMemo(
    () => trackerData.year ?? new Date().getFullYear(),
    [trackerData.year]
  );

  const [currentYear, setCurrentYear] = React.useState(defaultYear);

  const currentYearEntries = useMemo(
    () => getEntriesForYear(trackerData.entries, currentYear),
    [trackerData.entries, currentYear]
  );

  const mergedTrackerData = useMemo(() => {
    return {
      ...settings,
      ...trackerData,
    };
  }, [trackerData, settings]);

  const colors = useMemo( () => getColors(trackerData, settings.colors), [trackerData, settings.colors]);

  const entriesWithIntensity = useMemo(() => fillEntriesWithIntensity(
    currentYearEntries,
    mergedTrackerData,
    colors,
    settings
  ), [currentYearEntries, mergedTrackerData, colors, settings]);


  return (
    <HeatmapContext.Provider
      value={{
        currentYear,
        setCurrentYear,
        currentYearEntries,
        trackerData,
        settings,
        mergedTrackerData,
        view,
        setView,
        colors,
        entriesWithIntensity,
      }}
    >
      {children}
    </HeatmapContext.Provider>
  );
}

interface HeatmapContextProps {
  currentYear: number;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  currentYearEntries: Entry[];
  trackerData: TrackerData;
  settings: TrackerSettings;
  mergedTrackerData: TrackerData;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
  colors: Colors;
  entriesWithIntensity: Record<number, Entry>;
}

export function useHeatmapContext(): HeatmapContextProps {
  const context = React.useContext(HeatmapContext);
  if (!context) {
    throw new Error("useHeatmapContext must be used within a HeatmapProvider");
  }

  return context;
}
