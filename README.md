![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/caronchen/obsidian-chartsview-plugin) ![GitHub all releases](https://img.shields.io/github/downloads/caronchen/obsidian-chartsview-plugin/total) ![GitHub Release Date](https://img.shields.io/github/release-date/caronchen/obsidian-chartsview-plugin) ![GitHub last commit](https://img.shields.io/github/last-commit/caronchen/obsidian-chartsview-plugin)

## Obsidian Charts View Plugin

This is a charts view plugin for Obsidian (https://obsidian.md), based on [Ant Design Charts](https://charts.ant.design/) which is a React chart library.

### How to use

#### Pie
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Pie

#-----------------#
#- chart data    -#
#-----------------#
data:
  - type: "Wage income per capita (¥)"
    value: 17917
  - type: "Operating net income per capita (¥)"
    value: 5307
  - type: "Property Per Capita Net Income (¥)"
    value: 2791
  - type: "Transfer of net income per capita (¥)"
    value: 6173

#-----------------#
#- chart options -#
#-----------------#
options:
  angleField: "value"
  colorField: "type"
  radius: 0.5
  label:
	type: "spider"
	content: "{percentage}\n{name}"
  legend:
	layout: "horizontal"
	position: "bottom"
```

![image](https://user-images.githubusercontent.com/150803/119069882-87c95700-ba19-11eb-8cef-02d1e021d1a2.png)

```

#### WordCloud Demo
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: WordCloud

#-----------------#
#- chart data    -#
#-----------------#
data:
  - x: "China"
    value: 1383220000
    category: "asia"
  - x: "India"
    value: 1316000000
    category: "asia"
  - x: "United States"
    value: 324982000
    category: "america"
  - x: "Indonesia"
    value: 263510000
    category: "asia"
  - x: "Brazil"
    value: 207505000
    category: "america"
  - x: "Pakistan"
    value: 196459000
    category: "asia"
  - x: "Nigeria"
    value: 191836000
    category: "africa"
  - x: "Bangladesh"
    value: 162459000
    category: "asia"
  - x: "Russia"
    value: 146804372
    category: "europe"
  - x: "Japan"
    value: 126790000
    category: "asia"
  - x: "Mexico"
    value: 123518000
    category: "america"
  - x: "Ethiopia"
    value: 104345000
    category: "africa"
  - x: "Philippines"
    value: 104037000
    category: "asia"
  - x: "Egypt"
    value: 93013300
    category: "africa"
  - x: "Vietnam"
    value: 92700000
    category: "asia"
  - x: "Germany"
    value: 82800000
    category: "europe"
  - x: "Democratic Republic of the Congo"
    value: 82243000
    category: "africa"
  - x: "Iran"
    value: 80135400
    category: "asia"
  - x: "Turkey"
    value: 79814871
    category: "asia"
  - x: "Thailand"
    value: 68298000
    category: "asia"
  - x: "France"
    value: 67013000
    category: "europe"
  - x: "United Kingdom"
    value: 65110000
    category: "europe"
  - x: "Italy"
    value: 60599936
    category: "europe"
  - x: "Tanzania"
    value: 56878000
    category: "africa"
  - x: "South Africa"
    value: 55908000
    category: "africa"
  - x: "Myanmar"
    value: 54836000
    category: "asia"
  - x: "South Korea"
    value: 51446201
    category: "asia"
  - x: "Colombia"
    value: 49224700
    category: "america"
  - x: "Kenya"
    value: 48467000
    category: "africa"
  - x: "Spain"
    value: 46812000
    category: "europe"
  - x: "Argentina"
    value: 43850000
    category: "america"
  - x: "Ukraine"
    value: 42541633
    category: "europe"
  - x: "Sudan"
    value: 42176000
    category: "africa"
  - x: "Uganda"
    value: 41653000
    category: "africa"
  - x: "Algeria"
    value: 41064000
    category: "africa"
  - x: "Poland"
    value: 38424000
    category: "europe"
  - x: "Iraq"
    value: 37883543
    category: "asia"
  - x: "Canada"
    value: 36541000
    category: "america"
  - x: "Morocco"
    value: 34317500
    category: "africa"
  - x: "Saudi Arabia"
    value: 33710021
    category: "asia"
  - x: "Uzbekistan"
    value: 32121000
    category: "asia"
  - x: "Malaysia"
    value: 32063200
    category: "asia"
  - x: "Peru"
    value: 31826018
    category: "america"
  - x: "Venezuela"
    value: 31431164
    category: "america"
  - x: "Nepal"
    value: 28825709
    category: "asia"
  - x: "Angola"
    value: 28359634
    category: "africa"
  - x: "Ghana"
    value: 28308301
    category: "africa"
  - x: "Yemen"
    value: 28120000
    category: "asia"
  - x: "Afghanistan"
    value: 27657145
    category: "asia"
  - x: "Mozambique"
    value: 27128530
    category: "africa"
  - x: "Australia"
    value: 24460900
    category: "australia"
  - x: "North Korea"
    value: 24213510
    category: "asia"
  - x: "Taiwan"
    value: 23545680
    category: "asia"
  - x: "Cameroon"
    value: 23248044
    category: "africa"
  - x: "Ivory Coast"
    value: 22671331
    category: "africa"
  - x: "Madagascar"
    value: 22434363
    category: "africa"
  - x: "Niger"
    value: 21564000
    category: "africa"
  - x: "Sri Lanka"
    value: 21203000
    category: "asia"
  - x: "Romania"
    value: 19760000
    category: "europe"
  - x: "Burkina Faso"
    value: 19632147
    category: "africa"
  - x: "Syria"
    value: 18907000
    category: "asia"
  - x: "Mali"
    value: 18875000
    category: "africa"
  - x: "Malawi"
    value: 18299000
    category: "africa"
  - x: "Chile"
    value: 18191900
    category: "america"
  - x: "Kazakhstan"
    value: 17975800
    category: "asia"
  - x: "Netherlands"
    value: 17121900
    category: "europe"
  - x: "Ecuador"
    value: 16737700
    category: "america"
  - x: "Guatemala"
    value: 16176133
    category: "america"
  - x: "Zambia"
    value: 15933883
    category: "africa"
  - x: "Cambodia"
    value: 15626444
    category: "asia"
  - x: "Senegal"
    value: 15256346
    category: "africa"
  - x: "Chad"
    value: 14965000
    category: "africa"
  - x: "Zimbabwe"
    value: 14542235
    category: "africa"
  - x: "Guinea"
    value: 13291000
    category: "africa"
  - x: "South Sudan"
    value: 12131000
    category: "africa"
  - x: "Rwanda"
    value: 11553188
    category: "africa"
  - x: "Belgium"
    value: 11356191
    category: "europe"
  - x: "Tunisia"
    value: 11299400
    category: "africa"
  - x: "Cuba"
    value: 11239004
    category: "america"
  - x: "Bolivia"
    value: 11145770
    category: "america"
  - x: "Somalia"
    value: 11079000
    category: "africa"
  - x: "Haiti"
    value: 11078033
    category: "america"
  - x: "Greece"
    value: 10783748
    category: "europe"
  - x: "Benin"
    value: 10653654
    category: "africa"
  - x: "Czech Republic"
    value: 10578820
    category: "europe"
  - x: "Portugal"
    value: 10341330
    category: "europe"
  - x: "Burundi"
    value: 10114505
    category: "africa"
  - x: "Dominican Republic"
    value: 10075045
    category: "america"
  - x: "Sweden"
    value: 10054100
    category: "europe"
  - x: "United Arab Emirates"
    value: 10003223
    category: "asia"
  - x: "Jordan"
    value: 9889270
    category: "asia"
  - x: "Azerbaijan"
    value: 9823667
    category: "asia"
  - x: "Hungary"
    value: 9799000
    category: "europe"
  - x: "Belarus"
    value: 9498600
    category: "europe"
  - x: "Honduras"
    value: 8866351
    category: "america"
  - x: "Austria"
    value: 8773686
    category: "europe"
  - x: "Tajikistan"
    value: 8742000
    category: "asia"
  - x: "Israel"
    value: 8690220
    category: "asia"
  - x: "Switzerland"
    value: 8417700
    category: "europe"
  - x: "Papua New Guinea"
    value: 8151300
    category: "australia"

#-----------------#
#- chart options -#
#-----------------#
options:
  wordField: "x"
  weightField: "value"
  color: "#122c6a"
  wordStyle:
	fontFamily: "Verdana"
	fontSize: [24, 80]
  interactions:
	type: "element-active"
  style:
    backgroundColor: "white"
  state:
	active:
	  style:
	    lineWidth: 3
```

![image](https://user-images.githubusercontent.com/150803/119069991-bba47c80-ba19-11eb-873f-847563daea39.png)


#### Treemap
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: Treemap

#-----------------#
#- chart data    -#
#-----------------#
data:
  name: 'root'
  children:
    - name: 'Folder 1'
      value: 560
    - name: 'Folder 2'
      value: 500
    - name: 'Folder 3'
      value: 150
    - name: 'Folder 4'
      value: 140
    - name: 'Folder 5'
      value: 115
    - name: 'Folder 6'
      value: 95
    - name: 'Folder 7'
      value: 90
    - name: 'Folder 8'
      value: 75
    - name: 'Folder 9'
      value: 98
    - name: 'Folder 10'
      value: 60
    - name: 'Folder 11'
      value: 45
    - name: 'Folder 12'
      value: 40
    - name: 'Folder 13'
      value: 40
    - name: 'Folder 14'
      value: 35
    - name: 'Folder 15'
      value: 40
    - name: 'Folder 16'
      value: 40
    - name: 'Folder 17'
      value: 40
    - name: 'Folder 18'
      value: 30
    - name: 'Folder 19'
      value: 28
    - name: 'Folder 20'
      value: 16

#-----------------#
#- chart options -#
#-----------------#
options:
  colorField: "name"
```

![image](https://user-images.githubusercontent.com/150803/119070047-decf2c00-ba19-11eb-9d59-21c051da593c.png)

#### DualAxes
```chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: DualAxes

#-----------------#
#- chart data    -#
#-----------------#
data:
  -
    - time: "2019-03"
      value: 350
      count: 800
    - time: "2019-04"
      value: 900
      count: 600
    - time: "2019-05"
      value: 300
      count: 400
    - time: "2019-06"
      value: 450
      count: 380
    - time: "2019-07"
      value: 470
      count: 22
  -
    - time: "2019-03"
      value: 350
      count: 800
    - time: "2019-04"
      value: 900
      count: 600
    - time: "2019-05"
      value: 300
      count: 400
    - time: "2019-06"
      value: 450
      count: 380
    - time: "2019-07"
      value: 470
      count: 22

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

![image](https://user-images.githubusercontent.com/150803/119969638-618b5480-bfe1-11eb-8a36-0a5d60408b00.png)

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-chartsview-plugin/`.

### Ant Design Charts Demos

See https://charts.ant.design/demos/global
