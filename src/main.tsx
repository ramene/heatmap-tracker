import { App, MarkdownPostProcessorContext, Notice, parseYaml, Plugin } from "obsidian";
import { getAPI, Literal } from "obsidian-dataview";
import { createRoot } from "react-dom/client";
import { createContext, StrictMode } from "react";
import HeatmapTrackerSettingsTab from "./settings";
import { TrackerData, TrackerParams, TrackerSettings } from "./types";
import ReactApp from "./App";
import { HeatmapProvider } from "./context/heatmap/heatmap.context";

import "./localization/i18n";
import { useContext } from "react";
import { IHeatmapView } from "src/types";
import { mergeTrackerData } from "./utils/core";
import LegendView from "./views/LegendView/LegendView";
import StatisticsView from "./views/StatisticsView/StatisticsView";
import { getCurrentFullYear } from "./utils/date";
import { HeatmapHeader } from "./components/HeatmapHeader/HeatmapHeader";
import { renderHeatmapTracker } from "./web";

declare global {
  interface Window {
    renderHeatmapTracker?: (el: HTMLElement, trackerData: TrackerData) => void;
    renderHeatmapTrackerLegend?: (
      el: HTMLElement,
      trackerData: TrackerData
    ) => void;
    renderHeatmapTrackerStatistics?: (
      el: HTMLElement,
      trackerData: TrackerData
    ) => void;
  }
}

export const AppContext = createContext<App | undefined>(undefined);

export const useAppContext = (): App => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};

const DEFAULT_SETTINGS: TrackerSettings = {
  palettes: {
    default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
    danger: ["#fff33b", "#fdc70c", "#f3903f", "#ed683c", "#e93e3a"],
  },
  weekStartDay: 1,
  weekDisplayMode: "even",
  separateMonths: true,
  language: "en",
  viewTabsVisibility: {
    [IHeatmapView.Documentation]: true,
    // [IHeatmapView.Donation]: true,
    [IHeatmapView.HeatmapTracker]: true,
    [IHeatmapView.HeatmapTrackerStatistics]: true,
    [IHeatmapView.Legend]: true,
  },
};

export const DEFAULT_TRACKER_DATA: TrackerData = {
  year: getCurrentFullYear(),
  entries: [
    { date: "1900-01-01", customColor: "#7bc96f", intensity: 5, content: "" },
  ],
  showCurrentDayBorder: true,
  intensityConfig: {
    scaleStart: undefined,
    scaleEnd: undefined,
    defaultIntensity: 4,
    showOutOfRange: true,
  },
  intensityScaleStart: undefined,
  intensityScaleEnd: undefined,
  defaultEntryIntensity: 4,
  colorScheme: {
    paletteName: "default",
  },
  insights: [],
};

export default class HeatmapTracker extends Plugin {
  settings: TrackerSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new HeatmapTrackerSettingsTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor(
      "tracker-heatmap",
      async (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        const params = parseYaml(source) as TrackerParams;
        if(!('property' in params)) {
          console.warn("Missing codeblock parameter: property");
          return;
        }
        try {
          const trackerData: TrackerData = {
            ...DEFAULT_TRACKER_DATA,
            entries: [],
            ...params
          };
          const dv = getAPI();
          const pages = dv.pages(`"${params.path}"`).where((p: Record<string, Literal>) => {
            if(typeof params.property === 'string') {
              return params.property in p;
            }
            for(const property of params.property) {
              if(property in p) {
                return true;
              }
            }
            return false;
          });
          for (const page of pages) {
            trackerData.entries.push({
              date: page.file.name,
              content: el.createSpan(`[](${page.file.name})`)
            });
          }
          renderHeatmapTracker(el, trackerData, {...this.settings, ...params});
        } catch(e) {
          console.warn(e);
        }
      }
    );

    window.renderHeatmapTracker = (
      el: HTMLElement,
      trackerData: TrackerData = DEFAULT_TRACKER_DATA
    ) => {
      const container = el.createDiv({
        cls: "heatmap-tracker-container",
        attr: { "data-htp-name": trackerData?.heatmapTitle ?? "" },
      });

      const root = createRoot(container);

      root.render(
        <StrictMode>
          <AppContext.Provider value={this.app}>
            <HeatmapProvider
              trackerData={mergeTrackerData(DEFAULT_TRACKER_DATA, trackerData)}
              settings={this.settings}
            >
              <ReactApp />
            </HeatmapProvider>
          </AppContext.Provider>
        </StrictMode>
      );

      return container;
    };

    window.renderHeatmapTrackerLegend = (
      el: HTMLElement,
      trackerData: TrackerData = DEFAULT_TRACKER_DATA
    ) => {
      const container = el.createDiv({
        cls: "heatmap-tracker-legend",
        attr: {
          "data-htp-name": trackerData?.heatmapTitle
            ? `${trackerData?.heatmapTitle}-legend`
            : "",
        },
      });

      const root = createRoot(container);

      root.render(
        <StrictMode>
          <AppContext.Provider value={this.app}>
            <HeatmapProvider
              trackerData={mergeTrackerData(DEFAULT_TRACKER_DATA, trackerData)}
              settings={this.settings}
            >
              <LegendView />
            </HeatmapProvider>
          </AppContext.Provider>
        </StrictMode>
      );

      return container;
    };

    window.renderHeatmapTrackerStatistics = (
      el: HTMLElement,
      trackerData: TrackerData = DEFAULT_TRACKER_DATA
    ) => {
      const container = el.createDiv({
        cls: "heatmap-tracker-statistics",
        attr: {
          "data-htp-name": trackerData?.heatmapTitle
            ? `${trackerData?.heatmapTitle}-statistics`
            : "",
        },
      });

      const root = createRoot(container);

      root.render(
        <StrictMode>
          <AppContext.Provider value={this.app}>
            <HeatmapProvider
              trackerData={mergeTrackerData(DEFAULT_TRACKER_DATA, trackerData)}
              settings={this.settings}
            >
              <>
                <HeatmapHeader hideTabs hideSubtitle />
                <StatisticsView />
              </>
            </HeatmapProvider>
          </AppContext.Provider>
        </StrictMode>
      );

      return container;
    };
  }

  onunload() {
    if (window.renderHeatmapTracker) {
      delete window.renderHeatmapTracker;
    }

    if (window.renderHeatmapTrackerLegend) {
      delete window.renderHeatmapTrackerLegend;
    }

    if (window.renderHeatmapTrackerStatistics) {
      delete window.renderHeatmapTrackerStatistics;
    }
  }

  async loadSettings() {
    const settingsData: TrackerSettings = await this.loadData();

    this.settings = {
      ...DEFAULT_SETTINGS,
      ...settingsData,
      viewTabsVisibility: {
        ...DEFAULT_SETTINGS?.viewTabsVisibility,
        ...settingsData?.viewTabsVisibility,
      },
      palettes: {
        ...DEFAULT_SETTINGS?.palettes,
        ...settingsData?.palettes,
      },
    };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
