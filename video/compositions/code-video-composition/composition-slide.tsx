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

// export function CompositionSlide({
//   oldCode,
//   newCode,
//   tokenTransitionDurationInFrames,
//   disableTransition,
//   scene,
//   slideDurationInFrames,
// }: {
//   oldCode?: HighlightedCode;
//   newCode: HighlightedCode;
//   tokenTransitionDurationInFrames: number;
//   disableTransition?: boolean;
//   slideDurationInFrames: number;
//   scene: Scene;
// }) {
//   const { fps } = useVideoConfig();
//   const { code, ref } = useTokenTransitions(
//     disableTransition ? newCode : oldCode,
//     newCode,
//     tokenTransitionDurationInFrames,
//   );

//   let media;
//   if (scene.media) media = propsParser.media(scene.media || "");

//   const sceneMeta = propsParser.sceneMeta(scene.title || "");

//   let text: TextProps = {};
//   if (scene.text) text = propsParser.text(scene.text);
//   console.log("text", text);

//   return (
//     <div
//       className={cn("flex h-full w-full flex-col px-8 py-4", {})}
//       style={{
//         fontFamily,
//         background: sceneMeta.background,
//       }}
//     >
//       {/* TODO : we need to move it out of this component, as I don't want the heading to be animated as well eg. on slide it looks, bad */}
//       <div
//         className="h-10 text-center text-2xl text-white"
//         style={{
//           fontFamily,
//         }}
//       >
//         {newCode?.meta}
//       </div>
//       <div className="flex w-full flex-1 flex-col">
//         <Pre
//           ref={ref}
//           code={code}
//           handlers={[tokenTransitions, mark]}
//           className="text-4xl leading-[3.5rem]"
//           style={{
//             fontFamily,
//             fontFeatureSettings: '"liga" 1, "calt" 1',
//             WebkitFontFeatureSettings: '"liga" 1, "calt" 1',
//             fontVariantLigatures: "contextual",
//           }}
//         />
//         {text.content && (
//           <CompositionText
//             text={text.content}
//             animationType={text.animation}
//             delay={convertSecondsToFramerate(text.delay || 0, fps)}
//             fontSize={text.fontSize}
//             fontWeight={text.fontWeight}
//           />
//         )}
//         {media && media.src && getMediaType(media.src) === "image" && (
//           <CompositionImage
//             src={media.src}
//             slideDurationInFrames={slideDurationInFrames}
//             mediaAppearanceDelay={convertSecondsToFramerate(media.delay, fps)}
//             withMotion={media.withMotion}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

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
    />
  );
};
