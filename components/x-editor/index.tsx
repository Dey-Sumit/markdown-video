"use client";

import { Editor, OnMount, Theme } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { monacoCustomOptions } from "./editor-config";
import { configureJSX, configureKeyboardShortcuts, configureLinting } from "./utils";
import { provideCodeActions } from "./utils/quick-fixes";
import { configureContextMenu } from "./utils/configure-context-menu";
import { monacoCustomTheme } from "./theme";
import { configureCompletions } from "./utils/configure-autocompletion";

function XEditor() {
  const [mounted, setMounted] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    // monaco.languages.register({ id: "markdown" });

    /* --------- ON DEV: comment below  code block to make the hot reload faster -------- */

    configureJSX(monaco);
    configureKeyboardShortcuts(editor, monaco);
    configureLinting(editor, monaco);
    configureCompletions(monaco);

    /* --------- ON DEV : comment above code block to make the hot reload faster --------- */

    configureContextMenu(editor, monaco);

    monaco.languages.registerCodeActionProvider("markdown", {
      provideCodeActions: provideCodeActions,
    });
  };

  const _handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define the custom theme
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");

    // Register a completion item provider for Markdown
    monaco.languages.registerCompletionItemProvider("markdown", {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: "# Heading 1",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "# Heading 1\n",
            detail: "Add a level 1 heading",
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
          {
            label: "## Heading 2",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "## Heading 2\n",
            detail: "Add a level 2 heading",
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
          {
            label: "Link",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "[Link text](https://example.com)",
            detail: "Add a link",
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
          {
            label: "Bold Text",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "**Bold Text**",
            detail: "Add bold text",
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
          {
            label: "Code Block",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "```\nCode block\n```",
            detail: "Insert a code block",
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
          },
        ];

        return { suggestions };
      },
    });
  };
  const __handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define the custom theme
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      // theme="vs-dark"
      value={editorContent}
      onChange={(value) => setEditorContent(value ?? "")}
      // onMount={handleEditorMount}
      onMount={handleEditorMount}
      options={monacoCustomOptions}
    />
  );
}

export default XEditor;
