import { KeyCode, KeyMod, type Position } from "monaco-editor";

import type { editor } from "monaco-editor";

// utils/editor/context-menu/menu-items.ts
interface ContextMenuItem {
  id: string;
  label: string;
  when?: string;
  group?: string;
  icon?: string;
  order?: number;
  keybinding?: number[]; // Monaco keycodes
  handler: (editor: editor.ICodeEditor, position: Position) => void;
}

export const CONTEXT_MENU_ITEMS: Record<string, ContextMenuItem> = {
  mark: {
    id: "add.mark",
    label: "Add Mark",
    when: "inComment",
    group: "modification",
    order: 1,
    // CMD+M for Mac, Ctrl+M for others
    keybinding: [KeyMod.CtrlCmd | KeyCode.KeyM],
    handler: (editor, position) => {
      const lineContent =
        editor.getModel()?.getLineContent(position.lineNumber) || "";
      const indent = lineContent.match(/^\s*/)?.[0] || "";
      editor.executeEdits("", [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: 1,
          },
          text: `${indent}// !mark --color=red --duration=1\n`,
        },
      ]);
    },
  },
};
