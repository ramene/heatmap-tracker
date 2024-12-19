import React from "react";
import { ReactNode } from "react";

interface HeatmapBoxProps {
  columnIndex: number;
  rowIndex: number;
  style: any;
  data: any;
}

const GUTTER_SIZE = 2;

function HeatmapBox({ columnIndex, rowIndex, style, data }: HeatmapBoxProps) {
  const index = columnIndex * 7 + rowIndex;
  const box = data[index] ?? {
    backgroundColor: "transparent",
    isSpaceBetweenBox: true,
  };

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

  const content =
    box.content instanceof HTMLElement ? (
      <span dangerouslySetInnerHTML={{ __html: box.content.outerHTML }} />
    ) : (
      (box.content as ReactNode)
    );

  return (
    <div
      data-date={box.date}
      data-index={index}
      style={{
        ...style,
        backgroundColor: box.backgroundColor,
        left: style.left + GUTTER_SIZE,
        top: style.top + GUTTER_SIZE,
        width: style.width - GUTTER_SIZE,
        height: style.height - GUTTER_SIZE,
      }}
      className={`${boxClassNames.filter(Boolean).join(" ")}`}
      // On Desktop it will show the date on hover.
      aria-label={box.date}
    >
      <span className="heatmap-tracker-content">{content}</span>
    </div>
  );
}

export default HeatmapBox;
