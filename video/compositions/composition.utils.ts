import { fade } from "@remotion/transitions/fade";
import { type SlideDirection, slide } from "@remotion/transitions/slide";
import { type WipeDirection, wipe } from "@remotion/transitions/wipe";
import {
  CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
  FALLBACK_PROPS_RAW_FORMAT,
} from "./code-video-composition/config";
import type { Scene } from "./code-video-composition/types.composition";
import { linearTiming } from "@remotion/transitions";
import { none } from "@remotion/transitions/none";
import propsParser from "./code-video-composition/utils/props-parser";

export const calculateCompositionDuration = (
  steps: Scene[],
  fps: number = 30,
): number => {
  return steps.reduce((acc, step) => {
    console.log("step-->", {
      transition: step.transition,
      title: step.title,
      seconds: propsParser.sceneMeta(step.title!, {
        withFallback: true,
      }).duration,
      inFrames: convertSecondsToFramerate(
        propsParser.sceneMeta(step.title!, {
          withFallback: true,
        }).duration,
        fps,
      ),
      negative:
        step.transition && step.transition !== "magic"
          ? convertSecondsToFramerate(
              CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
              fps,
            )
          : 0,
      shouldNegative: step.transition && step.transition !== "magic",
    });

    const { duration } = propsParser.sceneMeta(step.title!, {
      withFallback: true,
    });
    const transition = propsParser.transition(step.transition!, {
      withFallback: true,
    });
    const durationInFrames = convertSecondsToFramerate(duration, fps);
    const transitionDurationInFrames =
      transition.type && transition.type !== "magic"
        ? convertSecondsToFramerate(transition.duration, fps)
        : 0;

    return acc + durationInFrames - transitionDurationInFrames;
  }, 0);
};

export const convertSecondsToFramerate = (seconds: number, framerate: number) =>
  seconds * framerate;

export const createTransitionConfig = ({
  type,
  durationInSeconds,
  direction,
  fps,
}: (
  | {
      type: "slide";
      direction: SlideDirection;
    }
  | {
      type: "fade";
      direction: string;
    }
  | {
      type: "wipe";
      direction: WipeDirection;
    }
  | {
      type: "none";
      direction: string;
    }
  | {
      type: "magic";
      direction: string;
    }
) & {
  durationInSeconds: number;
  fps: number;
}): {
  timing: ReturnType<typeof linearTiming>;
  presentation: ReturnType<typeof slide | typeof fade | typeof wipe>;
} => {
  switch (type) {
    case "slide":
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: slide({ direction }),
      };
    case "fade":
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: fade(),
      };
    case "wipe":
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: wipe({ direction }),
      };
    //! does not matter
    case "none":
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: none(),
      };
    default:
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: none(),
      };
  }
};
