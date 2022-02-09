import { parseYaml, TFile, TFolder } from "obsidian";
import * as Plots from '@ant-design/plots';
import * as Graphs from '@ant-design/graphs';
import { ChartProps, DataType } from "./components/Chart";
import ChartsViewPlugin from "./main";
import { getWordCount, parseCsv } from "./tools";
import { DataviewAPI, Link, DateTime, LiteralValue } from "obsidian-dataview";
import { DataArray } from "obsidian-dataview/lib/api/data-array";

const functionRegex = /^\s*function\s*.*\(.*\)\s*\{[\w\W]*\}\s*/i;

type Options = Record<string, unknown | string | Options[]>

type DataOptionType = DataType | Options | string;

interface DataProps {
    type: string;
    options?: Options;
    data?: DataType;
    [key: string]: DataOptionType;
}

export async function parseConfig(content: string, plugin: ChartsViewPlugin, sourcePath: string): Promise<ChartProps> {
    const dataProps = parseYaml(content) as DataProps;
    const type = dataProps.type;

    // @ts-ignore
    const chart = Plots[type] || Graphs[type];
    if (chart === undefined) {
        throw new Error(`Unsupported chart type ${type}.`);
    }

    const data: DataType = dataProps.data;
    const options = stringToFunction(dataProps.options || {});

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

function stringToFunction(options: Options): Options {
    for (const key in options) {
        const value = options[key];
        if (value) {
            if (typeof value === "string" && functionRegex.test(value)) {
                options[key] = (0, eval)(`(${value})`);
            } else if (Array.isArray(value)) {
                options[key] = value.map(stringToFunction);
            } else if (typeof value === "object") {
                options[key] = stringToFunction(value as Options);
            }
        }
    }
    return options;
}

async function parseMultiViewConfig(dataProps: DataProps, data: DataType, options: Options, plugin: ChartsViewPlugin, sourcePath: string): Promise<Record<string, unknown>> {
    const temp = new Map<string, Record<string, unknown>>();
    const views: Record<string, unknown>[] = [];

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

    for (const v of temp.values()) {
        views.push({ data: await loadFromFile(v["data"], plugin, sourcePath) || data, ...stringToFunction(v["options"] as Options || {}) });
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

const dataViewApiProxy = function (api: DataviewAPI, currentFilePath: string) {
    return {
        pagePaths: function (query?: string): DataArray<string> {
            return api.pagePaths(query, currentFilePath);
        },
        page: function (path: string | Link): Record<string, LiteralValue> | undefined {
            return api.page(path, currentFilePath);
        },
        pages: function (query?: string): DataArray<Record<string, LiteralValue>> {
            return api.pages(query, currentFilePath);
        },
        current: function (): Record<string, LiteralValue> | undefined {
            return api.page(currentFilePath, currentFilePath);
        },
        array: function (raw: unknown): DataArray<any> {
            return api.array(raw);
        },
        isArray: function (raw: unknown): raw is DataArray<any> | Array<any> {
            return api.isArray(raw);
        },
        fileLink: function (path: string, embed?: boolean, display?: string): Link {
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
        const api: DataviewAPI = plugin.app.plugins.plugins.dataview?.api;
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
    const fileOrPaths = fileName.split(",");
    const contents: Array<string> = [];
    for (const file of plugin.app.vault.getMarkdownFiles()) {
        if (file.basename == fileName || fileOrPaths.contains(file.basename) || containedParent(file.parent, fileOrPaths)) {
            const content = await plugin.app.vault.cachedRead(file);
            contents.push(content);
        }
    }
    if (contents.length == 0) {
        throw new Error("No words found.");
    }
    return getWordCount(contents.join("\n"), plugin.settings.wordCountFilter);
}

function containedParent(folder: TFolder, fileOrPaths: Array<string>): boolean {
    const contained = fileOrPaths.contains(`${folder.name}/`);
    if (contained || folder.parent == undefined) {
        return contained;
    } else {
        return containedParent(folder.parent, fileOrPaths);
    }
}

async function loadFromCsv(data: string, plugin: ChartsViewPlugin): Promise<DataType> {
    const csvFileNames = data.split(",");
    const value = [];
    for (const name of csvFileNames.values()) {
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