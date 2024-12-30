import { Pre, type HighlightedCode } from "codehike/code";

import { cn } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import {
  tokenTransitions,
  useTokenTransitions,
} from "./annotations/token-transitions";
import { type Scene } from "./types.composition";
import propsParser from "./utils/props-parser";
import { mark } from "./annotations/mark";
import { getMediaType } from "@/utils/utils";
import CompositionImage from "./components/composition-image";
import { convertSecondsToFramerate } from "../composition.utils";
import { useVideoConfig } from "remotion";
import CompositionText from "./components/composition-text";

const { fontFamily } = loadFont();

type BaseSlideProps = {
  code: HighlightedCode;
  codeRef: React.RefObject<any> | null;
  scene: Scene;
  slideDurationInFrames: number;
  newCode?: HighlightedCode;
};

type CompositionSlideProps = {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  tokenTransitionDurationInFrames: number;
  disableTransition?: boolean;
  slideDurationInFrames: number;
  scene: Scene;
};

type CodeTransitionProps = {
  children: (props: {
    code: HighlightedCode;
    ref: React.RefObject<any>;
  }) => React.ReactNode;
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  tokenTransitionDurationInFrames: number;
  disableTransition?: boolean;
};

function CodeTransitionWrapper({
  children,
  oldCode,
  newCode,
  tokenTransitionDurationInFrames,
  disableTransition,
}: CodeTransitionProps) {
  const { code, ref } = useTokenTransitions(
    disableTransition ? newCode : oldCode,
    newCode,
    tokenTransitionDurationInFrames,
  );
  return children({ code, ref });
}

function BaseSlide({
  code,
  codeRef,
  scene,
  slideDurationInFrames,
  newCode,
}: BaseSlideProps) {
  const { fps } = useVideoConfig();
  const media = scene.media ? propsParser.media(scene.media) : null;
  const sceneMeta = propsParser.sceneMeta(scene.title || "");

  return (
    <div
      className={cn("flex h-full w-full flex-col px-8 py-4")}
      style={{ fontFamily, background: sceneMeta.background }}
    >
      {/* {newCode && (
        <div
          className="h-10 text-center text-2xl text-white"
          style={{ fontFamily }}
        >
          {newCode?.meta}
        </div>
      )} */}
      <div className="flex w-full flex-1 flex-col">
        {newCode && (
          <Pre
            ref={codeRef}
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
        )}
        {/* {text.content && (
          <CompositionText
            text={text.content}
            animationType={text.animation}
            delay={convertSecondsToFramerate(text.delay || 0, fps)}
            fontSize={text.fontSize}
            fontWeight={text.fontWeight}
          />
        )} */}
        {scene.text && <CompositionTextProcessor value={scene.text} />}
        {media?.src && getMediaType(media.src) === "image" && (
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

export function CompositionSlide(props: CompositionSlideProps) {
  if (!props.newCode) {
    return <BaseSlide {...props} code={props.newCode} codeRef={null} />;
  }

  return (
    <CodeTransitionWrapper {...props}>
      {({ code, ref }) => <BaseSlide {...props} code={code} codeRef={ref} />}
    </CodeTransitionWrapper>
  );
}

const CompositionTextProcessor = ({ value }: { value: string }) => {
  const { fps } = useVideoConfig();
  const textProps = propsParser.text(value);
  if (!textProps.content) return null;
  return (
    <CompositionText
      text={textProps.content}
      animationType={textProps.animation}
      delay={convertSecondsToFramerate(textProps.delay || 0, fps)}
      fontSize={textProps.fontSize}
      fontWeight={textProps.fontWeight}
      color={textProps.color}
    />
  );
};
