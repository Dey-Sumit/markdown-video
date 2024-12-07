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
    monaco.languages.register({ id: "markdown" });
    configureCompletions(monaco);

    /* --------- ON DEV : comment above code block to make the hot reload faster --------- */

    configureContextMenu(editor, monaco);

    monaco.languages.registerCodeActionProvider("markdown", {
      provideCodeActions: provideCodeActions,
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={editorContent}
      onChange={(value) => setEditorContent(value ?? "")}
      onMount={handleEditorMount}
      options={monacoCustomOptions}
    />
  );
}

export default XEditor;
