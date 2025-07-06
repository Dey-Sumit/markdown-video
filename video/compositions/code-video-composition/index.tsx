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
import scenePropsParser from "@/components/x-editor/plugins/scene/scene.parser";
import transitionPropsParser, {
  type TransitionOutputProps,
} from "@/components/x-editor/plugins/transition/transition.parser";

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
      style={
        {
          // background: createGradient(gradient.colors, gradient.angle),
        }
      }
      className="bg-dot-pattern"
    >
      <div
        className="_shadow-2xl absolute !h-auto !w-auto overflow-hidden border border-gray-600"
        style={{
          inset: padding,
          borderRadius: borderRadius,
          // borderWidth: inset,
          fontFamily: fontFamily,
        }}
      >
        <TransitionSeries layout="none">
          {scenes.map((currentScene, index) => {
            const nextStep = scenes[index + 1];

            const { data: currentSceneProps } = scenePropsParser.parse(
              currentScene.title || "",
            ); // TODO : we need to pass a fallback value here. important for duration and transition duration dynamic

            const { data: currentTransition } = transitionPropsParser.parse(
              currentScene.transition || "", // TODO : we need to pass a fallback value here. important for duration and transition duration dynamic
            );

            const { data: nextTransition } = transitionPropsParser.parse(
              nextStep?.transition || "", // TODO : we need to pass a fallback value here. important for duration and transition duration dynamic
            );

            // let nextSceneTransitionType: TransitionType | undefined;
            // let nextTransitionDurationInSeconds: number = 0.3;
            // let transitionDirection: string = "from-bottom";

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

            /*    const __presentation = slide({
              direction: transitionDirection as SlideDirection,
            });

            const presentationWithSound = addSound(
              __presentation,
              staticFile("sfx/sweep-transition.wav"),
            ); */

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
                  durationInFrames={currentSceneProps.durationInFrames}
                >
                  <CompositionSlide
                    scene={currentScene}
                    oldCode={scenes[index - 1]?.code[0]} // todo:  for Code we will always have only one code block for now, else magic transition will not work
                    newCode={currentScene.code[0]} // todo:  for Code we will always have only one code block for now, else magic transition will not work
                    slideDurationInFrames={currentSceneProps.durationInFrames}
                    tokenTransitionDurationInFrames={
                      currentTransition.durationInFrames
                    }
                    sceneProps={currentSceneProps}
                    disableTokenTransition={currentTransition.type !== "magic"}
                  />
                </TransitionSeries.Sequence>

                {nextTransition.type &&
                  nextTransition.type !== "none" &&
                  nextTransition.type !== "magic" && (
                    //@ts-ignore : ts is bullshit
                    <TransitionSeries.Transition
                      //@ts-ignore : ts is bullshit again
                      {...createTransitionConfig({
                        direction: nextTransition.direction,
                        durationInSeconds: nextTransition.duration,
                        fps,
                        // @ts-ignore : ts is bullshit once again
                        type: nextTransition.type,
                      })}
                    />
                  )}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </div>
      {/* <Audio src={staticFile("audio/rock-happy-1.mp3")} /> */}
    </AbsoluteFill>
  );
};

export default CodeVideoComposition;
