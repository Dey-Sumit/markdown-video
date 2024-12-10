import { Pre, type HighlightedCode } from "codehike/code";

import { cn } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";
import { type Scene } from "./types.composition";
import propsParser from "./utils/props-parser";

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
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    tokenTransitionDurationInFrames,
  );

  const transition = propsParser.transition(scene.transition);
  console.log("transition", transition);

  const codeBlockUtils = scene.codeBlockUtils || "";

  const media = scene.media || "";

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
