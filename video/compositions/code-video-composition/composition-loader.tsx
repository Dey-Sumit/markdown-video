import { Composition } from "remotion";
import { StoreState } from "./types.composition";
import CodeVideoComposition from ".";
import { CODE_COMP_TRANSITION_DURATION } from "./config";

const HARDCODED_STEPS: StoreState["steps"] = [];

export default function CodeTransitionCompositionLoader() {
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{ steps: HARDCODED_STEPS }}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={({ props }) => {
        const duration = props.steps.reduce((acc, step) => {
          return acc + step.duration - (step.transition ? CODE_COMP_TRANSITION_DURATION : 0);
        }, 0);

        return {
          durationInFrames: duration,
          width: 1920,
          height: 1080,
          fps: 30,
        };
      }}
    />
  );
}
