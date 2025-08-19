import { useRef, useState } from "react";
import { useEffect } from "react";
import { HeatmapBoxesList } from "src/components/HeatmapBoxesList/HeatmapBoxesList";
import { HeatmapMonthsList } from "src/components/HeatmapMonthsList/HeatmapMonthsList";
import { HeatmapWeekDays } from "src/components/HeatmapWeekDays/HeatmapWeekDays";
import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { useAppContext } from "src/main";
import { getDailyNote, createDailyNote, getAllDailyNotes } from "obsidian-daily-notes-interface";
import moment from "moment";

function HeatmapTrackerView() {
  const { boxes } = useHeatmapContext();
  const app = useAppContext();

  const graphRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    graphRef.current?.scrollTo?.({
      top: 0,
      left:
        (graphRef.current?.querySelector(".today") as HTMLElement)?.offsetLeft -
        graphRef.current?.offsetWidth / 2,
    });

    setIsLoading(false);
  }, [boxes]);

  const handleBoxClick = async (box: any) => {
    // Only log for debugging if needed
    if (window.location.search.includes('debug')) {
      console.log('📅 HeatmapBox clicked:', { 
        date: box.date, 
        metadata: box.metadata,
        documentCount: box.metadata?.documentCount,
        hasMetadata: !!box.metadata,
        isMultiDocument: box.metadata && box.metadata.documentCount > 1,
        isSingleDocument: box.metadata && box.metadata.documentCount === 1
      });
    }
    
    if (!box.date) return;
    const date = moment(box.date);
    
    // Check if this is a multi-document date
    if (box.metadata && box.metadata.documentCount > 1) {
      // Multi-document: create dashboard
      await createPublishingDashboard(date, box.metadata);
      return; // Important: exit here to prevent fallthrough
    } 
    
    if (box.metadata && box.metadata.documentCount === 1) {
      // Single document: navigate directly
      const doc = box.metadata.documents[0];
      const file = app.vault.getAbstractFileByPath(doc.path);
      if (file) {
        app.workspace.openLinkText(file.name, file.path);
        return; // Important: exit here to prevent fallthrough
      }
    }
    
    // Fallback: create daily note (for empty dates or when document not found)
    const allDailyNotes = getAllDailyNotes();
    let file = getDailyNote(date, allDailyNotes);
    if (!file) {
      file = await createDailyNote(date);
    }
    app.workspace.openLinkText(file.basename, file.path);
  };

  // Dashboard creation function using Templater
  const createPublishingDashboard = async (date: moment.Moment, metadata: any) => {
    const dashboardFolder = 'Dashboards/Publishing';
    const dashboardPath = `${dashboardFolder}/${date.format('YYYY-MM-DD')}.md`;
    
    // Ensure dashboard folder exists
    const folderExists = await app.vault.adapter.exists(dashboardFolder);
    if (!folderExists) {
      await app.vault.createFolder(dashboardFolder);
    }
    
    // Check if dashboard already exists
    const existingFile = app.vault.getAbstractFileByPath(dashboardPath);
    if (existingFile) {
      app.workspace.openLinkText(existingFile.name, existingFile.path);
      return;
    }
    
    // Try to use Templater plugin for dynamic generation
    const templaterPlugin = (app as any).plugins.plugins['templater-obsidian'];
    
    if (templaterPlugin && templaterPlugin.templater) {
      try {
        // Set up template variables for Templater
        const templateContext = {
          date: date.format('YYYY-MM-DD'),
          dayName: date.format('dddd'),
          documentCount: metadata.documentCount,
          channels: metadata.channels,
          documents: metadata.documents,
          coverage: Math.round((metadata.channels.length / 6) * 100),
          metadata: JSON.stringify(metadata)
        };
        
        // Use Templater to create from template
        const templatePath = 'EXAMPLE_VAULT/templates/Publishing Dashboard.md';
        const templateFile = app.vault.getAbstractFileByPath(templatePath);
        
        if (templateFile) {
          // Create new file from template using Templater API
          const newFile = await templaterPlugin.templater.create_new_note_from_template(
            templateFile,
            '',
            false,
            dashboardPath.replace('.md', ''),
            templateContext
          );
          
          // Open the created file
          if (newFile) {
            app.workspace.openLinkText(newFile.basename, newFile.path);
          } else {
            // Try to open by path if newFile is null
            const createdFile = app.vault.getAbstractFileByPath(dashboardPath);
            if (createdFile) {
              app.workspace.openLinkText(createdFile.name, createdFile.path);
            }
          }
        } else {
          // Fallback to manual creation if template not found
          const dashboardContent = generateDashboardContent(date, metadata);
          const newFile = await app.vault.create(dashboardPath, dashboardContent);
          app.workspace.openLinkText(newFile.basename, newFile.path);
        }
        
        new (window as any).Notice(`Dashboard generated for ${date.format('YYYY-MM-DD')}`);
      } catch (error) {
        console.error('Templater integration failed:', error);
        // Fallback to manual creation
        const dashboardContent = generateDashboardContent(date, metadata);
        const newFile = await app.vault.create(dashboardPath, dashboardContent);
        app.workspace.openLinkText(newFile.basename, newFile.path);
        new (window as any).Notice(`Dashboard created for ${date.format('YYYY-MM-DD')} (fallback)`);
      }
    } else {
      // Fallback if Templater not available
      const dashboardContent = generateDashboardContent(date, metadata);
      const newFile = await app.vault.create(dashboardPath, dashboardContent);
      app.workspace.openLinkText(newFile.basename, newFile.path);
      new (window as any).Notice(`Dashboard created for ${date.format('YYYY-MM-DD')} (no Templater)`);
    }
  };

  // Generate dashboard content (fallback when Templater not available)
  const generateDashboardContent = (date: moment.Moment, metadata: any) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dayName = date.format('dddd');
    const coverage = Math.round((metadata.channels.length / 6) * 100);
    
    // Generate document list with channels
    const documentList = metadata.documents
      .map((doc: any) => {
        const channels = doc.channels.length > 0 
          ? ` (${doc.channels.join(', ')})`
          : '';
        return `- [[${doc.name}]]${channels}`;
      })
      .join('\n');
    
    // Generate channel summary
    const channelSummary = metadata.channels.length > 0
      ? metadata.channels.map((ch: string) => `#${ch}`).join(' ')
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
- **Channel Coverage**: ${coverage}% (${metadata.channels.length}/6 channels)
- **Channel Mix**: ${channelSummary}

