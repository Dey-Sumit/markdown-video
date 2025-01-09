import textParser from "@/components/x-editor/plugins/text/text.parser";
import { useProjectStore } from "@/store/project-store";
import React, { useId, type CSSProperties } from "react";
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

export const AVAILABLE_TEXT_ANIMATIONS = [
  "fadeInSlideUp",
  "fadeInSlideDown",
  "fadeInOnly",
  "scaleIn",
  "bounceIn",
  "flipIn",
  "zoomOut",
  "wobble",
  "wave",
  // "typewriter",
  "none",
  "slideFromBehind",
] as const;

export type TextAnimationType = (typeof AVAILABLE_TEXT_ANIMATIONS)[number];

const ANIMATION_MAP: Record<TextAnimationType, AnimationFn> = {
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
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
}) => {
  return (
    <div
      id="comp-text-wrapper"
      className="absolute inset-0 flex w-full flex-col items-center justify-center gap-10 p-2 font-sans text-8xl font-black tracking-wider text-white"
      style={{
        ...style,
        zIndex: 5,

        // mixBlendMode: props.blend
      }}
    >
      {children}
    </div>
  );
};

const CompositionText = ({
  animationType = "none",
  text = "Hello, This is the next step",
  applyTo = "word",
  delay = 0, // Delay for the entire animation to start
  color = "white",
  fontSize,
}: {
  animationType: TextAnimationType;
  text?: string;
  delay?: number; // Delay in frames before starting the animation
  applyTo?: "word" | "sentence";
  color?: string;
  fontSize?: number;
}) => {
  const {
    currentProject: {
      config: { styles },
    },
    updateStyles,
  } = useProjectStore();

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let animationFn = ANIMATION_MAP[animationType]; // Select the animation function

  if (!animationFn) {
    animationFn = ANIMATION_MAP["none"]; // Default to "none" animation
    // throw new Error(`Unknown animation type: ${animationType}`);
  }

  // If applyTo is "sentence", treat the entire text as one unit
  if (applyTo === "sentence") {
    const { opacity, transform, clipPath } = animationFn({
      frame: frame - delay, // Adjust frame to start after the delay
      fps,
      index: 0,
    });

    return (
      <Wrapper
        style={{
          color,
          fontSize: `${fontSize}px`,
        }}
      >
        <h1
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
    <Wrapper
      style={{
        color,
        fontSize: `${fontSize}px`,
        fontFamily: styles.backgroundContainer.fontFamily,
      }}
    >
      <h1
        className="relative px-10 py-0"
        style={{
          // border: `1px solid ${borderComponent.color}`,
          textAlign: props.align,
        }}
      >
        <>
          {words.map((word, index) => {
            const { opacity, transform, clipPath } = animationFn({
              frame: frame - delay, // Apply the delay globally
              fps,
              index, // Use index for stagger effect if needed
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

const Fancy = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {" "}
      // here we need to create the h1 and updat the styles using react.clone
      maybe
      <div
        className="absolute -left-2 -top-2 size-4"
        style={{
          backgroundColor: "red",
        }}
      ></div>
      <div
        className="absolute -right-2 -top-2 size-4"
        style={{
          backgroundColor: "red",
        }}
      ></div>
      <div
        className="absolute -bottom-2 -left-2 size-4"
        style={{
          backgroundColor: "red",
        }}
      ></div>
      <div
        className="absolute -bottom-2 -right-2 size-4"
        style={{
          backgroundColor: "red",
        }}
      ></div>
    </>
  );
};

const CompositionTextRenderer = ({ value }: { value: string[] }) => {
  const textProps = textParser.parse(value);

  // TODO : need to add one more prop to the parser that isValid that matches the minimum criteria
  return (
    <>
      {textProps.data.map((textProp) => {
        return (
          <CompositionText
            text={textProp.content}
            delay={textProp.delayInFrames}
            fontSize={textProp.size}
            color={textProp.color}
            animationType={textProp.animation as TextAnimationType}
          />
        );
      })}
    </>
  );
};

export default CompositionTextRenderer;
