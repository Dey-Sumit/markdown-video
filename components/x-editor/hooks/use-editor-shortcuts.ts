import { dexieDB } from "@/lib/dexie-db";
import type { Monaco } from "@monaco-editor/react";
import { type editor } from "monaco-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { formatDocument } from "../format-document";
import { useParams } from "next/navigation";

interface EditorShortcutsProps {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  content: string;
}

export const useEditorShortcuts = ({
  editor,
  monaco,
}: EditorShortcutsProps) => {
  const params = useParams<{
    id: string;
  }>();

  const handleSave = useCallback(async () => {
    try {
      if (!editor || !params.id) return;
      const projectId = params.id;
      const model = editor.getModel();
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

      await dexieDB.updateContent(projectId, "sceneLevel", content);
      toast.success("Saved successfully");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to save ${error.message}`);
    }
  }, [editor, params.id]);

  useEffect(() => {
    if (!editor || !monaco) return;

    // Register save command
    const saveDisposable = editor.addAction({
      id: "save",
      label: "Save",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: handleSave,
    });

    // Register command palette
    const paletteDisposable = editor.addAction({
      id: "command-palette",
      label: "Command Palette",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP],
      run: () => editor.trigger("", "editor.action.quickCommand", null),
    });

    const preventDefaults = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventDefaults);

    // Cleanup
    return () => {
      saveDisposable.dispose();
      paletteDisposable.dispose();
      window.removeEventListener("keydown", preventDefaults);
    };
  }, [editor, monaco, handleSave]);
};
