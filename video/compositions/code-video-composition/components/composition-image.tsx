import { cn } from "@/lib/utils";
import { Img, interpolate, useCurrentFrame } from "remotion";

const CompositionImage = ({
  src,
  slideDurationInFrames,
  mediaAppearanceDelay,
  withMotion,
}: {
  src: string;
  slideDurationInFrames: number;
  mediaAppearanceDelay: number;
  withMotion?: boolean;
}) => {
  const frame = useCurrentFrame();

  // 30 + 10 = 40+10 frames start
  const TRANSITION_DURATION_IN_FRAMES = 10;
  const BUFFER_IN_FRAMES = 15;
  const FALLBACK_STILL_DURATION = 10;

  const stillDuration =
    slideDurationInFrames -
    (mediaAppearanceDelay + 2 * TRANSITION_DURATION_IN_FRAMES) -
    BUFFER_IN_FRAMES;

  const refinedStillDuration =
    stillDuration <= 0 ? FALLBACK_STILL_DURATION : stillDuration;

  const opacity = interpolate(
    frame, // Frame starts when `startAt` is reached
    [
      mediaAppearanceDelay,
      mediaAppearanceDelay + TRANSITION_DURATION_IN_FRAMES,
      mediaAppearanceDelay +
        TRANSITION_DURATION_IN_FRAMES +
        refinedStillDuration,
      mediaAppearanceDelay +
        TRANSITION_DURATION_IN_FRAMES +
        refinedStillDuration +
        TRANSITION_DURATION_IN_FRAMES,
    ], // Map frame range from 0 to animation duration
    [0, 1, 1, 0], // Opacity changes from `from` to `to`
    {
      extrapolateRight: "clamp", // Ensure the value stops at the end
    },
  );

  // Conditional motion logic
  let transform = "translate(0, 0)";
  if (withMotion) {
    const motionRange = 3; // Maximum pixel shift
    const motionX = Math.sin(frame / 5) * motionRange;
    const motionY = Math.cos(frame / 5) * motionRange;

    const isMotionFrame =
      frame >= mediaAppearanceDelay + TRANSITION_DURATION_IN_FRAMES &&
      frame <=
        mediaAppearanceDelay +
          TRANSITION_DURATION_IN_FRAMES +
          refinedStillDuration;
    // Subtle motion for X and Y axes
    transform = isMotionFrame
      ? `translate(${motionX}px, ${motionY}px)`
      : "translate(0, 0)";
  }

  return (
    <div
      style={{
        opacity,
        zIndex: 10, // will come at the top most layer
      }}
      className="absolute inset-0 flex items-center justify-center backdrop-blur-lg"
    >
      <Img
        style={{
          transform,
        }}
        src={src}
        className={cn(
          "rounded-2xl border-4 border-white shadow-2xl",
          "h-[60%] w-[60%]",
        )}
        onError={(e) => {
          console.log("Error loading image", e);
        }}
      />
    </div>
  );
};
export default CompositionImage;
