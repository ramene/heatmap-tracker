import { ReactNode } from "react";
import { EnhancedBox, ClickAction } from "../../types/enhanced";

interface EnhancedHeatmapBoxProps {
  box: EnhancedBox;
  onClick?: (box: EnhancedBox, action: ClickAction) => void;
}

/**
 * Enhanced HeatmapBox component with multi-document support
 * and dashboard navigation capabilities
 */
export function EnhancedHeatmapBox({ box, onClick }: EnhancedHeatmapBoxProps) {
  const boxClassNames = [
    "heatmap-tracker-box",
    box.name,
    box.isToday ? "today" : "",
    box.showBorder ? "with-border" : "",
    box.hasData ? "hasData" : box.isSpaceBetweenBox ? "space-between-box" : "isEmpty",
  ];

  // Determine if this is a multi-document date
  const isMultiDocument = box.metadata && box.metadata.documentCount > 1;
  const isSingleDocument = box.metadata && box.metadata.documentCount === 1;
  
  // Add multi-document class if applicable
  if (isMultiDocument) {
    boxClassNames.push("multi-document");
  }

  // Generate appropriate aria-label
  const getAriaLabel = (): string => {
    if (isMultiDocument) {
      const { documentCount, channels } = box.metadata!;
      const channelList = channels.length > 0 ? channels.join(", ") : "various channels";
      return `${box.date}: ${documentCount} documents published to ${channelList}`;
    } else if (isSingleDocument) {
      const doc = box.metadata!.documents[0];
      return `${box.date}: ${doc.name}`;
    }
    return box.date || '';
  };

  // Handle click based on document count
  const handleClick = () => {
    if (!onClick) return;
    
    if (isMultiDocument) {
      // Multi-document: trigger dashboard creation
      onClick(box, 'dashboard');
    } else if (isSingleDocument) {
      // Single document: direct navigation
      onClick(box, 'navigate');
    } else {
      // Empty date: create daily note
      onClick(box, 'create');
    }
  };

  // Render document count badge for multi-document dates
  const renderContent = (): ReactNode => {
    if (isMultiDocument) {
      return (
        <>
          <span className="document-count-badge">
            {box.metadata!.documentCount}
          </span>
          {box.metadata!.channels.length > 0 && (
            <div className="channel-indicators">
              {box.metadata!.channels.slice(0, 3).map(channel => (
                <span 
                  key={channel} 
                  className={`channel-dot channel-${channel}`}
                  title={channel}
                />
              ))}
            </div>
          )}
        </>
      );
    }
    
    // For single documents or empty dates, render simple content
    if (box.content instanceof HTMLElement) {
      // Don't render the HTML links anymore - keep it clean
      return null;
    }
    
    return box.content as ReactNode;
  };

  return (
    <div
      data-htp-date={box.date}
      style={{ backgroundColor: box.backgroundColor }}
      className={boxClassNames.filter(Boolean).join(" ")}
      aria-label={getAriaLabel()}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <span className="heatmap-tracker-content">
        {renderContent()}
      </span>
    </div>
  );
}