import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { convertSecondsToFramerate } from "../composition.utils";

const TRANSITION_DURATION_IN_FRAMES = 10; // entry and exit duration
const BUFFER_IN_FRAMES = 15;
const FALLBACK_STILL_DURATION = 10;

// Define animation functions in a config object
const animationConfig: Record<
  | "fade"
  | "scale"
  | "none"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "pop-in",
  (frame: number, delay: number, duration: number) => string
> = {
  fade: () => "",
  scale: (frame, delay, duration) => {
    const scale = interpolate(frame, [delay, delay + duration], [0.8, 1], {
      extrapolateRight: "clamp",
    });
    return `scale(${scale})`;
  },
  none: () => "",
  "slide-left": (frame, delay, duration) => {
    const translateX = interpolate(frame, [delay, delay + duration], [200, 0], {
      extrapolateRight: "clamp",
    });
    return `translateX(${translateX}px)`;
  },
  "slide-right": (frame, delay, duration) => {
    const translateX = interpolate(
      frame,
      [delay, delay + duration],
      [-200, 0],
      {
        extrapolateRight: "clamp",
      },
    );
    return `translateX(${translateX}px)`;
  },
  "slide-up": (frame, delay, duration) => {
    const translateY = interpolate(frame, [delay, delay + duration], [200, 0], {
      extrapolateRight: "clamp",
    });
    return `translateY(${translateY}px)`;
  },
  "slide-down": (frame, delay, duration) => {
    const translateY = interpolate(
      frame,
      [delay, delay + duration],
      [-200, 0],
      {
        extrapolateRight: "clamp",
      },
    );
    return `translateY(${translateY}px)`;
  },
  "pop-in": (frame, delay, duration) => {
    const scale = interpolate(
      frame,
      [delay, delay + duration / 2, delay + duration],
      [0.5, 1.2, 1],
      {
        extrapolateRight: "clamp",
      },
    );
    return `scale(${scale})`;
  },
} as const;

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
  animation: keyof typeof animationConfig;
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

  const opacity = interpolate(
    frame,
    [
      delayInFrames,
      delayInFrames + TRANSITION_DURATION_IN_FRAMES,
      delayInFrames + TRANSITION_DURATION_IN_FRAMES + refinedStillDuration,
      delayInFrames +
        TRANSITION_DURATION_IN_FRAMES +
        refinedStillDuration +
        TRANSITION_DURATION_IN_FRAMES,
    ],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" },
  );

  const transformFn = animationConfig[animation] || (() => "");
  let transform = transformFn(
    frame,
    delayInFrames,
    TRANSITION_DURATION_IN_FRAMES,
  );

  if (withMotion && isInActiveRange) {
    const motionRange = 3;
    const motionX = Math.sin(frame / 5) * motionRange;
    const motionY = Math.cos(frame / 5) * motionRange;
    transform += ` translate(${motionX}px, ${motionY}px)`;
  }

  return { opacity, transform, isInActiveRange };
};
