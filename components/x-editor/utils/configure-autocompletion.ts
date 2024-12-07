import { languages, type Position } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";

const TRANSITION_PROPERTIES = {
  name: ["slide-in-left", "slide-in-right", "fade-in", "zoom-in"],
  duration: ["300ms", "500ms", "1s"],
  delay: ["0ms", "200ms", "500ms"],
};

export const configureCompletions = (monaco: Monaco) => {
  return monaco.languages.registerCompletionItemProvider("markdown", {
    triggerCharacters: ["!", " ", ":"],
    provideCompletionItems: (model, position, context) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const wordUntilPosition = model.getWordUntilPosition(position);

      /*   if (context.triggerCharacter === " " && lineContent.endsWith("!transition ")) {
        console.log("triggered");

        const usedProps: string[] = [];
        const availableProps = Object.keys(TRANSITION_PROPERTIES).filter(
          (p) => !usedProps.includes(p)
        );

        return {
          suggestions: availableProps.map((prop) => ({
            label: prop + ":",
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: prop + ":",
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          })),
        };
      } */

      // First-level directives
      if (lineContent.match(/!$/)) {
        return {
          suggestions: [
            {
              label: "transition",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "transition ",
              range: {
                startLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endLineNumber: position.lineNumber,
                endColumn: wordUntilPosition.endColumn,
              },
            },
            {
              label: "duration",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "duration ",
              range: {
                startLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endLineNumber: position.lineNumber,
                endColumn: wordUntilPosition.endColumn,
              },
            },
          ],
        };
      }

      if (lineContent.match(/!transition(?:\s+\w+:[^:]*)*\s+$/)) {
        const usedProps: string[] = [];
        const propsRegex = /(\w+):/g;
        let match;

        while ((match = propsRegex.exec(lineContent)) !== null) {
          usedProps.push(match[1]);
        }

        const availableProps = Object.keys(TRANSITION_PROPERTIES).filter(
          (p) => !usedProps.includes(p)
        );

        return {
          suggestions: availableProps.map((prop) => ({
            label: prop + ":",
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: prop + ":",
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          })),
        };
      }

      // Property values
      // Property values - updated to handle multiple properties
      const propMatch = lineContent.match(/!transition(?:\s+\w+:[^:]*)*\s+(\w+):\s*/);
      // This regex:
      // - Matches completed properties: (?:\s+\w+:[^:\s]+)*
      // - Then matches the current property being typed: \s+(\w+):\s*

      if (propMatch) {
        const [, prop] = propMatch;
        const values = TRANSITION_PROPERTIES[prop] || [];
        return {
          suggestions: values.map((value) => ({
            label: value,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: value,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          })),
        };
      }

      return { suggestions: [] };
    },
  });
};
