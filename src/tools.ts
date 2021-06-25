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
