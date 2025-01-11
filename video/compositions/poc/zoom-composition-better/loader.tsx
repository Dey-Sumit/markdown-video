import { Composition } from "remotion";
import { z } from "zod";
import ZoomIntoPosition from ".";
import type { ZoomEvent } from "./types";

/**
 * Schema for a single zoom event
 */
export const _ZoomEventSchema = z.object({
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
 * Schema for the array of zoom events
 */
export const ZoomEventsSchema = z.object({
  zoomEvents: z.array(_ZoomEventSchema).min(1),
});

/**
 * Example default value for the schema
 */

export const defaultZoomEvents: ZoomEvent[] = [
  {
    startFrame: 20,
    targetX: 960,
    targetY: 540,
    zoomLevel: 2,
    stayDuration: 30,
  },
];

/**
 * Main Composition to define the video with a single zoom event.
 */
export const ZoomCompositionLoader: React.FC = () => {
  const zoomEvents: ZoomEvent[] = [
    {
      startFrame: 20, // Zoom starts at frame 20
      targetX: 960, // Target X-coordinate (center of the grid horizontally)
      targetY: 540, // Target Y-coordinate (center of the grid vertically)
      zoomLevel: 2, // 2x zoom
      stayDuration: 30, // Stay for 30 frames
    },
    {
      startFrame: 120, // Zoom starts at frame 20
      targetX: 1260, // Target X-coordinate (center of the grid horizontally)
      targetY: 840, // Target Y-coordinate (center of the grid vertically)

      zoomLevel: 2, // 2x zoom
      stayDuration: 30, // Stay for 30 frames
    },
    {
      startFrame: 240, // Zoom starts at frame 20
      targetX: 1920, // Target X-coordinate (center of the grid horizontally)
      targetY: 1080, // Target Y-coordinate (center of the grid vertically)
      zoomLevel: 2, // 2x zoom
      stayDuration: 30, // Stay for 30 frames
    },
  ];

  return (
    <Composition
      id="ZoomIntoPosition"
      component={ZoomIntoPosition}
      durationInFrames={360}
      fps={30}
      width={2880}
      height={1800}
      schema={ZoomEventsSchema}
      defaultProps={{
        zoomEvents: zoomEvents,
      }}
    />
  );
};
