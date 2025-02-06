import { type HighlightedCode } from "codehike/code";

import { cn, getDerivedBackground } from "@/lib/utils";
import { loadFont } from "@remotion/google-fonts/FiraCode";
import { useTokenTransitions } from "./annotations/token-transitions";
import { type Scene } from "./types.composition";

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

function BaseSlide({ code, codeRef, scene, sceneProps }: BaseSlideProps) {
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
