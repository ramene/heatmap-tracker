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



```dataviewjs
const trackerData = {
      year: 2025,
      colorScheme: {
          // Green gradient for publishing intensity
          customColors: ["#e8f5e9","#a5d6a7","#66bb6a","#43a047","#2e7d32","#1b5e20"]
      },
      entries: [],
      showCurrentDayBorder: true,
      heatmapTitle: "📱 Multi-Channel Publishing Tracker"
  }

  // Configuration for channel weights
  const CHANNEL_WEIGHTS = {
      twitter: 1,
      instagram: 1,
      tiktok: 1,
      facebook: 0.8,
      linkedin: 1.2,
      substack: 1.5  // Blog posts weighted higher
  };

  // Group pages by publishDraftDate
  const pagesByDate = {};
  for(let page of dv.pages().where(p => p.publishDraftDate)) {
      const date = page.publishDraftDate;
      if (!pagesByDate[date]) pagesByDate[date] = [];
      pagesByDate[date].push(page);
  }

  // Calculate intensity for each date
  for(let date in pagesByDate) {
      const pages = pagesByDate[date];
      const documentCount = pages.length;

      // Track unique channels across all documents on this date
      const channelsUsed = new Set();

      for(let page of pages) {
          // Check each social channel
          if (page.twitter) channelsUsed.add('twitter');
          if (page.instagram) channelsUsed.add('instagram');
          if (page.tiktok) channelsUsed.add('tiktok');
          if (page.facebook) channelsUsed.add('facebook');
          if (page.linkedin) channelsUsed.add('linkedin');
          if (page.substack) channelsUsed.add('substack');
      }

      // Calculate intensity based on:
      // 1. Number of documents (base intensity)
      // 2. Number of unique channels (multiplier effect)
      const baseIntensity = documentCount;
      const channelMultiplier = 1 + (channelsUsed.size * 0.5);
      const intensity = Math.min(baseIntensity * channelMultiplier, 10);

      // Create clickable links for all documents
      const links = pages.map(p =>
          `<a class="internal-link" data-href="${p.file.name}">${p.file.name}</a>`
      ).join('<br>');

      trackerData.entries.push({
          date: date,
          intensity: intensity,
          content: await dv.span(`<div title="${documentCount} docs, ${channelsUsed.size} channels">${links}</div>`)
      });
  }

  renderHeatmapTracker(this.container, trackerData);
```
