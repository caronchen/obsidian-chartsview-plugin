import React, { useRef } from "react";
import { registerInteraction, registerAction, Action, registerTheme } from '@antv/g2';
import * as Plots from "@ant-design/plots";
import * as Graphs from "@ant-design/graphs";
import ErrorBoundary from "@ant-design/plots/es/errorBoundary";
import { LooseObject } from "@antv/g2/lib/interface";

export interface ChartProps {
  type: string;
  config: ConfigProps;
  showExportBtn?: boolean;
}

const WITHOUT_WRAPPER = (searchWord: string) => encodeURIComponent(searchWord);
const PARENTHESIS_WRAPPER = (searchWord: string) => `(${encodeURIComponent(searchWord)})`;
const QUOTE_WRAPPER = (searchWord: string) => `"${encodeURIComponent(searchWord)}"`;
const PARENTHESIS_QUOTE_WRAPPER = (searchWord: string) => `("${encodeURIComponent(searchWord)}")`;

/**
 * 鼠标形状的 Action
 */
class ObsidianAction extends Action {

  private search(arg: Record<string, string>, prefix: string, replacer?: (searchWord: string) => string) {
    const data = this.context.event.data;
    const { shape, data: field } = data;
    let searchWord: string = undefined;
    if (shape === 'word-cloud') {
      searchWord = field.text;
    } else {
      searchWord = arg ? field[arg.field] : "";
    }
    if (replacer) {
      searchWord = replacer(searchWord);
    }
    this.openScheme(`obsidian://search?vault=${encodeURIComponent(arg.vault)}&query=${prefix}${searchWord}`);
  }

  private openNote(arg: Record<string, string>) {
    const data = this.context.event.data;
    const { shape, data: field } = data;
    let path: string = undefined;
    if (shape === 'word-cloud') {
      path = field.datum[arg.pathField];
    } else {
      path = field[arg.pathField];
    }
    this.openScheme(`obsidian://vault/${encodeURIComponent(arg.vault)}/${path}`);
  }

  private openScheme(url: string) {
    const tmpLink = window.document.body.createEl('a', {href: url});
    tmpLink.click();
    tmpLink.remove();
  }

  public tag(arg: Record<string, string>) {
    this.search(arg, "tag%3A", WITHOUT_WRAPPER);
  }

  public file(arg: Record<string, string>) {
    this.search(arg, "file%3A", PARENTHESIS_QUOTE_WRAPPER);
  }

  public fileopen(arg: Record<string, string>) {
    this.openNote(arg);
  }

  public path(arg: Record<string, string>) {
    this.search(arg, "path%3A", PARENTHESIS_QUOTE_WRAPPER);
  }

  public content(arg: Record<string, string>) {
    this.search(arg, "content%3A", PARENTHESIS_WRAPPER);
  }

  public task(arg: Record<string, string>) {
    this.search(arg, "task%3A", PARENTHESIS_WRAPPER);
  }

  public matchCase(arg: Record<string, string>) {
    this.search(arg, "match-case%3A", PARENTHESIS_WRAPPER);
  }

  public ignoreCase(arg: Record<string, string>) {
    this.search(arg, "ignore-case%3A", PARENTHESIS_WRAPPER);
  }

  public line(arg: Record<string, string>) {
    this.search(arg, "line%3A", PARENTHESIS_WRAPPER);
  }

  public block(arg: Record<string, string>) {
    this.search(arg, "block%3A", PARENTHESIS_WRAPPER);
  }

  public taskTodo(arg: Record<string, string>) {
    this.search(arg, "task-todo%3A", PARENTHESIS_WRAPPER);
  }

  public taskDone(arg: Record<string, string>) {
    this.search(arg, "task-done%3A", PARENTHESIS_WRAPPER);
  }

  public section(arg: Record<string, string>) {
    this.search(arg, "section%3A", PARENTHESIS_WRAPPER);
  }

  public default(arg: Record<string, string>) {
    this.search(arg, "", QUOTE_WRAPPER);
  }
}

