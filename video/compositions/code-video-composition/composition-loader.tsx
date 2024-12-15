import { Composition } from "remotion";
import CodeVideoComposition from ".";
import { calculateCompositionDuration } from "../composition.utils";
import { compositionMetaData } from "./config";
import { type CompositionStore } from "./types.composition";

const HARDCODED_STEPS: CompositionStore["scenes"] = [];
const HARDCODED_STYLES = {
  backgroundContainer: {
    background: "#000000",
  },
  sceneContainer: {
    inset: 10,
    padding: 10,
  },
};

export default function CodeTransitionCompositionLoader() {
  const { fps, height, width } = compositionMetaData;
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{
        scenes: HARDCODED_STEPS,
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
