![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/caronchen/obsidian-chartsview-plugin) ![GitHub all releases](https://img.shields.io/github/downloads/caronchen/obsidian-chartsview-plugin/total) ![GitHub Release Date](https://img.shields.io/github/release-date/caronchen/obsidian-chartsview-plugin) ![GitHub last commit](https://img.shields.io/github/last-commit/caronchen/obsidian-chartsview-plugin)

# Obsidian Charts View Plugin

This is a data visualization plugin for [Obsidian](https://obsidian.md), based on [Ant Design Charts](https://charts.ant.design/). Support plots and graphs.

- [Obsidian Charts View Plugin](#obsidian-charts-view-plugin)
  - [Chart Templates](#chart-templates)
    - [Word Count](#word-count)
      - [Multi files](#multi-files)
      - [ALL files](#all-files)
      - [Folder](#folder)
    - [Pie](#pie)
    - [WordCloud](#wordcloud)
    - [Treemap](#treemap)
    - [DualAxes](#dualaxes)
    - [Mix](#mix)
    - [Bar](#bar)
    - [OrganizationTreeGraph](#organizationtreegraph)
    - [Radar](#radar)
    - [TinyLine](#tinyline)
    - [Dataviewjs Example (Column)](#dataviewjs-example-column)
  - [Data from CSV file](#data-from-csv-file)
    - [Import data from external CSV file (Desktop)](#import-data-from-external-csv-file-desktop)
    - [Load data from internal CSV file](#load-data-from-internal-csv-file)
      - [Multi CSV files](#multi-csv-files)
  - [Dataview Plugin Integration](#dataview-plugin-integration)
    - [Examples](#examples)
      - [Folder Count](#folder-count)
      - [Year Count](#year-count)
      - [Day and Night Count](#day-and-night-count)
      - [Hour Count](#hour-count)
      - [Date Count](#date-count)
      - [Task Count](#task-count)
    - [Allowed methods](#allowed-methods)
  - [Manually installing the plugin](#manually-installing-the-plugin)
  - [Ant Design Charts Demos](#ant-design-charts-demos)

## Chart Templates
### Word Count
Use command `Insert Template...` -> `Word Count` to insert code block.
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: WordCloud

#-----------------#
#- chart data    -#
#-----------------#
data: "wordcount:Words"

#-----------------#
#- chart options -#
#-----------------#
options:
  wordField: "word"
  weightField: "count"
  colorField: "count"
  wordStyle:
    rotation: 30
```
![image](https://user-images.githubusercontent.com/150803/136478725-be28a56b-0075-4f0a-a719-f61b30e83b6a.png)

#### Multi files
```
data: "wordcount:Words,PARA,@Inbox/"
```

#### ALL files
```
data: "wordcount:/"
```

#### Folder
```
data: "wordcount:@Inbox/"
```

### Pie
Use command `Insert Template` -> `Pie` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069882-87c95700-ba19-11eb-8cef-02d1e021d1a2.png)


### WordCloud
Use command `Insert Template...` -> `WordCloud` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069991-bba47c80-ba19-11eb-873f-847563daea39.png)


### Treemap
Use command `Insert Template...` -> `Treemap` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119070047-decf2c00-ba19-11eb-9d59-21c051da593c.png)

### DualAxes
Use command `Insert Template...` -> `DualAxes` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119969638-618b5480-bfe1-11eb-8a36-0a5d60408b00.png)

### Mix
Use `data.<any name>` and `options.<any name>` to set data and options. Keep data and options `<any name>` same.

Use command `Insert Template...` -> `Mix` to insert code block.

![image](https://user-images.githubusercontent.com/150803/120421841-a1638a80-c399-11eb-9464-d773931fdd6f.png)

### Bar
Use command `Insert Template...` -> `Bar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117024-fa43b180-d473-11eb-84eb-8e1806ce5dec.png)

### OrganizationTreeGraph
Use command `Insert Template...` -> `OrganizationTreeGraph` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117254-2b23e680-d474-11eb-845f-0d663a458fa7.png)

### Radar
Use command `Insert Template...` -> `Radar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117394-4a227880-d474-11eb-8a11-23f3cd482251.png)

### TinyLine
Use command `Insert Template...` -> `TinyLine` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117476-5a3a5800-d474-11eb-9db8-4b3785bb010c.png)

### Dataviewjs Example (Column)
Chart data by dataviewjs.
Use command `Insert Template...` -> `Dataviewjs Example (Column)` to insert code block.

![image](https://user-images.githubusercontent.com/150803/140684190-fa6a08ea-3394-44fe-ae92-265810f6b9a9.png)

## Data from CSV file

### Import data from external CSV file (Desktop)
Use command `Import data from external CSV file` to insert data from CSV file.

### Load data from internal CSV file
Load CSV file from data path.
Data path should be specified in settings.

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Mix

#-----------------#
#- chart data    -#
#-----------------#
data.area:
  - time: 1246406400000
    temperature: [14.3, 27.7]
  - time: 1246492800000
    temperature: [14.5, 27.8]
  - time: 1246579200000
    temperature: [15.5, 29.6]
  - time: 1246665600000
    temperature: [16.7, 30.7]
  - time: 1246752000000
    temperature: [16.5, 25.0]
  - time: 1246838400000
    temperature: [17.8, 25.7]

data.line: LineData.csv

#-----------------#
#- chart options -#
#-----------------#
options:
  appendPadding: 8
  syncViewPadding: true
  tooltip:
    shared: true
    showMarkers: false
    showCrosshairs: true
    offsetY: -50

options.area:
  axes: {}
  meta:
    time:
      type: 'time'
      mask: 'MM-DD'
      nice: true
      tickInterval: 172800000
      range: [0, 1]
    temperature:
      nice: true
      sync: true
      alias: '温度范围'
  geometries:
    - type: 'area'
      xField: 'time'
      yField: 'temperature'
      mapping: {}

options.line:
  axes: false
  meta:
    time:
      type: 'time'
      mask: 'MM-DD'
      nice: true
      tickInterval: 172800000
      range: [0, 1]
    temperature:
      sync: 'temperature'
      alias: '温度'
  geometries:
    - type: 'line'
      xField: 'time'
      yField: 'temperature'
      mapping: {}
    - type: 'point'
      xField: 'time'
      yField: 'temperature'
      mapping:
        shape: 'circle'
        style:
          fillOpacity: 1
```

#### Multi CSV files

```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: DualAxes

#-----------------#
#- chart data    -#
#-----------------#
data: DualAxesData.csv, DualAxesData.csv

#-----------------#
#- chart options -#
#-----------------#
options:
  xField: 'time'
  yField: ['value', 'count']
  yAxis:
    value:
      min: 0
      label:
        formatter:
          function formatter(val) {
            return ''.concat(val, '个');
          }
  geometryOptions:
    - geometry: 'column'
    - geometry: 'line'
      lineStyle:
	    lineWidth: 2
```

## Dataview Plugin Integration

### Examples

#### Folder Count
```
#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.folder)
		   .map(p => ({folder: p.key || "ROOT", count: p.rows.length}))
		   .array();
```
![image](https://user-images.githubusercontent.com/150803/140684190-fa6a08ea-3394-44fe-ae92-265810f6b9a9.png)

#### Year Count
```
#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.cday.toFormat("yyyy/MM"))
           .map(p => ({cdate: p.key, count: p.rows.length}))
           .array();
```
<img width="1207" alt="image" src="https://user-images.githubusercontent.com/150803/165743596-95f5c93c-1bc4-47ec-872d-adc5041b7fff.png">


#### Day and Night Count
```
#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.ctime.hour >= 8 && p.file.ctime.hour <= 18 ? 'Day' : 'Night')
		   .map(p => ({cdate: p.key, count: p.rows.length}))
		   .array();
```
![image](https://user-images.githubusercontent.com/150803/140925371-7d645640-db9b-4e43-8828-24b084f298db.png)

#### Hour Count
```
#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.ctime.toFormat("HH"))
		   .map(p => ({cdate: p.key, count: p.rows.length}))
		   .array();
```
![image](https://user-images.githubusercontent.com/150803/140925719-a7a1e1c9-c682-4e9b-a491-e103537052de.png)

#### Date Count
```
#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .groupBy(p => p.file.cday.toFormat("yyyy/MM"))
		   .map(p => ({cdate: p.key, count: p.rows.length}))
		   .array();
```
![image](https://user-images.githubusercontent.com/150803/140925781-6d601a13-db73-454b-96af-d3def8cc00e1.png)

#### Task Count
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Column

#-----------------#
#- chart data    -#
#-----------------#
data: |
  dataviewjs:
  return dv.pages()
           .flatMap(page => page.file.tasks)
           .groupBy(task => ({completion: task.completion?? task.created.toFormat("yyyy/MM/dd"), status: task.completed ? 'Done' : 'Undone'}))
           .map(group => ({cdate: group.key.completion, status: group.key.status, count: group.rows.length}))
           .array();

#-----------------#
#- chart options -#
#-----------------#
options:
  isStack: true
  xField: "cdate"
  yField: "count"
  seriesField: 'status'
  label:
    position: "middle"
  xAxis:
    label:
      autoHide: false
      autoRotate: true
```
<img width="1177" alt="image" src="https://user-images.githubusercontent.com/150803/165742240-6199a44d-e067-4ea5-9dfa-5e7097904951.png">


### Allowed methods
* dv.current()
* dv.pages(source)
* dv.pagePaths(source)
* dv.page(path)
* dv.array(value)
* dv.isArray(value)
* dv.date(text)
* dv.fileLink(path, [embed?], [display-name])

See [Dataview Codeblock Reference](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/)

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-chartsview-plugin/`.

## Ant Design Charts Demos

See https://charts.ant.design/en/examples/gallery
