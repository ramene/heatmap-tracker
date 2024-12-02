// ReactView.test.tsx
import React from "react";
import { useHeatmapContext } from "../context/heatmap/heatmap.context";
import { ReactView } from "../ReactView";
import { render } from "@testing-library/react";
import { View } from "src/types";

jest.mock("../context/heatmap/heatmap.context", () => ({
  useHeatmapContext: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  })),
}));

describe("ReactView component", () => {
  it("renders correctly and matches snapshot", () => {
    (useHeatmapContext as jest.Mock).mockReturnValue({
      currentYear: 2024,
      currentYearEntries: [
        { date: "2024-01-01", intensity: 5 },
        { date: "2024-01-02", intensity: 7 },
      ],
      trackerData: {
        showCurrentDayBorder: true,
        separateMonths: true,
        intensityScaleStart: 0,
        intensityScaleEnd: 10,
      },
      settings: {
        language: "en",
        weekStartDay: 0,
        colors: {
          green: ["#e0ffe0", "#aaffaa", "#55ff55", "#00ff00"],
        },
      },
      mergedTrackerData: {
        intensityScaleStart: 0,
        intensityScaleEnd: 10,
        separateMonths: true,
      },
      view: View.HeatmapTracker,
      setView: jest.fn(),
    });

    const { asFragment } = render(<ReactView />);
    expect(asFragment()).toMatchSnapshot();
  });
});