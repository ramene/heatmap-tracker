import { getWeekdayShort } from "./core";

export function initializeTrackerContainer(el: HTMLElement): HTMLElement {
  const elContent = el.querySelector('.heatmap-tracker-graph');
  if (elContent) {
    // Clear the parent element to prevent duplication
    elContent.innerHTML = '';
  }

  return elContent as HTMLDivElement ?? createDiv({
    cls: 'heatmap-tracker-graph',
    parent: el,
  });
}

export function renderTrackerHeader(parent: HTMLElement, year: number) {
  const headerDiv = createDiv({ cls: 'heatmap-tracker-header', parent });

  const leftArrow = createSpan({
    cls: 'heatmap-tracker-arrow left',
    text: '◀',
    parent: headerDiv,
    attr: {
      'aria-label': 'Previous Year',
      role: 'button',
      tabindex: '0',
    },
  });

  createSpan({
    cls: 'heatmap-tracker-year-display',
    text: String(year),
    parent: headerDiv,
  });

  const rightArrow = createSpan({
    cls: 'heatmap-tracker-arrow right',
    text: '▶',
    parent: headerDiv,
    attr: {
      'aria-label': 'Next Year',
      role: 'button',
      tabindex: '0',
    },
  });

  return { leftArrow, rightArrow };
}

export function renderMonthLabels(parent: HTMLElement) {
  const monthsUl = createEl('ul', { cls: 'heatmap-tracker-months', parent });

  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach(
    (month) => {
      createEl('li', { text: month, parent: monthsUl });
    }
  );

  return monthsUl;
}

export function renderDayLabels(parent: HTMLElement, weekStartDay: number) {
  const daysUl = createEl('ul', { cls: 'heatmap-tracker-days', parent });

  for (let i = 0; i < 7; i++) {
    createEl('li', {
      text: getWeekdayShort(i, weekStartDay),
      parent: daysUl,
    });
  }

  return daysUl;
}