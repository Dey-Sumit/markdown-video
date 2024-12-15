import { validateMarkdown } from "@/components/x-editor/utils";
import { db } from "@/lib/dexie-db";
import { toast } from "sonner";

import {
  compositionMetaData,
  FALLBACK_COMPOSITION_DURATION_IN_SECONDS,
} from "@/video/compositions/code-video-composition/config";
import type { CompositionStore } from "@/video/compositions/code-video-composition/types.composition";
import { calculateCompositionDuration } from "@/video/compositions/composition.utils";
import { editor } from "monaco-editor";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const AUTO_SAVE_INTERVAL = 5 * 1000; // 5 seconds

const useCompositionStore = create<CompositionStore>()(
  devtools(
    immer((set) => ({
      content: "",
      scenes: [],
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
      setScenes: (scenes) => {
        set((state) => {
          state.scenes = scenes;
          state.duration =
            calculateCompositionDuration(scenes) ||
            FALLBACK_COMPOSITION_DURATION_IN_SECONDS;
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
      duration: FALLBACK_COMPOSITION_DURATION_IN_SECONDS,
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
      styles: {
        backgroundContainer: {
          background: {
            color: "",
            gradient: {
              angle: 0,
              colors: ["#4338ca", "#5b21b6"],
            },
            image: "",
            activeType: "color",
          },
        },
        sceneContainer: {
          inset: 0,
          padding: 40,
          borderRadius: 10,
        },
      },

      setStyles: (styles) => {
        set((state) => {
          state.styles = styles;
        });
      },
    })),
    {
      name: "composition-store",
      anonymousActionType: "composition-store/anonymous-action",
    },
  ),
);

export default useCompositionStore;
