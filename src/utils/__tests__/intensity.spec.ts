import { getIntensitiesRanges } from "../intensity";


describe('getIntensitiesRanges', () => {
  test('5 - 1 - 10', () => {
    const result = getIntensitiesRanges(5, 1, 10);

    expect(result).toEqual([
      { min: 1, max: 2.8, intensity: 1 },
      { min: 2.8, max: 4.6, intensity: 2 },
      { min: 4.6, max: 6.4, intensity: 3 },
      { min: 6.4, max: 8.2, intensity: 4 },
      { min: 8.2, max: 10, intensity: 5 }
    ]);
  });

  test('11 - 1 - 10000', () => {
    const result = getIntensitiesRanges(11, 1, 10000);

    expect(result).toEqual([
      { min: 1, max: 910, intensity: 1 },
      { min: 910, max: 1819, intensity: 2 },
      { min: 1819, max: 2728, intensity: 3 },
      { min: 2728, max: 3637, intensity: 4 },
      { min: 3637, max: 4546, intensity: 5 },
      { min: 4546, max: 5455, intensity: 6 },
      { min: 5455, max: 6364, intensity: 7 },
      { min: 6364, max: 7273, intensity: 8 },
      { min: 7273, max: 8182, intensity: 9 },
      { min: 8182, max: 9091, intensity: 10 },
      { min: 9091, max: 10000, intensity: 11 }
    ]);
  });

  test('5 - 5 - 5', () => {
    const result = getIntensitiesRanges(5, 5, 5);

    expect(result).toEqual([
      { min: 5, max: 5, intensity: 1 },
      { min: 5, max: 5, intensity: 2 },
      { min: 5, max: 5, intensity: 3 },
      { min: 5, max: 5, intensity: 4 },
      { min: 5, max: 5, intensity: 5 }
    ]);
  });

  test('6 - -10 - 10', () => {
    const result = getIntensitiesRanges(6, -10, 10);

    console.log(result);
    expect(result).toEqual( [
      { min: -10, max: -6.666666666666666, intensity: 1 },
      { min: -6.666666666666666, max: -3.333333333333333, intensity: 2 },
      { min: -3.333333333333333, max: 0, intensity: 3 },
      { min: 0, max: 3.333333333333334, intensity: 4 },
      { min: 3.333333333333334, max: 6.666666666666668, intensity: 5 },
      { min: 6.666666666666668, max: 10, intensity: 6 }
    ]);
  });
});