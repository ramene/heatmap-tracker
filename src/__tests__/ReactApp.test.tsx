import {
  HeatmapProvider,
} from "../context/heatmap/heatmap.context";
import { ReactApp } from "../App";
import { render } from "@testing-library/react";
import trackerDataMock from "./trackerData.mock.json";
import settingsMock from "./settings.mock.json";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  })),
}));

describe("ReactApp component", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <HeatmapProvider
        trackerData={trackerDataMock as any}
        settings={settingsMock as any}
      >
        <ReactApp />
      </HeatmapProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
