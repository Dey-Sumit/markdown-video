import { validateMarkdown } from "@/components/x-editor/utils";
import { db } from "@/lib/dexie-db";
import { toast } from "sonner";

import { compositionMetaData } from "@/video/compositions/code-video-composition/config";
import type { CompositionStore } from "@/video/compositions/code-video-composition/types.composition";
import { calculateCompositionDuration } from "@/video/compositions/composition.utils";
import { editor } from "monaco-editor";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

const FALLBACK_DURATION = 3 * compositionMetaData.fps; // 3 seconds

const useCompositionStore = create<CompositionStore>()(
  devtools(
    immer((set) => ({
      content: "",
      steps: [],
      loading: false,
      error: null,
      setContent: (content) =>
        set((state) => {
          state.content = content;

          // Create temporary model for validation
          const model = editor.createModel(content, "markdown");
          const { hasErrors } = validateMarkdown(model);
          model.dispose();

          if (hasErrors) {
            if ((state as any)._saveTimeout) {
              clearTimeout((state as any)._saveTimeout);
            }
            return;
          }

          if ((state as any)._saveTimeout) {
            clearTimeout((state as any)._saveTimeout);
          }

          (state as any)._saveTimeout = setTimeout(async () => {
            try {
              await db.editorContent.put({
                id: 1,
                content,
                updatedAt: new Date(),
              });
              toast.success("Saved successfully", { duration: 1000 });
            } catch (error) {
              toast.error("Failed to save");
            }
          }, AUTO_SAVE_INTERVAL);
        }),
      setSteps: (steps) => {
        set((state) => {
          state.steps = steps;
          state.duration =
            calculateCompositionDuration(steps) || FALLBACK_DURATION;
        });
      },
      setLoading: (loading) => {
        set((state) => {
          state.loading = loading;
        });
      },
      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },
      duration: FALLBACK_DURATION,
      loadSavedContent: async () => {
        try {
          const savedContent = await db.editorContent.get(1);
          if (savedContent) {
            set((state) => {
              state.content = savedContent.content;
            });
          }
        } catch (error) {
          console.error("Failed to load saved content:", error);
          toast.error("Failed to load saved content");
        }
      },
    })),
    {
      name: "composition-store",
      anonymousActionType: "composition-store/anonymous-action",
    },
  ),
);

export default useCompositionStore;
