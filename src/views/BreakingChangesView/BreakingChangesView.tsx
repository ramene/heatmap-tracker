export function BreakingChangesView() {
  //background: repeating-linear-gradient(45deg, black, black 35px, yellow 35px, yellow 70px);
  // padding: 8px

  // padding 8px

  return (
    <div className="breaking-changes-view__maintenance-border">
      <div className="breaking-changes-view__container">
        <div>Heatmap Tracker 1.8 Breaking change</div>
        <div>
          You see this scree because your're using colors property in
          trackerData which is not supported anymore.
        </div>

        <div>Complete these steps to make it work:</div>

        <ul>
          <li>
            Replace <code>colors</code> property with <code>colorScheme</code>.
          </li>
          <li>
            If you're using palette (default or your own from settings), do this
            change: <br />
            <ul>
              <li>
                <code>
                  {`colorScheme: {
           paletteName: "default" // or the name of your palette
               }`}
                </code>
              </li>
            </ul>
          </li>
          <li>
            If you're using the list of colors, do this change: <br />
            <ul>
              <li>
                <code>{`colorScheme: {
               customColors: ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"]
             }`}</code>
              </li>
            </ul>
          </li>
        </ul>
        <div>
          Info: since version 1.8.0 colors interface was updated and
          significantly improved (code-wise). Now it's more flexible.
        </div>
      </div>
    </div>
  );
}
