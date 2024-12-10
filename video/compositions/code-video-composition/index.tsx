import React from "react";

import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";

import { CompositionSlide } from "./composition-slide";
import { CODE_COMP_TRANSITION_DURATION_IN_SECONDS } from "./config";
import type {
  CodeTransitionCompositionProps,
  TransitionType,
} from "./types.composition";
import {
  convertSecondsToFramerate,
  createTransitionConfig,
} from "../composition.utils";
import propsParser from "./utils/props-parser";

const CodeVideoComposition = ({ scenes }: CodeTransitionCompositionProps) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill className="_to-red-700 _from-orange-600 bg-gradient-to-r from-indigo-500 to-purple-800">
      {/* <ProgressBar steps={steps} /> */}

      <TransitionSeries className="!inset-10 !h-auto !w-auto overflow-hidden rounded-xl border bg-gray-950 shadow-2xl">
        {scenes.map((currentScene, index) => {
          const nextStep = scenes[index + 1];

          let transitionType: TransitionType;
          let transitionDuration: number;

          try {
            const result = propsParser.transition(currentScene.transition);
            transitionType = result.type;
            transitionDuration = result.duration;
          } catch (e) {
            transitionType = "none";
            transitionDuration = 3;
          }

          let nextSceneTransitionType: TransitionType | undefined;
          if (nextStep) {
            try {
              const result = propsParser.transition(nextStep.transition);
              nextSceneTransitionType = result.type;
            } catch (e) {
              nextSceneTransitionType = "none";
            }
          }

          return (
            <React.Fragment key={index}>
              {index === 0 && (
                //@ts-ignore
                <TransitionSeries.Transition
                  {...createTransitionConfig({
                    direction: "from-top",
                    durationInSeconds: CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
                    fps,
                    type: transitionType,
                  })}
                />
              )}
              <TransitionSeries.Sequence
                key={index}
                durationInFrames={convertSecondsToFramerate(
                  currentScene.duration,
                  fps,
                )}
              >
                <CompositionSlide
                  scene={currentScene}
                  oldCode={scenes[index - 1]?.code}
                  newCode={currentScene.code}
                  slideDurationInFrames={convertSecondsToFramerate(
                    currentScene.duration,
                    fps,
                  )}
                  tokenTransitionDurationInFrames={convertSecondsToFramerate(
                    currentScene.transitionDuration,
                    fps,
                  )}
                  disableTransition={currentScene.transition !== "magic"}
                />
              </TransitionSeries.Sequence>

              {nextSceneTransitionType &&
                nextSceneTransitionType !== "magic" &&
                nextSceneTransitionType !== "none" && (
                  //@ts-ignore
                  <TransitionSeries.Transition
                    {...createTransitionConfig({
                      direction: "from-top",
                      durationInSeconds: transitionDuration,
                      fps,
                      type: nextSceneTransitionType,
                    })}
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
