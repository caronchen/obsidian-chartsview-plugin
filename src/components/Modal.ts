import { App, Editor, FuzzySuggestModal } from 'obsidian';
import { ChartTemplateType } from '../templates';
import { insertEditor } from '../tools';

export class ChartTemplateSuggestModal extends FuzzySuggestModal<ChartTemplateType> {
    app: App;

    constructor(app: App, private editor: Editor) {
        super(app);
        this.app = app;
    }

    getItems(): ChartTemplateType[] {
        return Object.entries(ChartTemplateType);
    }

    getItemText(item: ChartTemplateType) {
        return item[0];
    }

    onChooseItem(item: ChartTemplateType) {
        insertEditor(
            this.editor,
            Buffer.from(item[1], "base64").toString("utf8")
        );
    }
}
