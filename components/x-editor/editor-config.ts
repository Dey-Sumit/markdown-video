import { editor } from "monaco-editor";

export const monacoCustomOptions: editor.IStandaloneEditorConstructionOptions =
  {
    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
    fontLigatures: true,
    fontSize: 14,
    lineHeight: 24,
    tabSize: 3,

    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    cursorStyle: "line",
    padding: { top: 16 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    folding: true,
    snippetSuggestions: "top",
    suggestSelection: "first",
    tabCompletion: "on",
    wordWrap: "on",
    renderWhitespace: "selection",
    guides: {
      bracketPairs: true,
      indentation: true,
      highlightActiveIndentation: true,
    },
    bracketPairColorization: {
      enabled: true,
    },
    lineNumbers: "off",
    suggest: {
      showWords: false,
      snippetsPreventQuickSuggestions: false,
      showIcons: true,
      showFunctions: true,
      showConstants: true,
    },
    suggestOnTriggerCharacters: true,
  };
