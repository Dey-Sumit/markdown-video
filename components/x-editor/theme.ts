import { editor } from "monaco-editor";

export const monacoCustomTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    // Basic syntax
    { token: "keyword", foreground: "#c678dd" },
    { token: "string", foreground: "#98c379" },
    { token: "number", foreground: "#d19a66" },
    { token: "comment", foreground: "#5c6370", fontStyle: "italic" },

    // JSX/JavaScript specific
    { token: "delimiter.bracket.js", foreground: "#abb2bf" },
    { token: "delimiter.angle.js", foreground: "#abb2bf" },
    { token: "tag", foreground: "#e06c75" },
    { token: "tag.js", foreground: "#e06c75" },
    { token: "tag.jsx", foreground: "#e06c75" },
    { token: "attribute.name.js", foreground: "#d19a66" },
    { token: "attribute.name.jsx", foreground: "#d19a66" },
    { token: "attribute.value.js", foreground: "#98c379" },
    { token: "attribute.value.jsx", foreground: "#98c379" },

    // Functions and variables
    { token: "function", foreground: "#61afef" },
    { token: "variable", foreground: "#e06c75" },
    { token: "type", foreground: "#56b6c2" },

    // Markdown specific
    { token: "heading", foreground: "#e5c07b", fontStyle: "bold" },
    { token: "emphasis", fontStyle: "italic" },
    { token: "strong", fontStyle: "bold" },
    { token: "link", foreground: "#56b6c2" },
  ],
  colors: {
    "editor.background": "#000000",
    "editorCursor.foreground": "#ffffff",
    "editor.lineHighlightBackground": "#1a1a1a",
    "editorLineNumber.foreground": "#666666",
    "editorLineNumber.activeForeground": "#ffffff",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#3a3d41",
    "editorIndentGuide.background": "#404040",
    "editorIndentGuide.activeBackground": "#707070",
    "menu.background": "#1e1e1e",
  },
};
