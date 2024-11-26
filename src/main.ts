import { Plugin } from 'obsidian';
import HeatmapTrackerSettingsTab from './settings';
import { getDayOfYear, getLastDayOfYear, getNumberOfEmptyDaysBeforeYearStarts, isValidDate, mapRange } from './utils/core';
import { initializeTrackerContainer, renderTrackerHeader, renderDayLabels, renderMonthLabels } from './utils/rendering';

declare global {
  interface Window {
    renderHeatmapTracker: (el: HTMLElement, trackerData: TrackerData) => void;
  }
}

interface TrackerData {
  year: number;
  colors: { [index: string | number]: string[] } | string;
  entries: Entry[];
  showCurrentDayBorder: boolean;
  defaultEntryIntensity: number;
  intensityScaleStart: number;
  intensityScaleEnd: number;
  separateMonths: boolean;
}

interface TrackerSettings extends TrackerData {
  colors: { [index: string | number]: string[] };
  weekStartDay: number;
  separateMonths: boolean;
}

interface Entry {
  date: string;
  intensity?: number;
  color: string;
  content: string | HTMLElement;
  separateMonths?: boolean;
}

interface Box {
  backgroundColor?: string;
  date?: string;
  content?: string | HTMLElement;
  classNames?: string[];
}

type Colors = { [index: string | number]: string[] };

const DEFAULT_SETTINGS: TrackerSettings = {
  year: new Date().getFullYear(),
  colors: {
    default: ['#c6e48b', '#7bc96f', '#49af5d', '#2e8840', '#196127'],
  },
  entries: [{ date: '1900-01-01', color: '#7bc96f', intensity: 5, content: '' }],
  showCurrentDayBorder: true,
  defaultEntryIntensity: 4,
  intensityScaleStart: 1,
  intensityScaleEnd: 5,
  weekStartDay: 1,
  separateMonths: false,
};

class TrackerBuilder {

  private readonly trackerData: TrackerData;

  constructor(trackerData: TrackerData) {
    this.trackerData = trackerData;
  }

  withYear(year: number): TrackerBuilder {
    this.trackerData.year = year;
    return this;
  }

  withColors(colors: { [index: string | number]: string[] } | string): TrackerBuilder {
    this.trackerData.colors = colors;
    return this;
  }

  withEntries(entries: Entry[]): TrackerBuilder {
    this.trackerData.entries = entries;
    return this;
  }

  withShowCurrentDayBorder(showCurrentDayBorder: boolean): TrackerBuilder {
    this.trackerData.showCurrentDayBorder = showCurrentDayBorder;
    return this;
  }

  withDefaultEntryIntensity(defaultEntryIntensity: number): TrackerBuilder {
    this.trackerData.defaultEntryIntensity = defaultEntryIntensity;
    return this;
  }

  withIntensityScaleStart(intensityScaleStart: number): TrackerBuilder {
    this.trackerData.intensityScaleStart = intensityScaleStart;
    return this;
  }

  withIntensityScaleEnd(intensityScaleEnd: number): TrackerBuilder {
    this.trackerData.intensityScaleEnd = intensityScaleEnd;
    return this;
  }

  withSeparateMonths(separateMonths: boolean): TrackerBuilder {
    this.trackerData.separateMonths = separateMonths;
    return this;
  }

  build(): TrackerData {
    return this.trackerData;
  }
}

export default class HeatmapTracker extends Plugin {
  settings: TrackerSettings = DEFAULT_SETTINGS;

  getEntriesForYear(entries: Entry[], year: number): Entry[] {
    return entries.filter((e) => {
      if (!isValidDate(e.date)) {
        return false;
      }

      return new Date(e.date).getFullYear() === year;
    }) ?? this.settings.entries;
  }

  getCurrentYear(trackerData: TrackerData): number {
    return trackerData.year ?? this.settings.year;
  }

  getColors(trackerData: TrackerData): Colors {
    const colors =
      typeof trackerData.colors === 'string'
        ? this.settings.colors[trackerData.colors]
          ? { [trackerData.colors]: this.settings.colors[trackerData.colors] }
          : this.settings.colors
        : trackerData.colors ?? this.settings.colors;

    return colors;
  }

  getShowCurrentDayBorderSetting(trackerData: TrackerData): boolean {
    return trackerData.showCurrentDayBorder ?? this.settings.showCurrentDayBorder;
  }

  getDefaultEntryIntensitySetting(trackerData: TrackerData): number {
    return trackerData.defaultEntryIntensity ?? this.settings.defaultEntryIntensity;
  }

  getEntriesIntensities(entries: Entry[]): number[] {
    return entries
      .filter((e) => e.intensity)
      .map((e) => e.intensity as number);
  }

  getMinMaxIntensities(intensities: number[]): [number, number] {
    if (!intensities.length) {
      return [this.settings.intensityScaleStart, this.settings.intensityScaleEnd];
    }

    return [
      Math.min(...intensities),
      Math.max(...intensities),
    ];
  }

  getSeparateMonthsSetting(trackerData: TrackerData): boolean {
    return trackerData.separateMonths ?? this.settings.separateMonths;
  }

  addYearNavigationListeners(parentEl: HTMLElement, el: HTMLElement, trackerData: TrackerData, currentYear: number, leftArrow: HTMLElement, rightArrow: HTMLElement) {
    // Event listener for the left arrow
    leftArrow.addEventListener('click', () => {
      const newTrackerData = { ...trackerData, year: currentYear - 1 };
      el.remove();

      this.render(parentEl, newTrackerData);
    });

    // Event listener for the right arrow
    rightArrow.addEventListener('click', () => {
      const newTrackerData = { ...trackerData, year: currentYear + 1 };
      el.remove();

      this.render(parentEl, newTrackerData);
    });
  }

