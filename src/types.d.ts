import "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { DataviewInlineApi } from "obsidian-dataview/lib/api/inline-api";

declare module "obsidian" {
  interface App {
    plugins: {
      getPlugin<Id extends keyof Plugins>(id: Id): Plugins[Id] | null;
    }
  }
  interface Plugins {
    dataview: {
      api?: DataviewApi;
    }
  }
  interface MetadataCache {
    on(
      name: "dataview:api-ready",
      callback: (api: DataviewApi) => any,
      ctx?: any
    ): EventRef;
    on(
      name: "dataview:metadata-change",
      callback: (
        ...args:
          | [op: "rename", file: TAbstractFile, oldPath: string]
          | [op: "delete", file: TFile]
          | [op: "update", file: TFile]
      ) => any,
      ctx?: any
    ): EventRef;
  }
}