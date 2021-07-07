![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/caronchen/obsidian-chartsview-plugin) ![GitHub all releases](https://img.shields.io/github/downloads/caronchen/obsidian-chartsview-plugin/total) ![GitHub Release Date](https://img.shields.io/github/release-date/caronchen/obsidian-chartsview-plugin) ![GitHub last commit](https://img.shields.io/github/last-commit/caronchen/obsidian-chartsview-plugin)

## Obsidian Charts View Plugin

This is a charts view plugin for Obsidian (https://obsidian.md), based on [Ant Design Charts](https://charts.ant.design/) which is a React chart library.

### How to use

#### Import data from external CSV file
Use command `Import data from external CSV file` to insert data from CSV file.

#### Load data from internal CSV file
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

#### Pie
Use command `Insert Template` -> Pie` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069882-87c95700-ba19-11eb-8cef-02d1e021d1a2.png)


#### WordCloud
Use command `Insert Template...` -> WordCloud` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119069991-bba47c80-ba19-11eb-873f-847563daea39.png)


#### Treemap
Use command `Insert Template...` -> Treemap` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119070047-decf2c00-ba19-11eb-9d59-21c051da593c.png)

#### DualAxes
Use command `Insert Template...` -> `DualAxes` to insert code block.

![image](https://user-images.githubusercontent.com/150803/119969638-618b5480-bfe1-11eb-8a36-0a5d60408b00.png)

#### Mix
Use `data.<any name>` and `options.<any name>` to set data and options. Keep data and options `<any name>` same.

Use command `Insert Template...` -> Mix` to insert code block.

![image](https://user-images.githubusercontent.com/150803/120421841-a1638a80-c399-11eb-9464-d773931fdd6f.png)

#### Bar
Use command `Insert Template...` -> Bar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117024-fa43b180-d473-11eb-84eb-8e1806ce5dec.png)

#### OrganizationTreeGraph
Use command `Insert Template...` -> OrganizationTreeGraph` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117254-2b23e680-d474-11eb-845f-0d663a458fa7.png)

#### Radar
Use command `Insert Template...` -> Radar` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117394-4a227880-d474-11eb-8a11-23f3cd482251.png)

#### TinyLine
Use command `Insert Template...` -> TinyLine` to insert code block.

![image](https://user-images.githubusercontent.com/150803/123117476-5a3a5800-d474-11eb-9db8-4b3785bb010c.png)

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-chartsview-plugin/`.

### Ant Design Charts Demos

See https://charts.ant.design/demos/global
