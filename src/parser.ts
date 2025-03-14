import { parseYaml, TFile, TFolder } from "obsidian";
import * as Plots from '@ant-design/plots';
import * as Graphs from '@ant-design/graphs';
import { getTheme } from '@antv/g2';
import { ChartProps, DataType } from "./components/Chart";
import ChartsViewPlugin from "./main";
import { AsyncFunction, getWordCount, parseCsv } from "./tools";
import { DataviewApi, Link, DateTime, Literal, Query, Result } from "obsidian-dataview";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import { QueryApiSettings, QueryResult } from "obsidian-dataview/lib/api/plugin-api";

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
    const { type, data } = dataProps;

    // @ts-ignore
    const chart = Plots[type] || Graphs[type];
    if (chart === undefined) {
        throw new Error(`Unsupported chart type ${type}.`);
    }

    const options = stringToFunction(dataProps.options || {});
    const config = (type === "MultiView" || type === "Mix") ?
        await parseMultiViewConfig(dataProps, data, options, plugin, sourcePath)
        :
        { data: await loadFromFile(data, plugin, sourcePath, options), ...customOptions(options, plugin) };

    //@ts-ignore
    const useDefaultBgColor = config.theme?.background === undefined && config.theme?.styleSheet?.backgroundColor === undefined;

    config.theme = config.theme ?? getTheme(plugin.settings.theme);

    if (useDefaultBgColor) {
        //@ts-ignore
        config.theme.background = plugin.settings.backgroundColor;
    }

    config.appendPadding = config.appendPadding ?? [
        plugin.settings.paddingTop, plugin.settings.paddingRight,
        plugin.settings.paddingBottom, plugin.settings.paddingLeft
    ];

    return {
        type,
        showExportBtn: plugin.settings.showExportBtn,
        config
    };
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

function customOptions(options: Options, plugin: ChartsViewPlugin): Options {
    const { enableSearchInteraction, interactions } = options;
    if (enableSearchInteraction !== true && typeof enableSearchInteraction !== "object") {
        return options;
    }

    const customedInteractions = interactions ?? [];
    if (!Array.isArray(customedInteractions)) {
        return options;
    }

    const interaction = {
        type: "obsidian-search",
        cfg: {
            start: [{
                trigger: "element:click",
                action: "obsidian-search:default",
                arg: {
                    field: 'text',
                    pathField: 'path',
                    vault: plugin.app.vault.getName()
                }
            }]
        }
    }
    if (typeof enableSearchInteraction === "object") {
        //@ts-ignore
        interaction.cfg.start[0].action = `obsidian-search:${enableSearchInteraction.operator ?? "default"}`;
        //@ts-ignore
        interaction.cfg.start[0].arg.field = enableSearchInteraction.field ?? "text";
        //@ts-ignore
        interaction.cfg.start[0].arg.pathField = enableSearchInteraction.pathField ?? "path";
    }
    customedInteractions.push(interaction);

    delete options.enableSearchInteraction;

    options.interactions = customedInteractions;
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
        views.push({ data: await loadFromFile(v["data"], plugin, sourcePath, options) || data, ...customOptions(stringToFunction(v["options"] as Options || {}), plugin) });
    }

    return { views, ...options };
}

async function loadFromFile(data: DataOptionType, plugin: ChartsViewPlugin, sourcePath: string, options: Options): Promise<DataType> {
    if (typeof data === "string") {
        if (data.startsWith("wordcount:")) {
            const file = data.replace("wordcount:", "");
            return loadFromMdWordCount(file.length > 0 ? file : (plugin.app.vault.getAbstractFileByPath(sourcePath) as TFile).basename, plugin, options);
        } else if (data.startsWith("dataviewjs:")) {
            return loadFromDataviewPlugin(data.replace("dataviewjs:", ""), plugin, sourcePath);
        } else {
            return loadFromCsv(data, plugin);
        }
    } else {
        return data;
    }
}

const dataviewApiProxy = function (api: DataviewApi, currentFilePath: string) {
    return {
        pagePaths: function (query?: string): DataArray<string> {
            return api.pagePaths(query, currentFilePath);
        },
        page: function (path: string | Link): Record<string, Literal> | undefined {
            return api.page(path, currentFilePath);
        },
        pages: function (query?: string): DataArray<Record<string, Literal>> {
            return api.pages(query, currentFilePath);
        },
        current: function (): Record<string, Literal> | undefined {
            return api.page(currentFilePath, currentFilePath);
        },
        array: function (raw: unknown): DataArray<any> {
            return api.array(raw);
        },
        isArray: function (raw: unknown): raw is DataArray<any> | Array<any> {
            return api.isArray(raw);
        },
        fileLink: function (path: string, embed?: boolean, display?: string): Link {
            return api.fileLink(path, embed, display);
        },
        date: function (pathlike: string | Link | DateTime): DateTime | null {
            return api.date(pathlike);
        },
        query(source: string | Query, settings?: QueryApiSettings): Promise<Result<QueryResult, string>> {
            return api.query(source, currentFilePath, settings);
        },
        io: api.io
    }
};

async function loadFromDataviewPlugin(content: string, plugin: ChartsViewPlugin, sourcePath: string): Promise<DataType> {
    const api: DataviewApi = plugin.app.plugins.getPlugin('dataview')?.api;
    if (api) {
        const invoke = new AsyncFunction("dv", content);
        const dv = dataviewApiProxy(api, sourcePath);
        return await invoke(dv);
    } else {
        throw new Error(`Obsidian Dataview is required.`);
    }
}

async function loadFromMdWordCount(fileName: string, plugin: ChartsViewPlugin, options: Options): Promise<DataType> {
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
    const wordCount = getWordCount(contents.join("\n"), plugin.settings.wordCountFilter);
    const { minWordCount } = options;
    if (typeof minWordCount === 'number') {
        delete options.minWordCount;
        return wordCount.filter(item => item.count >= minWordCount);
    }
    return wordCount;
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
        const path = plugin.settings.dataPath === '/' ? '' : `${plugin.settings.dataPath}/`;
        const file = plugin.app.vault.getAbstractFileByPath(`${path}${name.trim()}`);
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