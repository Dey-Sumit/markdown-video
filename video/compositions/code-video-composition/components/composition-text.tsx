import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

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
export const rotateIn: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
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
export const flipIn: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
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
export const zoomOut: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
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

export const wave: AnimationFn = ({ frame, index, fps, delay = 15 }) => {
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
export const wobble: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
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

export const typewriter: AnimationFn = ({ frame, index, delay = 10 }) => {
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
};

type AnimationType =
  | "fadeInSlideUp"
  | "fadeInSlideDown"
  | "fadeInOnly"
  | "scaleIn"
  //   | "rotateIn"
  | "bounceIn"
  | "flipIn"
  | "zoomOut"
  | "wobble"
  | "fadeInWithColor"
  | "wave"
  | "typewriter";
const ANIMATION_MAP: Record<AnimationType, AnimationFn> = {
  fadeInSlideUp,
  fadeInSlideDown,
  fadeInOnly,
  scaleIn,
  //   rotateIn,
  bounceIn,
  flipIn,
  zoomOut,
  wobble,
  fadeInWithColor,
  wave,
  typewriter,
};
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute inset-0 flex w-full flex-col items-center justify-center gap-10 p-16">
      {children}
    </div>
  );
};
const CompositionText = ({
  animationType = "wave",
  text = "Hello, This is the next step",
  applyTo = "sentence",
  delay = 45, // Delay for the entire animation to start
}: {
  animationType?: AnimationType;
  text?: string;
  delay?: number; // Delay in frames before starting the animation
  applyTo?: "word" | "sentence";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animationFn = ANIMATION_MAP[animationType]; // Select the animation function

  if (!animationFn) {
    throw new Error(`Unknown animation type: ${animationType}`);
  }

  // If applyTo is "sentence", treat the entire text as one unit
  if (applyTo === "sentence") {
    const { opacity, transform, clipPath } = animationFn({
      frame: frame - delay, // Adjust frame to start after the delay
      fps,
      index: 0,
    });

    return (
      <Wrapper>
        <h1
          className="font-sans text-[7.5rem] font-black tracking-wide text-white"
          style={{
            opacity,
            transform,
            ...(clipPath && { clipPath }), // Apply clipPath only when defined
          }}
        >
          {text}
        </h1>
      </Wrapper>
    );
  }

  // Split text into words for "word" animation
  const words = text.split(" ");

  return (
    <Wrapper>
      <h1 className="font-sans text-[7.5rem] font-black tracking-wide text-white">
        {words.map((word, index) => {
          const { opacity, transform, clipPath } = animationFn({
            frame: frame - delay, // Apply the delay globally
            fps,
            index, // Use index for stagger effect if needed
          });

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity,
                transform,
                ...(clipPath && { clipPath }), // Apply clipPath only when defined
              }}
            >
              {word}&nbsp;
            </span>
          );
        })}
      </h1>
    </Wrapper>
  );
};

export default CompositionText;
