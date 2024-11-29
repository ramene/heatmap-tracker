import { Box } from "src/types";
import { HeatmapBox } from "../HeatmapBox/HeatmapBox";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { ReactNode } from "react";

export function HeatmapBoxesList({ boxes }: { boxes: Box[] }) {
  const { mergedTrackerData } = useHeatmapContext();
  return (
    <div
      className={`heatmap-tracker-boxes ${
        mergedTrackerData.separateMonths ? "separate-months" : ""
      }`}
    >
      {boxes.map((box, index) => {
        const content =
          box.content instanceof HTMLElement
            ? <span dangerouslySetInnerHTML={{ __html: box.content.outerHTML }} />
            : (box.content as ReactNode);

        return (
          <HeatmapBox
            key={index}
            date={box.date}
            backgroundColor={box.backgroundColor}
            classNames={box.classNames}
          >
            {content}
          </HeatmapBox>
        );
      })}
    </div>
  );
}
