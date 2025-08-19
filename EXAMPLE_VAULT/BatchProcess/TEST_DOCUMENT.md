---
publishDraftDate: 2025-08-19
twitter: false
instagram: true
linkedin: true
tiktok: true
facebook: true
substack: true
steps: "30000"
learning: 123 minutes
exercise: 60 minutes
excerpt: Testing the new multi-channel publishing heatmap functionality with enhanced intensity calculation and dashboard generation.
tags:
  - test
  - publishing
  - multi-channel
created: 2025-08-19
---

# Test Document for Multi-Channel Publishing

This is a test document to validate the new multi-channel publishing heatmap functionality.

## Publishing Details

- **Date**: 2025-08-19
- **Channels**: Twitter, Instagram, Substack
- **Content Type**: Technical article
- **Target Audience**: Content creators and developers

## Test Scenarios

### Single Document Date
If this is the only document published on 2025-08-19:
- Should show clean cell with no badge
- Hover should show document title only
- Click should navigate directly to this document

### Multi-Document Date
If there are other documents published on 2025-08-19:
- Should show document count badge
- Should show channel indicator dots
- Click should create analytics dashboard

## Expected Intensity Calculation

With channels: twitter, instagram, substack
- Channel count: 3
- Document count: 1 (if alone) or X (if with others)
- Intensity: documentCount × (1 + 3 × 0.5) = documentCount × 2.5

## Visual Indicators Expected

### Channel Dots
- 🔵 Twitter (#1DA1F2)
- 🔴 Instagram (#E4405F) 
- 🟠 Substack (#FF6719)

### Document Badge
- If 2+ documents: Colored badge with count
- Colors: Blue → Green → Orange → Red

## Dashboard Features Expected

When clicked (if multi-document):
- Summary stats
- Channel distribution chart
- Document list with links
- AI-generated insights
- Performance tracking section

---
*Test document created for multi-channel heatmap validation*