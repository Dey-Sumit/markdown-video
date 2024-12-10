import { Composition } from "remotion";
import CodeVideoComposition from ".";
import { calculateCompositionDuration } from "../composition.utils";
import { compositionMetaData } from "./config";
import { type CompositionStore } from "./types.composition";

const HARDCODED_STEPS: CompositionStore["scenes"] = [];

export default function CodeTransitionCompositionLoader() {
  const { fps, height, width } = compositionMetaData;
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{ scenes: HARDCODED_STEPS }}
      calculateMetadata={({ props }) => {
        const duration = calculateCompositionDuration(props.scenes);

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
