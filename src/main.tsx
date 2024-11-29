import { App, Plugin } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { createContext, StrictMode } from "react";
import HeatmapTrackerSettingsTab from "./settings";
import { TrackerData, TrackerSettings } from "./types";
import { ReactView } from "./ReactView";
import { HeatmapProvider } from "./context/heatmap/heatmap.context";

import './localization/i18n';

declare global {
  interface Window {
    renderHeatmapTracker?: (el: HTMLElement, trackerData: TrackerData) => void;
  }
}



export const AppContext = createContext<App | undefined>(undefined);

const DEFAULT_SETTINGS: TrackerSettings = {
  year: new Date().getFullYear(),
  colors: {
    default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
  },
  entries: [
    { date: "1900-01-01", color: "#7bc96f", intensity: 5, content: "" },
  ],
  showCurrentDayBorder: true,
  defaultEntryIntensity: 4,
  intensityScaleStart: 1,
  intensityScaleEnd: 5,
  weekStartDay: 1,
  separateMonths: false,
  language: "en",
};

export default class HeatmapTracker extends Plugin {
  settings: TrackerSettings = DEFAULT_SETTINGS;
  root: Root | null = null;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new HeatmapTrackerSettingsTab(this.app, this));

    window.renderHeatmapTracker = (
      el: HTMLElement,
      trackerData: TrackerData
    ): void => {
      this.root = createRoot(el);
      this.root.render(
        <StrictMode>
          <AppContext.Provider value={this.app}>
            <HeatmapProvider trackerData={trackerData} settings={this.settings}>
              <ReactView />
            </HeatmapProvider>
          </AppContext.Provider>
        </StrictMode>
      );
    };
  }

  onunload() {
    this.root?.unmount();

    if (window.renderHeatmapTracker) {
      delete window.renderHeatmapTracker;
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
