import React from "react";

import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";

import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { CompositionSlide } from "./composition-slide";
import { CODE_COMP_TRANSITION_DURATION } from "./config";
import type {
  CodeTransitionCompositionProps,
  TransitionType,
} from "./types.composition";

const CodeVideoComposition = ({ steps }: CodeTransitionCompositionProps) => {
  return (
    <AbsoluteFill className="bg-gradient-to-r from-indigo-500 to-purple-800">
      {/* <ProgressBar steps={steps} /> */}

      <TransitionSeries className="!inset-10 !h-auto !w-auto overflow-hidden rounded-xl border bg-gray-950 shadow-2xl">
        {steps.map((currentStep, index) => {
          const nextStep = steps[index + 1];
          const nextSceneTransition = nextStep?.transition;

          return (
            <React.Fragment key={index}>
              {index === 0 && (
                <TransitionSeries.Transition
                  timing={linearTiming({
                    durationInFrames: CODE_COMP_TRANSITION_DURATION,
                  })}
                  presentation={wipe({
                    direction: "from-top",
                  })}
                />
              )}
              <TransitionSeries.Sequence
                key={index}
                durationInFrames={
                  index === 0
                    ? currentStep.duration
                    : currentStep.duration + CODE_COMP_TRANSITION_DURATION
                }
              >
                <CompositionSlide
                  step={currentStep}
                  oldCode={steps[index - 1]?.code}
                  newCode={currentStep.code}
                  slideDuration={currentStep.duration}
                  disableTransition={currentStep.transition !== "magic"}
                />
              </TransitionSeries.Sequence>

              {nextSceneTransition &&
                nextSceneTransition !== "magic" &&
                nextSceneTransition !== "none" && (
                  <TransitionSeries.Transition
                    timing={linearTiming({
                      durationInFrames: CODE_COMP_TRANSITION_DURATION,
                    })}
                    //@ts-ignore
                    presentation={renderTransition(nextSceneTransition)}
                  />
                )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default CodeVideoComposition;

const renderTransition = (transition: TransitionType) => {
  switch (transition) {
    case "slide-from-left":
      return slide({ direction: "from-left" });
    case "slide-from-right":
      return slide({ direction: "from-right" });
    case "slide-from-top":
      return slide({ direction: "from-top" });
    case "slide-from-bottom":
      return slide({ direction: "from-bottom" });
    case "magic":
      return;
    case "fade":
      return fade();
    case "wipe":
      return wipe();
    case "none":
      return;
  }
};
