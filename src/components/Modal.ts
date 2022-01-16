import { App, Editor, FuzzyMatch, FuzzySuggestModal } from 'obsidian';
import { ChartTemplateType, ChartThumbnailMapping } from '../templates';
import { insertEditor } from '../tools';
import { Buffer } from 'buffer';

export class ChartTemplateSuggestModal extends FuzzySuggestModal<ChartTemplateType> {

    constructor(app: App, private editor: Editor) {
        super(app);
    }

    getItems(): ChartTemplateType[] {
        return Object.entries(ChartTemplateType);
    }

    getItemText(item: ChartTemplateType) {
        return item[0];
    }

    renderSuggestion(item: FuzzyMatch<ChartTemplateType>, el: HTMLElement): void {
        const div = createDiv({ cls: "chartsview-thumbnail" });
        const type = ChartTemplateType[item.item[0] as keyof typeof ChartTemplateType];
        const img = createEl("img", {
            attr: {
                src: ChartThumbnailMapping[type]
            }
        });
        div.appendChild(img);
        el.appendChild(div);
        el.addClass("chartsview-thumbnail-container");
        super.renderSuggestion(item, el);
    }

    onChooseItem(item: ChartTemplateType) {
        insertEditor(
            this.editor,
            Buffer.from(item[1], "base64").toString("utf8")
        );
    }
}
