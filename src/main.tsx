import { fileDialog } from 'file-select-dialog';
import yaml from 'js-yaml';

import React from 'react';
import ReactDOM from "react-dom";
import parse from 'csv-parse/lib/sync';

import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { Chart } from './components/Chart';
import { parseConfig } from './parser';
import { ChartsViewPluginSettings, ChartsViewSettingTab, DEFAULT_SETTINGS } from './settings';
import { TEMPLATES } from './templates';
import { insertEditor } from './tools';

const CSV_FILE_EXTENSION = "csv";
const VIEW_TYPE_CSV = "csv";

export default class ChartsViewPlugin extends Plugin {
	settings: ChartsViewPluginSettings;

	async ChartsViewProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		ReactDOM.unmountComponentAtNode(el);
		try {
			const chartProps = parseConfig(source);
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

		for (const key in TEMPLATES) {
			this.addCommand({
				id: `insert-chartsview-template-${key}`,
				name: `Insert Template - ${key}`,
				editorCallback: (editor) => {
					insertEditor(
						editor,
						Buffer.from(TEMPLATES[key as keyof typeof TEMPLATES], "base64").toString("utf8")
					);
				}
			});
		}

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
				const records = parse(content, {
					columns: true,
					skip_empty_lines: true,
				});

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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}