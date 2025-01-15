import { Editor, type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { extractCSS } from "~/lib/utils";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { ImageSequenceItemType } from "~/types/timeline.types";

type EditorTab = "image" | "container" | "overlay";

const SequenceItemEditor: React.FC = () => {
  const updateImageEditableProps = useVideoStore(
    (store) => store.updateImageEditableProps,
  );
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);
  const activeSequenceItem = (
    sequenceItems[activeSeqItemLite.itemId] as ImageSequenceItemType
  ).editableProps;

  const [editorContents, setEditorContents] = useState<
    Record<EditorTab, string>
  >({
    image: "",
    container: "",
    overlay: "",
  });

  const [activeTab, setActiveTab] = useState<EditorTab>("image");

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const initializeEditorContents = () => {
      const newEditorContents: Record<EditorTab, string> = {
        image: "",
        container: "",
        overlay: "",
      };

      Object.keys(newEditorContents).forEach((key) => {
        const tab = key as EditorTab;
        const styles =
          activeSequenceItem?.styles?.[tab === "image" ? "element" : tab];
        if (styles) {
          const cssString = Object.entries(styles)
            .map(([cssKey, value]) => `  ${cssKey}: ${value};`)
            .join("\n");
          newEditorContents[tab] = `${tab} {\n${cssString}\n}`;
        } else {
          newEditorContents[tab] =
            `${tab} {\n  /* Write your ${tab} styles here */\n}`;
        }
      });

      setEditorContents(newEditorContents);
    };

    initializeEditorContents();
  }, [activeSequenceItem]);

  const handleSave = () => {
    if (editorRef.current) {
      const updatedStyles: Record<string, Record<string, string>> = {};

      Object.keys(editorContents).forEach((key) => {
        const tab = key as EditorTab;
        const css = editorContents[tab];
        const styles = extractCSS(css);
        //@ts-ignore
        updatedStyles[tab === "image" ? "element" : tab] = styles;
      });

      updateImageEditableProps(
        activeSeqItemLite.layerId,
        activeSeqItemLite.itemId,
        {
          styles: {
            ...activeSequenceItem.styles,
            ...updatedStyles,
          },
        },
      );
    }
  };

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;

    // monacoInstance.editor.setTheme("vs-dark");
    monacoInstance.editor.defineTheme("customDarkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
      },
    });
    monacoInstance.editor.setTheme("customDarkTheme");

    monacoInstance.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: "warning",
        vendorPrefix: "warning",
        duplicateProperties: "warning",
        emptyRules: "ignore",
        importStatement: "warning",
        boxModel: "ignore",
        universalSelector: "warning",
        zeroUnits: "warning",
        fontFaceProperties: "warning",
        hexColorLength: "error",
        argumentsInColorFunction: "error",
        unknownProperties: "error",
        ieHack: "ignore",
        unknownVendorSpecificProperties: "ignore",
        propertyIgnoredDueToDisplay: "warning",
        important: "ignore",
        float: "ignore",
        idSelector: "ignore",
      },
    });

    const model = editor.getModel();
    if (model) {
      const updateDecorations = () => {
        const lines = model.getLinesContent();
        editor.createDecorationsCollection([
          {
            range: new monacoInstance.Range(1, 1, 1, Infinity),
            options: { inlineClassName: "readonly-line" },
          },
          {
            range: new monacoInstance.Range(
              lines.length,
              1,
              lines.length,
              Infinity,
            ),
            options: { inlineClassName: "readonly-line" },
          },
        ]);
      };

      updateDecorations();

      editor.onDidChangeModelContent(() => {
        const currentContent = editor.getValue();
        const lines = currentContent.split("\n");

        if (lines[0] !== `${activeTab} {` || lines[lines.length - 1] !== "}") {
          const middleContent = lines.slice(1, -1).join("\n");
          editor.setValue(`${activeTab} {\n${middleContent}\n}`);
          updateDecorations();
        }

        setEditorContents((prev) => ({
          ...prev,
          [activeTab]: editor.getValue(),
        }));
      });

      editor.onKeyDown((e) => {
        const selection = editor.getSelection();
        if (selection) {
          const lines = model.getLinesContent();
          if (
            selection.startLineNumber === 1 ||
            selection.endLineNumber === lines.length
          ) {
            e.preventDefault();
          }
        }
      });
    }
  };

  return (
    <div>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <div className="h-96 p-2">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EditorTab)}
          className="mx-auto w-full max-w-3xl"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image">Image CSS</TabsTrigger>
            <TabsTrigger value="container">Container CSS</TabsTrigger>
            <TabsTrigger value="overlay">Overlay CSS</TabsTrigger>
          </TabsList>
          {(["image", "container", "overlay"] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="h-96 overflow-hidden">
                <CardContent className="h-full p-0">
                  <Editor
                    className="relative h-full w-full rounded-md border-2"
                    height="100%"
                    defaultLanguage="css"
                    value={editorContents[tab]}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "off",
                      lineHeight: 22,
                      padding: {
                        top: 16,
                        bottom: 16,
                      },

                      fontFamily:
                        "'Fira Code', 'Consolas', 'Courier New', monospace",
                      fontLigatures: true,
                      renderLineHighlight: "none",
                      scrollbar: {
                        vertical: "hidden",
                        horizontal: "hidden",
                      },
                      overviewRulerLanes: 0,
                      hideCursorInOverviewRuler: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <style jsx global>{`
        .monaco-editor .overflow-guard {
          border-radius: 2rem !important;
        }
        .monaco-editor {
          border-radius: 2rem !important;
        }
      `}</style>
    </div>
  );
};

export default SequenceItemEditor;
