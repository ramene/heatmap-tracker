export function DocumentationView() {
  const codeString = `
  const trackerData = {
    entries: [{
        date: "2021-01-01",
        intensity: 1,
        customColor: "#ff0000",
    }],
    colorScheme: {
        paletteName: "default", // or customColors
        customColors: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"]
    },
    separateMonths: true,
    heatmapTitle: "This is the title for your heatmap",
    heatmapSubtitle: "This is the subtitle for your heatmap. You can use it as a description.",
    showCurrentDayBorder: true,
    defaultEntryIntensity: 4,
    intensityScaleStart: 1,
    intensityScaleEnd: 5
}
  `;

  return (
    <div className="documentation-view__container">
      <p><strong>Actual Heatmap Tracker API</strong></p>
      <div className="breaking-changes-view__maintenance-border">
        <div className="breaking-changes-view__container">
          Since version <code>1.9</code> <code>colors</code> property is
          removed. Please, remove <code>colors</code> and use{" "}
          <code>colorScheme</code> instead (check example below).
        </div>
      </div>

      <p>You can disable Christmas effect in plugin settings 🎄</p>
      <pre>
        <code>{codeString}</code>
      </pre>
    </div>
  );
}
