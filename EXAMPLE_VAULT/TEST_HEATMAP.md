# 🧪 Multi-Channel Publishing Heatmap Test

Test your new multi-channel publishing heatmap functionality with the enhanced intensity calculation and dashboard generation.

## 📊 Test Heatmap

```dataviewjs
const trackerData = {
    year: 2025,
    colorScheme: {
        // Blue gradient for publishing intensity
        customColors: ["#f0f9ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "🧪 Multi-Channel Publishing Test Tracker"
}

// Channel weight configuration
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
for(let page of dv.pages('"BatchProcess"').where(p => p.publishDraftDate)) {
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
    const documentDetails = [];
    
    for(let page of pages) {
        const channels = [];
        
        // Check each social channel
        if (page.twitter) { channelsUsed.add('twitter'); channels.push('twitter'); }
        if (page.instagram) { channelsUsed.add('instagram'); channels.push('instagram'); }
        if (page.tiktok) { channelsUsed.add('tiktok'); channels.push('tiktok'); }
        if (page.facebook) { channelsUsed.add('facebook'); channels.push('facebook'); }
        if (page.linkedin) { channelsUsed.add('linkedin'); channels.push('linkedin'); }
        if (page.substack) { channelsUsed.add('substack'); channels.push('substack'); }
        
        documentDetails.push({
            name: page.file.name,
            path: page.file.path,
            channels: channels,
            excerpt: page.excerpt || page.summary || ''
        });
    }
    
    // Calculate intensity based on:
    // 1. Number of documents (base intensity)
    // 2. Number of unique channels (multiplier effect)
    const baseIntensity = documentCount;
    const channelMultiplier = 1 + (channelsUsed.size * 0.5);
    const intensity = Math.min(baseIntensity * channelMultiplier, 10);
    
    // Create entry with metadata but NO VISIBLE LINKS
    trackerData.entries.push({
        date: date,
        intensity: intensity,
        content: "", // ✅ CLEAN - No links cluttering the display
        metadata: {
            documentCount: documentCount,
            channels: Array.from(channelsUsed),
            documents: documentDetails,
            intensity: intensity
        }
    });
}

renderHeatmapTracker(this.container, trackerData);
```

## 🎯 Test Scenarios

### Expected Results for 2025-08-19

With both TEST_DOCUMENT.md and TEST_DOCUMENT_2.md:

#### Visual Display
- **Document Count Badge**: "2" in blue
- **Channel Dots**: Twitter (blue), TikTok (black), LinkedIn (blue)
- **Intensity Color**: Strong blue (intensity = 7)

#### Hover Tooltip
"2025-08-19: 2 documents published to twitter, instagram, tiktok, linkedin, substack"

#### Click Behavior
- Should create: `Dashboards/Publishing/2025-08-19.md`
- Should open the dashboard automatically
- Dashboard should contain analytics and insights

### Test Steps

1. **View Heatmap**: Look for 2025-08-19 cell
2. **Check Visual Indicators**: Badge, dots, color
3. **Test Hover**: Verify tooltip content
4. **Test Click**: Should create dashboard
5. **Verify Dashboard**: Check content and analytics

### Expected Dashboard Content

```markdown
# 📊 Publishing Dashboard - Monday, August 19th, 2025

## 📈 Summary
- **Documents Published**: 2
- **Channels Used**: 5
- **Channel Mix**: #twitter #instagram #tiktok #linkedin #substack

## 📄 Published Documents
- [[TEST_DOCUMENT]] (twitter, instagram, substack)
- [[TEST_DOCUMENT_2]] (twitter, tiktok, linkedin)

## 📊 Analytics
[Channel breakdown table]

## 🎯 Publishing Insights
- 🔥 High publishing volume - excellent consistency!
- 🌍 Strong multi-channel distribution strategy
- 💼 Professional presence maintained on LinkedIn
- 📱 Good balance of text and visual content
```

## 🔧 Troubleshooting

### No Badge Showing
- Check that both test documents have `publishDraftDate: 2025-08-19`
- Verify channel properties are `true`/`false` (not strings)
- Rebuild with `npm run build`

### Dashboard Not Creating  
- Check console for errors
- Verify `Dashboards/Publishing` folder permissions
- Try manually creating the folder first

### Wrong Intensity
- Verify calculation: 2 docs × (1 + 5 channels × 0.5) = 7
- Check that all channels are being detected
- Ensure date format is consistent

## ✅ Success Criteria

- [x] Heatmap builds without errors
- [ ] Visual indicators appear correctly
- [ ] Hover tooltip shows proper content
- [ ] Click creates dashboard
- [ ] Dashboard contains expected content
- [ ] Analytics and insights generate properly

---
*Multi-channel publishing heatmap functionality test complete* 🎉