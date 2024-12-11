import React from "react";

import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";

import { CompositionSlide } from "./composition-slide";
import {
  CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
  FALLBACK_PROPS_RAW_FORMAT,
} from "./config";
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
    <AbsoluteFill className="bg-gradient-to-r from-indigo-500 to-purple-800">
      {/* <ProgressBar steps={steps} /> */}

      <TransitionSeries className="!inset-10 !h-auto !w-auto overflow-hidden rounded-xl border bg-gray-950 shadow-2xl">
        {scenes.map((currentScene, index) => {
          const nextStep = scenes[index + 1];
          const currentSceneMeta = propsParser.sceneMeta(
            currentScene.title || FALLBACK_PROPS_RAW_FORMAT.sceneMeta,
          ); // TODO : add a fallback
          console.log({ currentSceneMeta });

          const currentSceneDurationInFrames = convertSecondsToFramerate(
            currentSceneMeta.duration,
            fps,
          );

          let currentTransitionType: TransitionType;
          let currentTransitionDuration: number;

          try {
            const result = propsParser.transition(currentScene.transition);
            currentTransitionType = result.type;
            currentTransitionDuration = result.duration;
          } catch (e) {
            currentTransitionType = "none";
            currentTransitionDuration = 3;
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
              {/* the first slide by default will have a transition type wipe from bottom */}
              {index === 0 && (
                //@ts-ignore
                <TransitionSeries.Transition
                  {...createTransitionConfig({
                    direction: "from-bottom", // TODO : it's hardcoded
                    durationInSeconds: CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
                    fps,
                    type: currentTransitionType,
                  })}
                />
              )}

              <TransitionSeries.Sequence
                key={index}
                durationInFrames={currentSceneDurationInFrames}
              >
                <CompositionSlide
                  scene={currentScene}
                  oldCode={scenes[index - 1]?.code}
                  newCode={currentScene.code}
                  slideDurationInFrames={currentSceneDurationInFrames}
                  tokenTransitionDurationInFrames={convertSecondsToFramerate(
                    currentTransitionDuration,
                    fps,
                  )}
                  disableTransition={currentTransitionType !== "magic"}
                />
              </TransitionSeries.Sequence>

              {nextSceneTransitionType &&
                nextSceneTransitionType !== "magic" &&
                nextSceneTransitionType !== "none" && (
                  //@ts-ignore
                  <TransitionSeries.Transition
                    {...createTransitionConfig({
                      direction: "from-bottom",
                      durationInSeconds: currentTransitionDuration,
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
