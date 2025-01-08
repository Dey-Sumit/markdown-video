"use client";

import { useMdxProcessor } from "@/hooks/codehike/useMDXProcessor";
import { Editor, type Monaco, type OnMount } from "@monaco-editor/react";
import { editor, type IDisposable, type IKeyboardEvent } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { monacoCustomOptions } from "./editor-config";
import { useEditorShortcuts } from "./hooks/use-editor-shortcuts";
import { monacoCustomTheme } from "./theme";
import { configureFoldingProvider } from "./utils/configure-folding-provider";
import { configureHoverProvider } from "./utils/configure-hover-provider";
// import { provideCodeActions } from "./utils/quick-fixes";
import {
  configureJSX,
  configureKeyboardShortcuts,
  configureLinting,
} from "./utils";
import { configureCompletions } from "./utils/completion-provider.new";
import { configureTokenizer } from "./utils/syntax-highlight/configure-tokens";
import { configureDiagnostics } from "./utils/configure-diagnostics.new";
import { configureContextMenu } from "./utils/context-menu/configure-context-menu.new";
import { configureSnippets } from "./utils/snippets";
import CommandMenu, { type Position } from "./command-menu";
import { provideCodeActions } from "./utils/code-action/code-action.new";
import { useProjectStore } from "@/store/project-store";
import { useParams } from "next/navigation";
import { EDITOR_LANGUAGE } from "./const";
import { Button } from "../ui/button";
import { formatDocument } from "./format-document";
import { PluginRegistry } from "./core/registry";
import { SceneAdapter } from "./plugins/scene/scene.adapter";
import { TextAdapter } from "./plugins/text/text.adapter";
import { TransitionAdapter } from "./plugins/transition/transition.adapter";
import { CodeAdapter } from "./plugins/code/code.adapter";
// import { configureCompletions } from "./utils/configure-autocompletion";

const files = ["Scenes", "Global"] as const;
type FileName = (typeof files)[number];

