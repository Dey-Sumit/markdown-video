import type { editor, Position } from "monaco-editor";

class RichTextWidget implements editor.IContentWidget {
  private readonly domNode: HTMLElement;
  private position: Position | null = null;

  constructor(
    private readonly editor: editor.IStandaloneCodeEditor,
    private readonly openModal: () => void,
  ) {
    this.domNode = document.createElement("div");
    this.domNode.className = "rich-text-widget";
    this.domNode.innerHTML = `
      <button class="p-1 bg-blue-500 text-white rounded-md text-xs">
        Open Editor
      </button>
    `;
    this.domNode.onclick = () => this.openModal();

    // Update widget position when content changes
    this.editor.onDidChangeModelContent(() => {
      this.updatePosition();
    });
  }

  private updatePosition() {
    const model = this.editor.getModel();
    if (!model) return;

    // Find lines containing !richText
    for (let i = 1; i <= model.getLineCount(); i++) {
      const line = model.getLineContent(i);
      if (line.includes("!richText")) {
        const column = line.indexOf("!richText") + 9; // After !richText
        this.position = { lineNumber: i, column };
        this.editor.layoutContentWidget(this);
        return;
      }
    }
  }

  getId(): string {
    return "rich-text.widget";
  }

  getDomNode(): HTMLElement {
    return this.domNode;
  }

  getPosition(): editor.IContentWidgetPosition | null {
    if (!this.position) return null;

    return {
      position: this.position,
      preference: [editor.ContentWidgetPositionPreference.EXACT],
    };
  }
}

// Usage:
export const addRichTextWidget = (
  editor: editor.IStandaloneCodeEditor,
  openModal: () => void,
) => {
  const widget = new RichTextWidget(editor, openModal);
  editor.addContentWidget(widget);
  return widget;
};
