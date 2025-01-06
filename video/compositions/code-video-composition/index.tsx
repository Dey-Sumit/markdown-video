import React from "react";

import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Audio, useVideoConfig } from "remotion";

import { CompositionSlide } from "./composition-slide";
import { FALLBACK_PROPS_RAW_FORMAT } from "./config";
import type {
  CodeTransitionCompositionProps,
  TransitionType,
} from "./types.composition";

import {
  convertSecondsToFramerate,
  createTransitionConfig,
} from "../composition.utils";

import { createGradient } from "@/utils/utils";

import { slide, type SlideDirection } from "@remotion/transitions/slide";
import { staticFile } from "remotion";
import { addSound } from "./utils/add-sound";
import { SceneParser } from "@/components/x-editor/plugins/scene/scene.parser";

const presentation = slide();
const withSound = addSound(
  presentation,
  staticFile("sfx/sweep-transition.wav"),
);
const withSoundDynamic = (presentation: any) =>
  addSound(presentation, staticFile("sfx/sweep-transition.wav"));
const slideWithSound = addSound(
  slide(),
  staticFile("sfx/sweep-transition.wav"),
);

const parser = new SceneParser();

const CodeVideoComposition = ({
  scenes,
  styles,
}: CodeTransitionCompositionProps) => {
  const { fps } = useVideoConfig();

  const {
    backgroundContainer: { background, fontFamily },
    sceneContainer: { inset, padding, borderRadius },
  } = styles;

  const { gradient } = background;

  return (
    <AbsoluteFill
      style={{
        background: createGradient(gradient.colors, gradient.angle),
      }}
    >
      <div
        className="absolute !h-auto !w-auto overflow-hidden shadow-2xl"
        style={{
          inset: padding,
          borderRadius: borderRadius,
          borderWidth: inset,
          fontFamily: fontFamily,
        }}
      >
        <TransitionSeries layout="none">
          {scenes.map((currentScene, index) => {
            const nextStep = scenes[index + 1];

            const sceneProps = parser.parse(
              currentScene.title || FALLBACK_PROPS_RAW_FORMAT.sceneMeta,
            );
            console.log("CodeVideoComposition -> sceneProps", sceneProps);

            // const currentSceneMeta = propsParser.sceneMeta(
            //   currentScene.title || FALLBACK_PROPS_RAW_FORMAT.sceneMeta,
            // );

            const currentSceneDurationInFrames = convertSecondsToFramerate(
              sceneProps.data.duration,
              fps,
            );

            let currentTransitionType: TransitionType;
            let currentTransitionDurationInSeconds: number;

            // try {
            //   const result = propsParser.transition(currentScene.transition);
            //   currentTransitionType = result.type;
            //   currentTransitionDurationInSeconds = result.duration;
            // } catch (e) {
            //   currentTransitionType = "none";
            //   currentTransitionDurationInSeconds = 3;
            // }

            let nextSceneTransitionType: TransitionType | undefined;
            let nextTransitionDurationInSeconds: number = 0.3;
            let transitionDirection: string = "from-bottom";

            /*     if (nextStep) {
              try {
                const result = propsParser.transition(nextStep.transition);
                nextSceneTransitionType = result.type;
                nextTransitionDurationInSeconds = result.duration;
                transitionDirection = result.direction;
              } catch (e) {
                nextSceneTransitionType = "none";
              }
            } */

            const __presentation = slide({
              direction: transitionDirection as SlideDirection,
            });

            const presentationWithSound = addSound(
              __presentation,
              staticFile("sfx/sweep-transition.wav"),
            );

            return (
              <React.Fragment key={index}>
                {/* the first slide by default will have a transition type wipe from bottom */}
                {/* {index === 0 && (
                  //@ts-ignore
                  <TransitionSeries.Transition
                    {...createTransitionConfig({
                      direction: "from-bottom", // TODO : it's hardcoded
                      durationInSeconds: currentTransitionDurationInSeconds,
                      fps,
                      type: currentTransitionType,
                    })}
                  />
                )} */}

                <TransitionSeries.Sequence
                  key={index}
                  durationInFrames={currentSceneDurationInFrames}
                >
                  <CompositionSlide
                    scene={currentScene}
                    oldCode={scenes[index - 1]?.code[0]}
                    newCode={currentScene.code[0]}
                    slideDurationInFrames={currentSceneDurationInFrames}
                    tokenTransitionDurationInFrames={convertSecondsToFramerate(
                      0.5,
                      fps,
                    )}
                    // disableTransition={currentTransitionType !== "magic"}
                  />
                </TransitionSeries.Sequence>

                {nextSceneTransitionType &&
                  nextSceneTransitionType !== "magic" &&
                  nextSceneTransitionType !== "none" && (
                    <TransitionSeries.Transition
                      presentation={withSoundDynamic(
                        slide({
                          direction: transitionDirection as SlideDirection,
                        }),
                      )}
                      // presentation={presentationWithSound}
                      timing={linearTiming({
                        durationInFrames: convertSecondsToFramerate(
                          nextTransitionDurationInSeconds,
                          fps,
                        ),
                      })}
                    />
                  )}
                {/* {nextSceneTransitionType &&
                  nextSceneTransitionType !== "magic" &&
                  nextSceneTransitionType !== "none" && (
                    <TransitionSeries.Transition
                      presentation={withSound(slide())}
                      timing={linearTiming({
                        durationInFrames: convertSecondsToFramerate(
                          nextTransitionDurationInSeconds,
                          fps,
                        ),
                      })}
                    />
                  )} */}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </div>
      <Audio src={staticFile("audio/rock-happy-1.mp3")} />
    </AbsoluteFill>
  );
};

export default CodeVideoComposition;
