import React, { type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { useZoomProjectStore } from "../store/zoom.store";
import { VideoCompositionSchema } from "../types.zoom";
import ZoomIntoPositionComposition from "../zoom-composition-better";
import NestedSequenceComposition from "../zoom-composition-better/composition.zoom";
import { NestedCompositionPropsSchema } from "../timeline/timeline.types";
import useVideoStore from "../timeline/store/video.store";
import NestedSequenceCompositionLite from "../zoom-composition-better/composition.zoom-lite";

// Example metadata for the composition
const compositionMetaData = {
  duration: 360, // Total duration in frames
  fps: 30, // Frames per second
  width: 1920, // Composition width
  height: 1080, // Composition height
};

// Error fallback
const errorFallback = (error: any) => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-red-800 text-white">
    <h1 className="text-2xl font-bold">Something went wrong</h1>
    <p className="mt-2">{error.message}</p>
  </div>
);

const CompositionPreview: React.FC<{ playerRef: RefObject<PlayerRef> }> = ({
  playerRef,
}) => {
  const { props } = useVideoStore();

  /*  const { zoomPoints, videos, background } = useZoomProjectStore();

  if (!zoomPoints || !videos || !background) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
        Loading project...
      </div>
    );
  } */

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      {/*  <Player
        component={ZoomIntoPositionComposition} // Your nested composition
        durationInFrames={compositionMetaData.duration}
        fps={compositionMetaData.fps}
        compositionHeight={compositionMetaData.height}
        compositionWidth={compositionMetaData.width}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls={false}
        autoPlay={false}
        loop
        initiallyMuted
        errorFallback={(error) => errorFallback(error)}
        ref={playerRef}
        schema={VideoCompositionSchema} // Validate props using the schema
        inputProps={{
          zoomEvents: zoomPoints,
          styles: background,
          videos,
        }} // Props for the composition
        browserMediaControlsBehavior={{
          mode: "register-media-session",
        }}
        className="overflow-hidden rounded-md shadow-lg"
      /> */}
      <Player
        component={NestedSequenceCompositionLite}
        durationInFrames={compositionMetaData.duration}
        fps={compositionMetaData.fps}
        compositionHeight={compositionMetaData.height}
        compositionWidth={compositionMetaData.width}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls={false}
        autoPlay={false}
        loop
        initiallyMuted
        errorFallback={(error) => errorFallback(error)}
        ref={playerRef}
        schema={NestedCompositionPropsSchema}
        inputProps={props}
        browserMediaControlsBehavior={{
          mode: "register-media-session",
        }}
        className="rounded-md border shadow-lg"
      />
    </div>
  );
};

export default CompositionPreview;
