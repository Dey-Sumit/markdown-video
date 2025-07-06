"use client";

import { useMdxProcessor } from "@/hooks/codehike/useMDXProcessor";
import { Editor, type Monaco, type OnMount } from "@monaco-editor/react";
import { editor, type IDisposable, type IKeyboardEvent } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { monacoCustomOptions } from "./editor-config";
import { useEditorShortcuts } from "./hooks/use-editor-shortcuts";
import { monacoCustomTheme } from "./theme";

// import { provideCodeActions } from "./utils/quick-fixes";
import {
  configureJSX,
  configureKeyboardShortcuts,
  configureLinting,
} from "./utils";

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
import { HighlightAdapter } from "./plugins/highlight/highlight.adapter";
import FloatingEditButton from "./components/floating-button";
import { ImageAdapter } from "./plugins/image/image.adapter";
import { SectionAdapter } from "./plugins/section/section.adapter";
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

  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const {
    config: { content, styles },
  } = currentProject;

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

  useEffect(() => {
    loadProject(projectId);
  }, [projectId, loadProject]);

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

    setEditorInstance(editor);

    monaco.editor.defineTheme("custom", monacoCustomTheme);
    monaco.editor.setTheme("custom");
    monaco.languages.register({ id: EDITOR_LANGUAGE });

    const registry = new PluginRegistry(monaco);

    registry.register(new SceneAdapter(monaco));
    registry.register(new TransitionAdapter(monaco));
    registry.register(new CodeAdapter(monaco));
    registry.register(new ImageAdapter(monaco));
    registry.register(new TextAdapter(monaco));
    registry.register(new SectionAdapter(monaco));

    const highlightAdapter = new HighlightAdapter(monaco);
    registry.register(highlightAdapter);

    registry.registerCompletions(editor.getModel()!);
    registry.registerDiagnostics(editor.getModel()!);
    registry.registerHoverProvider(editor.getModel()!);
    registry.registerDecorations(editor.getModel()!);
    registry.registerFoldingRanges(monaco);

    highlightAdapter.setupEditor(editor);

    editor.onKeyDown((e: IKeyboardEvent) => {
      if (e.browserEvent.key === "\\") {
        console.log("Show command menu");

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
  };

  const handleFormat = () => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const content = model.getValue();
    const formatted = formatDocument(content);

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
      <div className="relative flex h-full flex-col">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex justify-between gap-2 border-b bg-black">
            <div>
              {files.map((fileName, index) => (
                <Button
                  key={fileName}
                  variant="outline"
                  onClick={() => setActiveFile(fileName)}
                  size="sm"
                  className={`${activeFile === fileName ? "bg-accent" : ""} rounded-none border-0`}
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
            value={
              activeFile === "Scenes" ? content.sceneLevel : content.global
            }
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
        <div className="editor-background absolute -inset-1 z-0 h-full w-full"></div>
      </div>
    </>
  );
}

export default XEditor;

{
  /* {editorInstance && <FloatingEditButton editor={editorInstance} />} */
}
