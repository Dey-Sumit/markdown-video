import { cn } from "@/lib/utils";
import { Img, interpolate, useCurrentFrame } from "remotion";

// Define animation functions in a config object
const animationConfig: Record<
  | "fade"
  | "scale"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "bounce-in"
  | "spin-in"
  | "flip-in"
  | "zig-zag"
  | "pop-in",
  (
    frame: number,
    mediaAppearanceDelay: number,
    transitionDuration: number,
  ) => string
> = {
  fade: () => "", // Opacity is handled separately
  scale: (frame, delay, duration) => {
    const scale = interpolate(frame, [delay, delay + duration], [0.8, 1], {
      extrapolateRight: "clamp",
    });
    return `scale(${scale})`;
  },
  "slide-left": (frame, delay, duration) => {
    const translateX = interpolate(
      frame,
      [delay, delay + duration],
      [200, 0], // Slide in from right
      { extrapolateRight: "clamp" },
    );
    return `translateX(${translateX}px)`;
  },
  "slide-right": (frame, delay, duration) => {
    const translateX = interpolate(
      frame,
      [delay, delay + duration],
      [-200, 0], // Slide in from left
      { extrapolateRight: "clamp" },
    );
    return `translateX(${translateX}px)`;
  },
  "slide-up": (frame, delay, duration) => {
    const translateY = interpolate(
      frame,
      [delay, delay + duration],
      [200, 0], // Slide in from bottom
      { extrapolateRight: "clamp" },
    );
    return `translateY(${translateY}px)`;
  },
  "slide-down": (frame, delay, duration) => {
    const translateY = interpolate(
      frame,
      [delay, delay + duration],
      [-200, 0], // Slide in from top
      { extrapolateRight: "clamp" },
    );
    return `translateY(${translateY}px)`;
  },
  "bounce-in": (frame, delay, duration) => {
    const bounce = interpolate(frame, [delay, delay + duration], [1.2, 1], {
      extrapolateRight: "clamp",
    });
    return `scale(${bounce})`;
  },

  // NEW: Spin In
  "spin-in": (frame, delay, duration) => {
    const rotate = interpolate(frame, [delay, delay + duration], [360, 0], {
      extrapolateRight: "clamp",
    });
    return `rotate(${rotate}deg)`;
  },

  // NEW: Flip In
  "flip-in": (frame, delay, duration) => {
    const flip = interpolate(
      frame,
      [delay, delay + duration],
      [90, 0], // Flip from 90 degrees to 0
      { extrapolateRight: "clamp" },
    );
    return `rotateY(${flip}deg)`;
  },

  // NEW: Zig-Zag
  "zig-zag": (frame, delay, duration) => {
    const amplitude = 50; // Maximum zig-zag amplitude
    const zigzag = Math.sin((frame - delay) / 5) * amplitude;
    const translateX = interpolate(
      frame,
      [delay, delay + duration],
      [200, 0], // From the right to center
      { extrapolateRight: "clamp" },
    );
    return `translateX(${translateX}px) translateY(${zigzag}px)`;
  },

  // NEW: Pop In
  "pop-in": (frame, delay, duration) => {
    const scale = interpolate(
      frame,
      [delay, delay + duration / 2, delay + duration],
      [0.5, 1.2, 1], // Pop effect
      { extrapolateRight: "clamp" },
    );
    return `scale(${scale})`;
  },
} as const;

const CompositionImage = ({
  src,
  slideDurationInFrames,
  mediaAppearanceDelay,
  withMotion,
  animationType = "pop-in",
}: {
  src: string;
  slideDurationInFrames: number;
  mediaAppearanceDelay: number;
  withMotion?: boolean;
  animationType?: keyof typeof animationConfig; // Limit to defined animations
}) => {
  const frame = useCurrentFrame();

  const TRANSITION_DURATION_IN_FRAMES = 10;
  const BUFFER_IN_FRAMES = 15;
  const FALLBACK_STILL_DURATION = 10;

  const stillDuration =
    slideDurationInFrames -
    (mediaAppearanceDelay + 2 * TRANSITION_DURATION_IN_FRAMES) -
    BUFFER_IN_FRAMES;

  const refinedStillDuration =
    stillDuration <= 0 ? FALLBACK_STILL_DURATION : stillDuration;

  const isInActiveRange =
    frame >= mediaAppearanceDelay + TRANSITION_DURATION_IN_FRAMES &&
    frame <=
      mediaAppearanceDelay +
        TRANSITION_DURATION_IN_FRAMES +
        refinedStillDuration;

  const opacity = interpolate(
    frame,
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
    ],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" },
  );

  // Fetch animation transform from config
  const transformFn = animationConfig[animationType] || (() => "");
  let transform = transformFn(
    frame,
    mediaAppearanceDelay,
    TRANSITION_DURATION_IN_FRAMES,
  );

  // Add optional motion
  if (withMotion && isInActiveRange) {
    const motionRange = 3;
    const motionX = Math.sin(frame / 5) * motionRange;
    const motionY = Math.cos(frame / 5) * motionRange;
    transform += ` translate(${motionX}px, ${motionY}px)`;
  }

  return (
    <div
      style={{
        opacity,
        zIndex: 10,
      }}
      className="absolute inset-0 flex items-center justify-center backdrop-blur-lg"
    >
      <Img
        style={{
          transform,
        }}
        src={src}
        className="h-[60%] w-[60%] rounded-2xl border-4 border-white shadow-2xl"
        onError={(e) => {
          console.log("Error loading image", e);
        }}
      />
    </div>
  );
};

export default CompositionImage;
