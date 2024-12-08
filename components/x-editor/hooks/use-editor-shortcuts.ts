import { db } from "@/lib/dexie-db";
import useCompositionStore from "@/store/composition-store";
import type { editor } from "monaco-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

interface EditorShortcutsProps {
  editor: editor.IStandaloneCodeEditor;
  monaco: typeof import("monaco-editor");
  content: string;
}

export const useEditorShortcuts = ({
  editor,
  monaco,
}: EditorShortcutsProps) => {
  const content = useCompositionStore((state) => state.content);
  const handleSave = useCallback(async () => {
    try {
      await db.editorContent.put({
        id: 1,
        content,
        updatedAt: new Date(),
      });
      toast.success("Saved successfully", {
        duration: 1000,
      });
    } catch (error) {
      console.error("Manual save failed:", error);
      toast.error("Failed to save");
    }
  }, [content]);

  useEffect(() => {
    if (!editor || !monaco) return;

    // Save Command (Ctrl/Cmd + S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);

    // Command Palette (Ctrl/Cmd + P)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      editor.trigger("", "editor.action.quickCommand", null);
    });

    // Prevent browser defaults
    const preventDefaults = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventDefaults);
    return () => window.removeEventListener("keydown", preventDefaults);
  }, [editor, monaco, handleSave]);
};
