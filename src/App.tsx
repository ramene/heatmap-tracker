import { View } from "./types";
import { useHeatmapContext } from "./context/heatmap/heatmap.context";
import React, { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { HeatmapHeader } from "./components/HeatmapHeader/HeatmapHeader";

import HeatmapFooter from "./components/HeatmapFooter/HeatmapFooter";

const HeatmapTrackerView = lazy(
  () => import("./views/HeatmapTrackerView/HeatmapTrackerView")
);
const StatisticsView = lazy(
  () => import("./views/StatisticsView/StatisticsView")
);
const DocumentationView = lazy(
  () => import("./views/DocumentationView/DocumentationView")
);

const SnowFall = lazy(() => import("./components/SnowFall/SnowFall"));

function ReactApp() {
  const { i18n } = useTranslation();
  const { currentYear, settings, view } = useHeatmapContext();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings]);

  let content;
  switch (view) {
    case View.HeatmapTracker:
      content = <HeatmapTrackerView />;
      break;
    case View.HeatmapTrackerStatistics:
      content = <StatisticsView />;
      break;
    case View.Documentation:
      content = <DocumentationView />;
      break;
    case View.HeatmapMenu:
      content = (
        <div>
          <div>Menu</div>
          <div>
            If you find this plugin useful, you can buy me a coffee! Your
            support helps keep this project alive. ☕💖
          </div>
          <div>
            <a href="https://www.buymeacoffee.com/mrubanau">
              <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=mrubanau&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
            </a>
          </div>
        </div>
      );
      break;
    default:
      content = null;
  }

  if (!currentYear) {
    return null;
  }

  return (
    <div className="heatmap-tracker__container">
      {settings.enableChristmasMood ? (
        <Suspense fallback={null}>
          <SnowFall />
        </Suspense>
      ) : null}

      <HeatmapHeader />
      <Suspense fallback={null}>{content}</Suspense>
      <HeatmapFooter />
    </div>
  );
}

export default React.memo(ReactApp);
