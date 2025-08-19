# Multi-Channel Intensity System Design

## 📊 Current State Analysis

### Repository Status
- **Current Branch**: `feat/multi-channel-intensity` (created from `main`)
- **Key Branches**: 
  - `main` - Stable with working native Obsidian links & custom tooltips
  - `backup-multi-document-work` - Previous multi-document attempts (archived)
  - `feat/custom-tooltip-titles` - Merged tooltip customizations

### Recent Work
1. ✅ Native Obsidian link support in heatmap cells
2. ✅ Custom tooltips showing only document titles (no date prefix)
3. ✅ Hover preview and navigation functionality restored
4. ❌ Multi-document aggregation (reverted due to breaking core functionality)

### Current Intensity Implementation
```typescript
// src/utils/intensity.ts
interface Entry {
  date: string;
  intensity?: number;  // Mapped intensity (1-5 typically)
  value?: number;      // Original user value
  content?: ReactNode | HTMLElement;
}
```

Current system maps user-provided intensity values to color ranges based on:
- Min/max intensity values
- Number of colors in palette
- Linear distribution across ranges

## 🎯 New Requirements: Multi-Channel Publishing Intensity

### Core Concept
Intensity should reflect **publishing breadth** across social media channels:
- Base: Number of documents with `publishDraftDate` on same day
- Multiplier: Number of unique channels published to
- Channels: Twitter, Instagram, TikTok, Facebook, LinkedIn, Substack

### Intensity Calculation Formula

```typescript
// Proposed intensity calculation
intensity = baseDocumentCount * channelMultiplier

where:
- baseDocumentCount = number of documents on same date
- channelMultiplier = 1 + (uniqueChannels * 0.5)

// Example scenarios:
// 1 doc, 1 channel = 1 * 1.5 = 1.5 intensity
// 2 docs, 3 channels = 2 * 2.5 = 5 intensity  
// 3 docs, 6 channels = 3 * 4 = 12 intensity
```

## 🏗️ Implementation Design

### 1. Enhanced Entry Type
```typescript
interface MultiChannelEntry extends Entry {
  date: string;
  intensity?: number;
  value?: number;
  content?: ReactNode | HTMLElement;
  
  // New fields for multi-channel tracking
  channels?: SocialChannel[];
  documentCount?: number;
  publishedTo?: {
    twitter?: boolean;
    instagram?: boolean;
    tiktok?: boolean;
    facebook?: boolean;
    linkedin?: boolean;
    substack?: boolean;
  };
}

type SocialChannel = 
  | 'twitter' 
  | 'instagram' 
  | 'tiktok' 
  | 'facebook' 
  | 'linkedin' 
  | 'substack';
```

### 2. Intensity Configuration
```typescript
interface MultiChannelIntensityConfig extends IntensityConfig {
  // Existing config
  defaultIntensity?: number;
  scaleStart?: number;
  scaleEnd?: number;
  showOutOfRange?: boolean;
  
  // New multi-channel config
  channelWeights?: {
    twitter?: number;     // default: 1
    instagram?: number;   // default: 1
    tiktok?: number;      // default: 1
    facebook?: number;    // default: 1
    linkedin?: number;    // default: 1
    substack?: number;    // default: 1.5 (blog posts weighted higher)
  };
  
  documentCountWeight?: number;  // default: 1
  channelDiversityBonus?: number; // default: 0.5 per channel
  maxIntensity?: number;          // default: 10
}
```

### 3. DataviewJS Integration

#### Document Properties Structure
```yaml
# Document frontmatter
publishDraftDate: 2025-08-19
publishedTo:
  twitter: true
  instagram: true
  linkedin: false
  tiktok: false
  facebook: false
  substack: true
```

