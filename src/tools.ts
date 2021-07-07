import parse from 'csv-parse/lib/sync';
import { App, TFolder, Vault, Editor } from "obsidian";

export function insertEditor(editor: Editor, data: string): void {
    editor.somethingSelected
    ?
    editor.replaceSelection(data)
    :
    editor.setLine(
        editor.getCursor().line,
        data
    );
}

export function getFolderOptions(app: App) {
    const options: Record<string, string> = {};

    Vault.recurseChildren(app.vault.getRoot(), (f) => {
        if (f instanceof TFolder) {
            options[f.path] = f.path;
        }
    });

    return options;
}

export function parseCsv(content: string): any {
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        cast: true
    });
}