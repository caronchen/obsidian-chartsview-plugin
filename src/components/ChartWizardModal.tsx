import { App, Editor, Modal, Setting, stringifyYaml, TFile, TFolder, Vault } from "obsidian";
import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { ChartsViewPluginSettings } from "src/settings";
import { Chart, ChartProps } from "./Chart";
import { insertEditor, parseCsv } from "src/tools";

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

type DataSource = 'manual' | 'csv';

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
const DATA_SOURCE_LABELS: Record<DataSource, string> = {
  manual: 'Manual',
  csv: 'CSV',
};

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
  dataSource: DataSource;
  selectedCsvFiles: string[];
  csvColumns: string[];
  csvColumnsSource: string | null;
  csvPreviewData: Record<string, unknown>[];
  csvError: string | null;
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
    this.dataSource = 'manual';
    this.selectedCsvFiles = [];
    this.csvColumns = [];
    this.csvColumnsSource = null;
    this.csvPreviewData = [];
    this.csvError = null;
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
    if (this.dataSource === 'csv') {
      const currentSource = this.selectedCsvFiles.find(Boolean) ?? null;
      if (this.csvColumns.length === 0 || this.csvColumnsSource !== currentSource) {
        void this.updateCsvColumns();
      } else {
        this.renderChart();
      }
    } else {
      this.renderChart();
    }
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
      .setName("Data Source")
      .addDropdown(dropdown => dropdown
        .addOptions(DATA_SOURCE_LABELS)
        .setValue(this.dataSource)
        .onChange(value => {
          this.dataSource = value as DataSource;
          this.displayContent();
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

    if (this.dataSource === 'csv') {
      this.createCsvSettings();
    } else {
      this.createManualSettings();
    }
  }

  private createManualSettings() {
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

  private createCsvSettings() {
    const csvOptions = this.getCsvFileOptions();
    const csvOptionKeys = Object.keys(csvOptions);
    const hasCsvFiles = csvOptionKeys.length > 0;

    if (this.selectedCsvFiles.length === 0 && hasCsvFiles) {
      this.selectedCsvFiles = [csvOptionKeys[0]];
    }

    if (!hasCsvFiles) {
      new Setting(this.contentEl)
        .setName("CSV Files")
        .setDesc("No CSV files found in the data folder.");
    }

    this.selectedCsvFiles.forEach((file, index) => {
      new Setting(this.contentEl)
        .setName(index === 0 ? "CSV Files" : "")
        .addDropdown(dropdown => dropdown
          .addOptions(hasCsvFiles ? csvOptions : { "": "" })
          .setValue(file ?? "")
          .onChange(value => {
            this.selectedCsvFiles[index] = value;
            void this.updateCsvColumns();
          })
        )
        .addButton(button => button
          .setButtonText("Remove")
          .onClick(() => {
            this.selectedCsvFiles.splice(index, 1);
            this.displayContent();
          })
        );
    });

    if (hasCsvFiles) {
      new Setting(this.contentEl)
        .setName("")
        .addButton(button => button
          .setButtonText("Add CSV File")
          .onClick(() => {
            this.selectedCsvFiles.push(csvOptionKeys[0]);
            this.displayContent();
          })
        );
    }

    const preferences = this.getChartPreferences();
    const columnOptions = this.getCsvColumnOptions();

    for (let i = 0; i < this.valueNumber; i++) {
      new Setting(this.contentEl)
        .setName(i === 0 ? `Values (${preferences.valuesFieldKey})` : "")
        .addDropdown(dropdown => dropdown
          .addOptions(columnOptions)
          .setValue(this.dataValues[i]?.field ?? "")
          .onChange(value => {
            if (this.dataValues[i] === undefined) {
              this.dataValues[i] = {} as DataType;
            }
            this.dataValues[i].field = value;
            this.renderChart();
          })
        );
    }

    new Setting(this.contentEl)
      .setName(`Labels (${preferences.labelsFieldKey})`)
      .addDropdown(dropdown => dropdown
        .addOptions(columnOptions)
        .setValue(this.dataLabels.field ?? "")
        .onChange(value => {
          this.dataLabels.field = value;
          this.renderChart();
        })
      );

    if (preferences.seriesFieldKey) {
      new Setting(this.contentEl)
        .setName(`Series (${preferences.seriesFieldKey})`)
        .addDropdown(dropdown => dropdown
          .addOptions(columnOptions)
          .setValue(this.dataSeries.field ?? "")
          .onChange(value => {
            this.dataSeries.field = value;
            this.renderChart();
          })
        );
    }

    if (this.csvError) {
      new Setting(this.contentEl)
        .setName("CSV Error")
        .setDesc(this.csvError);
    }
  }

  private renderChart() {
    this.dataSeries.field = this.dataSeries.field ?? 'serie';
    this.dataLabels.field = this.dataLabels.field ?? 'label';
    for (let i = 0; i < this.valueNumber; i++) {
      if (this.dataValues[i] === undefined) {
        this.dataValues[i] = { field: this.dataValues[0]?.field ?? 'value', value: [] } as DataType;
      }
    }
    this.dataValues[0].field = this.dataValues[0].field ?? 'value';

    this.chartSetting.config = {};
    const preferences = this.getChartPreferences();

    if (this.dataSource === 'csv') {
      if (preferences.seriesFieldKey) {
        this.chartSetting.config[preferences.seriesFieldKey] = this.dataSeries.field;
      }
      this.chartSetting.config[preferences.labelsFieldKey] = this.dataLabels.field;
      this.chartSetting.config[preferences.valuesFieldKey] = (this.valueNumber === 1
        ? this.dataValues[0].field
        : this.dataValues.map(item => item.field));
      this.chartSetting.config.data = this.csvPreviewData ?? [];
    } else {
      this.isNotEmpty(this.dataSeries.value) &&
        (this.chartSetting.config[preferences.seriesFieldKey] = this.dataSeries.field);
      this.isNotEmpty(this.dataLabels.value) &&
        (this.chartSetting.config[preferences.labelsFieldKey] = this.dataLabels.field);
      this.isNotEmpty(this.dataValues) &&
        (this.chartSetting.config[preferences.valuesFieldKey] = (this.valueNumber === 1
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
    }

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
    const data = this.dataSource === 'csv'
      ? { data: this.selectedCsvFiles.filter(Boolean).join(", ") }
      : { data: this.chartSetting.config.data };
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

  private getChartPreferences(): Preferences {
    return ChartPreferences[this.chartSetting.type] ?? DEFAULT;
  }

  private getCsvFileOptions(): Record<string, string> {
    const options: Record<string, string> = {};
    const prefix = this.getDataPathPrefix();
    const files = this.getCsvFiles();
    for (const file of files) {
      let name = file.path;
      if (prefix && name.startsWith(prefix)) {
        name = name.slice(prefix.length);
      }
      options[name] = name;
    }
    return options;
  }

  private getCsvFiles(): TFile[] {
    const dataPath = this.settings.dataPath === '/' ? '' : this.settings.dataPath;
    const root = dataPath
      ? this.app.vault.getAbstractFileByPath(dataPath)
      : this.app.vault.getRoot();
    const files: TFile[] = [];
    if (root instanceof TFolder) {
      Vault.recurseChildren(root, (child) => {
        if (child instanceof TFile && child.path.toLowerCase().endsWith('.csv')) {
          files.push(child);
        }
      });
    }
    return files;
  }

  private getDataPathPrefix(): string {
    const dataPath = this.settings.dataPath === '/' ? '' : this.settings.dataPath;
    return dataPath ? `${dataPath}/` : '';
  }

  private resolveCsvFilePath(name: string): string {
    const dataPath = this.settings.dataPath === '/' ? '' : this.settings.dataPath;
    return dataPath ? `${dataPath}/${name}` : name;
  }

  private getCsvColumnOptions(): Record<string, string> {
    const options: Record<string, string> = {};
    for (const column of this.csvColumns) {
      options[column] = column;
    }
    if (Object.keys(options).length === 0) {
      options[""] = "";
    }
    return options;
  }

  private async updateCsvColumns() {
    this.csvColumns = [];
    this.csvColumnsSource = null;
    this.csvPreviewData = [];
    this.csvError = null;
    const firstFile = this.selectedCsvFiles.find(Boolean);
    if (!firstFile) {
      this.renderChart();
      return;
    }

    const path = this.resolveCsvFilePath(firstFile);
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      this.csvError = `CSV file not found: ${firstFile}`;
      this.renderChart();
      return;
    }

    try {
      const content = await this.app.vault.read(file);
      const parsed = parseCsv(content);
      if (Array.isArray(parsed)) {
        this.csvPreviewData = parsed as Record<string, unknown>[];
        const firstRow = this.csvPreviewData[0] as Record<string, unknown> | undefined;
        this.csvColumns = firstRow ? Object.keys(firstRow) : [];
        this.csvColumnsSource = firstFile;
        if (this.csvColumns.length > 0) {
          if (!this.dataLabels.field || !this.csvColumns.includes(this.dataLabels.field)) {
            this.dataLabels.field = this.csvColumns[0];
          }
          for (let i = 0; i < this.valueNumber; i++) {
            if (this.dataValues[i] === undefined) {
              this.dataValues[i] = {} as DataType;
            }
            if (!this.dataValues[i].field || !this.csvColumns.includes(this.dataValues[i].field)) {
              this.dataValues[i].field = this.csvColumns[0];
            }
          }
          if (!this.dataSeries.field || !this.csvColumns.includes(this.dataSeries.field)) {
            this.dataSeries.field = this.csvColumns[0];
          }
        }
      }
    } catch (error) {
      this.csvError = `${error}`;
    }
    this.displayContent();
  }

  onClose() {
    unmountComponentAtNode(this.chartEl);
    this.contentEl.empty();
  }
}