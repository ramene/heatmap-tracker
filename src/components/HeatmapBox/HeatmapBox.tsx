import { ReactNode } from "react";
import { Box } from "src/types";

interface HeatmapBoxProps {
  box: Box;
  onClick?: (box: Box) => void;
}

// Helper function to extract link information from HTML content
function extractLinkInfo(htmlElement: HTMLElement): { href?: string; linkText?: string } | null {
  // Look for various types of links that dataview might create
  const linkElement = htmlElement.querySelector('a[data-href]') || 
                     htmlElement.querySelector('a[href]') ||
                     htmlElement.querySelector('.internal-link');
  
  if (linkElement) {
    const href = linkElement.getAttribute('data-href') || 
                linkElement.getAttribute('href') ||
                linkElement.textContent?.trim();
    const linkText = linkElement.textContent || '';
    return { href, linkText };
  }
  
  // Check if the element itself has link-like content (for dataview spans)
  const textContent = htmlElement.textContent?.trim();
  if (textContent && (htmlElement.innerHTML.includes('[[') || htmlElement.innerHTML.includes('data-href'))) {
    return { href: textContent, linkText: textContent };
  }
  
  return null;
}

export function HeatmapBox({ box, onClick }: HeatmapBoxProps) {

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

  // Check for multi-document metadata
  const isMultiDocument = box.metadata && box.metadata.documentCount && box.metadata.documentCount > 1;
  const isSingleDocument = box.metadata && box.metadata.documentCount === 1;

  // Generate proper content for different scenarios
  const content = (() => {
    if (isMultiDocument) {
      // Multi-document: show count number with dashboard preview link
      const dashboardPath = `Dashboards/Publishing/${box.date}`;
      const dashboardLinkHtml = `<a class="internal-link multi-doc-dashboard-link" data-href="${dashboardPath}"></a>`;
      return (
        <>
          <span dangerouslySetInnerHTML={{ __html: dashboardLinkHtml }} />
          <span className="document-count-number">
            {box.metadata!.documentCount}
          </span>
        </>
      );
    } else if (isSingleDocument) {
      // Single document: invisible link covering entire cell (blank pixel)
      const doc = box.metadata!.documents![0];
      const linkHtml = `<a class="internal-link heatmap-cell-link" data-href="${doc.name}">&nbsp;</a>`;
      return <span dangerouslySetInnerHTML={{ __html: linkHtml }} />;
    } else if (box.content instanceof HTMLElement) {
      // Legacy: render existing HTML content
      return <span dangerouslySetInnerHTML={{ __html: box.content.outerHTML }} />;
    } else {
      // Fallback: render as ReactNode
      return (box.content as ReactNode);
    }
  })();

  // Calculate weighted channel coverage percentage
  const calculateChannelCoverage = (channels: string[]): number => {
    const totalPossibleChannels = 6; // twitter, instagram, tiktok, facebook, linkedin, substack
    return Math.round((channels.length / totalPossibleChannels) * 100);
  };

  // Enhanced tooltip content with channel info
  const getTooltipContent = (): string => {
    if (isMultiDocument) {
      const { documentCount, channels } = box.metadata!;
      const coverage = calculateChannelCoverage(channels || []);
      const channelList = channels && channels.length > 0 ? ` (${channels.join(', ')})` : '';
      return `${documentCount} posts, ${coverage}% coverage${channelList}`;
    } else if (isSingleDocument) {
      const doc = box.metadata!.documents![0];
      const channels = doc.channels && doc.channels.length > 0 ? ` (${doc.channels.join(', ')})` : '';
      return `${doc.name}${channels}` || box.date || '';
    }
    return box.date || '';
  };

  // Check if box has custom link content (for single documents without metadata)
  const linkInfo = !isMultiDocument && !isSingleDocument && box.content instanceof HTMLElement ? 
    extractLinkInfo(box.content) : null;
  const hasCustomLink = !!linkInfo;
  
  // Add multi-document class if applicable
  if (isMultiDocument) {
    boxClassNames.push("multi-document");
  }

  // Enhanced click handler - only for multi-document and empty dates
  const handleClick = (e: React.MouseEvent) => {
    if (isMultiDocument && onClick) {
      // Multi-document: trigger dashboard creation
      e.preventDefault();
      onClick(box);
    } else if (hasCustomLink && linkInfo) {
      // Legacy single link: let Obsidian handle natively
      return;
    } else if (onClick) {
      // Empty date: create daily note
      e.preventDefault();
      onClick(box);
    }
    // Note: Single documents with metadata are handled by native links - no React handling
  };

  // Add internal-link class for legacy link handling
  if (hasCustomLink && linkInfo && !isMultiDocument && !isSingleDocument) {
    boxClassNames.push("internal-link");
  }

  // Determine if this should have React click handlers  
  // Single docs and legacy links use native link behavior only
  const shouldHaveClickHandler = !isSingleDocument && !hasCustomLink;
  
  // Build div props conditionally
  const divProps: any = {
    "data-htp-date": box.date,
    style: { backgroundColor: box.backgroundColor },
    className: boxClassNames.filter(Boolean).join(" "),
    title: getTooltipContent(),
    "aria-label": getTooltipContent(),
  };

  // Add data-href for legacy links
  if (hasCustomLink && linkInfo) {
    divProps["data-href"] = linkInfo.href || '';
  }

  // Add React handlers only when needed (NOT for single documents)
  if (shouldHaveClickHandler) {
    divProps.onClick = handleClick;
    divProps.role = "button";
    divProps.tabIndex = 0;
    divProps.onKeyDown = (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    };
  }

  return (
    <div {...divProps}>
      <span className="heatmap-tracker-content">{content}</span>
    </div>
  );
}
