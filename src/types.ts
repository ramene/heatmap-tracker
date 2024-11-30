export interface Entry {
  date: string;
  intensity?: number;
  color: string;
  content: string | HTMLElement;
  separateMonths?: boolean;
}

export type Colors = { [index: string | number]: string[] };

/**
 * Represents the data structure for the heatmap tracker.
 */
export interface TrackerData {
  /**
   * The year for which the tracker data is relevant.
   */
  year: number;

  /**
   * A mapping of colors used in the heatmap. The keys can be either strings or numbers,
   * and the values are arrays of strings representing color codes.
   */
  colors: { [index: string | number]: string[] } | string;

  /**
   * An array of entries representing the data points in the heatmap.
   */
  entries: Entry[];

  /**
   * A flag indicating whether to show a border around the current day.
   */
  showCurrentDayBorder: boolean;

  /**
   * The default intensity value for an entry.
   */
  defaultEntryIntensity: number;

  /**
   * The starting value for the intensity scale.
   */
  intensityScaleStart: number;

  /**
   * The ending value for the intensity scale.
   */
  intensityScaleEnd: number;

  /**
   * A flag indicating whether to separate the months in the heatmap.
   */
  separateMonths: boolean;
  heatmapTitle?: string;
  heatmapSubtitle?: string;
}

export interface TrackerSettings extends TrackerData {
  colors: { [index: string | number]: string[] };
  weekStartDay: number;
  separateMonths: boolean;
  language: string;
}

export interface Box {
  backgroundColor?: string;
  date?: string;
  content?: string | HTMLElement;
  classNames?: string[];
}