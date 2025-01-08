import { fade } from "@remotion/transitions/fade";
import { type SlideDirection, slide } from "@remotion/transitions/slide";
import { type WipeDirection, wipe } from "@remotion/transitions/wipe";
import { type FlipDirection, flip } from "@remotion/transitions/flip";
import type { Scene } from "./code-video-composition/types.composition";
import { linearTiming } from "@remotion/transitions";
import { none } from "@remotion/transitions/none";
import propsParser from "./code-video-composition/utils/props-parser";

import { staticFile } from "remotion";
import { addSound } from "./code-video-composition/utils/add-sound";
import sceneParser from "@/components/x-editor/plugins/scene/scene.parser";
import transitionPropsParser from "@/components/x-editor/plugins/transition/transition.parser";

export const calculateCompositionDuration = (
  scenes: Scene[],
  fps: number = 30,
): number => {
  return scenes.reduce((acc, step) => {
    const { data: sceneProps } = sceneParser.parse(step.title || "");
    const { data: transitionProps } = transitionPropsParser.parse(
      step.transition || "",
    );

    const transitionDurationInFrames =
      transitionProps.type && transitionProps.type !== "magic"
        ? convertSecondsToFramerate(transitionProps.duration, fps)
        : 0;

    return acc + sceneProps.durationInFrames - transitionDurationInFrames;
  }, 0);
};

export const convertSecondsToFramerate = (seconds: number, framerate: number) =>
  Math.floor(seconds * framerate);

const withSound = (presentation: any) =>
  addSound(presentation, staticFile("sfx/sweep-transition.wav"));

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
      type: "flip";
      direction: FlipDirection;
    }
) & {
  durationInSeconds: number;
  fps: number;
}): {
  timing: ReturnType<typeof linearTiming>;
  presentation: ReturnType<typeof slide | typeof fade | typeof wipe>;
} => {
  console.log("createTransitionConfig", { direction, type });

  switch (type) {
    case "slide": {
      console.log(
        "in slide createTransitionConfig",
        { direction, durationInSeconds, fps },
        "slide",
      );

      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: slide({ direction }),
      };
    }
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
    case "flip":
      return {
        timing: linearTiming({
          durationInFrames: convertSecondsToFramerate(durationInSeconds, fps),
        }),
        presentation: flip({ direction }),
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