## 📄 Published Documents
${documentList}

## 📊 Analytics

\`\`\`dataviewjs
// Document breakdown by channel
const docs = [
${metadata.documents.map((doc: any) => `  { name: "${doc.name}", channels: [${doc.channels.map((ch: string) => `"${ch}"`).join(', ')}] }`).join(',\n')}
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
if (Object.keys(channelCounts).length > 0) {
  dv.table(["Channel", "Count"], 
    Object.entries(channelCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([channel, count]) => [channel, count])
  );
} else {
  dv.paragraph("No channel data available");
}
\`\`\`

## 🎯 Publishing Insights

\`\`\`dataviewjs
// Generate insights based on publishing patterns
const insights = [];

if (${metadata.documentCount} > 3) {
  insights.push("🔥 High publishing volume - excellent consistency!");
}

if (${metadata.channels.length} >= 4) {
  insights.push("🌍 Strong multi-channel distribution strategy");
}

const channels = [${metadata.channels.map((ch: string) => `"${ch}"`).join(', ')}];

if (channels.includes('linkedin')) {
  insights.push("💼 Professional presence maintained on LinkedIn");
}

if (channels.includes('substack')) {
  insights.push("📝 Long-form content strategy with Substack");
}

if (channels.includes('twitter') && channels.includes('instagram')) {
  insights.push("📱 Good balance of text and visual content");
}

if (insights.length > 0) {
  dv.list(insights);
} else {
  dv.paragraph("*Analyzing publishing patterns...*");
}
\`\`\`

## 📝 Notes
<!-- Add any additional notes about this day's publishing activity -->

---
*Dashboard generated on ${new Date().toISOString().slice(0, 16)}*
`;
  };

  return (
    <div
      className={`heatmap-tracker ${
        isLoading ? "heatmap-tracker-loading" : ""
      }`}
    >
      <HeatmapWeekDays />
      <div className="heatmap-tracker-graph" ref={graphRef}>
        <HeatmapMonthsList />

        <HeatmapBoxesList boxes={boxes} onBoxClick={handleBoxClick} />
      </div>
    </div>
  );
}

export default HeatmapTrackerView;
