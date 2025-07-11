import { type HighlightedCode } from "codehike/code";

import { cn, getDerivedBackground } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import { useTokenTransitions } from "./annotations/token-transitions";
import { type Scene } from "./types.composition";
import { useVideoConfig } from "remotion";

// import ComponentLayoutRenderer from "./components/compone-layout-renderer";
// import { sectionParser } from "@/parsers/SectionParser";
// import Section from "./components/_composition-section";
import type { SceneOutputProps } from "@/components/x-editor/plugins/scene/scene.types";
import CompositionTextRenderer from "./components/composition-text";
import CodeBlockRenderer from "./components/composition-code";
import CompositionImageRenderer from "./components/composition-image";
import CompositionSectionRenderer from "./components/composition-section-renderer";

const { fontFamily } = loadFont();

type BaseSlideProps = {
  code?: HighlightedCode;
  codeRef: React.RefObject<any> | null;
  scene: Scene;
  slideDurationInFrames: number;
  sceneProps: SceneOutputProps;
};

type CompositionSlideProps = {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  tokenTransitionDurationInFrames: number;
  disableTokenTransition?: boolean;
  slideDurationInFrames: number;
  scene: Scene;
  sceneProps: SceneOutputProps;
};

type CodeTransitionWrapperProps = {
  children: (props: {
    code: HighlightedCode;
    ref: React.RefObject<any>;
  }) => React.ReactNode;
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  tokenTransitionDurationInFrames: number;
  disableTokenTransition?: boolean;
};

function CodeTransitionWrapper({
  children,
  oldCode,
  newCode,
  tokenTransitionDurationInFrames,
  disableTokenTransition,
}: CodeTransitionWrapperProps) {
  const { code, ref } = useTokenTransitions(
    disableTokenTransition ? newCode : oldCode,
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
  sceneProps,
}: BaseSlideProps) {
  const { fps } = useVideoConfig();
  // const media = scene.media ? propsParser.media(scene.media) : null;

  // // TODO : we can put this logic and all inside the ComponentLayoutRenderer
  // // const contentLayout = propsParser.contentLayout(scene.contentLayout || "");
  // // const section = propsParser.contentLayout(scene.contentLayout || "");
  // const sectionArgs = scene.section;
  // const section = sectionParser.parse(`!section ${sectionArgs}`);
  // // const codeBlockProps =

  // console.log("code-video-composition/composition-slide.tsx", {
  //   scene,
  //   section,
  // });

  return (
    <div
      id="composition-slide"
      className={cn("flex h-full w-full flex-col p-6")}
      style={{
        fontFamily, // TODO : font family here not working
        background: getDerivedBackground(sceneProps.background),
      }}
    >
      <CompositionTextRenderer value={scene.text} />
      {/* {newCode && (
        <div
          className="h-10 text-center text-2xl text-white"
          style={{ fontFamily }}
        >
          {newCode?.meta}
        </div>
      )} */}

      {/*    {scene.text && <CompositionTextProcessor value={scene.text} />}
      {section.type === "section" && (
        <Section data={section.data} type={section.type} />
      )}
 */}
      {/* {contentLayout?.name && (
        <div className="absolute inset-0">
          {ComponentLayoutRenderer(contentLayout)}
        </div>
      )} */}

      {code && (
        <CodeBlockRenderer code={code} codeRef={codeRef} meta={code.meta} />
      )}

      <CompositionImageRenderer
        value={scene.image}
        sceneDurationInFrames={sceneProps.durationInFrames}
      />
      {scene.section?.length > 0 && (
        <CompositionSectionRenderer
          sceneDurationInFrames={sceneProps.durationInFrames}
          value={scene.section}
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
