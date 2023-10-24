import { App, Editor, Modal, Setting, stringifyYaml } from "obsidian";
import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { ChartsViewPluginSettings } from "src/settings";
import { Chart, ChartProps } from "./Chart";
import { insertEditor } from "src/tools";

type DataType = {
  field: string;
  value: string[];
};

type Preferences = {
  valuesFieldKey: string;
  labelsFieldKey: string;
  seriesFieldKey: string;
  labels?: DataType;
  values?: DataType[];
  series?: DataType;
};

const DEFAULT: Preferences = {
  labelsFieldKey: 'xField',
  valuesFieldKey: 'yField',
  seriesFieldKey: 'seriesField',
  labels: { field: 'label', value: ['1951','1952','1956','1957','1958'] } as DataType,
  values: [{ field: 'value', value: ['38','52','61','145','48'] }] as DataType[],
  series: { field: 'serie' } as DataType,
};

const VALUE_INPUT_SIZE = 80;
const NAME_INPUT_SIZE = 14;
const DEFAULT_CHART_TYPE = 'Area';

const ValueNumbers: Record<string, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
}

const ChartTypes: Record<string, string> = {
  'Area': 'Area',
  'Bar': 'Bar',
  'Box': 'Box',
  'Chord': 'Chord',
  'Column': 'Column',
  'Funnel': 'Funnel',
  'Heatmap': 'Heatmap',
  'Histogram': 'Histogram',
  'Line': 'Line',
  'Pie': 'Pie',
  'Radar': 'Radar',
  'RadialBar': 'RadialBar',
  'Rose': 'Rose',
  'Sankey': 'Sankey',
  'Stock': 'Stock',
  'Violin': 'Violin',
  'Waterfall': 'Waterfall',
  'WordCloud': 'WordCloud',
  'Scatter': 'Scatter',
};

const ChartPreferences: Record<string, Preferences> = {
  'Bar': { labelsFieldKey: 'yField', valuesFieldKey: 'xField', seriesFieldKey: 'seriesField' },
  'Chord': { labelsFieldKey: 'sourceField', valuesFieldKey: 'weightField', seriesFieldKey: 'targetField' },
  'Sankey': { labelsFieldKey: 'sourceField', valuesFieldKey: 'weightField', seriesFieldKey: 'targetField' },
  'Heatmap': { labelsFieldKey: 'xField', valuesFieldKey: 'colorField', seriesFieldKey: '' },
  'Histogram': { labelsFieldKey: 'xField', valuesFieldKey: 'binField', seriesFieldKey: '' },
  'WordCloud': { labelsFieldKey: 'wordField', valuesFieldKey: 'weightField', seriesFieldKey: '' },
  'Pie': { labelsFieldKey: 'colorField', valuesFieldKey: 'angleField', seriesFieldKey: '' },
};

export class ChartWizardModal extends Modal {
  chartEl: HTMLDivElement;
  chartSetting: ChartProps;
  dataLabels: DataType;
  dataValues: DataType[];
  dataSeries: DataType;
  /*
  interaction: { operator: string; field: string; enabled: boolean };
  */
  valueNumber: number;

  constructor(app: App, private editor: Editor, private settings: ChartsViewPluginSettings) {
    super(app);
  }

  onOpen() {
    this.modalEl.style.width = '860px';
    this.titleEl.createEl('h2', { text: 'Chart Wizard' });
    this.chartSetting = { type: DEFAULT_CHART_TYPE, config: {} } as ChartProps;
    this.dataLabels = (ChartPreferences[this.chartSetting.type] ?? DEFAULT).labels;
    this.dataValues = (ChartPreferences[this.chartSetting.type] ?? DEFAULT).values;
    this.dataSeries = (ChartPreferences[this.chartSetting.type] ?? DEFAULT).series;
    this.valueNumber = 1;
    /*
    this.interaction = { operator: 'default', field: this.dataLabels.field, enabled: false };
    */

    this.displayContent();
    this.addConfirmButton();
  }

  private displayContent() {
    this.contentEl.empty();
    this.createSetting();
    this.chartEl = this.contentEl.createDiv();
    this.renderChart();
  }

