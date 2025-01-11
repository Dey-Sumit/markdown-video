import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ProjectStore, Video, ZoomPoint } from "../types.zoom";

// Create the Zustand store
export const useZoomProjectStore = create<ProjectStore>()(
  devtools(
    immer((set, get) => ({
      videos: [], // Initial empty array of videos
      zoomPoints: [], // Initial empty array of zoom points
      background: {
        padding: 0,
        borderRadius: 0,
        insets: 0,
      }, // Initial background styles

      // Add a new video
      addVideo: (video) => {
        const newVideo: Video = {
          ...video,
          type: "video", // Fixed type
        };
        set((state) => {
          state.videos.push(newVideo);
        });
      },

      // Update a video by index
      updateVideo: (index, updatedFields) => {
        set((state) => {
          if (state.videos[index]) {
            Object.assign(state.videos[index].editableProps, updatedFields);
          }
        });
      },

      // Remove a video by index
      removeVideo: (index) => {
        set((state) => {
          state.videos.splice(index, 1);
        });
      },

      // Add a new zoom point
      addZoomPoint: (point) => {
        const newPoint: ZoomPoint = {
          ...point,
          id: crypto.randomUUID(), // Generate a unique ID
        };
        set((state) => {
          state.zoomPoints.push(newPoint);
        });
      },

      // Update an existing zoom point
      updateZoomPoint: (id, updatedFields) => {
        set((state) => {
          const pointIndex = state.zoomPoints.findIndex(
            (point) => point.id === id,
          );
          if (pointIndex !== -1) {
            Object.assign(state.zoomPoints[pointIndex], updatedFields);
          }
        });
      },

      // Delete a zoom point by ID
      deleteZoomPoint: (id) => {
        set((state) => {
          state.zoomPoints = state.zoomPoints.filter(
            (point) => point.id !== id,
          );
        });
      },

      // Update background styles
      updateBackground: (updatedFields) => {
        set((state) => {
          Object.assign(state.background, updatedFields);
        });
      },
    })),
  ),
);
