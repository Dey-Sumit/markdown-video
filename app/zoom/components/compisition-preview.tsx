import React, { useEffect, type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { NestedCompositionPropsSchema } from "../timeline/timeline.types";
import useVideoStore, {
  CONTENT_RESTRICT_LAYERS_TO_ID_MAP,
} from "../timeline/store/video.store";
import NestedSequenceCompositionLite from "../zoom-composition-better/composition.zoom-lite";
import { prefetch, type PrefetchOnProgress } from "remotion";
import { PREFETCH_VIDEO_URL } from "../timeline/dummy-project";
import { preloadVideo } from "@remotion/preload";
import Dropzone from "@/components/dropzone";
import { FileDropzone } from "@/components/file-dropzone";
import { VideoUpload } from "./editor-dropzone";

const unpreload = preloadVideo(PREFETCH_VIDEO_URL);
// Example metadata for the composition
const compositionMetaData = {
  duration: 1470, // Total duration in frames
  fps: 30, // Frames per second
  width: 1920, // Composition width
  height: 1080, // Composition height
};

const onProgress: PrefetchOnProgress = (progress) => {
  // console.log("Loading progress:", { progress });

  if (progress.totalBytes === null) {
    // HTTP response has no "Content-Length" header,
    // therefore no relative progress can be calculated.
    console.log("Loaded bytes:", progress.loadedBytes);
    return;
  }
  console.log(
    "Loaded bytes:",
    Math.round((progress.loadedBytes / progress.totalBytes) * 100) + "%",
  );
  // console.log(
  //   "Loading progress:",
  //   Math.round(progress.loadedBytes / progress.totalBytes / 100) + "%",
  // );
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
   useEffect(() => {
    console.log("Prefetching video...");

    const { free, waitUntilDone } = prefetch(PREFETCH_VIDEO_URL, {
      method: "blob-url",
      onProgress,
      contentType: "video/mp4",
    });

    waitUntilDone().then(() => {
      console.log("Video has finished loading");
    });
  }, []);
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
      {props.layers[CONTENT_RESTRICT_LAYERS_TO_ID_MAP.VIDEO_LAYER_ID]?.liteItems
        ?.length > 0 ? (
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
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <VideoUpload />
        </div>
      )}
    </div>
  );
};

export default CompositionPreview;
