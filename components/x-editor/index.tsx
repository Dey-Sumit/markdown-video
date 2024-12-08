"use client";

import { useMdxProcessor } from "@/hooks/codehike/useMDXProcessor";
import useCompositionStore from "@/store/composition-store";
import { Editor, type Monaco, type OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { monacoCustomOptions } from "./editor-config";
import { useEditorShortcuts } from "./hooks/use-editor-shortcuts";
import { monacoCustomTheme } from "./theme";
import { configureContextMenu } from "./utils/configure-context-menu";
import { configureFoldingProvider } from "./utils/configure-folding-provider";
import { configureHoverProvider } from "./utils/configure-hover-provider";
import { provideCodeActions } from "./utils/quick-fixes";

function XEditor() {
  const [mounted, setMounted] = useState(false);
  const { content, setContent, loadSavedContent } = useCompositionStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
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

    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    // monaco.languages.register({ id: "markdown" });

    /* --------- ON DEV: comment below  code block to make the hot reload faster -------- */
    /*    configureJSX(monaco);
    configureKeyboardShortcuts(editor, monaco);
    configureLinting(editor, monaco);
    monaco.languages.register({ id: "markdown" });
    configureCompletions(monaco);
 */
    /* --------- ON DEV : comment above code block to make the hot reload faster --------- */
    configureHoverProvider(editor, monaco);
    configureContextMenu(editor, monaco);
    configureFoldingProvider(monaco);
    monaco.languages.registerCodeActionProvider("markdown", {
      provideCodeActions: provideCodeActions,
    });
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
