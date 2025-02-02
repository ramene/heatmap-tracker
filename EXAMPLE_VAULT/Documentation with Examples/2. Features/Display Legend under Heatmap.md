
Request:
https://github.com/mokkiebear/heatmap-tracker/issues/21
https://github.com/Richardsl/heatmap-calendar-obsidian/discussions/103

```dataviewjs

const trackerData = {
    heatmapTitle: "Another way to display Legend",
    intensityScaleStart: 0,
    intensityScaleEnd: 10,
    separateMonths: true,
    colorScheme: {
        customColors: [
      "rgb(246, 250, 199)",
      "rgb(228, 242, 156)",
      "rgb(198, 228, 139)",
      "rgb(161, 213, 123)",
      "rgb(123, 200, 111)",
      "rgb(95, 191, 103)",
      "rgb(74, 176, 94)",
      "rgb(60, 159, 80)",
      "rgb(47, 137, 65)",
      "rgb(34, 114, 50)",
      "rgb(25, 97, 40)"
    ],
    },
    entries: [
        {
      "date": "2025-04-04T00:00:00+01:00",
      "intensity": '0'
    },
    {
      "date": "2025-04-15",
      "intensity": '5'
    },
    {
      "date": "2025-04-16",
      "intensity": 8
    },
    {
      "date": "2025-04-17",
      "intensity": 10
    },
    ]
}

const heatmapTrackerEl = renderHeatmapTracker(this.container, trackerData)

// Adding container for legends and colored boxes on the same line
const legendsContainer = document.createElement('div');
legendsContainer.style.display = 'flex';
legendsContainer.style.alignItems = 'center'; // Align vertically

// Adding first legend with reduced size and custom font
const firstLegend = document.createElement('div');
firstLegend.innerText = 'LESS'; // Updated to "LESS" with all caps
firstLegend.style.fontSize = '65%'; // Reduce font size by 50%
firstLegend.style.fontFamily = 'IBM plex mono, sans-serif'; // Set custom font
firstLegend.style.textTransform = 'uppercase'; // Convert text to uppercase
firstLegend.style.marginRight = '5px'; // Add margin to separate from the boxes
legendsContainer.appendChild(firstLegend);

// Adding colored boxes with adjusted size
const legendContainer = document.createElement('div');
legendContainer.style.display = 'flex';
legendContainer.style.alignItems = 'center'; // Align vertically

for (let color of trackerData.colorScheme.customColors) {
    const colorBox = document.createElement('div');
    colorBox.style.width = '9px'; // Reduced box width by 50%
    colorBox.style.height = '9px'; // Reduced box height by 50%
    colorBox.style.backgroundColor = color;
    colorBox.style.marginRight = '5px'; // Adjusted margin
    legendContainer.appendChild(colorBox);
}

// Adding second legend after the colored boxes with reduced size and custom font
const secondLegend = document.createElement('div');
secondLegend.innerText = 'MORE'; // Updated to "MORE" with all caps
secondLegend.style.fontSize = '65%'; // Reduce font size by 50%
secondLegend.style.fontFamily = 'IBM plex mono, sans-serif'; // Set custom font
secondLegend.style.textTransform = 'uppercase'; // Convert text to uppercase
legendContainer.appendChild(secondLegend);

legendsContainer.appendChild(legendContainer);
legendsContainer.style.marginBottom = "12px";

heatmapTrackerEl.appendChild(legendsContainer);

```
