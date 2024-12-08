import { Pre, type HighlightedCode } from "codehike/code";

import { cn } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import { Img, interpolate, OffthreadVideo, useCurrentFrame } from "remotion";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";
import { MAX_TOKEN_TRANSITION_DURATION } from "./config";
import { Step } from "./types.composition";

const { fontFamily } = loadFont();

export function CompositionSlide({
  oldCode,
  newCode,
  durationInFrames = MAX_TOKEN_TRANSITION_DURATION,
  disableTransition,
  step,
  slideDuration,
}: {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  durationInFrames?: number;
  disableTransition?: boolean;
  slideDuration: number;
  step: Step;
}) {
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    durationInFrames,
  );

  const codeBlockUtils = step.codeBlockUtils || "";

  const media = step.media || "";

  const [mediaUrl, mediaAppearanceDelay] = media.split(/\s+/);

  return (
    <div
      className={cn("flex h-full w-full flex-col px-8 py-4", {})}
      style={{
        fontFamily,
      }}
    >
      {/* TODO : we need to move it out of this component ,as I dont want the heading to be animated as well eg. on slide it looks, bad */}
      <div
        className="h-10 text-center text-2xl text-white"
        style={{
          fontFamily,
        }}
      >
        {newCode.meta}
      </div>
      <div className="flex w-full flex-1">
        <Pre
          ref={ref}
          code={code}
          handlers={[tokenTransitions]}
          className="text-4xl leading-[3.5rem]"
          style={{
            fontFamily,
            fontFeatureSettings: '"liga" 1, "calt" 1',
            WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
            fontVariantLigatures: "contextual",
          }}
        />
      </div>
    </div>
  );
}

const AnimatedImage = ({
  src,
  slideDuration: slideDuration,
  mediaAppearanceDelay = 60,
}: {
  src: string;
  slideDuration: number;
  mediaAppearanceDelay: number;
}) => {
  const frame = useCurrentFrame();

  // 30 + 10 = 40+10 frames start
  const TRANSITION_DURATION = 10;
  const BUFFER = 15;
  const stillDuration =
    slideDuration - (mediaAppearanceDelay + 2 * TRANSITION_DURATION) - BUFFER; // for in and out transition

  const opacity = interpolate(
    frame, // Frame starts when `startAt` is reached
    [
      mediaAppearanceDelay,
      mediaAppearanceDelay + TRANSITION_DURATION,
      mediaAppearanceDelay + TRANSITION_DURATION + stillDuration,
      mediaAppearanceDelay +
        TRANSITION_DURATION +
        stillDuration +
        TRANSITION_DURATION,
    ], // Map frame range from 0 to animation duration
    [0, 1, 1, 0], // Opacity changes from `from` to `to`
    {
      extrapolateRight: "clamp", // Ensure the value stops at the end
    },
  );

  // Scale animation: from 0.9 to 1.2
  // const scale = interpolate(
  //   frame,
  //   [
  //     mediaAppearanceDelay + TRANSITION_DURATION,
  //     mediaAppearanceDelay + TRANSITION_DURATION + stillDuration,
  //   ],
  //   [1, 1.05],
  //   { extrapolateRight: "clamp" },
  // );

  // Subtle motion for X and Y axes
  const motionRange = 3; // Maximum pixel shift (adjustable)
  const motionX = Math.sin(frame / 5) * motionRange; // Change position every 10 frames
  const motionY = Math.cos(frame / 5) * motionRange; // Change position every 10frames

  // Restrict motion to the specified range
  const isMotionFrame =
    frame >= mediaAppearanceDelay + TRANSITION_DURATION &&
    frame <= mediaAppearanceDelay + TRANSITION_DURATION + stillDuration;

  const transform = isMotionFrame
    ? `translate(${motionX}px, ${motionY}px)`
    : "translate(0, 0)";

  return (
    <div
      style={{
        opacity,
        transform, // Apply the subtle motion
      }}
      className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
    >
      <Img src={src} className="h-auto w-[60%] rounded-2xl shadow-2xl" />
    </div>
  );
};

const AnimatedVideo = ({
  src,
  slideDuration: slideDuration,
}: {
  src: string;
  slideDuration: number;
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center border-2 backdrop-blur-sm">
      <OffthreadVideo
        src={src}
        className="h-auto w-[75%] rounded-2xl shadow-2xl"
        // delayRenderRetries={3}
        // delayRenderTimeoutInMilliseconds={1000 * 60 * 12}
      />
    </div>
  );
};

// export async function MyCode({ codeblock }: { codeblock: RawCode }) {
//   const highlighted = await highlight(codeblock, "github-dark");
//   return <Pre code={highlighted} />;
// }