  renderTrackerBoxes(parent: HTMLElement, boxes: Box[]) {
    boxes.forEach((box) => {
      const entry = createEl('li', {
        attr: {
          ...(box.date && { 'data-date': box.date }),
          style: `${box.backgroundColor ? `background-color: ${box.backgroundColor};` : ''}`,
        },
        cls: box.classNames,
        parent,
      });

      createSpan({
        cls: 'heatmap-tracker-content',
        parent: entry,
        text: box.content as string,
      });
    });
  }

  fillEntriesWithIntensity(entries: Entry[], trackerData: TrackerData, colors: Colors): Entry[] {
    const defaultEntryIntensity = this.getDefaultEntryIntensitySetting(trackerData);
    const intensities = this.getEntriesIntensities(entries);

    const [minimumIntensity, maximumIntensity] = this.getMinMaxIntensities(intensities);

    const intensityScaleStart = trackerData.intensityScaleStart ?? minimumIntensity;
    const intensityScaleEnd = trackerData.intensityScaleEnd ?? maximumIntensity;

    const entriesWithIntensity: Entry[] = [];

    entries.forEach((e) => {
      const newEntry = {
        intensity: defaultEntryIntensity,
        ...e,
      };

      const colorIntensities =
        typeof colors === 'string'
          ? this.settings.colors[colors]
          : colors[e.color] ?? colors[Object.keys(colors)[0]];

      const numOfColorIntensities = Object.keys(colorIntensities).length;

      if (minimumIntensity === maximumIntensity && intensityScaleStart === intensityScaleEnd) {
        newEntry.intensity = numOfColorIntensities;
      } else {
        newEntry.intensity = Math.round(
          mapRange(newEntry.intensity, intensityScaleStart, intensityScaleEnd, 1, numOfColorIntensities)
        );
      }

      const day = getDayOfYear(new Date(e.date));
      entriesWithIntensity[day] = newEntry;
    });

    return entriesWithIntensity;
  }

  getPrefilledBoxes(numberOfEmptyDaysBeforeYearBegins: number): Box[] {
    return Array(numberOfEmptyDaysBeforeYearBegins).fill({ backgroundColor: 'transparent' });
  }

  getBoxes(currentYear: number, entriesWithIntensity: Entry[], colors: Colors, separateMonths: boolean, trackerData: TrackerData): Box[] {
    const showCurrentDayBorder = this.getShowCurrentDayBorderSetting(trackerData);
    const numberOfEmptyDaysBeforeYearStarts = getNumberOfEmptyDaysBeforeYearStarts(currentYear, this.settings.weekStartDay);

    const boxes = this.getPrefilledBoxes(numberOfEmptyDaysBeforeYearStarts);

    const lastDayOfYear = getLastDayOfYear(currentYear);
    const numberOfDaysInYear = getDayOfYear(lastDayOfYear);
    const todaysDayNumberLocal = getDayOfYear(new Date());

    for (let day = 1; day <= numberOfDaysInYear; day++) {
      const box: Box = {
        classNames: [],
      };

      const currentDate = new Date(currentYear, 0, day);
      const month = currentDate.toLocaleString('en-US', { month: 'short' });

      // We don't need to add padding before January.
      if (separateMonths && day > 31) {
        const dayInMonth = Number(currentDate.toLocaleString("en-us", { day: "numeric" }));
        if (dayInMonth === 1) {
          for (let i = 0; i < 7; i++) {
            boxes.push({ backgroundColor: "transparent" });
          }
        }
      }

      box.classNames?.push(`month-${month.toLowerCase()}`);

      if (day === todaysDayNumberLocal && showCurrentDayBorder) {
        box.classNames?.push('today');
      }

      if (entriesWithIntensity[day]) {
        box.classNames?.push('hasData');
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
        box.classNames?.push('isEmpty');
      }

      boxes.push(box);
    }

    return boxes;
  }

  render(el: HTMLElement, trackerData: TrackerData) {
    // Get the current year from trackerData or default settings
    const currentYear = this.getCurrentYear(trackerData);

    // Create containers
    const heatmapTrackerGraphDiv = initializeTrackerContainer(el);
    const { leftArrow, rightArrow } = renderTrackerHeader(heatmapTrackerGraphDiv, currentYear);
    // Create the months and days labels
    renderMonthLabels(heatmapTrackerGraphDiv);

    renderDayLabels(heatmapTrackerGraphDiv, this.settings.weekStartDay);

    const boxesContainer = createEl('ul', {
      cls: 'heatmap-tracker-boxes',
      parent: heatmapTrackerGraphDiv,
    });
    // Determine colors
    const colors = this.getColors(trackerData);

    const currentYearEntries = this.getEntriesForYear(trackerData.entries, currentYear);

    const separateMonths = this.getSeparateMonthsSetting(trackerData);

    const entriesWithIntensity = this.fillEntriesWithIntensity(currentYearEntries, trackerData, colors);

    const boxes = this.getBoxes(currentYear, entriesWithIntensity, colors, separateMonths, trackerData);

    this.addYearNavigationListeners(el, heatmapTrackerGraphDiv, trackerData, currentYear, leftArrow, rightArrow);
    this.renderTrackerBoxes(boxesContainer, boxes);

    if (separateMonths) {
      boxesContainer.className += " separate-months";
    }
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new HeatmapTrackerSettingsTab(this.app, this));

    window.renderHeatmapTracker = (
      el: HTMLElement,
      trackerData: TrackerData
    ): void => {
      const heatmapTracker = el.createDiv({
        cls: 'heatmap-tracker',
        parent: el,
      });
  
      this.render(heatmapTracker, trackerData);
    };
  }

  onunload() {
    console.log('Unloading HeatmapTracker plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}