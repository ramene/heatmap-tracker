```dataviewjs
// Function to extract and parse a markdown table from the current Obsidian file
async function getTableFromObsidianFile() {
    const filePath = dv.current().file.path; // Get the current file path
    const fileContent = await app.vault.adapter.read(filePath); // Read file content
    const tableRegex = /\|.+\|(\r?\n\|[-:|\s]+\|)+((\r?\n\|.+\|)+)/gm; // Match markdown tables

    const match = tableRegex.exec(fileContent); // Extract the table using regex
    if (!match) {
        console.log("No table found in the file."); // Log if no table is found
        return [];
    }

    return parseMarkdownTable(match[0]); // Parse the matched table
}

// Function to parse a markdown table into structured data
function parseMarkdownTable(markdownTable) {
    const lines = markdownTable.trim().split("\n"); // Split table into lines
    return lines.slice(2).map(row => row.split("|").map(v => v.trim())); // Skip header and parse rows
}

// Water intake levels
const MIN_WATER = 0.5; // Minimum liters (very low)
const MAX_WATER = 3.5; // Maximum liters (excellent hydration)
const DEFAULT_WATER = MIN_WATER; // Default liters if missing

// Parse the water table from the file
const waterData = await getTableFromObsidianFile();

// Prepare entries for the heatmap
const entries = waterData.map(row => {
    const date = row[1]; // Extract date
    const liters = parseFloat(row[2]) || DEFAULT_WATER; // Extract water intake
    return { date, intensity: liters };
});

// Heatmap configuration
const trackerData = {
    year: 2024,
    entries, // Heatmap data entries
    intensityScaleStart: MIN_WATER, // Scale minimum
    intensityScaleEnd: MAX_WATER, // Scale maximum
    colorScheme: {
        customColors: [
            "rgb(0, 153, 255)",   // 1: Light blue (very low)
            "rgb(0, 128, 255)",   // 2: Sky blue
            "rgb(0, 102, 204)",   // 3: Blue
            "rgb(0, 76, 153)",    // 4: Dark blue
            "rgb(0, 51, 102)"     // 5: Very dark blue (excellent hydration)
        ]
    },
    heatmapTitle: "💧 Water Intake Tracker 💧", // Heatmap title
    heatmapSubtitle: "Track your daily water intake (0.5L = very low, 3.5L = excellent).", // Subtitle
};

// Render the heatmap in the container
renderHeatmapTracker(this.container, trackerData);
```

| Date       | Liters Drank | Notes                     |
| ---------- | ------------ | ------------------------- |
| 2024-01-01 | 2.5          | Normal day                |
| 2024-01-02 | 1.0          | Too little                |
| 2024-01-03 | 3.0          | Stayed hydrated           |
| 2024-01-04 | 1.5          | Slightly below recommended|
| 2024-01-05 | 2.0          | Average                   |
| 2024-01-06 | 3.5          | Excellent hydration       |
| 2024-01-07 | 2.0          | Normal day                |
| 2024-01-08 | 0.5          | Very low                  |
| 2024-01-09 | 2.5          | Normal day                |
| 2024-01-10 | 1.0          | Not enough                |
| 2024-01-11 | 3.0          | Good hydration            |
| 2024-01-12 | 2.0          | Average                   |
| 2024-01-13 | 2.5          | Normal day                |
| 2024-01-14 | 0.5          | Very low                  |
| 2024-01-15 | 3.5          | Excellent hydration       |
| 2024-01-16 | 2.0          | Average                   |
| 2024-01-17 | 1.5          | Slightly below recommended|
| 2024-01-18 | 2.5          | Normal day                |
| 2024-01-19 | 3.0          | Good hydration            |
| 2024-01-20 | 1.0          | Too little                |