"use client";

import { useMdxProcessor } from "@/hooks/codehike/useMDXProcessor";
import useCompositionStore from "@/store/composition-store";
import { Editor, type Monaco, type OnMount } from "@monaco-editor/react";
import { editor, type IDisposable } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { monacoCustomOptions } from "./editor-config";
import { useEditorShortcuts } from "./hooks/use-editor-shortcuts";
import { monacoCustomTheme } from "./theme";
import { configureFoldingProvider } from "./utils/configure-folding-provider";
import { configureHoverProvider } from "./utils/configure-hover-provider";
import { provideCodeActions } from "./utils/quick-fixes";
import {
  configureJSX,
  configureKeyboardShortcuts,
  configureLinting,
} from "./utils";
import { configureCompletions } from "./utils/completion-provider.new";
import { configureTokenizer } from "./utils/syntax-highlight/configure-tokens";
import { configureDiagnostics } from "./utils/configure-diagnostics.new";
import { configureContextMenu } from "./utils/context-menu/configure-context-menu.new";
import { configureMarkdownVideoPlugin } from "./plugins";
// import { configureMarkdownVideoPlugin } from "./plugins/core";
// import { configureCompletions } from "./utils/configure-autocompletion";

function XEditor() {
  const [mounted, setMounted] = useState(false);
  const { content, setContent, loadSavedContent } = useCompositionStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const activeDecorationsRef = useRef<string[]>([]); // Add this ref

  // Add this function at component level
  const updateDecorations = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const decorations: editor.IModelDeltaDecoration[] = [];
    const lineCount = model.getLineCount();

    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
      const lineContent = model.getLineContent(lineNumber);
      if (lineContent.includes("!!scene")) {
        decorations.push({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: "scene-line-highlight",
            marginClassName: "scene-line-margin",
          },
        });
      }
    }

    activeDecorationsRef.current = editor.deltaDecorations(
      activeDecorationsRef.current,
      decorations,
    );
  }, []);

  useMdxProcessor();
  useEditorShortcuts({
    content,
    editor: editorRef.current,
    monaco: monacoRef.current,
  });
  useEffect(() => {
    loadSavedContent(); // TODO : need to check this, sometimes it's not able to parse the content on mount in useMdxProcessor hook.
  }, [loadSavedContent]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Register tokenizer first
    // configureTokenizer(monaco);
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    monaco.languages.register({ id: "markdown" });

    // Get the editor's model
    const model = editor.getModel();
    if (model) {
      const disposable = configureMarkdownVideoPlugin(monaco, model);
    }

    configureContextMenu(monaco, editor);
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={content}
      onChange={(value) => setContent(value ?? "")}
      onMount={handleEditorMount}
      options={monacoCustomOptions}
    />
  );
}

export default XEditor;
