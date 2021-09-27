import React from "react";
import Charts, { Plot } from "@ant-design/charts";
import ErrorBoundary from "@ant-design/charts/lib/errorBoundary";
import { LooseObject } from "@antv/g2/lib/interface";

export interface ChartProps {
  type: string;
  config: ConfigProps;
}

export type DataType = object[] | object;

export interface ConfigProps {
  data?: DataType;
  theme?: LooseObject;
  backgroundColor?: string;
	padding?: number[];
}

Charts.G2.registerTheme("theme1", {
  colors10: ["#FF6B3B", "#626681", "#FFC100", "#9FB40F", "#76523B", "#DAD5B5", "#0E8E89", "#E19348", "#F383A2", "#247FEA"],
  colors20: ["#FF6B3B", "#626681", "#FFC100", "#9FB40F", "#76523B", "#DAD5B5", "#0E8E89", "#E19348", "#F383A2", "#247FEA", "#2BCB95", "#B1ABF4", "#1D42C2", "#1D9ED1", "#D64BC0", "#255634", "#8C8C47", "#8CDAE5", "#8E283B", "#791DC9"]
});

Charts.G2.registerTheme("theme2", {
  "colors10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"],
  "colors20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"]
});

export const Chart = ({ type, config }: ChartProps) => {
  // @ts-ignore
  const Component = Charts[type];
  return (
    <ErrorBoundary>
      <Component {...config} onReady={
        // @ts-ignore
        (chart) => {
          if (chart instanceof Plot) {
            const custom = {} as LooseObject;
            if (config.theme && config.backgroundColor) {
              custom.theme = { background: config.backgroundColor };
            }
            if (config.padding) {
              custom.padding = config.padding;
            }
            if (custom.theme || config.padding) {
              try {
                chart.update(custom);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      }
    />
    </ErrorBoundary>
  );
}