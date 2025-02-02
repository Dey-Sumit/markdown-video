import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { convertSecondsToFramerate } from "../composition.utils";
import { animationConfig, type CommonAnimationType } from "../animation.config";

const TRANSITION_DURATION_IN_FRAMES = 10; // entry and exit duration
const BUFFER_IN_FRAMES = 15;
const FALLBACK_STILL_DURATION = 10;

/**
 * Reusable animation hook for components like Image, Text, and Section
 */
export const useAnimatedProperties = ({
  delay,
  sceneDurationInFrames,
  animation,
  withMotion = false,
}: {
  delay: number;
  sceneDurationInFrames: number;
  animation: CommonAnimationType;
  withMotion?: boolean;
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const delayInFrames = convertSecondsToFramerate(delay, fps);

  const stillDuration =
    sceneDurationInFrames -
    (delayInFrames + 2 * TRANSITION_DURATION_IN_FRAMES) -
    BUFFER_IN_FRAMES;

  const refinedStillDuration =
    stillDuration <= 0 ? FALLBACK_STILL_DURATION : stillDuration;

  const isInActiveRange =
    frame >= delayInFrames + TRANSITION_DURATION_IN_FRAMES &&
    frame <=
      delayInFrames + TRANSITION_DURATION_IN_FRAMES + refinedStillDuration;

  const { transform, opacity } = animationConfig[animation]
    ? animationConfig[animation](
        frame,
        delayInFrames,
        TRANSITION_DURATION_IN_FRAMES,
      )
    : { transform: "", opacity: undefined };
 

  // Default opacity logic (only if animation does not define opacity)
  const computedOpacity =
    opacity !== undefined
      ? opacity
      : interpolate(
          frame,
          [
            delayInFrames,
            delayInFrames + TRANSITION_DURATION_IN_FRAMES,
            delayInFrames +
              TRANSITION_DURATION_IN_FRAMES +
              refinedStillDuration,
            delayInFrames +
              TRANSITION_DURATION_IN_FRAMES +
              refinedStillDuration +
              TRANSITION_DURATION_IN_FRAMES,
          ],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" },
        );

  let finalTransform = transform || "";

  if (withMotion && isInActiveRange) {
    const motionRange = 3;
    const motionX = Math.sin(frame / 5) * motionRange;
    const motionY = Math.cos(frame / 5) * motionRange;
    finalTransform += ` translate(${motionX}px, ${motionY}px)`;
  }

  return {
    opacity: computedOpacity,
    transform: finalTransform,
    isInActiveRange,
  };
};
