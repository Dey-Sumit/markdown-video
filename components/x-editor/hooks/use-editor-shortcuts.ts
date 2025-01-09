import { dexieDB } from "@/lib/dexie-db";
import { useProjectStore } from "@/store/project-store";
import type { Monaco } from "@monaco-editor/react";
import { type editor, type IDisposable } from "monaco-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface EditorShortcutsProps {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  content: string;
}

export const useEditorShortcuts = ({
  editor,
  monaco,
  content,
}: EditorShortcutsProps) => {
  const handleSave = useCallback(async () => {
    const {
      currentProject: { id, content, styles },
    } = useProjectStore.getState();
    if (!id) return;

    try {
      await dexieDB.updateProject(id, {
        content,
        styles,
        lastModified: new Date(),
      });
      toast.success("Saved successfully");
    } catch (error) {
      toast.error("Failed to save");
    }
  }, []);

  useEffect(() => {
    if (!editor || !monaco) return;

    const disposables: IDisposable[] = [];

    // Save Command
    const saveDisposable = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      handleSave,
    );
    if (saveDisposable)
      disposables.push({
        dispose: () => {
          saveDisposable;
        },
      });

    // Command Palette
    const paletteDisposable = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
      () => editor.trigger("", "editor.action.quickCommand", null),
    );
    if (paletteDisposable)
      disposables.push({
        dispose: () => {
          paletteDisposable;
        },
      });

    const preventDefaults = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventDefaults);

    return () => {
      disposables.forEach((d) => d.dispose());
      window.removeEventListener("keydown", preventDefaults);
    };
  }, [editor, monaco, handleSave]);
};
