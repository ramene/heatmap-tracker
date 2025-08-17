import { App, TFile, Notice } from 'obsidian';
import moment from 'moment';
import { MultiDocumentMetadata, ClickAction } from '../types/enhanced';

/**
 * Create or open a publishing dashboard for a specific date
 */
export async function createPublishingDashboard(
  app: App,
  date: moment.Moment,
  metadata: MultiDocumentMetadata
): Promise<void> {
  const dashboardFolder = 'Dashboards/Publishing';
  const dashboardPath = `${dashboardFolder}/${date.format('YYYY-MM-DD')}.md`;
  
  // Ensure dashboard folder exists
  const folderExists = await app.vault.adapter.exists(dashboardFolder);
  if (!folderExists) {
    await app.vault.createFolder(dashboardFolder);
  }
  
  // Check if dashboard already exists
  const existingFile = app.vault.getAbstractFileByPath(dashboardPath);
  if (existingFile && existingFile instanceof TFile) {
    // Open existing dashboard
    await app.workspace.openLinkText(existingFile.basename, existingFile.path);
    return;
  }
  
  // Create new dashboard content
  const dashboardContent = generateDashboardContent(date, metadata);
  
  // Create the file
  const newFile = await app.vault.create(dashboardPath, dashboardContent);
  
  // Open the newly created dashboard
  await app.workspace.openLinkText(newFile.basename, newFile.path);
  
  new Notice(`Dashboard created for ${date.format('YYYY-MM-DD')}`);
}

/**
 * Generate dashboard content without Templater
 * (Fallback when Templater is not available)
 */
function generateDashboardContent(
  date: moment.Moment,
  metadata: MultiDocumentMetadata
): string {
  const dateStr = date.format('YYYY-MM-DD');
  const dayName = date.format('dddd');
  
  // Generate document list with channels
  const documentList = metadata.documents
    .map(doc => {
      const channels = doc.channels.length > 0 
        ? ` (${doc.channels.join(', ')})`
        : '';
      return `- [[${doc.path}|${doc.name}]]${channels}`;
    })
    .join('\n');
  
  // Generate channel summary
  const channelSummary = metadata.channels.length > 0
    ? metadata.channels.map(ch => `#${ch}`).join(' ')
    : 'No channels specified';
  
  return `---
date: ${dateStr}
type: publishing-dashboard
documentCount: ${metadata.documentCount}
channels: [${metadata.channels.join(', ')}]
cssclass: publishing-dashboard
---

# 📊 Publishing Dashboard - ${dayName}, ${dateStr}

## 📈 Summary
- **Documents Published**: ${metadata.documentCount}
- **Channels Used**: ${metadata.channels.length}
- **Intensity Score**: ${metadata.intensity || 'N/A'}

## 📱 Channel Distribution
${channelSummary}

## 📄 Published Documents
${documentList}

## 📊 Analytics

\`\`\`dataviewjs
// Document breakdown by channel
const currentPage = dv.current();
const docs = [
${metadata.documents.map(doc => `  { name: "${doc.name}", channels: [${doc.channels.map(ch => `"${ch}"`).join(', ')}] }`).join(',\n')}
];

// Count documents per channel
const channelCounts = {};
docs.forEach(doc => {
  doc.channels.forEach(channel => {
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  });
});

// Display channel statistics
dv.header(3, "Documents per Channel");
dv.table(["Channel", "Count"], 
  Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([channel, count]) => [channel, count])
);
\`\`\`

## 🎯 Publishing Insights

\`\`\`dataviewjs
// Generate insights based on publishing patterns
const insights = [];

if (${metadata.documentCount} > 3) {
  insights.push("High publishing volume - great consistency!");
}

if (${metadata.channels.length} >= 4) {
  insights.push("Excellent multi-channel distribution");
}

if (${metadata.channels.includes('linkedin') ? 'true' : 'false'}) {
  insights.push("LinkedIn presence maintained - good for professional reach");
}

if (insights.length > 0) {
  dv.list(insights);
} else {
  dv.paragraph("*No specific insights for this publishing day*");
}
\`\`\`

## 📝 Notes
<!-- Add any additional notes about this day's publishing activity -->

---
*Dashboard generated on ${moment().format('YYYY-MM-DD HH:mm')}*
`;
}

/**
 * Navigate to a single document
 */
export async function navigateToDocument(
  app: App,
  metadata: MultiDocumentMetadata
): Promise<void> {
  if (metadata.documents.length === 0) {
    new Notice('No document to navigate to');
    return;
  }
  
  const doc = metadata.documents[0];
  const file = app.vault.getAbstractFileByPath(doc.path);
  
  if (file && file instanceof TFile) {
    await app.workspace.openLinkText(file.basename, file.path);
  } else {
    new Notice(`Document not found: ${doc.name}`);
  }
}

/**
 * Handle enhanced box click with action-based navigation
 */
export async function handleEnhancedBoxClick(
  app: App,
  box: any,
  action: ClickAction
): Promise<void> {
  const date = moment(box.date);
  
  switch(action) {
    case 'dashboard':
      if (box.metadata) {
        await createPublishingDashboard(app, date, box.metadata);
      }
      break;
      
    case 'navigate':
      if (box.metadata) {
        await navigateToDocument(app, box.metadata);
      }
      break;
      
    case 'create':
      // Use existing daily note creation logic
      // This would be imported from the existing codebase
      const { createDailyNote, getDailyNote, getAllDailyNotes } = (window as any).app.plugins.getPlugin('daily-notes-interface');
      const allDailyNotes = getAllDailyNotes();
      let file = getDailyNote(date, allDailyNotes);
      if (!file) {
        file = await createDailyNote(date);
      }
      await app.workspace.openLinkText(file.basename, file.path);
      break;
  }
}