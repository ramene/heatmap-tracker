import { PropsWithChildren } from "react";

interface HeatmapBoxProps extends PropsWithChildren {
  classNames?: string[];
  backgroundColor?: string;
  date?: string;
}

export function HeatmapBox({
  children,
  classNames,
  backgroundColor,
  date,
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
