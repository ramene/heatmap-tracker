import { DEFAULT_TRACKER_DATA } from 'src/main';
import { clamp, mapRange, mergeTrackerData, } from '../core';

describe('clamp', () => {
  test('Input Within Range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('Input Less Than Minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('Input Greater Than Maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('Input Equals Minimum', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  test('Input Equals Maximum', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe('mapRange', () => {
  test('Map Value Within Input Range', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });

  test('Map Value Below Input Range (Clamped to Output Minimum)', () => {
    expect(mapRange(-5, 0, 10, 0, 100)).toBe(0);
  });

  test('Map Value Above Input Range (Clamped to Output Maximum)', () => {
    expect(mapRange(15, 0, 10, 0, 100)).toBe(100);
  });

  test('Zero Input Range (Division by Zero Handling)', () => {
    expect(mapRange(5, 5, 5, 0, 100)).toBeNaN();
  });

  test('Reverse Input Range (inMin Greater Than inMax)', () => {
    expect(mapRange(5, 10, 0, 0, 100)).toBe(50);
  });
});

describe('mergeTrackerData', () => {
  it('should return default config when no user config is provided', () => {
    const result = mergeTrackerData(DEFAULT_TRACKER_DATA, null as any);

    expect(result).toEqual(DEFAULT_TRACKER_DATA);
  });

  it('should return correct config', () => {
    const userConfig = {
      year: 2021,
      entries: [
        { date: '2021-01-01', color: '#7bc96f', intensity: 5, content: '' },
      ],
      showCurrentDayBorder: false,
      intensityScaleStart: 2,
      intensityScaleEnd: 8,
      defaultEntryIntensity: 2,
      colorScheme: {
        paletteName: 'danger',
        customColors: ['#fff33b', '#fdc70c', '#f3903f', '#ed683c', '#e93e3a'],
      },
    };

    const expected = {
      ...userConfig,
      intensityConfig: {
        defaultIntensity: 2,
        scaleEnd: 8,
        scaleStart: 2,
      },
    };

    const result = mergeTrackerData(DEFAULT_TRACKER_DATA, userConfig as any);

    expect(result).toEqual(expected);
  });

  it('should return intensityConfig', () => {
    const userConfig = {
      year: 2021,
      entries: [
        { date: '2021-01-01', color: '#7bc96f', intensity: 5, content: '' },
      ],
      showCurrentDayBorder: false,
      intensityScaleStart: 2,
      intensityScaleEnd: 8,
      defaultEntryIntensity: 2,
      colorScheme: {
        paletteName: 'danger',
        customColors: ['#fff33b', '#fdc70c', '#f3903f', '#ed683c', '#e93e3a'],
      },
    };

    const result = mergeTrackerData(DEFAULT_TRACKER_DATA, userConfig as any);

    expect(result).toEqual(expect.objectContaining({
      intensityConfig: {
        defaultIntensity: 2,
        scaleEnd: 8,
        scaleStart: 2,
      }
    }));
  });

  it('should return deprecated intensity parameters', () => {
    const userConfig = {
      year: 2021,
      entries: [
        { date: '2021-01-01', color: '#7bc96f', intensity: 5, content: '' },
      ],
      showCurrentDayBorder: false,
      intensityScaleStart: 2,
      intensityScaleEnd: 8,
      defaultEntryIntensity: 2,
      colorScheme: {
        paletteName: 'danger',
        customColors: ['#fff33b', '#fdc70c', '#f3903f', '#ed683c', '#e93e3a'],
      },
    };

    const result = mergeTrackerData(DEFAULT_TRACKER_DATA, userConfig as any);

    expect(result.defaultEntryIntensity).toBeDefined();
    expect(result.intensityScaleStart).toBeDefined();
    expect(result.intensityScaleEnd).toBeDefined();
  });

  describe('colorScheme', () => {
    it(
      'should return default colorScheme if user did not provide one'
      , () => {
        const userConfig = {
          year: 2021,
          entries: [
            { date: '2021-01-01', color: '#7bc96f', intensity: 5, content: '' },
          ],
          showCurrentDayBorder: false,
          intensityScaleStart: 2,
          intensityScaleEnd: 8,
          defaultEntryIntensity: 2,
        };

        const result = mergeTrackerData(DEFAULT_TRACKER_DATA, userConfig as any);

        expect(result.colorScheme).toEqual(DEFAULT_TRACKER_DATA.colorScheme);
        expect(result.colorScheme.paletteName).toEqual('default');
        expect(result.colorScheme.customColors).toBeUndefined();
      });

    it(
      'should return default colorScheme when user set it to null'
      , () => {
        const userConfig = {
          year: 2021,
          entries: [
            { date: '2021-01-01', color: '#7bc96f', intensity: 5, content: '' },
          ],
          showCurrentDayBorder: false,
          intensityScaleStart: 2,
          intensityScaleEnd: 8,
          defaultEntryIntensity: 2,
          colorScheme: null,
        };

        const result = mergeTrackerData(DEFAULT_TRACKER_DATA, userConfig as any);

        expect(result.colorScheme).toEqual(DEFAULT_TRACKER_DATA.colorScheme);
        expect(result.colorScheme.paletteName).toEqual('default');
        expect(result.colorScheme.customColors).toBeUndefined();
      });
  });
});