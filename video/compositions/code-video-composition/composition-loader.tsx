import { Composition } from "remotion";
import CodeVideoComposition from ".";
import { calculateCompositionDuration } from "../composition.utils";
import { compositionMetaData } from "./config";
import { type CompositionStore } from "./types.composition";

const HARDCODED_STEPS: CompositionStore["steps"] = [];

export default function CodeTransitionCompositionLoader() {
  const { fps, height, width } = compositionMetaData;
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{ steps: HARDCODED_STEPS }}
      calculateMetadata={({ props }) => {
        const duration = calculateCompositionDuration(props.steps);

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
