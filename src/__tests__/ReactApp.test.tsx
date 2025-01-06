import { HeatmapProvider } from "../context/heatmap/heatmap.context";
import ReactApp from "../App";
import { act, render, waitFor } from "@testing-library/react";
import trackerDataMock from "./trackerData.mock.json";
import settingsMock from "./settings.mock.json";
import { mergeTrackerData } from "src/utils/core";
import { DEFAULT_TRACKER_DATA } from "../main";

jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  })),
}));

describe("ReactApp component", () => {
  it("renders correctly and matches snapshot", async () => {
    const { asFragment } = await render(
      <HeatmapProvider
        trackerData={mergeTrackerData(
          DEFAULT_TRACKER_DATA,
          trackerDataMock as any
        )}
        settings={settingsMock as any}
      >
        <ReactApp />
      </HeatmapProvider>
    );

    // Wait for all promises inside Suspense to resolve
    await act(async () => {
      // Simulate any asynchronous behavior like data fetching
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
