import { useHeatmapContext } from "src/context/heatmap/heatmap.context";
import { getIntensitiesInfo, getEntriesIntensities } from "src/utils/intensity";

function LegendView() {
  const { trackerData, colorsList, intensityConfig } = useHeatmapContext();

  const intensities = getEntriesIntensities(trackerData.entries);

  const intensitiesInfo = getIntensitiesInfo(
    intensities,
    intensityConfig,
    colorsList ?? []
  );

  return (
    <div className="legend-view">
      <table>
        <thead>
          <tr>
            <th>Intensity</th>
            <th>Range</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {intensitiesInfo.map((intensityInfo, index) => (
            <tr key={index}>
              <td>{intensityInfo.intensity}</td>
              <td>
                {intensityInfo.min.toFixed(2)} - {intensityInfo.max.toFixed(2)}
              </td>
              <td className="legend-view__color-cell">
                <div
                  style={{
                    backgroundColor: colorsList[index],
                  }}
                  className="heatmap-tracker-box"
                ></div>
                <span style={{ marginLeft: "10px" }}>{colorsList[index]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LegendView;
