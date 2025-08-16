```dataviewjs
const trackerData = {
      year: 2025,
      colorScheme: {
          customColors: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
      },
      entries: [],
      showCurrentDayBorder: true,
      heatmapTitle: "📚 Learning Tracker 📚"
  }

  for(let page of dv.pages('"BatchProcess"').where(p=>p.learning && p.publishDraftDate)){
      trackerData.entries.push({
          date: page.publishDraftDate,
          intensity: page.learning,
          content: await dv.span(`<a class="internal-link" data-href="${page.file.name}"></a>`)  // Empty link text
      })
  }

  renderHeatmapTracker(this.container, trackerData)
  ```


```dataviewjs
const trackerData = {
      year: 2025,
      heatmapTitle: "📚 Learning & Exercise Tracker 📚",
      heatmapSubtitle: "Combined learning time and exercise minutes",
      colorScheme: {
          customColors: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]
      },
      intensityConfig: {
          scaleStart: 0,
          scaleEnd: 300,           // Max combined minutes
          showOutOfRange: true
      },
      entries: [],
      insights: [
          {
              name: "Perfect days (>3hrs learning + >1hr exercise)",
              calculate: ({ yearEntries }) => {
                  return yearEntries.filter(entry =>
                      entry.value >= 240  // 4 hours total
                  ).length;
              }
          }
      ]
  }

  // In your loop:
  for(let page of dv.pages('"BatchProcess"').where(p=>p.learning && p.publishDraftDate)){
      const combinedMinutes = (page.learning || 0) + (page.exercise || 0);
      trackerData.entries.push({
          date: page.publishDraftDate,
          intensity: Math.ceil(combinedMinutes / 60), // Hours
          value: combinedMinutes,
          content: await dv.span(`<a class="internal-link" data-href="${page.file.name}"></a>`)
      })
  }
  renderHeatmapTracker(this.container, trackerData)
```
