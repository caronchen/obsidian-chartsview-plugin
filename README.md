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
  - [Chart Wizard](#chart-wizard)
  - [Data from CSV file](#data-from-csv-file)
    - [Import data from external CSV file (Desktop)](#import-data-from-external-csv-file-desktop)
    - [Load data from internal CSV file](#load-data-from-internal-csv-file)
      - [Multi CSV files](#multi-csv-files)
  - [Dataview Plugin Integration](#dataview-plugin-integration)
    - [Allowed methods](#allowed-methods)
  - [Interaction](#interaction)
    - [Enable search interaction](#enable-search-interaction)
  - [Examples](#examples)
  - [Manually installing the plugin](#manually-installing-the-plugin)
  - [Ant Design Charts Demos](#ant-design-charts-demos)

## Chart Templates
### Word Count
Use command `Insert Template` -> `Word Count` to insert code block.
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
Use command `Charts View: Insert Template` -> `Pie` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069882-87c95700-ba19-11eb-8cef-02d1e021d1a2.png)


### WordCloud
Use command `Charts View: Insert Template` -> `WordCloud` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069991-bba47c80-ba19-11eb-873f-847563daea39.png)


### Treemap
Use command `Charts View: Insert Template` -> `Treemap` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119070047-decf2c00-ba19-11eb-9d59-21c051da593c.png)

### DualAxes
Use command `Charts View: Insert Template` -> `DualAxes` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119969638-618b5480-bfe1-11eb-8a36-0a5d60408b00.png)

### Mix
Use `data.<any name>` and `options.<any name>` to set data and options. Keep data and options `<any name>` same.

Use command `Charts View: Insert Template` -> `Mix` to insert code block.

![image](https://user-images.githubusercontent.com/150803/120421841-a1638a80-c399-11eb-9464-d773931fdd6f.png)

### Bar
Use command `Charts View: Insert Template` -> `Bar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117024-fa43b180-d473-11eb-84eb-8e1806ce5dec.png)

### OrganizationTreeGraph
Use command `Charts View: Insert Template` -> `OrganizationTreeGraph` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117254-2b23e680-d474-11eb-845f-0d663a458fa7.png)

### Radar
Use command `Charts View: Insert Template` -> `Radar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117394-4a227880-d474-11eb-8a11-23f3cd482251.png)

### TinyLine
Use command `Charts View: Insert Template` -> `TinyLine` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117476-5a3a5800-d474-11eb-9db8-4b3785bb010c.png)

### Dataviewjs Example (Column)
Chart data by dataviewjs.
Use command `Charts View: Insert Template` -> `Dataviewjs Example (Column)` to insert code block.

![image](https://user-images.githubusercontent.com/150803/140684190-fa6a08ea-3394-44fe-ae92-265810f6b9a9.png)

## Chart Wizard
Use command `Charts View: Wizard` to insert code block.

## Data from CSV file

### Import data from external CSV file (Desktop)
Use command `Charts View: Import data from external CSV file` to insert data from CSV file.

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

## Interaction
### Enable search interaction
Enable the Search in Obsidian interaction when click a chart element by add an option `enableSearchInteraction`.
Use default: 
```
#-----------------#
#- chart options -#
#-----------------#
options:
  ...
  enableSearchInteraction: true
```
or custom:
```
#-----------------#
#- chart options -#
#-----------------#
options:
  ...
  enableSearchInteraction:
    field: 'word'
    operator: 'path'
```
- `field` indicate where to get keyword for search.
- `operator` enums from [Obsidian search opertaors](https://help.obsidian.md/Plugins/Search#Search+operators):

| operator     | Obsidian search opertaor |
| ------------ | ------------------------ |
| `default`    |                          |
| `tag`        | `tag:`                   |
| `path`       | `path:`                  |
| `file`       | `file:`                  |
| `task`       | `task:`                  |
| `taskTodo`   | `task-todo:`             |
| `taskDone`   | `task-done:`             |
| `matchCase`  | `match-case:`            |
| `ignoreCase` | `ignore-case:`           |
| `line`       | `line:`                  |
| `block`      | `block:`                 |
| `content`    | `content:`               |
| `section`    | `section:`               |

## Examples

See https://github.com/caronchen/obsidian-chartsview-plugin/wiki/Chart-examples

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-chartsview-plugin/`.

## Ant Design Charts Demos

See https://charts.ant.design/en/examples/gallery
