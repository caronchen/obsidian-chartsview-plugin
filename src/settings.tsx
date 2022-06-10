import { App, Platform, PluginSettingTab, Setting } from 'obsidian';
import ChartsViewPlugin from "./main";
import { getFolderOptions } from './tools';

export interface ChartsViewPluginSettings {
	dataPath: string;
	theme: string;
	backgroundColor: string;
	paddingTop: number;
	paddingRight: number;
	paddingBottom: number;
	paddingLeft: number;
	wordCountFilter: string;
	showExportBtn: boolean;
}

export const DEFAULT_SETTINGS: ChartsViewPluginSettings = {
	theme: 'default',
	dataPath: '',
	backgroundColor: 'transparent',
	paddingTop: 0,
	paddingRight: 0,
	paddingBottom: 0,
	paddingLeft: 0,
	showExportBtn: false,
	wordCountFilter: `[A-z]{1,2}
[0-9]+
(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)
and
are
but
did
for
get
got
had
has
her
him
his
its
not
our
she
the
was
you
been
from
have
into
mine
ours
that
them
they
this
went
were
with
these
those`
}

export class ChartsViewSettingTab extends PluginSettingTab {

	constructor(app: App, private plugin: ChartsViewPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', {text: 'Charts View Settings'});

		new Setting(containerEl)
			.setName("Theme")
			.setDesc("Choose default color scheme.")
			.addDropdown(dropdown => dropdown
				.addOption("default", "default")
				.addOption("dark", "dark")
				.addOption("theme1", "Theme #1")
				.addOption("theme2", "Theme #2")
				.setValue(this.plugin.settings.theme)
				.onChange(async (value) => {
					this.plugin.settings.theme = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Background Color")
			.setDesc("Change the background color of chart. e.g., #FFFFFF")
			.addText(text => text
				.setPlaceholder("transparent")
				.setValue(this.plugin.settings.backgroundColor)
				.onChange(async (value) => {
					this.plugin.settings.backgroundColor = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Chart Padding")
			.setDesc("Change the padding of chart. (Top, Right, Bottom, Left)")
			.addText(text => {
				text.inputEl.size = 5;
				text
					.setPlaceholder("30")
					.setValue(String(this.plugin.settings.paddingTop))
					.onChange(async (value) => {
						this.plugin.settings.paddingTop = Number(value);
						await this.plugin.saveSettings();
					});
			})
			.addText(text => {
				text.inputEl.size = 5;
				text
					.setPlaceholder("30")
					.setValue(String(this.plugin.settings.paddingRight))
					.onChange(async (value) => {
						this.plugin.settings.paddingRight = Number(value);
						await this.plugin.saveSettings();
					});
			})
			.addText(text => {
				text.inputEl.size = 5;
				text
					.setPlaceholder("30")
					.setValue(String(this.plugin.settings.paddingBottom))
					.onChange(async (value) => {
						this.plugin.settings.paddingBottom = Number(value);
						await this.plugin.saveSettings();
					});
			})
			.addText(text => {
				text.inputEl.size = 5;
				text
					.setPlaceholder("30")
					.setValue(String(this.plugin.settings.paddingLeft))
					.onChange(async (value) => {
						this.plugin.settings.paddingLeft = Number(value);
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Data Folder")
			.setDesc("Choose default folder for loading chart datas.")
			.addDropdown(dropdown => dropdown
				.addOptions(getFolderOptions(this.app))
				.setValue(this.plugin.settings.dataPath)
				.onChange(async (value) => {
					this.plugin.settings.dataPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Show Export Button")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showExportBtn)
				.onChange(async (value) => {
					this.plugin.settings.showExportBtn = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Word Filter")
			.setDesc("For word count, any words in the list will be ignored.")
			.addTextArea(text => {
				text.inputEl.rows = 6;
				text
					.setValue(this.plugin.settings.wordCountFilter)
					.onChange(async (value) => {
						this.plugin.settings.wordCountFilter = value;
						await this.plugin.saveSettings();
					});
			});

		if (Platform.isDesktopApp) {
			const donation = containerEl.createDiv({ cls: "chartsview-donation" });
			donation.createEl('p', {text: "Make a donation to support Charts View plugin development."});

			const link = donation.createEl('a', {href: "https://paypal.me/caronchenhz", cls: "paypal"});
			const img = link.createEl('img');
			img.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTI0cHgiIGhlaWdodD0iMzNweCIgdmlld0JveD0iMCAwIDEyNCAzMyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTI0IDMzIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGw9IiMyNTNCODAiIGQ9Ik00Ni4yMTEsNi43NDloLTYuODM5Yy0wLjQ2OCwwLTAuODY2LDAuMzQtMC45MzksMC44MDJsLTIuNzY2LDE3LjUzN2MtMC4wNTUsMC4zNDYsMC4yMTMsMC42NTgsMC41NjQsMC42NTgNCgloMy4yNjVjMC40NjgsMCwwLjg2Ni0wLjM0LDAuOTM5LTAuODAzbDAuNzQ2LTQuNzNjMC4wNzItMC40NjMsMC40NzEtMC44MDMsMC45MzgtMC44MDNoMi4xNjVjNC41MDUsMCw3LjEwNS0yLjE4LDcuNzg0LTYuNQ0KCWMwLjMwNi0xLjg5LDAuMDEzLTMuMzc1LTAuODcyLTQuNDE1QzUwLjIyNCw3LjM1Myw0OC41LDYuNzQ5LDQ2LjIxMSw2Ljc0OXogTTQ3LDEzLjE1NGMtMC4zNzQsMi40NTQtMi4yNDksMi40NTQtNC4wNjIsMi40NTQNCgloLTEuMDMybDAuNzI0LTQuNTgzYzAuMDQzLTAuMjc3LDAuMjgzLTAuNDgxLDAuNTYzLTAuNDgxaDAuNDczYzEuMjM1LDAsMi40LDAsMy4wMDIsMC43MDRDNDcuMDI3LDExLjY2OCw0Ny4xMzcsMTIuMjkyLDQ3LDEzLjE1NHoiDQoJLz4NCjxwYXRoIGZpbGw9IiMyNTNCODAiIGQ9Ik02Ni42NTQsMTMuMDc1aC0zLjI3NWMtMC4yNzksMC0wLjUyLDAuMjA0LTAuNTYzLDAuNDgxbC0wLjE0NSwwLjkxNmwtMC4yMjktMC4zMzINCgljLTAuNzA5LTEuMDI5LTIuMjktMS4zNzMtMy44NjgtMS4zNzNjLTMuNjE5LDAtNi43MSwyLjc0MS03LjMxMiw2LjU4NmMtMC4zMTMsMS45MTgsMC4xMzIsMy43NTIsMS4yMiw1LjAzMQ0KCWMwLjk5OCwxLjE3NiwyLjQyNiwxLjY2Niw0LjEyNSwxLjY2NmMyLjkxNiwwLDQuNTMzLTEuODc1LDQuNTMzLTEuODc1bC0wLjE0NiwwLjkxYy0wLjA1NSwwLjM0OCwwLjIxMywwLjY2LDAuNTYyLDAuNjZoMi45NQ0KCWMwLjQ2OSwwLDAuODY1LTAuMzQsMC45MzktMC44MDNsMS43Ny0xMS4yMDlDNjcuMjcxLDEzLjM4OCw2Ny4wMDQsMTMuMDc1LDY2LjY1NCwxMy4wNzV6IE02Mi4wODksMTkuNDQ5DQoJYy0wLjMxNiwxLjg3MS0xLjgwMSwzLjEyNy0zLjY5NSwzLjEyN2MtMC45NTEsMC0xLjcxMS0wLjMwNS0yLjE5OS0wLjg4M2MtMC40ODQtMC41NzQtMC42NjgtMS4zOTEtMC41MTQtMi4zMDENCgljMC4yOTUtMS44NTUsMS44MDUtMy4xNTIsMy42Ny0zLjE1MmMwLjkzLDAsMS42ODYsMC4zMDksMi4xODQsMC44OTJDNjIuMDM0LDE3LjcyMSw2Mi4yMzIsMTguNTQzLDYyLjA4OSwxOS40NDl6Ii8+DQo8cGF0aCBmaWxsPSIjMjUzQjgwIiBkPSJNODQuMDk2LDEzLjA3NWgtMy4yOTFjLTAuMzE0LDAtMC42MDksMC4xNTYtMC43ODcsMC40MTdsLTQuNTM5LDYuNjg2bC0xLjkyNC02LjQyNQ0KCWMtMC4xMjEtMC40MDItMC40OTItMC42NzgtMC45MTItMC42NzhoLTMuMjM0Yy0wLjM5MywwLTAuNjY2LDAuMzg0LTAuNTQxLDAuNzU0bDMuNjI1LDEwLjYzOGwtMy40MDgsNC44MTENCgljLTAuMjY4LDAuMzc5LDAuMDAyLDAuOSwwLjQ2NSwwLjloMy4yODdjMC4zMTIsMCwwLjYwNC0wLjE1MiwwLjc4MS0wLjQwOEw4NC41NjQsMTMuOTdDODQuODI2LDEzLjU5Miw4NC41NTcsMTMuMDc1LDg0LjA5NiwxMy4wNzV6DQoJIi8+DQo8cGF0aCBmaWxsPSIjMTc5QkQ3IiBkPSJNOTQuOTkyLDYuNzQ5aC02Ljg0Yy0wLjQ2NywwLTAuODY1LDAuMzQtMC45MzgsMC44MDJsLTIuNzY2LDE3LjUzN2MtMC4wNTUsMC4zNDYsMC4yMTMsMC42NTgsMC41NjIsMC42NTgNCgloMy41MWMwLjMyNiwwLDAuNjA1LTAuMjM4LDAuNjU2LTAuNTYybDAuNzg1LTQuOTcxYzAuMDcyLTAuNDYzLDAuNDcxLTAuODAzLDAuOTM4LTAuODAzaDIuMTY0YzQuNTA2LDAsNy4xMDUtMi4xOCw3Ljc4NS02LjUNCgljMC4zMDctMS44OSwwLjAxMi0zLjM3NS0wLjg3My00LjQxNUM5OS4wMDQsNy4zNTMsOTcuMjgxLDYuNzQ5LDk0Ljk5Miw2Ljc0OXogTTk1Ljc4MSwxMy4xNTRjLTAuMzczLDIuNDU0LTIuMjQ4LDIuNDU0LTQuMDYyLDIuNDU0DQoJaC0xLjAzMWwwLjcyNS00LjU4M2MwLjA0My0wLjI3NywwLjI4MS0wLjQ4MSwwLjU2Mi0wLjQ4MWgwLjQ3M2MxLjIzNCwwLDIuNCwwLDMuMDAyLDAuNzA0DQoJQzk1LjgwOSwxMS42NjgsOTUuOTE4LDEyLjI5Miw5NS43ODEsMTMuMTU0eiIvPg0KPHBhdGggZmlsbD0iIzE3OUJENyIgZD0iTTExNS40MzQsMTMuMDc1aC0zLjI3M2MtMC4yODEsMC0wLjUyLDAuMjA0LTAuNTYyLDAuNDgxbC0wLjE0NSwwLjkxNmwtMC4yMy0wLjMzMg0KCWMtMC43MDktMS4wMjktMi4yODktMS4zNzMtMy44NjctMS4zNzNjLTMuNjE5LDAtNi43MDksMi43NDEtNy4zMTEsNi41ODZjLTAuMzEyLDEuOTE4LDAuMTMxLDMuNzUyLDEuMjE5LDUuMDMxDQoJYzEsMS4xNzYsMi40MjYsMS42NjYsNC4xMjUsMS42NjZjMi45MTYsMCw0LjUzMy0xLjg3NSw0LjUzMy0xLjg3NWwtMC4xNDYsMC45MWMtMC4wNTUsMC4zNDgsMC4yMTMsMC42NiwwLjU2NCwwLjY2aDIuOTQ5DQoJYzAuNDY3LDAsMC44NjUtMC4zNCwwLjkzOC0wLjgwM2wxLjc3MS0xMS4yMDlDMTE2LjA1MywxMy4zODgsMTE1Ljc4NSwxMy4wNzUsMTE1LjQzNCwxMy4wNzV6IE0xMTAuODY5LDE5LjQ0OQ0KCWMtMC4zMTQsMS44NzEtMS44MDEsMy4xMjctMy42OTUsMy4xMjdjLTAuOTQ5LDAtMS43MTEtMC4zMDUtMi4xOTktMC44ODNjLTAuNDg0LTAuNTc0LTAuNjY2LTEuMzkxLTAuNTE0LTIuMzAxDQoJYzAuMjk3LTEuODU1LDEuODA1LTMuMTUyLDMuNjctMy4xNTJjMC45MywwLDEuNjg2LDAuMzA5LDIuMTg0LDAuODkyQzExMC44MTYsMTcuNzIxLDExMS4wMTQsMTguNTQzLDExMC44NjksMTkuNDQ5eiIvPg0KPHBhdGggZmlsbD0iIzE3OUJENyIgZD0iTTExOS4yOTUsNy4yM2wtMi44MDcsMTcuODU4Yy0wLjA1NSwwLjM0NiwwLjIxMywwLjY1OCwwLjU2MiwwLjY1OGgyLjgyMmMwLjQ2OSwwLDAuODY3LTAuMzQsMC45MzktMC44MDMNCglsMi43NjgtMTcuNTM2YzAuMDU1LTAuMzQ2LTAuMjEzLTAuNjU5LTAuNTYyLTAuNjU5aC0zLjE2QzExOS41NzgsNi43NDksMTE5LjMzOCw2Ljk1MywxMTkuMjk1LDcuMjN6Ii8+DQo8cGF0aCBmaWxsPSIjMjUzQjgwIiBkPSJNNy4yNjYsMjkuMTU0bDAuNTIzLTMuMzIybC0xLjE2NS0wLjAyN0gxLjA2MUw0LjkyNywxLjI5MkM0LjkzOSwxLjIxOCw0Ljk3OCwxLjE0OSw1LjAzNSwxLjENCgljMC4wNTctMC4wNDksMC4xMy0wLjA3NiwwLjIwNi0wLjA3Nmg5LjM4YzMuMTE0LDAsNS4yNjMsMC42NDgsNi4zODUsMS45MjdjMC41MjYsMC42LDAuODYxLDEuMjI3LDEuMDIzLDEuOTE3DQoJYzAuMTcsMC43MjQsMC4xNzMsMS41ODksMC4wMDcsMi42NDRsLTAuMDEyLDAuMDc3djAuNjc2bDAuNTI2LDAuMjk4YzAuNDQzLDAuMjM1LDAuNzk1LDAuNTA0LDEuMDY1LDAuODEyDQoJYzAuNDUsMC41MTMsMC43NDEsMS4xNjUsMC44NjQsMS45MzhjMC4xMjcsMC43OTUsMC4wODUsMS43NDEtMC4xMjMsMi44MTJjLTAuMjQsMS4yMzItMC42MjgsMi4zMDUtMS4xNTIsMy4xODMNCgljLTAuNDgyLDAuODA5LTEuMDk2LDEuNDgtMS44MjUsMmMtMC42OTYsMC40OTQtMS41MjMsMC44NjktMi40NTgsMS4xMDljLTAuOTA2LDAuMjM2LTEuOTM5LDAuMzU1LTMuMDcyLDAuMzU1aC0wLjczDQoJYy0wLjUyMiwwLTEuMDI5LDAuMTg4LTEuNDI3LDAuNTI1Yy0wLjM5OSwwLjM0NC0wLjY2MywwLjgxNC0wLjc0NCwxLjMyOGwtMC4wNTUsMC4yOTlsLTAuOTI0LDUuODU1bC0wLjA0MiwwLjIxNQ0KCWMtMC4wMTEsMC4wNjgtMC4wMywwLjEwMi0wLjA1OCwwLjEyNWMtMC4wMjUsMC4wMjEtMC4wNjEsMC4wMzUtMC4wOTYsMC4wMzVINy4yNjZ6Ii8+DQo8cGF0aCBmaWxsPSIjMTc5QkQ3IiBkPSJNMjMuMDQ4LDcuNjY3TDIzLjA0OCw3LjY2N0wyMy4wNDgsNy42NjdjLTAuMDI4LDAuMTc5LTAuMDYsMC4zNjItMC4wOTYsMC41NQ0KCWMtMS4yMzcsNi4zNTEtNS40NjksOC41NDUtMTAuODc0LDguNTQ1SDkuMzI2Yy0wLjY2MSwwLTEuMjE4LDAuNDgtMS4zMjEsMS4xMzJsMCwwbDAsMEw2LjU5NiwyNi44M2wtMC4zOTksMi41MzMNCgljLTAuMDY3LDAuNDI4LDAuMjYzLDAuODE0LDAuNjk1LDAuODE0aDQuODgxYzAuNTc4LDAsMS4wNjktMC40MiwxLjE2LTAuOTlsMC4wNDgtMC4yNDhsMC45MTktNS44MzJsMC4wNTktMC4zMg0KCWMwLjA5LTAuNTcyLDAuNTgyLTAuOTkyLDEuMTYtMC45OTJoMC43M2M0LjcyOSwwLDguNDMxLTEuOTIsOS41MTMtNy40NzZjMC40NTItMi4zMjEsMC4yMTgtNC4yNTktMC45NzgtNS42MjINCglDMjQuMDIyLDguMjg2LDIzLjU3Myw3Ljk0NSwyMy4wNDgsNy42Njd6Ii8+DQo8cGF0aCBmaWxsPSIjMjIyRDY1IiBkPSJNMjEuNzU0LDcuMTUxYy0wLjE4OS0wLjA1NS0wLjM4NC0wLjEwNS0wLjU4NC0wLjE1Yy0wLjIwMS0wLjA0NC0wLjQwNy0wLjA4My0wLjYxOS0wLjExNw0KCWMtMC43NDItMC4xMi0xLjU1NS0wLjE3Ny0yLjQyNi0wLjE3N2gtNy4zNTJjLTAuMTgxLDAtMC4zNTMsMC4wNDEtMC41MDcsMC4xMTVDOS45MjcsNi45ODUsOS42NzUsNy4zMDYsOS42MTQsNy42OTlMOC4wNSwxNy42MDUNCglsLTAuMDQ1LDAuMjg5YzAuMTAzLTAuNjUyLDAuNjYtMS4xMzIsMS4zMjEtMS4xMzJoMi43NTJjNS40MDUsMCw5LjYzNy0yLjE5NSwxMC44NzQtOC41NDVjMC4wMzctMC4xODgsMC4wNjgtMC4zNzEsMC4wOTYtMC41NQ0KCWMtMC4zMTMtMC4xNjYtMC42NTItMC4zMDgtMS4wMTctMC40MjlDMjEuOTQxLDcuMjA4LDIxLjg0OCw3LjE3OSwyMS43NTQsNy4xNTF6Ii8+DQo8cGF0aCBmaWxsPSIjMjUzQjgwIiBkPSJNOS42MTQsNy42OTljMC4wNjEtMC4zOTMsMC4zMTMtMC43MTQsMC42NTItMC44NzZjMC4xNTUtMC4wNzQsMC4zMjYtMC4xMTUsMC41MDctMC4xMTVoNy4zNTINCgljMC44NzEsMCwxLjY4NCwwLjA1NywyLjQyNiwwLjE3N2MwLjIxMiwwLjAzNCwwLjQxOCwwLjA3MywwLjYxOSwwLjExN2MwLjIsMC4wNDUsMC4zOTUsMC4wOTUsMC41ODQsMC4xNQ0KCWMwLjA5NCwwLjAyOCwwLjE4NywwLjA1NywwLjI3OCwwLjA4NmMwLjM2NSwwLjEyMSwwLjcwNCwwLjI2NCwxLjAxNywwLjQyOWMwLjM2OC0yLjM0Ny0wLjAwMy0zLjk0NS0xLjI3Mi01LjM5Mg0KCUMyMC4zNzgsMC42ODIsMTcuODUzLDAsMTQuNjIyLDBoLTkuMzhjLTAuNjYsMC0xLjIyMywwLjQ4LTEuMzI1LDEuMTMzTDAuMDEsMjUuODk4Yy0wLjA3NywwLjQ5LDAuMzAxLDAuOTMyLDAuNzk1LDAuOTMyaDUuNzkxDQoJbDEuNDU0LTkuMjI1TDkuNjE0LDcuNjk5eiIvPg0KPC9zdmc+DQo=";
			img.alt = "PayPal";
		}
	}
}
