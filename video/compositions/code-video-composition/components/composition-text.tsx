import textParser from "@/components/x-editor/plugins/text/text.parser";
import type { TextInputProps } from "@/components/x-editor/plugins/text/text.types";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import React, { type CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CommonAnimationType } from "../../animation.config";

type AnimationFn = (params: {
  frame: number;
  fps: number;
  index: number;
  delay?: number;
}) => { opacity: number; transform: string; clipPath?: string };

const ANIMATION_DURATION_IN_FRAMES = 5;

export const fadeInSlideUp: AnimationFn = ({
  frame,
  fps,
  index,
  delay = 10,
}) => {
  const startFrame = index * ANIMATION_DURATION_IN_FRAMES; // Per-word stagger (if needed)

  const adjustedFrame = frame - delay; // Apply the global delay

  // Ensure animation doesn't start before the delay ends
  if (adjustedFrame < 0) {
    return { opacity: 0, transform: `translateY(50px)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + ANIMATION_DURATION_IN_FRAMES],
    [0, 1],
    {
      extrapolateRight: "clamp",
    },
  );

  const translateY = spring({
    frame: adjustedFrame - startFrame,
    fps,
    from: 50,
    to: 0,
  });

  return { opacity, transform: `translateY(${translateY}px)` };
};

export const fadeInSlideDown: AnimationFn = ({
  frame,
  fps,
  index,
  delay = 10,
}) => {
  const startFrame = index * ANIMATION_DURATION_IN_FRAMES; // Optional per-word stagger
  const adjustedFrame = frame - delay; // Apply global delay

  // Ensure animation doesn't start before the delay ends
  if (adjustedFrame < 0) {
    return { opacity: 0, transform: `translateY(-50px)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + ANIMATION_DURATION_IN_FRAMES],
    [0, 1],
    {
      extrapolateRight: "clamp",
    },
  );

  const translateY = spring({
    frame: adjustedFrame - startFrame,
    fps,
    from: -50,
    to: 0,
  });

  return { opacity, transform: `translateY(${translateY}px)` };
};

export const getAdjustedFrame = (
  frame: number,
  delay: number,
  index: number,
  duration: number,
) => {
  const adjustedFrame = frame - delay; // Apply global delay
  console.log("getAdjustedFrame", { adjustedFrame });

  const startFrame = index * duration; // Optional per-word stagger

  // Ensure animation doesn't start before the delay ends
  if (adjustedFrame < startFrame) {
    return { shouldAnimate: false, adjustedFrame, startFrame };
  }

  return { shouldAnimate: true, adjustedFrame, startFrame };
};

export const fadeInOnly: AnimationFn = ({ frame, index, delay = 5 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES; // Duration for the fade-in
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: "none" };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  return { opacity, transform: "none" };
};

export const scaleIn: AnimationFn = ({ frame, fps, index, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES; // Animation duration
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `scale(0.5)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const scale = spring({
    frame: adjustedFrame - startFrame,
    fps,
    from: 0.5,
    to: 1,
  });

  return { opacity, transform: `scale(${scale})` };
};

// Rotate In
export const rotateIn: AnimationFn = ({ frame, index, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `rotate(90deg)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const rotate = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [90, 0],
    { extrapolateRight: "clamp" },
  );

  return { opacity, transform: `rotate(${rotate}deg)` };
};

// Bounce In
export const bounceIn: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `translateY(-50px)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const translateY = spring({
    frame: adjustedFrame - startFrame,
    fps,
    from: -50,
    to: 0,
    config: {
      damping: 5,
      stiffness: 100,
    },
  });

  return { opacity, transform: `translateY(${translateY}px)` };
};

// Flip In
export const flipIn: AnimationFn = ({ frame, index, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `rotateY(180deg)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const rotateY = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [180, 0],
    { extrapolateRight: "clamp" },
  );

  return { opacity, transform: `rotateY(${rotateY}deg)` };
};

