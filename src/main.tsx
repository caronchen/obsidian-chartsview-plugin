import { fileDialog } from 'file-select-dialog';
import yaml from 'js-yaml';

import React from 'react';
import ReactDOM from "react-dom";

import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { Chart } from './components/Chart';
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
			chartProps.config["theme"] = chartProps.config["theme"] || this.settings.theme;
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

		try {
			this.registerExtensions([CSV_FILE_EXTENSION], VIEW_TYPE_CSV);
		} catch (error) {
			console.log(`Existing file extension ${CSV_FILE_EXTENSION}`);
		}

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