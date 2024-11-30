import { PropsWithChildren, useEffect, useRef } from "react";

interface HeatmapBoxProps extends PropsWithChildren {
  classNames?: string[];
  backgroundColor?: string;
  date?: string;
  isToday: boolean;
}

export function HeatmapBox({
  children,
  classNames,
  backgroundColor,
  date,
  isToday,
}: HeatmapBoxProps) {
  return (
    <div
      data-date={date}
      style={{ backgroundColor }}
      className={`heatmap-tracker-box ${classNames?.join(" ")}`}
    >
      <span className="heatmap-tracker-content">{children}</span>
    </div>
  );
}
