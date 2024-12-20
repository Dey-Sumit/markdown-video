import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const TEXT = "Hello, This is the next step";

type AnimationFn = (params: {
  frame: number;
  fps: number;
  index: number;
  delay?: number;
}) => { opacity: number; transform: string };

export const fadeInSlideUp: AnimationFn = ({
  frame,
  fps,
  index,
  delay = 10,
}) => {
  const startFrame = index * delay;

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame: frame - startFrame,
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
  const startFrame = index * delay;

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = spring({
    frame: frame - startFrame,
    fps,
    from: -50,
    to: 0,
  });

  return { opacity, transform: `translateY(${translateY}px)` };
};
export const fadeInOnly: AnimationFn = ({ frame, index, delay = 5 }) => {
  const startFrame = index * delay;

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return { opacity, transform: "none" }; // No translation
};

// Scale In
export const scaleIn: AnimationFn = ({ frame, fps, index, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: frame - startFrame,
    fps,
    from: 0.5,
    to: 1,
  });
  return { opacity, transform: `scale(${scale})` };
};

// Rotate In
export const rotateIn: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(frame, [startFrame, startFrame + 10], [90, 0], {
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `rotate(${rotate}deg)` };
};

// Bounce In
export const bounceIn: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = spring({
    frame: frame - startFrame,
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
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rotateY = interpolate(frame, [startFrame, startFrame + 10], [180, 0], {
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `rotateY(${rotateY}deg)` };
};

// Zoom Out
export const zoomOut: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [startFrame, startFrame + 10], [2, 1], {
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `scale(${scale})` };
};
export const wave: AnimationFn = ({ frame, index, fps, delay = 15 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = Math.sin((frame - startFrame) / 5) * 10;
  return { opacity, transform: `translateY(${translateY}px)` };
};

// Wobble
export const wobble: AnimationFn = ({ frame, index, fps, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateX = Math.sin((frame - startFrame) / 10) * 20;
  return { opacity, transform: `translateX(${translateX}px)` };
};

// Fade In with Color Change
export const fadeInWithColor: AnimationFn = ({ frame, index, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const color = interpolate(frame, [startFrame, startFrame + 10], [0, 255], {
    extrapolateRight: "clamp",
  });
  return {
    opacity,
    transform: "none",
    color: `rgb(${color}, ${color}, ${color})`,
  };
};

// Typewriter
export const typewriter: AnimationFn = ({ frame, index, delay = 10 }) => {
  const startFrame = index * delay;
  const opacity = interpolate(frame, [startFrame, startFrame + 5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const clip = interpolate(frame, [startFrame, startFrame + 10], [0, 100], {
    extrapolateRight: "clamp",
  });
  return {
    opacity,
    transform: "none",
    color: undefined,
    clipPath: `inset(0 ${100 - clip}% 0 0)`,
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
  | "wave";
//   | "typewriter";
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
  //   typewriter,
};

const CompositionText = ({
  animationType = "wave",
  text = "Hello, This is the next step",
  applyTo = "sentence",
}: {
  animationType?: AnimationType;
  text?: string;
  applyTo?: "word" | "sentence"; // New prop to control animation granularity
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animationFn = ANIMATION_MAP[animationType]; // Select the animation function

  if (!animationFn) {
    throw new Error(`Unknown animation type: ${animationType}`);
  }

  // If applyTo is "sentence", treat the entire text as one unit
  if (applyTo === "sentence") {
    const { opacity, transform } = animationFn({
      frame,
      fps,
      index: 0, // Single index for entire sentence
    });

    return (
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <h1
          className="font-sans text-9xl font-black tracking-wide text-white"
          style={{
            opacity,
            transform,
          }}
        >
          {text}
        </h1>
      </div>
    );
  }
  const words = text.split(" "); // Split text into words

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <h1 className="font-sans text-[7.5rem] font-black tracking-wide text-white">
        {words.map((word, index) => {
          const { opacity, transform } = animationFn({ frame, fps, index });

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                opacity,
                transform,
              }}
            >
              {word}&nbsp;
            </span>
          );
        })}
      </h1>
    </div>
  );
};

export default CompositionText;
