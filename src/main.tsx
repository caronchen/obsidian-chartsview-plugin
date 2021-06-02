import React from 'react';
import ReactDOM from "react-dom";

import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { Chart } from './components/Chart';
import { parseConfig } from './parser';
import { ChartsViewPluginSettings, ChartsViewSettingTab, DEFAULT_SETTINGS } from './settings';
import { TEMPLATES } from './templates';

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
		console.log('Loading Charts View plugin');
		await this.loadSettings();
		this.addSettingTab(new ChartsViewSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor("chartsview", this.ChartsViewProcessor.bind(this));

		for (const key in TEMPLATES) {
			this.addCommand({
				id: `insert-chartsview-template-${key}`,
				name: `Insert Template - ${key}`,
				editorCallback: (editor) => {
					const codeBlock = Buffer.from(TEMPLATES[key as keyof typeof TEMPLATES], "base64").toString("utf8");
					editor.somethingSelected
					?
					editor.replaceSelection(codeBlock)
					:
					editor.setLine(
						editor.getCursor().line,
						codeBlock
					);
				}
			});
		}
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