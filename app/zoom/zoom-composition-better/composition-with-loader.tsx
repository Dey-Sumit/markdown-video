import { Composition, type CalculateMetadataFunction } from "remotion";
import {
  type NestedCompositionProjectType,
  NestedCompositionPropsSchema,
} from "../timeline/timeline.types";
import NestedSequenceComposition from "./composition.zoom";
import { EMPTY_PROJECT_4 } from "../timeline/dummy-project";

const calculateMetadata: CalculateMetadataFunction<
  NestedCompositionProjectType["props"]
> = async ({ props, defaultProps, abortSignal }) => {
  return {
    // Change the metadata
    // durationInFrames: props.compositionMetaData.duration,
    durationInFrames: props.compositionMetaData.duration,
  };
};

const NewDynamicCompositionWithLoader = () => {
  const { props } = EMPTY_PROJECT_4;
  return (
    <>
      <Composition
        id="new-dynamic-composition"
        component={NestedSequenceComposition}
        durationInFrames={60 * 30}
        fps={props.compositionMetaData.fps}
        width={props.compositionMetaData.width}
        height={props.compositionMetaData.height}
        defaultProps={props}
        schema={NestedCompositionPropsSchema}
        calculateMetadata={calculateMetadata}
      />
      {/* <Composition
        id="MyComp"
        component={AnimatedImageComposition}
        durationInFrames={600}
        fps={30}
        width={720}
        height={1080}
        defaultProps={{
          item: testSequenceItems[
            "s-image-c12ff9f0-21f0-44bd-83dd-c2e1d7931a93"
          ],
        }}
      /> */}
    </>
  );
};

export default NewDynamicCompositionWithLoader;
