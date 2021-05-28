import { parseYaml } from "obsidian";
import Charts from '@ant-design/charts';
import { ChartProps, DataType } from "./components/Chart";

const functionRegex = /^\s*function\s+[\w\W]+\(.*\)\s*\{.*\}\s*/;

interface Options {
    [key: string]: any;
}

interface DataProps {
    type: string;
    options?: Options;
    data: DataType;
}

export function parseConfig(content: string): ChartProps {
    const dataProps = parseYaml(content) as DataProps;
    const type = dataProps["type"];

    // @ts-ignore
    const chart = Charts[type];
    if (chart === undefined) {
        throw new Error(`Unsupported chart type ${type}.`);
    }

    const data: DataType = parseData(dataProps);
    const options = stringToFunction(dataProps["options"] || {});

    return {
        type,
        config: { data, ...options }
    };
}

function parseData(dataProps: DataProps): DataType {
    const data = dataProps["data"];
    if (data !== undefined) {
        return data;
    }

    throw new Error('Required data property is missing.');
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