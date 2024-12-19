import { Box } from "src/types";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { FixedSizeGrid } from "react-window";

import HeatmapBox from "../HeatmapBox/HeatmapBox";

const BOX_WIDTH = 15;
const BOX_HEIGHT = 15;
const NUMBER_OF_DAYS_IN_A_WEEK = 7;

export function HeatmapBoxesList({ boxes }: { boxes: Box[] }) {
  const { trackerData } = useHeatmapContext();

  const NUMBER_OF_WEEKS = trackerData.separateMonths ? 64 : 53;

  return (
    <FixedSizeGrid
      className="heatmap-tracker-boxes"
      columnWidth={BOX_WIDTH}
      rowHeight={BOX_HEIGHT}
      rowCount={NUMBER_OF_DAYS_IN_A_WEEK}
      columnCount={NUMBER_OF_WEEKS}
      width={BOX_WIDTH * NUMBER_OF_WEEKS + 2}
      height={NUMBER_OF_DAYS_IN_A_WEEK * BOX_HEIGHT + 2}
      itemData={boxes}
      overscanColumnCount={0}
      overscanRowCount={0}
    >
      {HeatmapBox}
    </FixedSizeGrid>
  );
}