// Zoom Out
export const zoomOut: AnimationFn = ({ frame, index, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `scale(2)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const scale = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [2, 1],
    { extrapolateRight: "clamp" },
  );

  return { opacity, transform: `scale(${scale})` };
};

export const wave: AnimationFn = ({ frame, index, delay = 15 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `translateY(0px)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const translateY = Math.sin((adjustedFrame - startFrame) / 5) * 10;

  return { opacity, transform: `translateY(${translateY}px)` };
};

// Wobble
export const wobble: AnimationFn = ({ frame, index, delay = 10 }) => {
  const duration = ANIMATION_DURATION_IN_FRAMES;
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: `translateX(0px)` };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const translateX = Math.sin((adjustedFrame - startFrame) / 10) * 20;

  return { opacity, transform: `translateX(${translateX}px)` };
};

export const fadeInWithColor: AnimationFn = ({ frame, index, delay = 10 }) => {
  const duration = 10; // Duration for the animation
  const { shouldAnimate, adjustedFrame, startFrame } = getAdjustedFrame(
    frame,
    delay,
    index,
    duration,
  );

  if (!shouldAnimate) {
    return { opacity: 0, transform: "none", color: "rgb(0, 0, 0)" };
  }

  const opacity = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const color = interpolate(
    adjustedFrame,
    [startFrame, startFrame + duration],
    [0, 255], // Color transitions from black (0) to white (255)
    { extrapolateRight: "clamp" },
  );

  return {
    opacity,
    transform: "none",
    color: `rgb(${color}, ${color}, ${color})`,
  };
};

/* export const typewriter: AnimationFn = ({ frame, index, delay = 10 }) => {
  const durationPerChar = 10; // Frames to reveal each character
  const adjustedFrame = frame - delay; // Apply global delay

  // Prevent animation from starting before delay
  if (adjustedFrame < 0) {
    return { opacity: 1, transform: "none", clipPath: "inset(0 100% 0 0)" };
  }

  // Total characters revealed based on elapsed frames
  const visiblePercentage = Math.min(
    100,
    (adjustedFrame / durationPerChar) * 100,
  );

  return {
    opacity: 1,
    transform: "none",
    clipPath: `inset(0 ${100 - visiblePercentage}% 0 0)`, // Reveals text left-to-right
  };
}; */

