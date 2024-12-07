import { Monaco } from "@monaco-editor/react";
import { editor, languages } from "monaco-editor";

export function configureContextMenu(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
  // Remove default context menu items
  editor.createContextKey("removeDefaultItems", true);

  // Custom menu items
  const menuItems = [
    {
      id: "quick-fix",
      label: "💡 Quick Fix",
      precondition: "hasCodeActions",
      keybinding: monaco.KeyMod.Alt | monaco.KeyCode.Period,
    },
    {
      id: "code-actions",
      label: "🔧 Show All Actions",
      precondition: "hasCodeActions",
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period,
    },
    {
      type: "separator",
    },
    {
      id: "format-document",
      label: "✨ Format Document",
      keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
    },
  ];

  // Apply custom styles to quick fix widget
  //   const styleSheet = document.createElement("style");
  //   styleSheet.textContent = `
  //     .monaco-menu {
  //       background-color: #1e1e1e !important;
  //       border: 1px solid #404040 !important;
  //       border-radius: 6px !important;
  //       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  //     }

  //     .monaco-quick-fix-widget .monaco-list-row {
  //       padding: 8px 12px !important;
  //     }

  //     .monaco-quick-fix-widget .monaco-list-row:hover {
  //       background-color: #2c2c2c !important;
  //     }

  //     .monaco-quick-fix-widget .codicon {
  //       color: #89d1dc !important;
  //     }

  //     .monaco-quick-fix-widget .title {
  //       font-size: 14px !important;
  //       color: #d4d4d4 !important;
  //     }
  //   `;
  //   document.head.appendChild(styleSheet);

  // Register menu items
  menuItems.forEach((item) => {
    if (item.type === "separator") {
      //   editor.addAction({
      //     id: "separator",
      //     label: "---",
      //     contextMenuGroupId: "navigation",
      //     run: () => {},
      //   });
    } else {
      editor.addAction({
        id: item.id!,
        label: item.label!,
        precondition: item.precondition,
        keybindings: [item.keybinding!],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 0,
        run: () => {
          editor.trigger("", item.id!, null);
        },
      });
    }
  });
}
