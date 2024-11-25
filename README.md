# Heatmap Tracker plugin for Obsidian

The **Heatmap Tracker** plugin is a versatile and visually appealing tool for tracking data over a calendar year. This plugin empowers you to create beautiful heatmaps for various purposes, such as habit tracking, project progress, or data visualization directly within Obsidian. Below is a comprehensive overview of its features, usage, and development opportunities.

<img src="./public/two-mac-mockup.png" />


This plugin is useful for tracking progress for exercise, finances, social time, project progression, passions, learning progress and so on.   

To be used with [Obsidian Dataview](https://blacksmithgu.github.io/obsidian-dataview/), but could be used standalone or with other plugins as well (if you know some javascript).


## 📦 Plugin Features

### ✅ Key Features:
1. **Yearly Heatmap Visualization**  
   Render a dynamic heatmap for the selected year, displaying data intensity for each day.
   
2. **Customizable Colors and Intensity**  
   Define your own color schemes and intensity ranges to match your data's theme.

3. **Interactive Navigation**  
   Easily switch between years using left and right navigation arrows.

4. **Flexible Data Entries**  
   Add entries with customizable colors, intensity levels, and tooltips for detailed content.

5. **Monthly Separation Option**  
   Choose whether to separate months visually within the heatmap.

6. **Current Day Highlight**  
   Optionally display a border around the current day for easy identification.


### Preview of Heatmap Tracker component

<img alt="" src="./public/preview.gif">

<img src="./public/mac-mockup-dark.png" />

## 📖 How to use

1. Annotate the data you want to track in your daily notes (see [Dataview annotation documentation](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/)) 

2. Create a [DataviewJS block](https://blacksmithgu.github.io/obsidian-dataview/api/intro/) where you want the Heatmap Tracker to display.  

3. Collect the data you want to display using [DataviewJS](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/)

4. Pass the data into Heatmap Tracker using  **renderHeatmapTracker()** 

<img src="./public/tracker-overview.png">

### 🌟 Example Usage

Below is an example JavaScript snippet to use the Heatmap Tracker:

~~~javascript
/```dataviewjs

// Update this object
const trackerData = {
    year: 2024,
    entries: [],
    separateMonths: true
}

// in dv.pages set your folder name
// in where add frontmatter property
for(let page of dv.pages('"daily notes"').where(p=>p.exercise)){
    trackerData.entries.push({
        date: page.file.name,
        intensity: page.exercise,
        content: await dv.span(`[](${page.file.name})`)
    });
}

dv.paragraph("** NAME OF THE HEATMAP **");

renderHeatmapTracker(this.container, trackerData);
```
~~~
> **Tip:** Replace `trackerData` with your own dataset to visualize custom data points.

## Development (Windows/Mac):

 ```npm run dev``` - will start an automatic TS to JS transpiler and automatically copy the generated JS/CSS/manifest files to the example vault when modified (Remember to run ```npm install``` first).

 After the files have been transpiled, the **hot-reload plugin** (https://github.com/pjeby/hot-reload) then reloads Obsidian automatically.
 Hot-reload is installed in the example vault by default. its used to avoid restarting obsidian after every change to code.  
 *(remember to add an empty *.hotreload* file to "EXAMPLE_VAULT/.obsidian/plugins/heatmap-tracker/" if not already present, as this tells hot-reload to watch for changes)*


```npm run build``` generates the files ready for distribution.

&nbsp;

Tip: ```ctrl-shift-i``` opens the devtools inside Obsidian.

&nbsp;



## Technical Explanation
All the plugin does, is add the function ***renderHeatmapTracker()*** to the global namespace of you vault.

**"this.container"** is passed as the first argument because the plugin needs to know where to render the tracker. You don't have to worry about this.

"renderHeatmapTracker()" then takes **"trackerData"** as the secondary argument. This is the javascript object you have to create yourself in order to give plugin instructions and data. Most of the properties are optional, but you have to supply an entries array as an absolute minimum.  

See the beginning of the readme for the full code example.

### Absolute minimum code example:
~~~javascript
\```dataviewjs

const trackerData = {
    entries: [],                
}

renderHeatmapTracker(this.container, trackerData)

```
~~~
