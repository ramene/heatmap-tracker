---
date: <% tp.frontmatter.date || tp.date.now("YYYY-MM-DD") %>
type: publishing-dashboard
cssclass: publishing-dashboard
documentCount: <% tp.frontmatter.documentCount || 0 %>
channels: <% tp.frontmatter.channels ? JSON.stringify(tp.frontmatter.channels) : "[]" %>
coverage: <% tp.frontmatter.coverage || 0 %>
metadata: <% tp.frontmatter.metadata ? JSON.stringify(tp.frontmatter.metadata) : "{}" %>
---

# 📊 Publishing Dashboard - <% tp.date.now("dddd, MMMM Do, YYYY", 0, tp.frontmatter.date, "YYYY-MM-DD") %>

> 🔄 **Refresh Dashboard**: Hold **Shift** and click the date cell to regenerate with latest changes
> 📅 **Quick Regenerate**: Use `Shift+Click` on multi-document cells for instant refresh

## 📈 Quick Stats

| Metric | Value |
|--------|-------|
| 📄 Documents | <% tp.frontmatter.documentCount || 0 %> |
| 📱 Channels | <% tp.frontmatter.channels ? JSON.parse(tp.frontmatter.channels).length : 0 %> |
| 📊 Coverage | <% tp.frontmatter.coverage || 0 %>% |
| 🎯 Intensity | <% Math.round((tp.frontmatter.documentCount || 0) * (1 + ((tp.frontmatter.channels ? JSON.parse(tp.frontmatter.channels).length : 0) * 0.5))) %> |

## 📱 Channel Distribution

```dataviewjs
// Get metadata from frontmatter
const metadataStr = dv.current().metadata || "{}";
let metadata;
try {
    metadata = JSON.parse(metadataStr);
} catch (e) {
    metadata = {};
}

if (metadata && metadata.documents && metadata.documents.length > 0) {
    // Count documents per channel
    const channelCounts = {};
    metadata.documents.forEach(doc => {
        if (doc.channels && doc.channels.length > 0) {
            doc.channels.forEach(channel => {
                channelCounts[channel] = (channelCounts[channel] || 0) + 1;
            });
        }
    });
    
    // Display channel statistics
    if (Object.keys(channelCounts).length > 0) {
        dv.header(3, "Documents per Channel");
        dv.table(["Channel", "Count", "Percentage"], 
            Object.entries(channelCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([channel, count]) => [
                    channel.charAt(0).toUpperCase() + channel.slice(1),
                    count,
                    Math.round((count / metadata.documents.length) * 100) + "%"
                ])
        );
    }
} else {
    dv.paragraph("No channel distribution data available.");
}
```

## 📄 Published Content

```dataviewjs
// Get metadata from frontmatter
const metadataStr = dv.current().metadata || "{}";
let metadata;
try {
    metadata = JSON.parse(metadataStr);
} catch (e) {
    metadata = {};
}

if (metadata && metadata.documents && metadata.documents.length > 0) {
    const documents = metadata.documents;
    
    // Create document cards
    documents.forEach(doc => {
        const channels = doc.channels && doc.channels.length > 0 
            ? doc.channels.map(ch => `\`${ch}\``).join(' ') 
            : '*No channels specified*';
        
        const excerpt = doc.excerpt ? doc.excerpt.substring(0, 150) + '...' : '';
        
        dv.header(4, `[[${doc.name}]]`);
        dv.paragraph(`**Channels:** ${channels}`);
        if (excerpt) {
            dv.paragraph(`*${excerpt}*`);
        }
    });
} else {
    dv.paragraph("No documents found for this date.");
}
```

## 📊 Publishing Insights

```dataviewjs
// Get metadata from frontmatter
const metadataStr = dv.current().metadata || "{}";
let metadata;
try {
    metadata = JSON.parse(metadataStr);
} catch (e) {
    metadata = {};
}

const insights = [];

// Document count insights
const docCount = metadata.documentCount || 0;
if (docCount > 3) {
    insights.push("🔥 High publishing volume - excellent consistency!");
} else if (docCount === 3) {
    insights.push("✨ Great publishing cadence today!");
} else if (docCount === 2) {
    insights.push("👍 Good publishing momentum!");
}

// Channel diversity insights
const channels = metadata.channels || [];
if (channels.length >= 5) {
    insights.push("🌍 Exceptional multi-channel coverage!");
} else if (channels.length >= 3) {
    insights.push("📱 Strong multi-channel distribution!");
} else if (channels.length === 2) {
    insights.push("👥 Focused dual-channel strategy");
}

// Platform-specific insights
if (channels.includes('linkedin')) {
    insights.push("💼 Professional network engaged");
}
if (channels.includes('substack')) {
    insights.push("📝 Long-form content published");
}
if (channels.includes('twitter') && channels.includes('instagram')) {
    insights.push("🎯 Text + visual content balance achieved");
}
if (channels.includes('tiktok')) {
    insights.push("🎬 Video content strategy active");
}

// Coverage insights
const coverage = metadata.coverage || 0;
if (coverage >= 80) {
    insights.push("🏆 Near-complete channel coverage!");
} else if (coverage >= 50) {
    insights.push("📈 Good channel utilization");
}

// Intensity calculation
const intensity = docCount * (1 + (channels.length * 0.5));
if (intensity >= 7) {
    insights.push("⚡ Exceptional publishing intensity!");
} else if (intensity >= 5) {
    insights.push("🔥 High publishing intensity");
}

if (insights.length > 0) {
    dv.list(insights);
} else {
    dv.paragraph("*Building insights from your publishing patterns...*");
}
```

## 📈 Channel Performance Summary

```dataviewjs
const channelsStr = dv.current().channels || "[]";
let channels;
try {
    channels = JSON.parse(channelsStr);
} catch (e) {
    channels = [];
}

if (channels && channels.length > 0) {
    // Channel characteristics
    const channelInfo = {
        twitter: { emoji: "🐦", reach: "Quick updates", audience: "Tech & News" },
        linkedin: { emoji: "💼", reach: "Professional", audience: "Business" },
        instagram: { emoji: "📸", reach: "Visual stories", audience: "Lifestyle" },
        tiktok: { emoji: "🎬", reach: "Video content", audience: "Gen Z" },
        facebook: { emoji: "👥", reach: "Community", audience: "General" },
        substack: { emoji: "📝", reach: "Deep dives", audience: "Subscribers" }
    };
    
    const rows = channels.map(ch => {
        const info = channelInfo[ch] || { emoji: "📱", reach: "Content", audience: "General" };
        return [
            `${info.emoji} ${ch.charAt(0).toUpperCase() + ch.slice(1)}`,
            info.reach,
            info.audience
        ];
    });
    
    if (rows.length > 0) {
        dv.header(3, "Active Channels");
        dv.table(["Channel", "Content Type", "Audience"], rows);
    }
}
```

## 🎯 Action Items

- [ ] Review engagement metrics for today's content
- [ ] Identify top-performing channels
- [ ] Plan follow-up content for high-engagement posts
- [ ] Schedule content for underutilized channels
- [ ] Analyze optimal posting times

## 📝 Notes

> Add your observations about today's publishing activity here...

## 🔗 Quick Navigation

- [[Publishing Strategy]] - Content strategy guidelines
- [[Content Calendar]] - Publishing schedule
- [[Channel Performance]] - Historical analytics
- [[Content Ideas]] - Upcoming content pipeline

---
*Dashboard created: <% tp.date.now("YYYY-MM-DD HH:mm") %>*