  private createSetting() {
    new Setting(this.contentEl)
      .setName("Chart Type")
      .addDropdown(dropdown => dropdown
        .addOptions(ChartTypes)
        .setValue(this.chartSetting.type)
        .onChange(value => {
          this.chartSetting.type = value;
          this.renderChart();
        })
      );

    new Setting(this.contentEl)
      .setName("Value Number")
      .addDropdown(dropdown => dropdown
        .addOptions(ValueNumbers)
        .setValue(`${this.valueNumber}`)
        .onChange(value => {
          this.valueNumber = +value;
          this.displayContent();
        }))

    for (let i = 0; i < this.valueNumber; i++) {
      new Setting(this.contentEl)
        .setName(i === 0 ? "Values" : "")
        .addText(text => {
          text.inputEl.size = NAME_INPUT_SIZE;
          text
            .setPlaceholder("Input field name")
            .setValue(this.dataValues[i]?.field ?? undefined)
            .onChange(value => {
              if (this.dataValues[i] === undefined) {
                this.dataValues[i] = {} as DataType;
              }
              this.dataValues[i].field = value;
              this.renderChart();
            });
        })
        .addText(text => {
          text.inputEl.size = VALUE_INPUT_SIZE;
          text
            .setPlaceholder("value1, value2, value3, ...")
            .setValue(this.dataValues[i]?.value && this.dataValues[i]?.value.join(","))
            .onChange(value => {
              if (this.dataValues[i] === undefined) {
                this.dataValues[i] = {} as DataType;
              }
              this.dataValues[i].value = value.length === 0 ? undefined : value.split(",");
              this.renderChart();
            });
        });
    }

    new Setting(this.contentEl)
      .setName("Labels")
      .addText(text => {
        text.inputEl.size = NAME_INPUT_SIZE;
        text
          .setPlaceholder("Input field name")
          .setValue(this.dataLabels.field)
          .onChange(value => {
            this.dataLabels.field = value;
            this.renderChart();
          });
      })
      .addText(text => {
        text.inputEl.size = VALUE_INPUT_SIZE;
        text
          .setPlaceholder("value1, value2, value3, ...")
          .setValue(this.dataLabels.value && this.dataLabels.value.join(","))
          .onChange(value => {
            this.dataLabels.value = value.length === 0 ? undefined : value.split(",");
            this.renderChart();
          });
      });

    new Setting(this.contentEl)
      .setName("Series")
      .addText(text => {
        text.inputEl.size = NAME_INPUT_SIZE;
        text
          .setPlaceholder("Input field name")
          .setValue(this.dataSeries.field)
          .onChange(value => {
            this.dataSeries.field = value;
            this.renderChart();
          });
      })
      .addText(text => {
        text.inputEl.size = VALUE_INPUT_SIZE;
        text
          .setPlaceholder("value1, value2, value3, ...")
          .setValue(this.dataSeries.value && this.dataSeries.value.join(","))
          .onChange(value => {
            this.dataSeries.value = value.length === 0 ? undefined : value.split(",");
            this.renderChart();
          });
      });
  }

  private renderChart() {
    this.dataSeries.field = this.dataSeries.field ?? 'serie';
    this.dataLabels.field = this.dataLabels.field ?? 'label';
    this.dataValues[0].field = this.dataValues[0].field ?? 'value';

    this.chartSetting.config = {};

    this.isNotEmpty(this.dataSeries.value) &&
      (this.chartSetting.config[(ChartPreferences[this.chartSetting.type] ?? DEFAULT).seriesFieldKey] = this.dataSeries.field);
    this.isNotEmpty(this.dataLabels.value) &&
      (this.chartSetting.config[(ChartPreferences[this.chartSetting.type] ?? DEFAULT).labelsFieldKey] = this.dataLabels.field);
    this.isNotEmpty(this.dataValues) &&
      (this.chartSetting.config[(ChartPreferences[this.chartSetting.type] ?? DEFAULT).valuesFieldKey] = (this.valueNumber === 1
        ? this.dataValues[0].field
        : this.dataValues.map(item => item.field)));

    this.chartSetting.config.data = (this.dataLabels.value ?? []).map((item, index) => {
      const obj = {} as Record<string, string | number>;
      obj[this.dataLabels.field] = item;

      for (let i = 0; i < this.valueNumber; i++) {
        const valueData = (this.dataValues[i].value ?? [])[index];
        valueData !== undefined && (obj[this.dataValues[i].field] = (isNaN(Number(valueData)) ? valueData : Number(valueData)));
      }

      const serieData = (this.dataSeries.value ?? [])[index];
      serieData !== undefined && (obj[this.dataSeries.field] = serieData);

      return obj;
    });

    try {
      this.chartEl.empty();
      render(<Chart {...this.chartSetting} />, this.chartEl);
    } catch (e) {
      render(
        <div style={{ color: 'var(--text-title-h1)' }}>{e.toString()}</div>,
        this.chartEl
      );
    }
  }

  private addConfirmButton() {
    new Setting(this.modalEl)
      .addButton(button => button
        .setClass("mod-cta")
        .setButtonText("Insert Yaml!")
        .onClick(e => {
          insertEditor(this.editor, this.genYaml());
          this.close();
        })
      );
  }

  private genYaml() {
    const type = this.chartSetting.type;
    const data = { data: this.chartSetting.config.data };
    const options = { options: { ...this.chartSetting.config } };
    delete options.options.data;

    return `\
\`\`\`chartsview
#-----------------#
#- chart type    -#
#-----------------#
type: ${type}

#-----------------#
#- chart data    -#
#-----------------#
${stringifyYaml(data)}\

#-----------------#
#- chart options -#
#-----------------#
${stringifyYaml(options)}\
\`\`\`
`;
  }

  private isNotEmpty(value: unknown[]) {
    return value !== undefined && value.length > 0;
  }

  onClose() {
    unmountComponentAtNode(this.chartEl);
    this.contentEl.empty();
  }
}