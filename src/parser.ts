import yaml from "js-yaml";
import Charts from '@ant-design/charts';
import { ChartProps } from "./components/Chart";

interface DataProps {
    type: string;
    options?: {};
    data: {}[] | {};
}

export function parseConfig(content: string): ChartProps {
    const dataProps = yaml.load(content) as DataProps;
    const type = dataProps["type"];

    // @ts-ignore
    const chart = Charts[type];
    if (chart === undefined) {
        throw new Error(`Unsupported chart type ${type}.`);
    }

    const data = dataProps["data"];
    if (data === undefined) {
        throw new Error('Required data property is missing.');
    }

    const options = dataProps["options"] || {};

    return {
        type,
        config: { data, ...options }
    };
}