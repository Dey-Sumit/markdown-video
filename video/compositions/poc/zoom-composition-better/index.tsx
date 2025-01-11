import { Composition, OffthreadVideo, staticFile } from "remotion";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ZoomEventsSchema } from "./loader";
import type { z } from "zod";
import type { ZoomEvent } from "./types";

/**
 * Renders a zoomable grid with row and column labels.
 */
const ZoomIntoPosition: React.FC<z.infer<typeof ZoomEventsSchema>> = ({
  zoomEvents,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Get the active zoom event for the current frame
  const activeZoomEvent = zoomEvents.find(
    (event) =>
      frame >= event.startFrame &&
      frame < event.startFrame + 30 + event.stayDuration + 30, // Zoom-in + Stay + Zoom-out
  );

  // Default scale and origin if no zoom event is active
  const scale = activeZoomEvent
    ? interpolate(
        frame,
        [
          activeZoomEvent.startFrame,
          activeZoomEvent.startFrame + 30,
          activeZoomEvent.startFrame + 30 + activeZoomEvent.stayDuration,
          activeZoomEvent.startFrame + 30 + activeZoomEvent.stayDuration + 30,
        ],
        [1, activeZoomEvent.zoomLevel, activeZoomEvent.zoomLevel, 1],
        {
          extrapolateRight: "clamp",
        },
      )
    : 1;

  const originX = activeZoomEvent?.targetX || width / 2;
  const originY = activeZoomEvent?.targetY || height / 2;

  // Number of rows and columns for the grid
  const rows = 8;
  const cols = 12;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `${originX}px ${originY}px`,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "black",
      }}
    >
      {/* Render grid */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          opacity: 0.2,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;

          return (
            <div
              key={index}
              style={{
                border: "1px solid gray",
                position: "relative",
                background: row % 2 === col % 2 ? "#222" : "#333",
              }}
            >
              {/* Row and column labels */}
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  fontSize: 12,
                  color: "white",
                  opacity: 0.8,
                }}
              >
                ({row}, {col})
              </span>
            </div>
          );
        })}
      </div>

      {/* Target marker */}
      {activeZoomEvent && (
        <div
          style={{
            position: "absolute",
            left: activeZoomEvent.targetX - 16,
            top: activeZoomEvent.targetY - 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "red",
          }}
        />
      )}

      <OffthreadVideo
        src={staticFile("videos/screen-recording.mov")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Ensures it's behind the grid
        }}
        muted
      />
    </div>
  );
};

export default ZoomIntoPosition;
