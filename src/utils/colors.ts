import { ColorScheme, ColorsList, Palettes } from "src/types";

/**
 * Retrieves the color scheme for the tracker data based on the provided settings.
 *
 * @param trackerData - The data containing the color scheme information.
 * @param settingsColors - The available color palettes.
 * @returns The list of colors to be used.
 *
 * @example
 * ```typescript
 * const trackerData = {
 *   colorScheme: {
 *     paletteName: 'warm',
 *     customColors: ['#FF5733', '#FFBD33']
 *   }
 * };
 * const settingsColors = {
 *   warm: ['#FF5733', '#FFBD33', '#FF8D1A'],
 *   default: ['#FFFFFF', '#000000']
 * };
 * 
 * const colors = getColors(trackerData, settingsColors);
 * console.log(colors); // Output: ['#FF5733', '#FFBD33', '#FF8D1A']
 * ```
 */
export function getColors(colorScheme: ColorScheme, settingsColors: Palettes): ColorsList {
  const { paletteName, customColors } = colorScheme ?? {};

  if (customColors) {
    return customColors ?? settingsColors['default'];
  }

  return paletteName ? settingsColors[paletteName] : settingsColors['default'];
}