---
date: <% tp.date.now("YYYY-MM-DD") %>
type: publishing-dashboard
cssclass: publishing-dashboard
documentCount: <% tp.user.getDocumentCount() %>
channels: <% JSON.stringify(tp.user.getChannels()) %>
metadata: <% tp.user.getMetadata() %>
---

# 📊 Publishing Dashboard - <% tp.date.now("dddd, MMMM Do, YYYY", 0, tp.frontmatter.date, "YYYY-MM-DD") %>

<div class="dashboard-header">
  <div class="stat-cards">
    <div class="stat-card">
      <div class="stat-value"><% tp.user.getDocumentCount() %></div>
      <div class="stat-label">Documents</div>
    </div>
    <div class="stat-card">
      <div class="stat-value"><% tp.user.getChannelCount() %></div>
      <div class="stat-label">Channels</div>
    </div>
    <div class="stat-card">
      <div class="stat-value"><% tp.user.getIntensityScore() %></div>
      <div class="stat-label">Intensity</div>
    </div>
    <div class="stat-card">
      <div class="stat-value"><% tp.user.getEstimatedReach() %></div>
      <div class="stat-label">Est. Reach</div>
    </div>
  </div>
</div>

## 📱 Channel Distribution

```dataviewjs
// Parse metadata from frontmatter
const metadata = JSON.parse(dv.current().metadata || '{}');
const channels = metadata.channels || [];
const documents = metadata.documents || [];

// Calculate channel distribution
const channelCounts = {};
const channelColors = {
  twitter: '#1DA1F2',
  linkedin: '#0077B5', 
  instagram: '#E4405F',
  tiktok: '#000000',
  facebook: '#1877F2',
  substack: '#FF6719'
};

documents.forEach(doc => {
  doc.channels.forEach(channel => {
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  });
});

// Create visual channel chart
let chartHtml = '<div class="channel-chart">';
Object.entries(channelCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([channel, count]) => {
    const percentage = (count / documents.length * 100).toFixed(1);
    const color = channelColors[channel] || '#666';
    chartHtml += `
      <div class="channel-bar">
        <div class="channel-label">
          <span class="channel-dot" style="background: ${color}"></span>
          ${channel}
        </div>
        <div class="channel-progress">
          <div class="progress-bar" style="width: ${percentage}%; background: ${color}"></div>
        </div>
        <div class="channel-count">${count}</div>
      </div>
    `;
  });
chartHtml += '</div>';

dv.container.innerHTML = chartHtml;
```

## 📄 Published Content

```dataviewjs
const metadata = JSON.parse(dv.current().metadata || '{}');
const documents = metadata.documents || [];

// Create content cards
const cards = documents.map(doc => {
  const channelBadges = doc.channels.map(ch => 
    `<span class="channel-badge channel-${ch}">${ch}</span>`
  ).join('');
  
  const excerpt = doc.excerpt ? 
    doc.excerpt.substring(0, 150) + (doc.excerpt.length > 150 ? '...' : '') : 
    'No excerpt available';
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <h3 class="content-title">
          <a href="${doc.path}" class="internal-link">${doc.name}</a>
        </h3>
        <div class="channel-badges">
          ${channelBadges}
        </div>
      </div>
      <div class="content-card-body">
        ${excerpt}
      </div>
      <div class="content-card-footer">
        <button class="btn btn-primary" onclick="app.workspace.openLinkText('${doc.name}', '${doc.path}')">
          View Document
        </button>
        <button class="btn btn-secondary" onclick="openAnalytics('${doc.path}')">
          Analytics
        </button>
      </div>
    </div>
  `;
}).join('');

dv.container.innerHTML = `
  <div class="content-grid">
    ${cards}
  </div>
`;
```

## 📈 Performance Metrics

```dataviewjs
// Mock analytics data - would be real in production
const metadata = JSON.parse(dv.current().metadata || '{}');
const channels = metadata.channels || [];

// Generate mock metrics for demonstration
const generateMockMetrics = (channel) => {
  const base = Math.floor(Math.random() * 1000) + 100;
  return {
    impressions: base * (channel === 'twitter' ? 10 : channel === 'linkedin' ? 5 : 3),
    engagement: (Math.random() * 10).toFixed(1) + '%',
    clicks: Math.floor(base * 0.1),
    shares: Math.floor(base * 0.05)
  };
};

