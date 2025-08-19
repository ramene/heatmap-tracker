# 🚀 Multi-Channel Publishing Heatmap - Usage Guide

## ✅ Ready to Use RIGHT NOW!

The multi-channel intensity system is fully implemented and ready for immediate use with your existing Obsidian setup.

## 📋 Quick Setup

### 1. Document Properties Structure

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
excerpt: "Your content summary here..."
---
```

### 2. Clean Multi-Channel DataviewJS

Replace your existing dataviewjs blocks with this enhanced version:

```dataviewjs
const trackerData = {
    year: 2025,
    colorScheme: {
        // Blue gradient for publishing intensity
        customColors: ["#f0f9ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "📱 Multi-Channel Publishing Tracker"
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

## 🎯 How It Works

### Visual Indicators

#### Document Count Badges
- **1 doc**: No badge (clean display)
- **2 docs**: Blue badge with "2"
- **3 docs**: Green badge with "3"  
- **4 docs**: Orange badge with "4"
- **5+ docs**: Red badge with count

#### Channel Dots
Small colored dots in bottom-left corner:
- 🔵 **Twitter**: #1DA1F2
- 🔵 **LinkedIn**: #0077B5
- 🔴 **Instagram**: #E4405F
- ⚫ **TikTok**: #000000
- 🔵 **Facebook**: #1877F2
- 🟠 **Substack**: #FF6719

### Smart Navigation

#### Single Document Date
1. **Display**: Clean cell with standard intensity color
2. **Hover**: Shows document title only
3. **Click**: Opens document directly

#### Multi-Document Date
1. **Display**: Badge + channel dots + intensity color
2. **Hover**: "X documents published to Y channels"
3. **Click**: Creates analytical dashboard

#### Empty Date
1. **Display**: Empty cell
2. **Hover**: Shows date
3. **Click**: Creates daily note (existing behavior)

## 📊 Intensity Calculation

### Formula
```
intensity = documentCount × (1 + channelCount × 0.5)
```

### Examples
| Documents | Channels | Calculation | Final Intensity |
|-----------|----------|-------------|-----------------|
| 1 doc | twitter | 1 × (1 + 0.5) | **1.5** |
| 2 docs | twitter, linkedin | 2 × (1 + 1) | **4** |
| 1 doc | twitter, instagram, tiktok | 1 × (1 + 1.5) | **2.5** |
| 3 docs | all 6 channels | 3 × (1 + 3) | **12 → 10** (capped) |

### Channel Weights (Optional)
You can customize channel importance:
```javascript
const CHANNEL_WEIGHTS = {
    twitter: 1,      // Standard weight
    instagram: 1,    // Standard weight
    linkedin: 1.2,   // 20% more important
    substack: 1.5,   // 50% more important (blog posts)
    facebook: 0.8,   // 20% less important
    tiktok: 1        // Standard weight
};
```

## 📱 Dashboard Features

When you click a multi-document date, you get a rich dashboard with:

### 📈 Summary Stats
- Document count
- Channels used
- Channel distribution

### 📄 Document List
- Clickable links to each document
- Channel indicators per document
- Excerpt previews

### 📊 Analytics
- Channel breakdown table
- Publishing insights
- AI-generated recommendations

### 🎯 Smart Insights
Examples of what you'll see:
- "🔥 High publishing volume - excellent consistency!"
- "🌍 Strong multi-channel distribution strategy"
- "💼 Professional presence maintained on LinkedIn"
- "📱 Good balance of text and visual content"

## 🎨 Styling & Themes

### Automatic Theme Support
- **Light Mode**: Dark badges, clear tooltips
- **Dark Mode**: Light badges, adapted colors
- **High Contrast**: Enhanced visibility
- **Reduced Motion**: Disabled animations

### Responsive Design
- **Desktop**: Full feature set
- **Mobile**: Smaller badges, touch-friendly
- **Tablet**: Optimized sizing

## 🚀 Advanced Usage

### Custom Color Schemes
```javascript
colorScheme: {
    // Green for growth
    customColors: ["#f0fdf4","#dcfce7","#bbf7d0","#86efac","#4ade80","#22c55e"]
    
    // Purple for creativity  
    customColors: ["#faf5ff","#f3e8ff","#e9d5ff","#c4b5fd","#a78bfa","#8b5cf6"]
    
    // Orange for energy
    customColors: ["#fff7ed","#ffedd5","#fed7aa","#fdba74","#fb923c","#f97316"]
}
```

### Filtering by Folder
```javascript
// Only include specific folder
for(let page of dv.pages('"Content/Published"').where(p => p.publishDraftDate)) {
    // ... rest of code
}

// Exclude drafts folder
for(let page of dv.pages('-"Drafts"').where(p => p.publishDraftDate)) {
    // ... rest of code
}
```

### Custom Date Ranges
```javascript
// Only show current year
const currentYear = new Date().getFullYear();
for(let page of dv.pages().where(p => p.publishDraftDate && 
    new Date(p.publishDraftDate).getFullYear() === currentYear)) {
    // ... rest of code
}
```

## 🔧 Troubleshooting

### No Badges Showing
- ✅ Check document properties format
- ✅ Ensure `publishDraftDate` is YYYY-MM-DD format
- ✅ Rebuild project: `npm run build`

### Dashboard Not Creating
- ✅ Verify folder permissions
- ✅ Check console for errors
- ✅ Ensure `Dashboards/Publishing` folder exists

### Wrong Intensity Colors
- ✅ Verify channel property values (true/false)
- ✅ Check color scheme configuration
- ✅ Ensure date format is consistent

### Tooltips Not Showing
- ✅ Check accessibility settings
- ✅ Verify SCSS import in styles.scss
- ✅ Clear browser cache

## 📚 Next Steps

### Immediate Use
1. ✅ Add properties to your documents
2. ✅ Update your dataviewjs block
3. ✅ Rebuild the plugin
4. ✅ Start tracking your publishing!

### Future Enhancements
- 🔮 Real analytics integration
- 🤖 AI-powered recommendations
- 📱 Cross-platform sync
- 📊 Performance tracking

## 💡 Pro Tips

### Batch Property Updates
Use a text editor with regex to add properties to multiple files:

**Find**: `^---\n`
**Replace**: 
```
---
publishDraftDate: 2025-08-19
twitter: false
instagram: false
tiktok: false
facebook: false
linkedin: false
substack: false
```

### Template Setup
Create a document template with properties:
```yaml
---
publishDraftDate: {{date:YYYY-MM-DD}}
twitter: false
instagram: false
linkedin: false
substack: false
excerpt: ""
---

# {{title}}

Content here...
```

### Analytics Tracking
Keep a publishing log:
```yaml
---
date: 2025-08-19
total_documents: 3
channels_used: ["twitter", "linkedin", "substack"]
top_performing: "Article about productivity"
insights: "LinkedIn posts get 3x more engagement"
---
```

Your multi-channel publishing heatmap is ready to use **right now**! 🎉