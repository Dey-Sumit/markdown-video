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
import type { SceneMetaResult } from "@/types/props.types";
import ComponentLayoutRenderer from "./components/compone-layout-renderer";
import { sectionParser } from "@/parsers/SectionParser";
import Section from "./components/composition-section";

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
  newCode?: HighlightedCode;
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

const getBackground = (sceneMeta: SceneMetaResult): string => {
  const bg = sceneMeta.background;
  if (!bg) return "";

  return /^'?https?:/.test(bg) ? `url(${bg})` : bg;
};

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
  // TODO : we can put this logic and all inside the ComponentLayoutRenderer
  const contentLayout = propsParser.contentLayout(scene.contentLayout || "");
  // const section = propsParser.contentLayout(scene.contentLayout || "");
  const sectionArgs = scene.section;
  const section = sectionParser.parse(`!section ${sectionArgs}`);

  return (
    <div
      id="composition-slide"
      className={cn("flex h-full w-full flex-col p-6")}
      style={{
        fontFamily,
        background: getBackground(sceneMeta),
      }}
    >
      {/* {newCode && (
        <div
          className="h-10 text-center text-2xl text-white"
          style={{ fontFamily }}
        >
          {newCode?.meta}
        </div>
      )} */}

      {scene.text && <CompositionTextProcessor value={scene.text} />}
      {section.type === "section" && (
        <Section data={section.data} type={section.type} />
      )}

      {/* {contentLayout?.name && (
        <div className="absolute inset-0">
          {ComponentLayoutRenderer(contentLayout)}
        </div>
      )} */}
      {/* <div className="flex w-full flex-1 flex-col bg-transparent">
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
      </div> */}

      {media?.src && (
        // {media?.src && getMediaType(media.src) === "image" && (
        <CompositionImage
          src={media.src}
          slideDurationInFrames={slideDurationInFrames}
          mediaAppearanceDelay={convertSecondsToFramerate(media.delay, fps)}
          withMotion={media.withMotion}
        />
      )}
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
      delay={convertSecondsToFramerate(textProps.delay || 0, fps)}
      // fontSize={textProps.fontSize}
      // fontWeight={textProps.fontWeight}
      color={textProps.color}
      animationType={textProps.animation}
    />
  );
};