function XEditor() {
  const { id: projectId } = useParams<{
    id: string;
  }>();
  const [activeFile, setActiveFile] = useState<FileName>("Scenes");

  const [mounted, setMounted] = useState(false);

  const { currentProject, updateContent, loadProject } = useProjectStore();
  const { content, styles } = currentProject;

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const activeDecorationsRef = useRef<string[]>([]); // Add this ref
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

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
    content: content.sceneLevel, // TODO :  Is it correct?
    editor: editorRef.current,
    monaco: monacoRef.current,
  });

  /*   useEffect(() => {
    loadProject(projectId);
  }, [projectId, loadProject]); */

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(
    (editorPosition: { top: number; left: number }) => {
      const viewportHeight = window.innerHeight;
      const menuHeight = 300; // Approximate menu height
      const buffer = -10; // Space between menu and editor line

      const shouldShowAbove =
        editorPosition.top + menuHeight + buffer > viewportHeight;

      return {
        top: shouldShowAbove
          ? editorPosition.top - menuHeight - buffer
          : editorPosition.top + buffer,
        left: editorPosition.left,
      };
    },
    [],
  );
  if (!mounted) return null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    monaco.languages.register({ id: EDITOR_LANGUAGE });

    const registry = new PluginRegistry(monaco);

    registry.register(new SceneAdapter(monaco));
    registry.register(new TextAdapter(monaco));
    registry.register(new TransitionAdapter(monaco));
    registry.register(new CodeAdapter(monaco));

    registry.registerCompletions(editor.getModel()!);
    registry.registerDiagnostics(editor.getModel()!);
    registry.registerHoverProvider(editor.getModel()!);
    registry.registerDecorations(editor.getModel()!);
    registry.registerFoldingRanges(monaco);
  };

  const __handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    monaco.languages.register({ id: EDITOR_LANGUAGE });

    editor.onKeyDown((e: IKeyboardEvent) => {
      if (e.browserEvent.key === "\\") {
        // Remove any backslash handling logic, just show the menu
        const position = editor.getPosition();
        if (!position) return;

        // Show menu after the backslash is typed
        requestAnimationFrame(() => {
          const coords = editor.getContainerDomNode().getBoundingClientRect();
          const pos = editor.getScrolledVisiblePosition(position);

          if (pos) {
            setMenuPosition(
              calculatePosition({
                top: coords.top + pos.top,
                left: coords.left + pos.left,
              }),
            );
            setShowCommandMenu(true);
          }
        });
      }
    });

    configureCompletions(monaco);

    // Set up decoration listener
    const contentChangeDisposable = editor.onDidChangeModelContent(() => {
      updateDecorations();
    });

    // Initial decoration update
    updateDecorations();

    const model = editor.getModel();
    let disposable: IDisposable;
    if (model) disposable = configureDiagnostics(monaco, model);
    monaco.languages.registerCodeActionProvider(EDITOR_LANGUAGE, {
      provideCodeActions: provideCodeActions,
    });
    configureContextMenu(monaco, editor);
    configureFoldingProvider(monaco);
    // configureKeyboardShortcuts(editor, monaco);
    configureHoverProvider(monaco);

    // Cleanup when editor is disposed
    // TODO : I don't this should work. xD
    return () => {
      contentChangeDisposable.dispose();
      disposable.dispose();
    };
  };

  const _handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Register tokenizer first
    // configureTokenizer(monaco);
    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    monaco.languages.register({ id: EDITOR_LANGUAGE });

    editor.onKeyDown((e: IKeyboardEvent) => {
      if (e.browserEvent.key === "\\") {
        // Remove any backslash handling logic, just show the menu
        const position = editor.getPosition();
        if (!position) return;

        // Show menu after the backslash is typed
        requestAnimationFrame(() => {
          const coords = editor.getContainerDomNode().getBoundingClientRect();
          const pos = editor.getScrolledVisiblePosition(position);

          if (pos) {
            setMenuPosition(
              calculatePosition({
                top: coords.top + pos.top,
                left: coords.left + pos.left,
              }),
            );
            setShowCommandMenu(true);
          }
        });
      }
    });
    // configureSnippets(monaco);
    configureCompletions(monaco);
    // Set up decoration listener
    const contentChangeDisposable = editor.onDidChangeModelContent(() => {
      updateDecorations();
    });

    // Initial decoration update
    updateDecorations();

    // Add diagnostics
    // Get the editor's model
    const model = editor.getModel();
    let disposable: IDisposable;
    if (model) disposable = configureDiagnostics(monaco, model);
    monaco.languages.registerCodeActionProvider(EDITOR_LANGUAGE, {
      provideCodeActions: provideCodeActions,
    });
    configureContextMenu(monaco, editor);

    // Cleanup when editor is disposed
    // TODO : I don't this should work. xD
    return () => {
      contentChangeDisposable.dispose();
      disposable.dispose();
    };

    // configureLinting(editor, monaco);
    // monaco.languages.register({ id: EDITOR_LANGUAGE });
    // configureCompletions(monaco);

    /* --------- ON DEV : comment above code block to make the hot reload faster --------- */
    // configureHoverProvider(editor, monaco);
    // configureContextMenu(editor, monaco);
    // configureFoldingProvider(monaco);
  };

  const handleFormat = () => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const content = model.getValue();
    const formatted = formatDocument(content);
    // console.log({
    //   content,
    //   formatted,
    // });

    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ],
      () => null,
    );
  };

  const handleEditorChange = (value: string | undefined) => {
    const fileType = activeFile === "Global" ? "global" : "sceneLevel";
    updateContent(fileType, value ?? "");
  };

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <div className="flex justify-between gap-2 border-b">
          <div>
            {files.map((fileName, index) => (
              <Button
                key={fileName}
                variant="outline"
                onClick={() => setActiveFile(fileName)}
                size="sm"
                className={`${activeFile === fileName ? "bg-accent" : ""} rounded-none border-y-0`}
              >
                {fileName}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleFormat}
            size="sm"
            variant="outline"
            className="rounded-none border-y-0"
          >
            Format Editor &nbsp; 🧹
          </Button>
        </div>
        <Editor
          height="100%"
          defaultLanguage={EDITOR_LANGUAGE}
          onMount={handleEditorMount}
          options={monacoCustomOptions}
          value={activeFile === "Scenes" ? content.sceneLevel : content.global}
          onChange={handleEditorChange}
        />
        <CommandMenu
          position={menuPosition}
          isVisible={showCommandMenu}
          editor={editorRef.current}
          monaco={monacoRef.current}
          onClose={() => setShowCommandMenu(false)}
        />
      </div>
    </>
  );
}

export default XEditor;
