// Define the Video type
export type Video = {
  type: "video"; // Fixed type
  editableProps: {
    videoUrl: string; // Video URL
    trimStart: number; // Trim start frame
    trimEnd: number; // Trim end frame
  };
  totalVideoDurationInFrames: number; // Total duration in frames
};

// Define the ZoomPoint type
export type ZoomPoint = {
  id: string; // Unique identifier for each zoom point
  startFrame: number;
  targetX: number;
  targetY: number;
  zoomLevel: number;
  stayDuration: number;
};

// Define the Background type
export type Background = {
  padding: number;
  borderRadius: number;
  insets: number;
};

// Define the store's state and actions
export interface ProjectStore {
  videos: Video[]; // Array of video objects
  zoomPoints: ZoomPoint[]; // List of zoom points
  background: Background; // Background styles

  // Actions
  addVideo: (video: Omit<Video, "type">) => void; // Add a new video
  updateVideo: (
    index: number,
    updatedFields: Partial<Video["editableProps"]>,
  ) => void; // Update a video by index
  removeVideo: (index: number) => void; // Remove a video by index

  addZoomPoint: (point: Omit<ZoomPoint, "id">) => void; // Add a new zoom point
  updateZoomPoint: (id: string, updatedFields: Partial<ZoomPoint>) => void; // Update an existing zoom point
  deleteZoomPoint: (id: string) => void; // Remove a zoom point

  updateBackground: (updatedFields: Partial<Background>) => void; // Update background styles
}

import { z } from "zod";

/**
 * Schema for a single zoom event
 */
export const ZoomEventSchema = z.object({
  startFrame: z.number().min(0).describe("Frame to start the zoom-in"),
  targetX: z
    .number()
    .min(0)
    .describe("X-coordinate to zoom into (e.g., center of a grid cell)"),
  targetY: z
    .number()
    .min(0)
    .describe("Y-coordinate to zoom into (e.g., center of a grid cell)"),
  zoomLevel: z
    .number()
    .min(1)
    .describe("Scale level for zooming (e.g., 2 for 2x zoom)"),
  stayDuration: z
    .number()
    .min(0)
    .describe("Frames to stay at the zoom level after zoom-in"),
});

/**
 * Schema for the videos array
 */
export const VideoSchema = z.object({
  type: z.literal("video").describe("The type must always be 'video'"),
  editableProps: z.object({
    videoUrl: z.string().url().describe("The URL of the video file"),
    trimStart: z.number().min(0).describe("Start frame for trimming the video"),
    trimEnd: z.number().min(0).describe("End frame for trimming the video"),
  }),
  totalVideoDurationInFrames: z
    .number()
    .min(1)
    .describe("Total duration of the video in frames"),
});

/**
 * Schema for styles (background properties)
 */
export const StylesSchema = z.object({
  padding: z.number().min(0).describe("Padding around the background"),
  borderRadius: z.number().min(0).describe("Border radius of the background"),
  insets: z.number().min(0).describe("Insets for the background"),
});

/**
 * Main schema for the composition
 */
export const VideoCompositionSchema = z.object({
  zoomEvents: z
    .array(ZoomEventSchema)
    .min(1)
    .describe("Array of zoom events for the animation"),
  videos: z
    .array(VideoSchema)
    .min(1)
    .describe("Array of video objects to include in the composition"),
  styles: StylesSchema.describe("Styles for background customization"),
});
