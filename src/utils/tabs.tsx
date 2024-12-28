import { HeatmapIcon } from "../components/icons/HeatmapIcon";
import { StatisticsIcon } from "../components/icons/StatisticsIcon";
// import { MenuIcon } from "../components/icons/MenuIcon";
import { DocumentationIcon } from "../components/icons/DocumentationIcon";
import { ReactNode } from "react";
import { HandCoinsIcon } from "../components/icons/HandCoinsIcon";
import { IHeatmapView } from "src/types";

export const TabIconForView: Record<IHeatmapView, ReactNode> = {
  [IHeatmapView.HeatmapTracker]: <HeatmapIcon />,
  [IHeatmapView.HeatmapTrackerStatistics]: <StatisticsIcon />,
  // [IHeatmapView.HeatmapMenu]: <MenuIcon />,
  [IHeatmapView.Documentation]: <DocumentationIcon />,
  [IHeatmapView.Donation]: <HandCoinsIcon />,
};
