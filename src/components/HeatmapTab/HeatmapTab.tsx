import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { IHeatmapView } from "src/types";
import { memo } from "react";
import { TabIconForView } from "src/utils/tabs";

interface HeatmapTabProps {
  view: IHeatmapView;
  label: string;
  disabled?: boolean;
}

function HeatmapTab({ view, label, disabled }: HeatmapTabProps) {
  const { view: selectedView, setView, settings } = useHeatmapContext();

  const isSelected = view === selectedView;

  function handleClick() {
    setView(view);
  }

  if (!settings.viewTabsVisibility[view]) {
    return null;
  }

  return (
    <button
      aria-label={label}
      className={`heatmap-tracker-tab clickable-icon ${
        isSelected ? "is-active" : ""
      }`}
      disabled={disabled}
      onClick={handleClick}
    >
      {TabIconForView[view]}
    </button>
  );
}

export default memo(HeatmapTab);
