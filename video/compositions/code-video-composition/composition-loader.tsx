import { Composition } from "remotion";
import CodeVideoComposition from ".";
import { calculateCompositionDuration } from "../composition.utils";
import { compositionMetaData } from "./config";
import { SceneSchema, type CompositionStore } from "./types.composition";

// const HARDCODED_STEPS: CompositionStore["scenes"] = [];
// const HARDCODED_STYLES = {
//   backgroundContainer: {
//     background: "#000000",
//   },
//   sceneContainer: {
//     inset: 10,
//     padding: 10,
//   },
// };

import SampleMarkdownContent from "../../../samples/background-sample.md";
import { Block, parseRoot } from "codehike/blocks";
import { z } from "zod";

const { scene: scenes, title } = parseRoot(
  SampleMarkdownContent,
  Block.extend({
    scene: z.array(SceneSchema),
  }),
);

const HARDCODED_STYLES: CompositionStore["styles"] = {
  backgroundContainer: {
    background: {
      activeType: "color",
      color: "#000000",
      gradient: {
        angle: 0,
        colors: ["red", "green"],
      },
    },
  },
  sceneContainer: {
    inset: 0,
    padding: 80,
    borderRadius: 10,
  },
};

export default function CodeTransitionCompositionLoader() {
  const { fps, height, width } = compositionMetaData;
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{
        scenes: scenes,
        styles: HARDCODED_STYLES,
      }}
      calculateMetadata={({ props }) => {
        const duration = calculateCompositionDuration(props.scenes) || 30;

        return {
          durationInFrames: duration,
          width: width,
          height: height,
          fps: fps,
        };
      }}
    />
  );
}
