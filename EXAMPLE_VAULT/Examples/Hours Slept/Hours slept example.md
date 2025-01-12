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

// Parse the sleep table from the file
const sleepData = await getTableFromObsidianFile();

// Prepare entries for the heatmap
const entries = sleepData.map(row => {
    const date = row[1]; // Extract date
    const hoursSlept = parseInt(row[2], 10) || 3;
    return { date, intensity: hoursSlept };
});

// Heatmap configuration
const trackerData = {
    year: 2024,
    entries, // Heatmap data entries
    intensityScaleStart: 3, // Scale minimum
    intensityScaleEnd: 10, // Scale maximum
    colorScheme: {
        paletteName: "danger"
    },
    heatmapTitle: "🌙 Hours slept Tracker ('danger' palette) 🌙", // Heatmap title
    heatmapSubtitle: "Track hours slept.", // Subtitle
};

// Render the heatmap in the container
renderHeatmapTracker(this.container, trackerData);
```

| Date       | Hours Slept | Sleep Quality (1-10) | Notes                   |
| ---------- | ----------- | -------------------- | ----------------------- |
| 2024-01-01 | 6.5         | 7                    | Slept late, felt rested |
| 2024-01-02 | 5.0         | 4                    | Insomnia                |
| 2024-01-03 | 8.0         | 9                    | Very good sleep         |
| 2024-01-04 | 7.0         | 6                    | Slightly restless       |
| 2024-01-05 | 6.0         | 5                    | Interrupted sleep       |
| 2024-01-06 | 7.5         | 8                    | Relaxing day            |
| 2024-01-07 | 6.5         | 7                    | Normal sleep            |
| 2024-01-08 | 5.0         | 3                    | Bad dreams              |
| 2024-01-09 | 8.0         | 9                    | Excellent recovery      |
| 2024-01-10 | 6.0         | 5                    | Interrupted by noise    |
| 2024-01-11 | 6.5         | 6                    | Light sleep             |
| 2024-01-12 | 7.5         | 8                    | Refreshing              |
| 2024-01-13 | 6.0         | 4                    | Woke up tired           |
| 2024-01-14 | 3.5         | 1                    | Went to bed late        |
| 2024-01-15 | 7.0         | 7                    | Good sleep              |
| 2024-01-16 | 8.0         | 10                   | Best sleep in weeks     |
| 2024-01-17 | 6.0         | 5                    | Restless                |
| 2024-01-18 | 7.0         | 7                    | Peaceful                |
| 2024-01-19 | 6.0         | 6                    | Normal                  |
| 2024-01-20 | 5.0         | 3                    | Too short               |
