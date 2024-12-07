import { languages, type Position } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";

export const configureCompletions = (monaco: Monaco) => {
  const provider = monaco.languages.registerCompletionItemProvider("markdown", {
    triggerCharacters: ["!", "#", " ", ":", "n"],
    provideCompletionItems: (model, position, context) => {
      const lineContent = model
        .getLineContent(position.lineNumber)
        .substring(0, position.column - 1);
      return getMarkdownSuggestions(monaco, lineContent, position);
    },
  });

  return provider;
};

const getMarkdownSuggestions = (
  monaco: Monaco,
  lineContent: string,
  position: Position
): { suggestions: languages.CompletionItem[] } => {
  const trimmedLine = lineContent.trim();

  // First-level suggestions
  if (/!$/.test(trimmedLine)) {
    console.log("top level", trimmedLine);

    return {
      suggestions: [
        {
          label: "!transition",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "!transition ",
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column - 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          detail: "Add a transition directive",
          sortText: "a",
        },
        {
          label: "!duration",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "!duration ",
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column - 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          detail: "Add a duration directive",
          sortText: "b",
        },
      ],
    };
  }
  console.log();

  // Suggest transition `name:` values (no trailing spaces required)
  if (/!transition\s+name:.*$/.test(trimmedLine)) {
    console.log("first if", trimmedLine);

    const match = lineContent.match(/!transition\s+name:(.*)$/);
    const value = match?.[1]?.trim() ?? "";
    console.log({ value });

    // Only suggest if there's no existing value or partial value
    if (!value || value === "") {
      return {
        suggestions: [
          {
            label: "fade",
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: "fade",
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            detail: "Fade transition",
            sortText: "a",
          },
          {
            label: "slide",
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: "slide",
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            detail: "Slide transition",
            sortText: "b",
          },
        ],
      };
    }
  }

  // Dynamic suggestions for `delay:` or `duration:`
  if (/!transition\s+.*(delay:|duration:)$/i.test(trimmedLine)) {
    const keyMatch = trimmedLine.match(/(delay:|duration:)$/i);
    const key = keyMatch ? keyMatch[0] : null;

    const values =
      key === "delay:"
        ? [
            { label: "500ms", detail: "Delay in milliseconds" },
            { label: "1s", detail: "Delay in seconds" },
          ]
        : key === "duration:"
          ? [
              { label: "2s", detail: "Duration in seconds" },
              { label: "3s", detail: "Duration in seconds" },
            ]
          : [];

    return {
      suggestions: values.map((value, idx) => ({
        label: value.label,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: value.label,
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        detail: value.detail,
        sortText: String.fromCharCode(97 + idx), // Sort by 'a', 'b', 'c', ...
      })),
    };
  }

  return { suggestions: [] };
};