registerAction('obsidian-search', ObsidianAction);

registerInteraction('obsidian-search', {
  start: [{ trigger: 'element:click', action: 'obsidian-search:default' }]
});

export type DataType = Record<string, unknown>[] | Record<string, unknown> | unknown;

export interface ConfigProps {
  data?: DataType;
  theme?: Record<string, unknown>;
  backgroundColor?: string;
  onReady?: (instance: unknown) => void;
  [key: string]: DataType | string | number;
}

const compactTheme = (theme: LooseObject): LooseObject => {
  theme.colors10 = theme.colors10?? theme.stylesheet?.paletteQualitative10;
  theme.colors20 = theme.colors20?? theme.stylesheet?.paletteQualitative20;
  return theme;
}

registerTheme("theme1", compactTheme({"background":"transparent","subColor":"rgba(0,0,0,0.05)","semanticRed":"#F4664A","semanticGreen":"#30BF78","padding":"auto","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","columnWidthRatio":0.5,"maxColumnWidth":null,"minColumnWidth":null,"roseWidthRatio":0.9999999,"multiplePieWidthRatio":0.7692307692307692,"sequenceColors":["#ffd8c2","#ffb188","#ff894e","#ff7231","#ff6322","#ff5211","#f94000","#e73000","#d51e00","#c30000"],"shapes":{"point":["hollow-circle","hollow-square","hollow-bowtie","hollow-diamond","hollow-hexagon","hollow-triangle","hollow-triangle-down","circle","square","bowtie","diamond","hexagon","triangle","triangle-down","cross","tick","plus","hyphen","line"],"line":["line","dash","dot","smooth"],"area":["area","smooth","line","smooth-line"],"interval":["rect","hollow-rect","line","tick"]},"sizes":[1,10],"components":{"axis":{"common":{"title":{"autoRotate":true,"position":"center","spacing":12,"style":{"fill":"#595959","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""},"iconStyle":{"fill":"#D9D9D9"}},"label":{"autoRotate":false,"autoEllipsis":false,"autoHide":{"type":"equidistance","cfg":{"minGap":6}},"offset":8,"style":{"fill":"#8C8C8C","fontSize":12,"lineHeight":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"line":{"style":{"lineWidth":1,"stroke":"#BFBFBF"}},"grid":{"line":{"type":"line","style":{"stroke":"#D9D9D9","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true},"tickLine":{"style":{"lineWidth":1,"stroke":"#BFBFBF"},"alignTick":true,"length":4},"subTickLine":null,"animate":true},"top":{"position":"top","grid":null,"title":null,"verticalLimitLength":0.5},"bottom":{"position":"bottom","grid":null,"title":null,"verticalLimitLength":0.5},"left":{"position":"left","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"right":{"position":"right","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"circle":{"title":null,"grid":{"line":{"type":"line","style":{"stroke":"#D9D9D9","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}},"radius":{"title":null,"grid":{"line":{"type":"circle","style":{"stroke":"#D9D9D9","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}}},"legend":{"common":{"title":null,"marker":{"symbol":"circle","spacing":8,"style":{"r":4,"fill":"#5B8FF9"}},"itemName":{"spacing":5,"style":{"fill":"#595959","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","fontSize":12,"lineHeight":12,"fontWeight":"normal","textAlign":"start","textBaseline":"middle"}},"itemStates":{"active":{"nameStyle":{"opacity":0.8}},"unchecked":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"fill":"#D8D8D8","stroke":"#D8D8D8"}},"inactive":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"opacity":0.2}}},"flipPage":true,"pageNavigator":{"marker":{"style":{"size":12,"inactiveFill":"#000","inactiveOpacity":0.45,"fill":"#000","opacity":1}},"text":{"style":{"fill":"#8C8C8C","fontSize":12}}},"animate":false,"maxItemWidth":200,"itemSpacing":24,"itemMarginBottom":12,"padding":[8,8,8,8]},"right":{"layout":"vertical","padding":[0,8,0,8]},"left":{"layout":"vertical","padding":[0,8,0,8]},"top":{"layout":"horizontal","padding":[8,0,8,0]},"bottom":{"layout":"horizontal","padding":[8,0,8,0]},"continuous":{"title":null,"background":null,"track":{},"rail":{"type":"color","size":12,"defaultLength":100,"style":{"fill":"#D9D9D9","stroke":null,"lineWidth":0}},"label":{"align":"rail","spacing":4,"formatter":null,"style":{"fill":"#8C8C8C","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"handler":{"size":10,"style":{"fill":"#F0F0F0","stroke":"#BFBFBF"}},"slidable":true,"padding":[8,8,8,8]}},"tooltip":{"showContent":true,"follow":true,"showCrosshairs":false,"showMarkers":true,"shared":false,"enterable":false,"position":"auto","marker":{"symbol":"circle","stroke":"#fff","shadowBlur":10,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"rgba(0,0,0,0.09)","lineWidth":2,"r":4},"crosshairs":{"line":{"style":{"stroke":"#BFBFBF","lineWidth":1}},"text":null,"textBackground":{"padding":2,"style":{"fill":"rgba(0, 0, 0, 0.25)","lineWidth":0,"stroke":null}},"follow":false},"domStyles":{"g2-tooltip":{"position":"absolute","visibility":"hidden","zIndex":8,"transition":"left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s","backgroundColor":"rgb(255, 255, 255)","opacity":0.95,"boxShadow":"0px 0px 10px #aeaeae","borderRadius":"3px","color":"#595959","fontSize":"12px","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","lineHeight":"12px","padding":"0 12px 0 12px"},"g2-tooltip-title":{"marginBottom":"12px","marginTop":"12px"},"g2-tooltip-list":{"margin":0,"listStyleType":"none","padding":0},"g2-tooltip-list-item":{"listStyleType":"none","padding":0,"marginBottom":"12px","marginTop":"12px","marginLeft":0,"marginRight":0},"g2-tooltip-marker":{"width":"8px","height":"8px","borderRadius":"50%","display":"inline-block","marginRight":"8px"},"g2-tooltip-value":{"display":"inline-block","float":"right","marginLeft":"30px"}}},"annotation":{"arc":{"style":{"stroke":"#D9D9D9","lineWidth":1},"animate":true},"line":{"style":{"stroke":"#BFBFBF","lineDash":null,"lineWidth":1},"text":{"position":"start","autoRotate":true,"style":{"fill":"#595959","stroke":null,"lineWidth":0,"fontSize":12,"textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","textBaseline":"bottom"}},"animate":true},"text":{"style":{"fill":"#595959","stroke":null,"lineWidth":0,"fontSize":12,"textBaseline":"middle","textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""},"animate":true},"region":{"top":false,"style":{"lineWidth":0,"stroke":null,"fill":"#000","fillOpacity":0.06},"animate":true},"image":{"top":false,"animate":true},"dataMarker":{"top":true,"point":{"style":{"r":3,"stroke":"#5B8FF9","lineWidth":2}},"line":{"style":{"stroke":"#BFBFBF","lineWidth":1},"length":16},"text":{"style":{"textAlign":"start","fill":"#595959","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"direction":"upward","autoAdjust":true,"animate":true},"dataRegion":{"style":{"region":{"fill":"#000","fillOpacity":0.06},"text":{"textAlign":"center","textBaseline":"bottom","fill":"#595959","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"animate":true}},"slider":{"common":{"padding":[8,8,8,8],"backgroundStyle":{"fill":"#416180","opacity":0.05},"foregroundStyle":{"fill":"#5B8FF9","opacity":0.15},"handlerStyle":{"width":10,"height":24,"fill":"#F7F7F7","opacity":1,"stroke":"#BFBFBF","lineWidth":1,"radius":2,"highLightFill":"#FFF"},"textStyle":{"fill":"#000","opacity":0.45,"fontSize":12,"lineHeight":12,"fontWeight":"normal","stroke":null,"lineWidth":0}}},"scrollbar":{"common":{"padding":[8,8,8,8]},"default":{"style":{"trackColor":"rgba(0,0,0,0)","thumbColor":"rgba(0,0,0,0.15)"}},"hover":{"style":{"thumbColor":"rgba(0,0,0,0.2)"}}}},"labels":{"offset":12,"style":{"fill":"#595959","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"fillColorDark":"#2c3542","fillColorLight":"#ffffff","autoRotate":true},"innerLabels":{"style":{"fill":"#FFFFFF","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"autoRotate":true},"overflowLabels":{"style":{"fill":"#595959","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":"#FFFFFF","lineWidth":1}},"pieLabels":{"labelHeight":14,"offset":10,"labelLine":{"style":{"lineWidth":1}},"autoRotate":true},"geometries":{"interval":{"rect":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.95}},"active":{"style":{"stroke":"#000","lineWidth":1}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{}},"hollow-rect":{"default":{"style":{"fill":"#FFFFFF","stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"stroke":"#000","lineWidth":2}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":3,"strokeOpacity":1}}},"line":{"default":{"style":{"fill":"#FFFFFF","stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"stroke":"#000","lineWidth":2}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":3,"strokeOpacity":1}}},"tick":{"default":{"style":{"fill":"#FFFFFF","stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"stroke":"#000","lineWidth":2}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":3,"strokeOpacity":1}}},"funnel":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.95}},"active":{"style":{"stroke":"#000","lineWidth":1}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"pyramid":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.95}},"active":{"style":{"stroke":"#000","lineWidth":1}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}}},"line":{"line":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"dot":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":null,"lineJoin":"round","lineDash":[1,1]}},"active":{"style":{"lineWidth":3,"lineCap":null,"lineDash":[1,1]}},"inactive":{"style":{"strokeOpacity":0.3,"lineCap":null,"lineDash":[1,1]}},"selected":{"style":{"lineWidth":3,"lineCap":null,"lineDash":[1,1]}}},"dash":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":null,"lineJoin":"round","lineDash":[5.5,1]}},"active":{"style":{"lineWidth":3,"lineCap":null,"lineDash":[5.5,1]}},"inactive":{"style":{"strokeOpacity":0.3,"lineCap":null,"lineDash":[5.5,1]}},"selected":{"style":{"lineWidth":3,"lineCap":null,"lineDash":[5.5,1]}}},"smooth":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"hv":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"vh":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"hvh":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"vhv":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}}},"polygon":{"polygon":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.95}},"active":{"style":{"stroke":"#000","lineWidth":1}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}}},"point":{"circle":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"square":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"bowtie":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"diamond":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"hexagon":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"triangle":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"triangle-down":{"default":{"style":{"fill":"#5B8FF9","r":4,"stroke":"#FFFFFF","lineWidth":1,"fillOpacity":0.95}},"active":{"style":{"stroke":"#000"}},"inactive":{"style":{"fillOpacity":0.3,"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":2}}},"hollow-circle":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-square":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-bowtie":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-diamond":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-hexagon":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-triangle":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hollow-triangle-down":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"cross":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"tick":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"plus":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"hyphen":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}},"line":{"default":{"style":{"fill":"#FFFFFF","lineWidth":1,"stroke":"#5B8FF9","strokeOpacity":0.95,"r":4}},"active":{"style":{"stroke":"#000","strokeOpacity":1}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":2,"stroke":"#000","strokeOpacity":1}}}},"area":{"area":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.25,"stroke":null}},"active":{"style":{"fillOpacity":0.5}},"inactive":{"style":{"fillOpacity":0.3}},"selected":{"style":{"fillOpacity":0.5}}},"smooth":{"default":{"style":{"fill":"#5B8FF9","fillOpacity":0.25,"stroke":null}},"active":{"style":{"fillOpacity":0.5}},"inactive":{"style":{"fillOpacity":0.3}},"selected":{"style":{"fillOpacity":0.5}}},"line":{"default":{"style":{"fill":null,"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"fill":null,"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"fill":null,"lineWidth":3}}},"smooth-line":{"default":{"style":{"fill":null,"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"fill":null,"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"fill":null,"lineWidth":3}}}},"schema":{"candle":{"default":{"style":{"fill":"#FFFFFF","stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"stroke":"#000","lineWidth":2}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":3,"strokeOpacity":1}}},"box":{"default":{"style":{"fill":"#FFFFFF","stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"stroke":"#000","lineWidth":2}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"stroke":"#000","lineWidth":3,"strokeOpacity":1}}}},"edge":{"line":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"vhv":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"smooth":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"arc":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}}},"violin":{"violin":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"smooth":{"default":{"style":{"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1,"fill":null,"lineAppendWidth":10,"lineCap":"round","lineJoin":"round"}},"active":{"style":{"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"lineWidth":3}}},"hollow":{"default":{"style":{"fill":null,"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"fill":null,"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"fill":null,"lineWidth":3}}},"hollow-smooth":{"default":{"style":{"fill":null,"stroke":"#5B8FF9","lineWidth":2,"strokeOpacity":1}},"active":{"style":{"fill":null,"lineWidth":3}},"inactive":{"style":{"strokeOpacity":0.3}},"selected":{"style":{"fill":null,"lineWidth":3}}}}},"styleSheet":{"brandColor":"#FF4500","paletteQualitative10":["#FF4500","#1AAF8B","#406C85","#F6BD16","#B40F0F","#2FB8FC","#4435FF","#FF5CA2","#BBE800","#FE8A26"],"paletteQualitative20":["#FF4500","#1AAF8B","#406C85","#F6BD16","#B40F0F","#2FB8FC","#4435FF","#FF5CA2","#BBE800","#FE8A26","#946DFF","#6C3E00","#6193FF","#FF988E","#36BCCB","#004988","#FFCF9D","#CCDC8A","#8D00A1","#1CC25E"]}}));

registerTheme("theme2", compactTheme({
  "colors10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"],
  "colors20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"]
}));

export const Chart = ({ type, config, showExportBtn = false }: ChartProps) => {
  // @ts-ignore
  const Component = Plots[type] || Graphs[type];
  const ref = useRef<unknown>();
  const { onReady } = config ?? {};

  return (
    <ErrorBoundary>
      {showExportBtn &&
        <div className="chartsview-export-button" aria-label="Export to PNG" onClick={() => {
          // @ts-ignore
          ref.current?.downloadImage(`${type}.png`);
        }}>
          <svg className="code-glyph" viewBox="0 0 1024 1024" width="16" height="16">
            <path fill="currentColor" stroke="currentColor" d="M896 166.4H128c-25.6 0-42.666667 17.066667-42.666667 42.666667v597.333333c0 25.6 17.066667 42.666667 42.666667 42.666667h768c25.6 0 42.666667-17.066667 42.666667-42.666667v-597.333333c0-25.6-21.333333-42.666667-42.666667-42.666667z m-42.666667 85.333333v418.133334l-136.533333-136.533334c-21.333333-12.8-51.2-12.8-64 4.266667L554.666667 635.733333l-183.466667-179.2c-17.066667-17.066667-46.933333-17.066667-59.733333 0L170.666667 597.333333V251.733333h682.666666z m-243.2 443.733334l76.8-76.8 136.533334 140.8h-145.066667l-68.266667-64zM170.666667 716.8l170.666666-170.666667 217.6 217.6H170.666667v-46.933333z"></path>
            <path fill="currentColor" stroke="currentColor" d="M716.8 396.8m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"></path>
          </svg>
        </div>
      }
      <Component
        {...config}
        onReady={(instance: unknown) => {
          onReady?.(instance);
          ref.current = instance;
        }}
      />
    </ErrorBoundary>
  );
}
