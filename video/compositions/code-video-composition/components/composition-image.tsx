import imageParser from "@/components/x-editor/plugins/image/image.parser";
import type { ImageInputProps } from "@/components/x-editor/plugins/image/image.types";
import { Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { convertSecondsToFramerate } from "../../composition.utils";

export const IMAGE_ANIMATIONS = [
  "fade",
  "scale",
  "slide-left",
  "slide-right",
  "slide-up",
  "slide-down",
  "bounce-in",
  "spin-in",
  "flip-in",
  "zig-zag",
  "pop-in",
  "none",
] as const;

// Define animation functions in a config object
const animationConfig: Record<
  (typeof IMAGE_ANIMATIONS)[number],
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
  none: () => "",
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

export type ImageAnimationsType = keyof typeof animationConfig;

const TRANSITION_DURATION_IN_FRAMES = 10;
const BUFFER_IN_FRAMES = 15;
const FALLBACK_STILL_DURATION = 10;

const CompositionImage = ({
  src,
  sceneDurationInFrames,
  delay,
  withMotion,
  animation,
  height,
  width,
}: ImageInputProps & {
  sceneDurationInFrames: number;
}) => {
  const { fps } = useVideoConfig();
  const delayInFrames = convertSecondsToFramerate(delay, fps);

  const frame = useCurrentFrame();

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

  // Fetch animation transform from config
  const transformFn = animationConfig[animation] || (() => "");
  let transform = transformFn(
    frame,
    delayInFrames,
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
      <div className="flex h-full w-full items-center justify-center">
        <Img
          style={{
            transform,
            height,
            width,
          }}
          src={src}
          className="h-auto max-h-full w-auto rounded-2xl border-4 border-gray-700 object-cover shadow-2xl"
          onError={(e) => {
            console.log("Error loading image", e);
          }}
        />
      </div>
    </div>
  );
};

interface CompositionImageRendererProps {
  value: string[];
  sceneDurationInFrames?: number;
}

const CompositionImageRenderer = ({
  value,
  sceneDurationInFrames = 150, // default 5 seconds at 30fps
}: CompositionImageRendererProps) => {
  // Parse all image props from the array of directives
  const parsedProps = imageParser.parse(value);

  return (
    <>
      {parsedProps.data.map((imageProp, index) => {
        if (!imageProp || !imageProp.src) return null;

        return (
          <CompositionImage
            key={index}
            {...imageProp}
            sceneDurationInFrames={sceneDurationInFrames}
          />
        );
      })}
    </>
  );
};

export default CompositionImageRenderer;
