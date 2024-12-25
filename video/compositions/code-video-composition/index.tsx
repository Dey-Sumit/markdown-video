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
import { createGradient } from "@/utils/utils";

const CodeVideoComposition = ({
  scenes,
  styles,
}: CodeTransitionCompositionProps) => {
  const { fps } = useVideoConfig();

  const {
    backgroundContainer: { background },
    sceneContainer: { inset, padding, borderRadius },
  } = styles;

  const { gradient } = background;

  return (
    <AbsoluteFill
      style={{
        background: createGradient(gradient.colors, gradient.angle),
      }}
    >
      {/* <ProgressBar steps={steps} /> */}
      <div
        className="absolute !h-auto !w-auto overflow-hidden border-gray-800 bg-gray-950 shadow-2xl"
        style={{
          inset: padding,
          borderRadius: borderRadius,
          borderWidth: inset,
        }}
      >
        <TransitionSeries layout="none">
          {scenes.map((currentScene, index) => {
            const nextStep = scenes[index + 1];
            const currentSceneMeta = propsParser.sceneMeta(
              currentScene.title || FALLBACK_PROPS_RAW_FORMAT.sceneMeta,
            );

            const currentSceneDurationInFrames = convertSecondsToFramerate(
              currentSceneMeta.duration,
              fps,
            );

            let currentTransitionType: TransitionType;
            let currentTransitionDurationInSeconds: number;

            try {
              const result = propsParser.transition(currentScene.transition);
              currentTransitionType = result.type;
              currentTransitionDurationInSeconds = result.duration;
            } catch (e) {
              currentTransitionType = "none";
              currentTransitionDurationInSeconds = 3;
            }

            let nextSceneTransitionType: TransitionType | undefined;
            let nextTransitionDurationInSeconds: number = 0.3;
            let transitionDirection: string = "from-bottom";

            if (nextStep) {
              try {
                const result = propsParser.transition(nextStep.transition);
                nextSceneTransitionType = result.type;
                nextTransitionDurationInSeconds = result.duration;
                transitionDirection = result.direction;
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
                      durationInSeconds:
                        CODE_COMP_TRANSITION_DURATION_IN_SECONDS,
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
                      currentTransitionDurationInSeconds,
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
                        direction: transitionDirection,
                        durationInSeconds: nextTransitionDurationInSeconds,
                        fps,
                        type: nextSceneTransitionType,
                      })}
                    />
                  )}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </div>
    </AbsoluteFill>
  );
};

export default CodeVideoComposition;
