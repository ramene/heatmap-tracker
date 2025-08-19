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
      const documentsMetadata = [];

      for(let page of pages) {
          const pageChannels = [];

          // Check each social channel
          if (page.twitter) {
              channelsUsed.add('twitter');
              pageChannels.push('twitter');
          }
          if (page.instagram) {
              channelsUsed.add('instagram');
              pageChannels.push('instagram');
          }
          if (page.tiktok) {
              channelsUsed.add('tiktok');
              pageChannels.push('tiktok');
          }
          if (page.facebook) {
              channelsUsed.add('facebook');
              pageChannels.push('facebook');
          }
          if (page.linkedin) {
              channelsUsed.add('linkedin');
              pageChannels.push('linkedin');
          }
          if (page.substack) {
              channelsUsed.add('substack');
              pageChannels.push('substack');
          }

          // Store document metadata for dashboard generation
          documentsMetadata.push({
              name: page.file.name,
              path: page.file.path,
              channels: pageChannels,
              excerpt: page.excerpt || page.description || ""
          });
      }

      // Calculate intensity
      const baseIntensity = documentCount;
      const channelMultiplier = 1 + (channelsUsed.size * 0.5);
      const intensity = Math.min(baseIntensity * channelMultiplier, 10);

      // Convert Set to Array for metadata
      const channelsArray = Array.from(channelsUsed);

      // CRITICAL: Create content for preview functionality
      let contentValue;
      if (documentCount === 1) {
          // Single document: invisible link for page preview
          const page = pages[0];
          contentValue = await dv.span(`<a class="internal-link heatmap-hidden-link" data-href="${page.file.name}"> </a>`);
      } else if (documentCount > 1) {
          // Multiple documents: just the count number
          contentValue = documentCount;
      } else {
          contentValue = null;
      }

      trackerData.entries.push({
          date: date,
          intensity: intensity,
          content: contentValue,
          metadata: {
              documentCount: documentCount,
              channels: channelsArray,
              documents: documentsMetadata
          }
      });
  }

  renderHeatmapTracker(this.container, trackerData);
```




















