/**
 * @fileoverview Project store implementation using Zustand
 * Manages project state, auto-save, and database interactions
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { db, type ProjectStyles } from "../lib/dexie-db";
import { toast } from "sonner";
import { editor } from "monaco-editor";
import { validateMarkdown } from "@/components/x-editor/utils";
import type { Scene } from "@/video/compositions/code-video-composition/types.composition";
import { calculateCompositionDuration } from "@/video/compositions/composition.utils";
import { DEFAULT_COMPOSITION_STYLES } from "@/lib/const";

const AUTO_SAVE_DELAY = 20 * 1000; // 10 seconds

export const DEFAULT_PROJECT_TEMPLATE = `## !!scene --title=Text --duration=4 --background=blue
!text --content="Your Text With Animation" --animation=fadeInSlideUp --duration=3 --delay=0.5
!transition --type=slide --duration=0.3 --direction=from-left

## !!scene --title=Code --duration=4 --background=transparent
!transition --type=slide --duration=0.8 --direction=from-bottom
\`\`\`js !
const fastestEditor = () => {
    return "markdownvideo.com"
}
fastestEditor()
\`\`\`

## !!scene --title=Scene --duration=5
!transition --type=fade --duration=0.3
\`\`\`js !
\`\`\``;

export const PLAYGROUND_PROJECT_TEMPLATE = `## !!scene --title=Text --duration=4 --background=blue
!text --content="Your Text With Animation" --animation=fadeInSlideUp --duration=3 --delay=0.5
!transition --type=slide --duration=0.3 --direction=from-left

## !!scene --title=Code --duration=4 --background=transparent
!transition --type=slide --duration=0.8 --direction=from-bottom
\`\`\`js !
const fastestEditor = () => {
    return "markdownvideo.com"
}
fastestEditor()
\`\`\`

## !!scene --title=Scene --duration=5
!transition --type=fade --duration=0.3
\`\`\`js !
\`\`\``;

interface ProjectState {
  currentProject: {
    id: string | null;
    content: string;
    styles: ProjectStyles;
    scenes: Scene[];
    duration: number;
    lastModified: Date;
  };
  isLoading: boolean;
  error: Error | null;
  _lastSaveTimestamp: number;
  _pendingChanges: boolean;
}

interface ProjectActions {
  loadProject: (id: string) => Promise<void>;
  updateContent: (content: string) => void;
  updateStyles: (styles: ProjectStyles) => void;
  updateScenes: (scenes: Scene[]) => void;
  setDuration: (duration: number) => void;
  clearCurrentProject: () => void;
}

type ProjectStore = ProjectState & ProjectActions;
let saveTimeout: NodeJS.Timeout | null = null;
/**
 * Creates and configures the project store with Zustand
 */
export const useProjectStore = create<ProjectStore>()(
  devtools(
    immer((set, get) => ({
      currentProject: {
        id: null,
        content: "",
        styles: DEFAULT_COMPOSITION_STYLES,
        scenes: [],
        duration: 3,
        lastModified: new Date(),
      },
      isLoading: false,
      error: null,
      _lastSaveTimestamp: Date.now(),
      _pendingChanges: false,
      updateScenes: (scenes) =>
        set((state) => {
          state.currentProject.scenes = scenes;
          state.currentProject.duration = calculateCompositionDuration(scenes);
        }),

      setDuration: (duration) =>
        set((state) => {
          state.currentProject.duration = duration;
        }),

      /**
       * Loads a project from the database
       * @param id - Project ID to load
       */
      loadProject: async (id: string) => {
        const PLAYGROUND_PROJECT_ID = "playground";
        console.log("Loading project", id);

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        if (!id) {
          set((state) => {
            state.currentProject.id = PLAYGROUND_PROJECT_ID;
            state.currentProject.content = PLAYGROUND_PROJECT_TEMPLATE;
            state.currentProject.styles = DEFAULT_COMPOSITION_STYLES;
            state.isLoading = false;
          });
          return;
        }

        try {
          const project = await db.projects.get(id);
          if (!project) throw new Error("Project not found");

          set((state) => {
            state.currentProject.id = project.id;
            state.currentProject.content = project.content;
            state.currentProject.styles = project.styles;
            state.currentProject.lastModified = project.lastModified;

            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error as Error;
            state.isLoading = false;
          });
          toast.error("Failed to load project");
        }
      },

      /**
       * Updates project content with auto-save
       * @param content - New content to save
       */
      updateContent: (content: string) => {
        // Clear existing timeout
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        set((state) => {
          state.currentProject.content = content;
          state._pendingChanges = true;
        });

        saveTimeout = setTimeout(async () => {
          const currentState = get();
          if (!currentState._pendingChanges) return;

          try {
            await db.updateProject(currentState.currentProject.id!, {
              content,
            });
            set((state) => {
              state._lastSaveTimestamp = Date.now();
              state._pendingChanges = false;
            });
            toast.success("Changes saved");
          } catch (error) {
            toast.error("Save failed");
          }
        }, AUTO_SAVE_DELAY);
      },

      /**
       * Updates project styles
       * @param styles - New styles configuration
       */
      updateStyles: (styles: ProjectStyles) => {
        const state = get();
        if (!state.currentProject.id) return;

        set((state) => {
          state.currentProject.styles = styles;
        });

        // Auto-save styles
        if ((state as any)._stylesSaveTimeout) {
          clearTimeout((state as any)._stylesSaveTimeout);
        }

        (state as any)._stylesSaveTimeout = setTimeout(async () => {
          try {
            await db.updateProject(state.currentProject.id!, {
              styles,
              lastModified: new Date(),
            });
          } catch (error) {
            toast.error("Failed to save style changes");
          }
        }, AUTO_SAVE_DELAY);
      },

      /**
       * Clears current project state
       */
      clearCurrentProject: () => {
        set((state) => {
          state.currentProject = {
            id: null,
            content: "",
            styles: DEFAULT_COMPOSITION_STYLES,
            scenes: [],
            duration: 0,
            lastModified: new Date(),
          };
          state.error = null;
        });
      },
    })),
    {
      name: "composition-store",
      anonymousActionType: "composition-store/anonymous-action",
    },
  ),
);
