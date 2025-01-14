
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

// Meditation time levels
const MIN_TIME = 0; // Minimum time (0 minutes)
const MAX_TIME = 30; // Maximum time (30 minutes)
const DEFAULT_TIME = MIN_TIME; // Default time if missing

// Parse the meditation table from the file
const meditationData = await getTableFromObsidianFile();

// Prepare entries for the heatmap
const entries = meditationData.map(row => {
    const date = row[1]; // Extract date
    const minutes = parseInt(row[2], 10) || DEFAULT_TIME; // Extract meditation time
    return { date, intensity: minutes };
});

// Heatmap configuration
const trackerData = {
    year: 2024,
    entries, // Heatmap data entries
    intensityScaleStart: MIN_TIME, // Scale minimum
    intensityScaleEnd: MAX_TIME, // Scale maximum
    colorScheme: {
        customColors: [
            "rgb(198, 255, 198)",   // 1: Very light green (minimal meditation)
            "rgb(144, 238, 144)",   // 2: Light green
            "rgb(60, 179, 113)",    // 3: Medium green
            "rgb(34, 139, 34)",     // 4: Dark green
            "rgb(0, 100, 0)"        // 5: Very dark green (maximum meditation)
        ]
    },
    heatmapTitle: "🧘 Meditation Tracker 🧘", // Heatmap title
    heatmapSubtitle: "Track your daily meditation time (0 = none, 30+ = excellent).", // Subtitle
};

// Render the heatmap in the container
renderHeatmapTracker(this.container, trackerData);
```

| Date       | Minutes Meditated | Notes                        |
| ---------- | ----------------- | ---------------------------- |
| 2024-01-01 | 5                 | Quick breathing exercise     |
| 2024-01-02 | 10                | Morning mindfulness          |
| 2024-01-03 | 20                | Full meditation session      |
| 2024-01-04 | 15                | Focus on relaxation          |
| 2024-01-05 | 0                 | Skipped meditation           |
| 2024-01-06 | 25                | Great focus                  |
| 2024-01-07 | 30                | Deep meditation              |
| 2024-01-08 | 10                | Mindfulness during lunch     |
| 2024-01-09 | 20                | Balanced session             |
| 2024-01-10 | 5                 | Evening relaxation           |
| 2024-01-11 | 15                | Calm and peaceful            |
| 2024-01-12 | 0                 | Too busy                     |
| 2024-01-13 | 20                | Deep breathing focus         |
| 2024-01-14 | 30                | Very relaxing session        |
| 2024-01-15 | 25                | Clear mind                   |
| 2024-01-16 | 5                 | Quick start to the day       |
| 2024-01-17 | 10                | Focused breathing            |
| 2024-01-18 | 0                 | Skipped session              |
| 2024-01-19 | 15                | Evening mindfulness          |
| 2024-01-20 | 20                | Calm and focused             |