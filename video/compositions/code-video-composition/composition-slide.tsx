import { Pre, type HighlightedCode } from "codehike/code";

import { cn } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";
import { type Scene } from "./types.composition";
import propsParser, { type TextProps } from "./utils/props-parser";
import { mark } from "./annotations/mark";
import { getMediaType } from "@/utils/utils";
import CompositionImage from "./components/composition-image";
import { convertSecondsToFramerate } from "../composition.utils";
import { useVideoConfig } from "remotion";
import CompositionText from "./components/composition-text";

const { fontFamily } = loadFont();

export function CompositionSlide({
  oldCode,
  newCode,
  tokenTransitionDurationInFrames,
  disableTransition,
  scene,
  slideDurationInFrames,
}: {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  tokenTransitionDurationInFrames: number;
  disableTransition?: boolean;
  slideDurationInFrames: number;
  scene: Scene;
}) {
  const { fps } = useVideoConfig();
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    tokenTransitionDurationInFrames,
  );

  // const transition = propsParser.transition(scene.transition);

  // const codeBlockUtils = scene.codeBlockUtils || "";

  // const media = scene.media || "";
  let media;
  if (scene.media) media = propsParser.media(scene.media || "");

  const sceneMeta = propsParser.sceneMeta(scene.title || "");

  let text: TextProps = {};
  if (scene.text) text = propsParser.text(scene.text);
  console.log("text", text);

  return (
    <div
      className={cn("flex h-full w-full flex-col px-8 py-4", {})}
      style={{
        fontFamily,
        background: sceneMeta.background,
      }}
    >
      {/* TODO : we need to move it out of this component, as I don't want the heading to be animated as well eg. on slide it looks, bad */}
      <div
        className="h-10 text-center text-2xl text-white"
        style={{
          fontFamily,
        }}
      >
        {newCode?.meta}
      </div>
      <div className="flex w-full flex-1 flex-col">
        <Pre
          ref={ref}
          code={code}
          handlers={[tokenTransitions, mark]}
          className="text-4xl leading-[3.5rem]"
          style={{
            fontFamily,
            fontFeatureSettings: '"liga" 1, "calt" 1',
            WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
            fontVariantLigatures: "contextual",
          }}
        />
        {text.content && (
          <CompositionText
            text={text.content}
            animationType={text.animation}
            delay={convertSecondsToFramerate(text.delay || 0, fps)}
            fontSize={text.fontSize}
            fontWeight={text.fontWeight}
          />
        )}
        {media && media.src && getMediaType(media.src) === "image" && (
          <CompositionImage
            src={media.src}
            slideDurationInFrames={slideDurationInFrames}
            mediaAppearanceDelay={convertSecondsToFramerate(media.delay, fps)}
            withMotion={media.withMotion}
          />
        )}
      </div>
    </div>
  );
}
