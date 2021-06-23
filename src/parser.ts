import { parseYaml } from "obsidian";
import Charts from '@ant-design/charts';
import { ChartProps, DataType } from "./components/Chart";

const functionRegex = /^[\s\n]*function[\s\n]+[\w\W]+\([\w\W]*\)[\s\n]*\{[\w\W]*\}[\s\n]*/g;

interface Options {
    [key: string]: any;
}

interface DataProps {
    type: string;
    options?: Options;
    data?: DataType;
    [key: string]: DataType | string;
}

export function parseConfig(content: string): ChartProps {
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
            config: parseMultiViewConfig(dataProps, data, options)
        };
    } else {
        return {
            type,
            config: { data, ...options }
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

function parseMultiViewConfig(dataProps: DataProps, data: DataType, options: Options): {} {
    const temp = new Map<string, any>();
    const views: {}[] = [];

    for (const key in dataProps) {
        const keyParts = key.split(".");
        if (keyParts.length !== 2
            || (keyParts[0] !== "options" && keyParts[0] !== "data")) {
            continue;
        }

        const view = temp.get(keyParts[1]) || {};
        view[keyParts[0]] = dataProps[key];
        temp.set(keyParts[1], view);
    }

    temp.forEach(function (v) {
        views.push({ data: v["data"] || data, ...v["options"] });
    });

    return { views, ...options };
}