#### Enhanced DataviewJS Example
```javascript
const trackerData = {
    year: 2025,
    colorScheme: {
        customColors: ["#e8f5e9","#a5d6a7","#66bb6a","#43a047","#2e7d32","#1b5e20"]
    },
    entries: [],
    showCurrentDayBorder: true,
    heatmapTitle: "📱 Multi-Channel Publishing Tracker",
    
    // New configuration for multi-channel intensity
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
        channelDiversityBonus: 0.5
    }
}

// Group pages by publishDraftDate
const pagesByDate = {};
for(let page of dv.pages().where(p => p.publishDraftDate)) {
    const date = page.publishDraftDate;
    if (!pagesByDate[date]) {
        pagesByDate[date] = [];
    }
    pagesByDate[date].push(page);
}

// Calculate intensity for each date
for(let date in pagesByDate) {
    const pages = pagesByDate[date];
    const documentCount = pages.length;
    
    // Track unique channels
    const channelsUsed = new Set();
    let totalChannelWeight = 0;
    
    for(let page of pages) {
        if (page.publishedTo) {
            for(let channel in page.publishedTo) {
                if (page.publishedTo[channel]) {
                    channelsUsed.add(channel);
                    totalChannelWeight += trackerData.intensityConfig.channelWeights[channel] || 1;
                }
            }
        }
    }
    
    // Calculate intensity
    const baseIntensity = documentCount * trackerData.intensityConfig.documentCountWeight;
    const channelMultiplier = 1 + (channelsUsed.size * trackerData.intensityConfig.channelDiversityBonus);
    const intensity = Math.min(baseIntensity * channelMultiplier, 10);
    
    // Create content with links to all documents
    const links = pages.map(p => 
        `<a class="internal-link" data-href="${p.file.name}">${p.file.name}</a>`
    ).join(', ');
    
    trackerData.entries.push({
        date: date,
        intensity: intensity,
        content: await dv.span(`<div>${links}</div>`),
        // Store metadata for tooltips
        metadata: {
            documentCount: documentCount,
            channels: Array.from(channelsUsed),
            pages: pages.map(p => p.file.name)
        }
    });
}

renderHeatmapTracker(this.container, trackerData);
```

## 📈 Intensity Scaling Examples

### Scenario 1: Single Document, Single Channel
- 1 document published to Twitter only
- Intensity = 1 * (1 + 0.5) = 1.5

### Scenario 2: Multiple Documents, Same Channel  
- 3 documents all published to LinkedIn only
- Intensity = 3 * (1 + 0.5) = 4.5

### Scenario 3: Single Document, Multiple Channels
- 1 document published to Twitter, Instagram, TikTok
- Intensity = 1 * (1 + 1.5) = 2.5

### Scenario 4: Maximum Engagement
- 5 documents published to all 6 channels
- Intensity = 5 * (1 + 3) = 20 (capped at 10)

## 🎨 Visual Indicators

### Color Intensity Mapping
```
Intensity 0-1:   ⬜ No activity
Intensity 1-2:   🟩 Light (single doc/channel)
Intensity 2-4:   🟢 Medium (multi-doc or multi-channel)
Intensity 4-6:   🟡 High (multi-doc AND multi-channel)
Intensity 6-8:   🟠 Very High (broad distribution)
Intensity 8-10:  🔴 Maximum (viral day)
```

### Tooltip Enhancement
```typescript
// Enhanced tooltip showing channel distribution
aria-label="3 documents published to 4 channels: Twitter, Instagram, LinkedIn, Substack"
```

## 🔧 Implementation Steps

1. **Phase 1: Core Type Extensions**
   - Extend Entry interface with channel tracking
   - Update IntensityConfig with multi-channel options
   - Create utility functions for channel counting

2. **Phase 2: Intensity Calculator**
   - Implement `calculateMultiChannelIntensity()` function
   - Add channel weight configuration
   - Support legacy single-intensity mode

3. **Phase 3: DataviewJS Templates**
   - Create example templates for different use cases
   - Document property structure requirements
   - Provide migration guide from simple intensity

4. **Phase 4: Visual Enhancements**
   - Update tooltips to show channel information
   - Add channel icons to cells (optional)
   - Implement channel-specific color schemes

## 🧪 Testing Strategy

### Unit Tests
- Channel counting accuracy
- Intensity calculation with various weights
- Edge cases (no channels, all channels, etc.)

### Integration Tests
- DataviewJS parsing with channel properties
- Multi-document aggregation per date
- Tooltip generation with channel info

### User Acceptance Criteria
- ✅ Intensity increases with more documents on same date
- ✅ Intensity increases with more channel diversity
- ✅ Configurable channel weights
- ✅ Backward compatible with existing intensity entries
- ✅ Clear visual distinction between intensity levels

## 📚 Documentation Updates

### User Guide Sections
1. Setting up document properties for channels
2. Configuring channel weights
3. DataviewJS examples for common scenarios
4. Migration from simple intensity tracking

### API Reference
- New Entry properties
- IntensityConfig extensions
- Utility functions for channel calculations

## 🚀 Future Enhancements

1. **Analytics Dashboard**
   - Channel performance over time
   - Best performing days/channels
   - Publishing consistency metrics

2. **Smart Suggestions**
   - Recommend optimal publishing times
   - Suggest underutilized channels
   - Identify content gaps

3. **Integration Extensions**
   - Direct API integration with social platforms
   - Auto-detect published content
   - Real-time engagement metrics