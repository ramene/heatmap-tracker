# 📊 Dashboard Regeneration Guide

Complete guide to refreshing and regenerating publishing dashboards in the Multi-Channel Heatmap Tracker.

## 🎯 **Problem Solved**

Previously, dashboards were created once and never updated, even when source documents changed. Now you have multiple ways to force regeneration and capture the latest changes.

## 🔄 **Regeneration Methods**

### **1. Force Regeneration with Modifier Keys**
**How**: Hold `Shift`, `Ctrl`, or `⌘ Cmd` while clicking multi-document cells
**When**: Anytime you want to force refresh without checking staleness
**Behavior**: Bypasses all checks, deletes existing dashboard, creates fresh one

```
✅ Shift + Click → Force regenerate
✅ Ctrl + Click → Force regenerate  
✅ ⌘ Cmd + Click → Force regenerate
```

### **2. Automatic Staleness Detection**
**How**: Regular click on multi-document cells
**When**: Automatically detects if source documents are newer than dashboard
**Behavior**: Shows confirmation dialog if regeneration is recommended

**Detection Logic**:
- Compares dashboard modification time with source document modification times
- If ANY source document is newer, triggers regeneration dialog
- User chooses: "🔄 Regenerate" or "📖 Open Existing"

### **3. Visual Refresh Instructions**
**Where**: Inside generated dashboards
**Content**: Clear instructions for users on how to refresh

```markdown
> 🔄 **Refresh Dashboard**: Hold **Shift** and click the date cell to regenerate with latest changes
> 📅 **Quick Regenerate**: Use `Shift+Click` on multi-document cells for instant refresh
```

## 🔧 **Technical Implementation**

### **Enhanced Dashboard Creation Function**
```typescript
const createPublishingDashboard = async (
  date: moment.Moment, 
  metadata: any, 
  forceRegenerate = false
) => {
  // Smart regeneration logic
  let shouldRegenerate = forceRegenerate;
  
  if (existingFile && !forceRegenerate) {
    // Auto-staleness detection
    const dashboardModified = existingFile.stat.mtime;
    const sourceDocuments = metadata.documents || [];
    
    let newestSourceTime = 0;
    for (const doc of sourceDocuments) {
      const sourceFile = app.vault.getAbstractFileByPath(doc.path);
      if (sourceFile && sourceFile.stat.mtime > newestSourceTime) {
        newestSourceTime = sourceFile.stat.mtime;
      }
    }
    
    // Suggest regeneration if sources are newer
    if (newestSourceTime > dashboardModified) {
      shouldRegenerate = await showRegenerationDialog(date.format('YYYY-MM-DD'));
    }
  }
}
```

### **Modifier Key Detection**
```typescript
const handleBoxClick = async (box: any, event?: React.MouseEvent) => {
  // Detect modifier keys for force regeneration
  const forceRegenerate = event && (event.shiftKey || event.ctrlKey || event.metaKey);
  
  if (box.metadata && box.metadata.documentCount > 1) {
    await createPublishingDashboard(date, box.metadata, !!forceRegenerate);
  }
}
```

### **Smart Regeneration Dialog**
```typescript
const showRegenerationDialog = async (dateStr: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const modal = new Modal(app);
    modal.contentEl.innerHTML = `
      <div style="padding: 20px;">
        <h3>📊 Dashboard Update Available</h3>
        <p>Source documents for <strong>${dateStr}</strong> have been modified...</p>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button class="mod-cta regenerate-btn">🔄 Regenerate</button>
          <button class="open-existing-btn">📖 Open Existing</button>
        </div>
      </div>
    `;
    // Event handlers...
  });
};
```

## 📋 **Usage Scenarios**

### **Scenario 1: Updated Document Channels**
You added Instagram and TikTok channels to a document after creating the dashboard.

**Solution**: 
1. Regular click on the multi-document cell
2. System detects document was modified after dashboard creation  
3. Choose "🔄 Regenerate" in the dialog
4. Dashboard refreshes with new channel information

### **Scenario 2: Added New Documents**
You published additional content for the same date after creating the dashboard.

**Solution**:
1. `Shift + Click` on the multi-document cell
2. Forces immediate regeneration without questions
3. Dashboard includes all current documents for that date

### **Scenario 3: Changed Document Content**
You updated excerpts, titles, or metadata in source documents.

**Solution**:
1. Regular click triggers staleness detection
2. Automatic dialog appears offering regeneration
3. Choose to regenerate for latest content

## 🎨 **User Experience Features**

### **Visual Feedback**
- ✅ "Regenerating dashboard for 2025-08-19..." notice
- ✅ Clear refresh instructions in dashboard header
- ✅ Professional confirmation dialog with branded buttons

### **Smart Defaults**
- ✅ Auto-detection prevents unnecessary regeneration
- ✅ Modifier keys provide instant override
- ✅ Graceful fallback if Templater unavailable

### **Performance Optimizations**  
- ✅ Only checks staleness when needed
- ✅ Efficient file modification time comparison
- ✅ Minimal UI blocking with async operations

## 🚀 **Benefits**

1. **Always Current**: Dashboards reflect latest document changes
2. **User Control**: Multiple regeneration methods for different workflows
3. **Intelligent**: Auto-detection prevents unnecessary work
4. **Fast**: Modifier keys provide instant regeneration
5. **Transparent**: Clear instructions and feedback

## 🔮 **Future Enhancements**

Potential additional features:
- **Auto-refresh on document save**: Watch file system for changes
- **Batch regeneration**: Update multiple dashboards at once  
- **Version history**: Track dashboard regeneration history
- **Smart notifications**: Background staleness monitoring

---
*Generated as part of the Multi-Channel Heatmap Tracker dashboard regeneration system*