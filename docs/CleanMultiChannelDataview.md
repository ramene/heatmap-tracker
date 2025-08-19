# Clean Multi-Channel Publishing Heatmap

This example shows how to create a clean heatmap that removes link clutter and uses enhanced navigation for multi-document dates.

## Document Properties Structure

Add these properties to your publishing documents:

```yaml
---
publishDraftDate: 2025-08-19
twitter: true
instagram: true
linkedin: false
tiktok: false
facebook: false
substack: true
---
```

## Enhanced DataviewJS Implementation

```dataviewjs
const trackerData = {
    year: 2025,
    colorScheme: {
        // Green gradient for publishing intensity
        customColors: ["#f0f9ff","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8","#0ea5e9"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "📱 Multi-Channel Publishing Tracker",
    
    // Enhanced configuration for multi-channel intensity
    intensityConfig: {
        mode: "multi-channel",
        channelWeights: {
            twitter: 1,
            instagram: 1,
            tiktok: 1,
            facebook: 0.8,
            linkedin: 1.2,
            substack: 1.5
        },
        documentCountWeight: 1,
        channelDiversityBonus: 0.5,
        maxIntensity: 10
    }
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

## Key Improvements

### 1. ✅ Clean Visual Display
- **Before**: Links cluttered the heatmap making it hard to see patterns
- **After**: Clean boxes with subtle indicators for multi-document dates

### 2. ✅ Smart Navigation
- **Single Document**: Click directly navigates to the document
- **Multi-Document**: Click creates a dashboard with all documents and analytics
- **Empty Date**: Click creates a daily note (existing behavior)

### 3. ✅ Enhanced Metadata
- Document count badges on multi-document dates
- Channel indicators showing platform distribution
- Rich tooltips with publishing summary

### 4. ✅ Dashboard Integration
- Automatic dashboard generation for complex publishing days
- shadcn-style UI components for modern look
- Analytics and insights for publishing patterns

## Visual Indicators

### Document Count Badges
- **2 docs**: Blue badge with count
- **3 docs**: Green badge with count  
- **4 docs**: Orange badge with count
- **5+ docs**: Red badge with count

### Channel Dots
Small colored dots at bottom-left of cells:
- 🔵 Twitter (#1DA1F2)
- 🔵 LinkedIn (#0077B5) 
- 🔴 Instagram (#E4405F)
- ⚫ TikTok (#000000)
- 🔵 Facebook (#1877F2)
- 🟠 Substack (#FF6719)

### Intensity Scaling
- **0-2**: Light blue (minimal activity)
- **2-4**: Medium blue (moderate publishing)
- **4-6**: Darker blue (good distribution)
- **6-8**: Strong blue (high engagement)
- **8-10**: Deep blue (maximum reach)

## Example Intensity Calculations

| Scenario | Documents | Channels | Calculation | Result |
|----------|-----------|----------|-------------|---------|
| Single tweet | 1 | twitter | 1 × (1 + 0.5) | **1.5** |
| Blog + social | 1 | twitter, linkedin, substack | 1 × (1 + 1.5) | **2.5** |
| Content burst | 3 | instagram, tiktok, facebook | 3 × (1 + 1.5) | **7.5** |
| Full campaign | 5 | all 6 channels | 5 × (1 + 3) | **10** (max) |

## Expected User Experience

1. **Clean Heatmap**: No visual clutter, easy to see publishing patterns
2. **Quick Navigation**: Single clicks go directly to content
3. **Rich Dashboards**: Multi-document dates open analytical views
4. **Future Analytics**: Foundation for performance tracking and insights

## Next Steps

This clean foundation enables:
- 📊 Real analytics integration
- 🤖 AI-powered publishing suggestions  
- 📈 Performance tracking over time
- 🎯 Optimal timing recommendations
- 📱 Cross-platform engagement analysis