export const none: AnimationFn = () => {
  return {
    opacity: 1,
    transform: "none",
    clipPath: undefined,
  };
};
export const slideFromBehind: AnimationFn = ({
  frame,
  index,
  delay = 20, // Delay between each word's appearance
}) => {
  const startFrame = index * delay; // Each word starts after the previous one
  const adjustedFrame = frame - startFrame; // Frame adjusted for the delay

  // For the first word, no sliding, just fading in
  if (index === 0) {
    const opacity = interpolate(
      adjustedFrame,
      [0, 10], // Fade in over 10 frames
      [0, 1],
      { extrapolateRight: "clamp" },
    );

    return {
      opacity,
      transform: "none", // No sliding for the first word
    };
  }

  // Prevent premature animation for subsequent words
  if (adjustedFrame < 0) {
    return {
      opacity: 0, // Initially hidden
      transform: `translateX(-100px)`, // Start behind the previous word
    };
  }

  // Calculate opacity and position for sliding
  const opacity = interpolate(
    adjustedFrame,
    [0, 10], // Fade in over 10 frames
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  const translateX = interpolate(
    adjustedFrame,
    [0, 10], // Smooth slide over 10 frames
    [-100, 0], // Slide from behind
    { extrapolateRight: "clamp" },
  );

  return {
    opacity, // Fading in
    transform: `translateX(${translateX}px)`, // Sliding for subsequent words
  };
};

const ANIMATION_MAP: Record<CommonAnimationType, AnimationFn> = {
  fadeInSlideUp,
  fadeInSlideDown,
  fadeInOnly,
  scaleIn,
  bounceIn,
  flipIn,
  zoomOut,
  wobble,
  wave,
  // typewriter,
  slideFromBehind,
  none,
};

interface Props {
  blend: CSSProperties["mixBlendMode"];
  align: CSSProperties["textAlign"];
  presetStyle: string;
}
const props: Props = {
  blend: "luminosity",
  align: "center",
  presetStyle: "fancy(--color=red --padding=2)",
};

const Wrapper = ({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div
      id="comp-text-wrapper"
      className={cn(
        "absolute inset-0 flex w-full flex-col items-center justify-center gap-10 p-2 text-8xl font-extrabold tracking-wide text-white",
        className,
      )}
      style={{
        ...style,
        // mixBlendMode: props.blend
      }}
    >
      {children}
    </div>
  );
};

export const CompositionText = ({ data }: { data: TextInputProps }) => {
  const {
    currentProject: {
      config: { styles },
    },
  } = useProjectStore();

  const {
    content: text,
    color,
    animation,
    delay = 0,
    size: fontSize,
    order,
  } = data;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let animationFn = ANIMATION_MAP[animation]; // Select the animation function

  if (!animationFn) {
    animationFn = ANIMATION_MAP["none"]; // Default to "none" animation
    // throw new Error(`Unknown animation type: ${animationType}`);
  }

  const words = text.split(" ");

  return (
    <Wrapper
      style={{
        color,
        fontSize: `${fontSize}px`,
        fontFamily: styles.backgroundContainer.fontFamily,
        zIndex: order,
      }}
    >
      <h1
        className="relative px-10 py-0"
        style={{
          textAlign: props.align,
        }}
      >
        <>
          {words.map((word, index) => {
            const { opacity, transform, clipPath } = animationFn({
              frame: frame - delay, // Apply the delay globally
              fps,
              index, // Use index for stagger effect if needed
              delay,
            });

            return (
              <>
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    opacity,
                    transform,
                    ...(clipPath && { clipPath }), // Apply clipPath only when defined

                    zIndex: words.length - index, // Reverse z-index: higher for earlier words
                    position: "relative", // Ensure z-index works
                  }}
                >
                  {word}
                  {index === words.length - 1 ? "" : "\u00A0"}
                </span>
              </>
            );
          })}
          {/* <div
            className="absolute -left-2 -top-2 size-4"
            style={{
              backgroundColor: borderComponent.color,
            }}
          ></div>
          <div
            className="absolute -right-2 -top-2 size-4"
            style={{
              backgroundColor: borderComponent.color,
            }}
          ></div>
          <div
            className="absolute -bottom-2 -left-2 size-4"
            style={{
              backgroundColor: borderComponent.color,
            }}
          ></div>
          <div
            className="absolute -bottom-2 -right-2 size-4"
            style={{
              backgroundColor: borderComponent.color,
            }}
          ></div> */}
        </>
      </h1>
    </Wrapper>
  );
};

const CompositionTextWrapper = ({ value }: { value: string }) => {
  const { data } = textParser.parse(value);

  return <CompositionText data={data} />;
};

// const Fancy = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <>
//       {/* // here we need to create the h1 and updat the styles using react.clone
//       maybe */}
//       <div
//         className="absolute -left-2 -top-2 size-4"
//         style={{
//           backgroundColor: "red",
//         }}
//       ></div>
//       <div
//         className="absolute -right-2 -top-2 size-4"
//         style={{
//           backgroundColor: "red",
//         }}
//       ></div>
//       <div
//         className="absolute -bottom-2 -left-2 size-4"
//         style={{
//           backgroundColor: "red",
//         }}
//       ></div>
//       <div
//         className="absolute -bottom-2 -right-2 size-4"
//         style={{
//           backgroundColor: "red",
//         }}
//       ></div>
//     </>
//   );
// };

const CompositionTextRenderer = ({ value }: { value: string[] }) => {
  // TODO : need to add one more prop to the parser that isValid that matches the minimum criteria
  return (
    <>
      {value.map((textValue, index) => {
        return <CompositionTextWrapper value={textValue} key={index} />;
      })}
    </>
  );
};

export default CompositionTextRenderer;
