import { editor } from "monaco-editor";

export const monacoCustomTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    // { token: "keyword", foreground: "#c678dd" }, // for const, return, etc
    // { token: "string", foreground: "#98c379" }, // for "HELLO"
    // { token: "function", foreground: "#61afef" }, // for function names
    // { token: "delimiter.bracket", foreground: "#abb2bf" }, // for (), {}, []
    // { token: "variable", foreground: "#e06c75" }, // for variables like 'a'
    // { token: "sceneProperty", foreground: "#61afef" }, // Blue for scene
    // { token: "property", foreground: "#c678dd" }, // Purple for properties
    // { token: "argumentKey", foreground: "#d19a66" }, // Orange for argument keys
    // { token: "argumentOperator", foreground: "#abb2bf" }, // Light grey for =
    // { token: "argumentValue", foreground: "#98c379" }, // Green for values
  ],
  colors: {
    "editor.background": "#000000",
    // "editor.background": "#111111",
    "editorCursor.foreground": "#ffffff",
    "editor.lineHighlightBackground": "#1a1a1a",
    "editorLineNumber.foreground": "#666666",
    "editorLineNumber.activeForeground": "#ffffff",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#3a3d41",
    "editorIndentGuide.background": "#404040",
    "editorIndentGuide.activeBackground": "#707070",
    "menu.background": "#1e1e1e",
    "quickInput.background": "#1e1e1e", // Command palette bg
    "quickInput.foreground": "#d4d4d4", // Command palette text
    "quickInputList.focusBackground": "#2a2d2e", // Selected item bg
    "quickInputList.focusForeground": "#ffffff", // Selected item text
    "quickInput.list.focusBackground": "#2a2d2e", // Alternative focused bg

    // Hover widget
    "editorHoverWidget.background": "#1e1e1e",
    "editorHoverWidget.foreground": "#d4d4d4",
    "editorHoverWidget.border": "#454545",

    // Quick fix/actions popup
    "editorSuggestWidget.background": "#1e1e1e",
    "editorSuggestWidget.foreground": "#d4d4d4",
    "editorSuggestWidget.selectedBackground": "#2a2d2e",
    "editorSuggestWidget.selectedForeground": "#ffffff",
    "editorSuggestWidget.highlightForeground": "#89d1dc",
    "editorSuggestWidget.border": "#454545",
  },
};
