import { type Monaco } from "@monaco-editor/react";
import { CONTEXT_MENU_ITEMS } from "./menu-items";
import type { editor } from "monaco-editor";

export const configureContextMenu = (
  monaco: Monaco,
  editor: editor.IStandaloneCodeEditor,
) => {
  editor.addAction({
    id: "add.mark",
    label: "Add Mark",
    contextMenuGroupId: "1_modification", // Monaco uses specific group naming
    contextMenuOrder: 1,
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],
    run: (ed) => {
      const position = editor.getPosition();
      if (!position) return;

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
  });
};
