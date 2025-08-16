# Fixed DataviewJS Code

```dataviewjs
const trackerData = {
    year: 2025,  // ADD THIS LINE - specify the year for your publishDraftDate
    colorScheme: {
        customColors: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "📚 Learning Tracker 📚"
}

for(let page of dv.pages('"BatchProcessing/Output"').where(p=>p.learning && p.publishDraftDate)){
    trackerData.entries.push({
        date: page.publishDraftDate,
        intensity: page.learning,
        content: await dv.span(`<a class="internal-link" data-href="${page.file.name}"></a>`)
    })  
}

renderHeatmapTracker(this.container, trackerData)
```

## Alternative: Auto-detect year from entries

```dataviewjs
const trackerData = {
    colorScheme: {
        customColors: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "📚 Learning Tracker 📚"
}

// First pass: collect entries and detect the year
const pagesWithData = dv.pages('"BatchProcessing/Output"').where(p=>p.learning && p.publishDraftDate);
let detectedYear = null;

for(let page of pagesWithData){
    const entryYear = new Date(page.publishDraftDate).getFullYear();
    if (!detectedYear) detectedYear = entryYear;
    
    trackerData.entries.push({
        date: page.publishDraftDate,
        intensity: page.learning,
        content: await dv.span(`<a class="internal-link" data-href="${page.file.name}"></a>`)
    })  
}

// Set the year to the detected year
if (detectedYear) {
    trackerData.year = detectedYear;
}

renderHeatmapTracker(this.container, trackerData)
```