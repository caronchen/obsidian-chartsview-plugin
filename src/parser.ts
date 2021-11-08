import { parseYaml, TFile } from "obsidian";
import Charts from '@ant-design/charts';
import { ChartProps, DataType } from "./components/Chart";
import ChartsViewPlugin from "./main";
import { getWordCount, parseCsv } from "./tools";
import { DataviewApi, DataObject, Link, DateTime } from "obsidian-dataview";

const functionRegex = /^[\s\n]*function[\s\n]+[\w\W]*\([\w\W]*\)[\s\n]*\{[\w\W]*\}[\s\n]*/i;

type DataOptionType = DataType | Options | string;

interface Options {
    [key: string]: any;
}

interface DataProps {
    type: string;
    options?: Options;
    data?: DataType;
    [key: string]: DataOptionType;
}

export async function parseConfig(content: string, plugin: ChartsViewPlugin, sourcePath: string): Promise<ChartProps> {
    const dataProps = parseYaml(content) as DataProps;
    const type = dataProps["type"];

    const chart = Charts[type as keyof typeof Charts];
    if (chart === undefined) {
        throw new Error(`Unsupported chart type ${type}.`);
    }

    const data: DataType = dataProps["data"];
    const options = stringToFunction(dataProps["options"] || {});

    if (type == "MultiView" || type == "Mix") {
        return {
            type,
            config: await parseMultiViewConfig(dataProps, data, options, plugin, sourcePath)
        };
    } else {
        return {
            type,
            config: { data: await loadFromFile(data, plugin, sourcePath), ...options }
        };
    }
}

function stringToFunction(options: Options): object {
    for (const key in options) {
        const value = options[key];
        if (value) {
            if (typeof value === "string" && functionRegex.test(value)) {
                options[key] = eval(`(${value})`);
            } else if (Array.isArray(value)) {
                options[key] = value.map(stringToFunction);
            } else if (typeof value === "object") {
                options[key] = stringToFunction(value);
            }
        }
    }
    return options;
}

async function parseMultiViewConfig(dataProps: DataProps, data: DataType, options: Options, plugin: ChartsViewPlugin, sourcePath: string): Promise<{}> {
    const temp = new Map<string, any>();
    const views: {}[] = [];

    for (const key in dataProps) {
        const keyParts = key.split(".");
        if (keyParts.length !== 2
            || (keyParts[0] !== "options" && keyParts[0] !== "data")) {
            continue;
        }

        const viewType = keyParts[1]; 
        const view = temp.get(viewType) || {};
        view[keyParts[0]] = dataProps[key];
        temp.set(viewType, view);
    }

    for (let v of temp.values()) {
        views.push({ data: await loadFromFile(v["data"], plugin, sourcePath) || data, ...v["options"] });
    }

    return { views, ...options };
}

async function loadFromFile(data: DataOptionType, plugin: ChartsViewPlugin, sourcePath: string): Promise<DataType> {
    if (typeof data === "string") {
        if (data.startsWith("wordcount:")) {
            return loadFromMdWordCount(data.replace("wordcount:", ""), plugin);
        } else if (data.startsWith("dataviewjs:")) {
            return loadFromDataViewPlugin(data.replace("dataviewjs:", ""), plugin, sourcePath);
        } else {
            return loadFromCsv(data, plugin);
        }
    } else {
        return data;
    }
}

const dataViewApiProxy = function (api: DataviewApi, currentFilePath: string) {
    return {
        pagePaths: function (query?: string): any {
            return api.pagePaths(query, currentFilePath);
        },
        page: function (path: string | Link): DataObject | undefined {
            return api.page(path, currentFilePath);
        },
        pages: function (query?: string): any {
            return api.pages(query, currentFilePath);
        },
        current: function (): Record<string, any> | undefined {
            return api.page(currentFilePath, currentFilePath);
        },
        array: function (raw: any): any {
            return api.array(raw);
        },
        isArray: function (raw: any): raw is any | Array<any> {
            return api.isArray(raw);
        },
        fileLink: function (path: string, embed: boolean = false, display?: string) {
            // @ts-ignore
            return Link.file(path, embed, display);
        },
        date: function (pathlike: string | Link | DateTime): DateTime | null {
            return api.date(pathlike);
        }
    }
};

async function loadFromDataViewPlugin(content: string, plugin: ChartsViewPlugin, sourcePath: string): Promise<DataType> {
    if (plugin.app.plugins.enabledPlugins.has("dataview")) {
        const api: DataviewApi = plugin.app.plugins.plugins.dataview?.api;
        if (api) {
            return new Function("dv", content).call(undefined, dataViewApiProxy(api, sourcePath));
        } else {
            throw new Error(`Obsidian Dataview is not ready.`);
        }
    } else {
        throw new Error(`Obsidian Dataview is required.`);
    }
}

async function loadFromMdWordCount(fileName: string, plugin: ChartsViewPlugin): Promise<DataType> {
    for (const file of plugin.app.vault.getMarkdownFiles()) {
        if (file.basename == fileName) {
            const content = await plugin.app.vault.cachedRead(file);
            return getWordCount(content, plugin.settings.wordCountFilter);
        }
    }
    throw new Error(`Note not found.`);
}

async function loadFromCsv(data: string, plugin: ChartsViewPlugin): Promise<DataType> {
    const csvFileNames = data.split(",");
    const value = [];
    for (let name of csvFileNames.values()) {
        const file = plugin.app.vault.getAbstractFileByPath(plugin.settings.dataPath + "/" + name.trim());
        if (file instanceof TFile) {
            value.push(parseCsv(await plugin.app.vault.read(file)));
        } else {
            value.push({});
        }
    }
    if (value.length == 0) {
        return {};
    } 
    if (value.length == 1) {
        return value[0];
    }
    return value;
}