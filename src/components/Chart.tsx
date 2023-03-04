import React, { useRef } from "react";
import { registerInteraction, registerAction, Action, registerTheme } from '@antv/g2';
import * as Plots from "@ant-design/plots";
import * as Graphs from "@ant-design/graphs";
import ErrorBoundary from "@ant-design/plots/es/errorBoundary";

export interface ChartProps {
  type: string;
  config: ConfigProps;
  showExportBtn?: boolean;
}

const WITHOUT_WRAPPER = (searchWord: string) => encodeURIComponent(searchWord);
const PARENTHESIS_WRAPPER = (searchWord: string) => `(${encodeURIComponent(searchWord)})`;
const QUOTE_WRAPPER = (searchWord: string) => `"${encodeURIComponent(searchWord)}"`;
const PARENTHESIS_QUOTE_WRAPPER = (searchWord: string) => `("${encodeURIComponent(searchWord)}")`;

/**
 * 鼠标形状的 Action
 */
class ObsidianAction extends Action {

  private search(arg: Record<string, string>, prefix: string, replacer?: (searchWord: string) => string) {
    const data = this.context.event.data;
    const { shape, data: field } = data;
    let searchWord: string = undefined;
    if (shape === 'word-cloud') {
      searchWord = field.text;
    } else {
      searchWord = arg ? field[arg.field] : "";
    }
    if (replacer) {
      searchWord = replacer(searchWord);
    }
    this.openScheme(`obsidian://search?vault=${encodeURIComponent(arg.vault)}&query=${prefix}${searchWord}`);
  }

  private openNote(arg: Record<string, string>) {
    const data = this.context.event.data;
    const { shape, data: field } = data;
    let path: string = undefined;
    if (shape === 'word-cloud') {
      path = field.datum[arg.pathField];
    } else {
      path = field[arg.pathField];
    }
    this.openScheme(`obsidian://vault/${encodeURIComponent(arg.vault)}/${path}`);
  }

  private openScheme(url: string) {
    const tmpLink = window.document.body.createEl('a', {href: url});
    tmpLink.click();
    tmpLink.remove();
  }

  public tag(arg: Record<string, string>) {
    this.search(arg, "tag%3A", WITHOUT_WRAPPER);
  }

  public file(arg: Record<string, string>) {
    this.search(arg, "file%3A", PARENTHESIS_QUOTE_WRAPPER);
  }

  public fileopen(arg: Record<string, string>) {
    this.openNote(arg);
  }

  public path(arg: Record<string, string>) {
    this.search(arg, "path%3A", PARENTHESIS_QUOTE_WRAPPER);
  }

  public content(arg: Record<string, string>) {
    this.search(arg, "content%3A", PARENTHESIS_WRAPPER);
  }

  public task(arg: Record<string, string>) {
    this.search(arg, "task%3A", PARENTHESIS_WRAPPER);
  }

  public matchCase(arg: Record<string, string>) {
    this.search(arg, "match-case%3A", PARENTHESIS_WRAPPER);
  }

  public ignoreCase(arg: Record<string, string>) {
    this.search(arg, "ignore-case%3A", PARENTHESIS_WRAPPER);
  }

  public line(arg: Record<string, string>) {
    this.search(arg, "line%3A", PARENTHESIS_WRAPPER);
  }

  public block(arg: Record<string, string>) {
    this.search(arg, "block%3A", PARENTHESIS_WRAPPER);
  }

  public taskTodo(arg: Record<string, string>) {
    this.search(arg, "task-todo%3A", PARENTHESIS_WRAPPER);
  }

  public taskDone(arg: Record<string, string>) {
    this.search(arg, "task-done%3A", PARENTHESIS_WRAPPER);
  }

  public section(arg: Record<string, string>) {
    this.search(arg, "section%3A", PARENTHESIS_WRAPPER);
  }

  public default(arg: Record<string, string>) {
    this.search(arg, "", QUOTE_WRAPPER);
  }
}

registerAction('obsidian-search', ObsidianAction);

registerInteraction('obsidian-search', {
  start: [{ trigger: 'element:click', action: 'obsidian-search:default' }]
});

export type DataType = Record<string, unknown>[] | Record<string, unknown> | unknown;

export interface ConfigProps {
  data?: DataType;
  theme?: Record<string, unknown>;
  backgroundColor?: string;
  [key: string]: DataType | string | number;
}

registerTheme("theme1", {
  colors10: ["#FF6B3B", "#626681", "#FFC100", "#9FB40F", "#76523B", "#DAD5B5", "#0E8E89", "#E19348", "#F383A2", "#247FEA"],
  colors20: ["#FF6B3B", "#626681", "#FFC100", "#9FB40F", "#76523B", "#DAD5B5", "#0E8E89", "#E19348", "#F383A2", "#247FEA", "#2BCB95", "#B1ABF4", "#1D42C2", "#1D9ED1", "#D64BC0", "#255634", "#8C8C47", "#8CDAE5", "#8E283B", "#791DC9"]
});

registerTheme("theme2", {
  "colors10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"],
  "colors20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"]
});

export const Chart = ({ type, config, showExportBtn = false }: ChartProps) => {
  // @ts-ignore
  const Component = Plots[type] || Graphs[type];
  const ref = useRef<unknown>();

  return (
    <ErrorBoundary>
      {showExportBtn &&
        <div className="chartsview-export-button" aria-label="Export to PNG" onClick={() => {
          // @ts-ignore
          ref.current?.downloadImage(`${type}.png`);
        }}>
          <svg className="code-glyph" viewBox="0 0 1024 1024" width="16" height="16">
            <path fill="currentColor" stroke="currentColor" d="M896 166.4H128c-25.6 0-42.666667 17.066667-42.666667 42.666667v597.333333c0 25.6 17.066667 42.666667 42.666667 42.666667h768c25.6 0 42.666667-17.066667 42.666667-42.666667v-597.333333c0-25.6-21.333333-42.666667-42.666667-42.666667z m-42.666667 85.333333v418.133334l-136.533333-136.533334c-21.333333-12.8-51.2-12.8-64 4.266667L554.666667 635.733333l-183.466667-179.2c-17.066667-17.066667-46.933333-17.066667-59.733333 0L170.666667 597.333333V251.733333h682.666666z m-243.2 443.733334l76.8-76.8 136.533334 140.8h-145.066667l-68.266667-64zM170.666667 716.8l170.666666-170.666667 217.6 217.6H170.666667v-46.933333z"></path>
            <path fill="currentColor" stroke="currentColor" d="M716.8 396.8m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"></path>
          </svg>
        </div>
      }
      <Component
        {...config}
        onReady={(instance: unknown) => {
          ref.current = instance;
        }}
      />
    </ErrorBoundary>
  );
}
