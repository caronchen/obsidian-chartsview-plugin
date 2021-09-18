import { fileDialog } from 'file-select-dialog';
import yaml from 'js-yaml';

import React from 'react';
import ReactDOM from 'react-dom';

import { MarkdownPostProcessorContext, Plugin, Platform } from 'obsidian';
import { Chart } from './components/Chart';
import { G2 } from "@ant-design/charts";
import { parseConfig } from './parser';
import { ChartsViewPluginSettings, ChartsViewSettingTab, DEFAULT_SETTINGS } from './settings';
import { insertEditor, parseCsv } from './tools';
import { ChartTemplateSuggestModal } from './components/Modal';

const CSV_FILE_EXTENSION = "csv";
const VIEW_TYPE_CSV = "csv";

export default class ChartsViewPlugin extends Plugin {
	settings: ChartsViewPluginSettings;

	async ChartsViewProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		ReactDOM.unmountComponentAtNode(el);
		try {
			const chartProps = await parseConfig(source, this);
			const cfg = chartProps.config;
			const isBackgroundColorCustomed = cfg.theme && (cfg.theme.background || (cfg.theme.styleSheet && cfg.theme.styleSheet.backgroundColor));
			cfg.theme = cfg.theme || G2.getTheme(this.settings.theme);
			cfg.backgroundColor = isBackgroundColorCustomed ? undefined : this.settings.backgroundColor;
			cfg.padding = [this.settings.paddingTop, this.settings.paddingRight, this.settings.paddingBottom, this.settings.paddingLeft];
			ReactDOM.render(
				<Chart {...chartProps} />,
				el
			);
		} catch (e) {
			ReactDOM.render(
				<div style={{ color: 'var(--text-title-h1)' }}>{e.toString()}</div>,
				el
			);
		}
	};

	async onload() {
		try {
			await this.loadSettings();
			this.addSettingTab(new ChartsViewSettingTab(this.app, this));
			this.registerMarkdownCodeBlockProcessor("chartsview", this.ChartsViewProcessor.bind(this));
			
			this.addCommand({
				id: 'insert-chartsview-template',
				name: 'Insert Template ...',
				editorCallback: (editor) => {
					new ChartTemplateSuggestModal(this.app, editor).open();
				}
			});

			if (Platform.isDesktopApp) {
				this.addCommand({
					id: `import-chartsview-data-csv`,
					name: `Import data from external CSV file`,
					editorCallback: async (editor) => {
						const file = await fileDialog({ accept: '.csv', strict: true });
						const content = await file.text();
						const records = parseCsv(content);
						
						insertEditor(
							editor,
							yaml.dump(records, { quotingType: '"', noRefs: true })
								.replace(/\n/g, "\n" + " ".repeat(editor.getCursor().ch))
						);
					}
				});
			}
		} catch (error) {
			console.log(`Load error. ${error}`);
		}

		try {
			this.registerExtensions([CSV_FILE_EXTENSION], VIEW_TYPE_CSV);
		} catch (error) {
			console.log(`Existing file extension ${CSV_FILE_EXTENSION}`);
		}
		console.log('Loaded Charts View plugin');
	}

	onunload() {
		console.log('Unloading Charts View plugin');
	}

	async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}