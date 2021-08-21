import { parseYaml, TFile } from "obsidian";
import Charts from '@ant-design/charts';
import { ChartProps, DataType } from "./components/Chart";
import ChartsViewPlugin from "./main";
import path from "path";
import { parseCsv } from "./tools";

const functionRegex = /^[\s\n]*function[\s\n]+[\w\W]+\([\w\W]*\)[\s\n]*\{[\w\W]*\}[\s\n]*/g;

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

export async function parseConfig(content: string, plugin: ChartsViewPlugin): Promise<ChartProps> {
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
            config: await parseMultiViewConfig(dataProps, data, options, plugin)
        };
    } else {
        return {
            type,
            config: { data: await loadFromFile(data, plugin), ...options }
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
                value.forEach(stringToFunction);
            } else if (typeof value === "object") {
                stringToFunction(value);
            }
        }
    }
    return options;
}

async function parseMultiViewConfig(dataProps: DataProps, data: DataType, options: Options, plugin: ChartsViewPlugin): Promise<{}> {
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
        views.push({ data: await loadFromFile(v["data"], plugin) || data, ...v["options"] });
    }

    return { views, ...options };
}

async function loadFromFile(data: DataOptionType, plugin: ChartsViewPlugin): Promise<DataType> {
    if (typeof data === "string") {
        const csvFileNames = data.split(",");
        const value = [];
        for (let name of csvFileNames.values()) {
            const file = plugin.app.vault.getAbstractFileByPath(plugin.settings.dataPath + path.sep + name.trim());
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
    } else {
        return data;
    }
}