const metricsHtml = channels.map(channel => {
  const metrics = generateMockMetrics(channel);
  return `
    <div class="metric-card">
      <div class="metric-header">
        <span class="channel-icon channel-${channel}"></span>
        <h4>${channel}</h4>
      </div>
      <div class="metric-stats">
        <div class="metric-stat">
          <span class="stat-value">${metrics.impressions.toLocaleString()}</span>
          <span class="stat-label">Impressions</span>
        </div>
        <div class="metric-stat">
          <span class="stat-value">${metrics.engagement}</span>
          <span class="stat-label">Engagement</span>
        </div>
        <div class="metric-stat">
          <span class="stat-value">${metrics.clicks}</span>
          <span class="stat-label">Clicks</span>
        </div>
        <div class="metric-stat">
          <span class="stat-value">${metrics.shares}</span>
          <span class="stat-label">Shares</span>
        </div>
      </div>
    </div>
  `;
}).join('');

dv.container.innerHTML = `
  <div class="metrics-grid">
    ${metricsHtml}
  </div>
`;
```

## 🎯 Publishing Insights

```dataviewjs
const metadata = JSON.parse(dv.current().metadata || '{}');
const documents = metadata.documents || [];
const channels = metadata.channels || [];

// Generate AI-style insights
const insights = [];

if (documents.length > 3) {
  insights.push("🔥 High publishing volume - excellent consistency!");
}

if (channels.length >= 4) {
  insights.push("🌍 Strong multi-channel distribution strategy");
}

if (channels.includes('linkedin')) {
  insights.push("💼 Professional presence maintained on LinkedIn");
}

if (channels.includes('substack')) {
  insights.push("📝 Long-form content strategy with Substack");
}

if (channels.includes('twitter') && channels.includes('instagram')) {
  insights.push("📱 Good balance of text and visual content");
}

// Timing insights (mock)
const publishTime = new Date().getHours();
if (publishTime >= 9 && publishTime <= 11) {
  insights.push("⏰ Publishing in optimal morning engagement window");
}

// Content mix insights
if (documents.length > 1) {
  insights.push("📚 Diverse content mix across multiple documents");
}

if (insights.length > 0) {
  dv.list(insights);
} else {
  dv.paragraph("*Analyzing publishing patterns...*");
}
```

## 📊 Historical Context

```dataviewjs
// Show publishing trend for the past 7 days
const currentDate = dv.current().date;
const past7Days = [];

for(let i = 6; i >= 0; i--) {
  const date = moment(currentDate).subtract(i, 'days').format('YYYY-MM-DD');
  const dayData = dv.pages()
    .where(p => p.type === 'publishing-dashboard' && p.date === date)
    .first();
  
  past7Days.push({
    date: date,
    docs: dayData?.documentCount || 0,
    channels: dayData?.channels?.length || 0
  });
}

// Create trend chart
const trendHtml = `
  <div class="trend-chart">
    <h4>7-Day Publishing Trend</h4>
    <div class="trend-bars">
      ${past7Days.map(day => `
        <div class="trend-day">
          <div class="trend-bar" style="height: ${(day.docs / 5 * 50)}px; background: var(--color-accent)">
            <span class="trend-value">${day.docs}</span>
          </div>
          <div class="trend-label">${moment(day.date).format('ddd')}</div>
        </div>
      `).join('')}
    </div>
  </div>
`;

dv.container.innerHTML = trendHtml;
```

## 📝 Notes & Ideas

> **Action Items for Next Publishing Cycle:**
> - [ ] Analyze which channels had highest engagement
> - [ ] Plan content calendar for next week
> - [ ] Review posting times for optimization
> - [ ] Consider expanding to underutilized channels

## 🔗 Quick Links

- [[Publishing Strategy]] - Overall content strategy
- [[Content Calendar]] - Planned publishing schedule  
- [[Analytics Dashboard]] - Performance tracking
- [[Channel Guidelines]] - Platform-specific best practices

---
*Dashboard generated on <% tp.date.now("YYYY-MM-DD HH:mm") %> | [[<% tp.date.now("YYYY-MM-DD", -1, tp.frontmatter.date, "YYYY-MM-DD") %>|← Previous]] | [[<% tp.date.now("YYYY-MM-DD", 1, tp.frontmatter.date, "YYYY-MM-DD") %>|Next →]]*