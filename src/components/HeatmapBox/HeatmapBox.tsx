import { PropsWithChildren } from "react";
import { Box } from "src/types";

interface HeatmapBoxProps extends PropsWithChildren {
  box: Box;
}

export function HeatmapBox({ children, box }: HeatmapBoxProps) {
  const boxClassNames = [
    "heatmap-tracker-box",
    box.name,
    box.isToday ? "today" : "",
    box.showBorder ? "with-border" : "",
    box.hasData
      ? "hasData"
      : box.isSpaceBetweenBox
      ? "space-between-box"
      : "isEmpty",
  ];

  return (
    <div
      data-date={box.date}
      style={{ backgroundColor: box.backgroundColor }}
      className={`${boxClassNames.filter(Boolean).join(" ")}`}
    >
      <span className="heatmap-tracker-content">{children}</span>
    </div>
  );
}
