import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { toast } from "sonner";
import type { Scene } from "@/video/compositions/code-video-composition/types.composition";
import { dexieDB } from "@/lib/dexie-db";
import type { ProjectMeta, ProjectStyles } from "@/types/project.types";
import {
  AUTO_SAVE_DELAY,
  DEFAULT_COMPOSITION_STYLES,
  FALLBACK_DURATION_IN_FRAMES,
} from "@/lib/const";
import { DEFAULT_PROJECT_TEMPLATE } from "./project.const";
import { calculateCompositionDuration } from "@/video/compositions/composition.utils";

interface ProjectState {
  currentProject: {
    id: string | null;
    meta: {
      title: string;
      description: string;
      category: string;
    };
    config: {
      content: {
        global: string;
        sceneLevel: string;
      };
      styles: ProjectStyles;
    };
    scenes: Scene[]; // Runtime only
    durationInFrames: number;
    createdAt: Date;
    lastModified: Date;
  };
  isLoading: boolean;
  error: Error | null;
  _lastSaveTimestamp: number;
  _pendingChanges: boolean;
}

interface ProjectActions {
  loadProject: (id: string) => Promise<void>;
  updateContent: (type: "global" | "sceneLevel", content: string) => void;
  updateMeta: (meta: Partial<ProjectMeta>) => void;
  updateStyles: (styles: ProjectStyles) => void;
  updateScenes: (scenes: Scene[]) => void;
  setDuration: (duration: number) => void;
  clearCurrentProject: () => void;
}

type ProjectStore = ProjectState & ProjectActions;

let saveTimeout: NodeJS.Timeout | null = null;

export const useProjectStore = create<ProjectStore>()(
  devtools(
    immer((set, get) => ({
      currentProject: {
        id: null,
        meta: {
          title: "",
          description: "",
          category: "",
        },
        config: {
          content: {
            global: "",
            sceneLevel: DEFAULT_PROJECT_TEMPLATE,
          },
          styles: DEFAULT_COMPOSITION_STYLES,
        },
        scenes: [],
        durationInFrames: FALLBACK_DURATION_IN_FRAMES,
        createdAt: new Date(),
        lastModified: new Date(),
      },
      isLoading: false,
      error: null,
      _lastSaveTimestamp: Date.now(),
      _pendingChanges: false,

      loadProject: async (id: string) => {
        set((state) => {
          state.isLoading = true;
        });
        try {
          const project = await dexieDB.getProject(id);
          if (!project) throw new Error("Project not found");

          set((state) => {
            state.currentProject = {
              ...project,
              scenes: [], // Initialize empty scenes array
            };
            state.isLoading = false;
            state._pendingChanges = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error as Error;
            state.isLoading = false;
          });
          toast.error("Failed to load project");
        }
      },

      updateContent: (type: "global" | "sceneLevel", content: string) => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject.config.content[type] = content;
          state._pendingChanges = true;
        });

        console.log("updateContent", type, content);

        const currentState = get();
        if (!currentState.currentProject.id) return;

        saveTimeout = setTimeout(async () => {
          console.log("Saving content", type, content);

          try {
            await dexieDB.updateContent(
              currentState.currentProject.id!,
              type,
              content,
            );

            set((state) => {
              state._lastSaveTimestamp = Date.now();
              state._pendingChanges = false;
            });

            toast.success("Changes saved");
          } catch (error) {
            console.log("Failed to save content", error);

            toast.error("Failed to save changes");
          }
        }, AUTO_SAVE_DELAY);
      },

      updateMeta: (meta: Partial<ProjectMeta>) => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject.meta = {
            ...state.currentProject.meta,
            ...meta,
          };
          state._pendingChanges = true;
        });

        const currentState = get();
        if (!currentState.currentProject.id) return;

        saveTimeout = setTimeout(async () => {
          try {
            await dexieDB.updateProjectMeta(
              currentState.currentProject.id!,
              meta,
            );

            set((state) => {
              state._lastSaveTimestamp = Date.now();
              state._pendingChanges = false;
            });
            toast.success("Changes saved");
          } catch (error) {
            toast.error("Failed to save changes");
          }
        }, AUTO_SAVE_DELAY);
      },

      updateStyles: (styles: ProjectStyles) => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject.config.styles = styles;
          state._pendingChanges = true;
        });

        const currentState = get();
        if (!currentState.currentProject.id) return;

        saveTimeout = setTimeout(async () => {
          try {
            await dexieDB.updateProjectConfig(
              currentState.currentProject.id!,
              "styles",
              styles,
            );

            set((state) => {
              state._lastSaveTimestamp = Date.now();
              state._pendingChanges = false;
            });
            toast.success("Styles saved");
          } catch (error) {
            toast.error("Failed to save styles");
          }
        }, AUTO_SAVE_DELAY);
      },

      updateScenes: (scenes: Scene[]) => {
        set((state) => {
          state.currentProject.scenes = scenes;
          state.currentProject.durationInFrames =
            calculateCompositionDuration(scenes);
          // No _pendingChanges update since scenes aren't persisted
        });
      },

      setDuration: (duration: number) => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject.durationInFrames = duration;
          state._pendingChanges = true;
        });

        const currentState = get();
        if (!currentState.currentProject.id) return;

        saveTimeout = setTimeout(async () => {
          try {
            await dexieDB.updateDuration(
              currentState.currentProject.id!,
              duration,
            );

            set((state) => {
              state._lastSaveTimestamp = Date.now();
              state._pendingChanges = false;
            });
            toast.success("Duration updated");
          } catch (error) {
            toast.error("Failed to update duration");
          }
        }, AUTO_SAVE_DELAY);
      },

      clearCurrentProject: () => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject = {
            id: null,
            meta: {
              title: "",
              description: "",
              category: "",
            },
            config: {
              content: {
                global: "",
                sceneLevel: "",
              },
              styles: DEFAULT_COMPOSITION_STYLES,
            },
            scenes: [],
            durationInFrames: FALLBACK_DURATION_IN_FRAMES,
            createdAt: new Date(),
            lastModified: new Date(),
          };
          state.error = null;
          state._pendingChanges = false;
        });
      },
    })),
    {
      name: "composition-store",
      anonymousActionType: "composition-store/anonymous-action",
    },
  ),
);

export const mergeContent = (global: string, sceneLevel: string): string => {
  const trimmedGlobal = global.trim();
  const trimmedSceneLevel = sceneLevel.trim();

  if (!trimmedGlobal) return trimmedSceneLevel;
  if (!trimmedSceneLevel) return trimmedGlobal;

  return `${trimmedGlobal}\n\n${trimmedSceneLevel}`;
};
