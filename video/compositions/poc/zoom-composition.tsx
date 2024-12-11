import { Composition } from "remotion";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const ZoomIntoPosition: React.FC<{
  zoomLevel: number; // Desired zoom level
  targetX: number; // Target X coordinate
  targetY: number; // Target Y coordinate
  durationInFrames: number; // Duration of the zoom effect
}> = ({ zoomLevel, targetX, targetY, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Interpolate scale
  const scale = interpolate(frame, [0, durationInFrames], [1, zoomLevel], {
    extrapolateRight: "clamp",
  });

  // Determine visible bounds after zooming
  const visibleWidth = width / scale;
  const visibleHeight = height / scale;

  // Determine if zooming would push corners out of the frame
  const isNearLeft = targetX - visibleWidth / 2 < 0;
  const isNearRight = targetX + visibleWidth / 2 > width;
  const isNearTop = targetY - visibleHeight / 2 < 0;
  const isNearBottom = targetY + visibleHeight / 2 > height;

  // Adjust transform-origin based on proximity to edges or center
  const originX = isNearLeft
    ? 0 // Snap to left edge
    : isNearRight
      ? width // Snap to right edge
      : targetX; // Center case

  const originY = isNearTop
    ? 0 // Snap to top edge
    : isNearBottom
      ? height // Snap to bottom edge
      : targetY; // Center case

  return (
    <div
      className="relative h-full w-full bg-gray-800"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `${originX}px ${originY}px`,
        overflow: "hidden", // Prevent any overflow
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 border border-white">
        {Array.from({ length: 12 * 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-500"
            style={{ background: i % 2 === 0 ? "#333" : "#555" }}
          />
        ))}
      </div>

      {/* Zooming content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">
          Zooming to ({targetX}, {targetY})
        </div>
      </div>

      {/* Target indicator */}
      <div
        className="absolute h-8 w-8 rounded-full bg-red-500"
        style={{
          left: `${targetX - 16}px`, // Offset for circle radius
          top: `${targetY - 16}px`,
        }}
      />
    </div>
  );
};

// Main Composition
export const MyVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="ZoomIntoPosition"
        component={ZoomIntoPosition}
        durationInFrames={120} // Total duration of the composition
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          zoomLevel: 2, // Zoom 2x
          targetX: 1920, // Near bottom-right corner
          targetY: 1080, // Near bottom-right corner
          durationInFrames: 60, // Duration of the zoom effect
        }}
      />
    </>
  );
};
