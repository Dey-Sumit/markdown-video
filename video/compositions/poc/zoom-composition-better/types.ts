/**
 * Represents a zoom event for the video.
 */
export type ZoomEvent = {
  startFrame: number; // Frame to start the zoom-in
  targetX: number; // X-coordinate to zoom into
  targetY: number; // Y-coordinate to zoom into
  zoomLevel: number; // Scale level
  stayDuration: number; // Frames to stay at the zoom level
};
