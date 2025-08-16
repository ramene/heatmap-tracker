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

  const content =
    box.content instanceof HTMLElement ? (
      <span dangerouslySetInnerHTML={{ __html: box.content.outerHTML }} />
    ) : (
      (box.content as ReactNode)
    );

  // Check if box has custom link content
  const linkInfo = box.content instanceof HTMLElement ? extractLinkInfo(box.content) : null;
  const hasCustomLink = !!linkInfo;
  
  // If there's a custom link, make the entire cell behave as an Obsidian internal link
  if (hasCustomLink && linkInfo) {
    // Add internal-link class for Obsidian's native link handling
    boxClassNames.push("internal-link");
    
    return (
      <div
        data-htp-date={box.date}
        data-href={linkInfo.href || ''}
        style={{ backgroundColor: box.backgroundColor }}
        className={`${boxClassNames.filter(Boolean).join(" ")}`}
        aria-label={linkInfo.linkText || linkInfo.href}
        // No onClick handler - let Obsidian handle the link natively
      >
        <span className="heatmap-tracker-content">
          {content}
        </span>
      </div>
    );
  }

  // For boxes without custom links, use the original daily note behavior
  return (
    <div
      data-htp-date={box.date}
      style={{ backgroundColor: box.backgroundColor }}
      className={`${boxClassNames.filter(Boolean).join(" ")}`}
      aria-label={box.date}
      onClick={onClick ? () => onClick(box) : undefined}
    >
      <span className="heatmap-tracker-content">{content}</span>
    </div>
  );
}
