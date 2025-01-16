import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import React from "react";
import type { NestedCompositionProjectType } from "../timeline/timeline.types";
import type { ZoomPoint } from "../types.zoom";
import { TransitionSeries } from "@remotion/transitions";
import { CONTENT_RESTRICT_LAYERS_TO_ID_MAP } from "../timeline/store/video.store";
import { RenderSequence } from "./composition.zoom";

/* const zoomEvents = [
  {
    startFrame: 20,
    targetX: 560,
    targetY: 540,
    zoomLevel: 1.5,
    stayDuration: 180,
  },
];
 */
const ZOOM_DURATION = 15;
export const ZOOM_COMP_PADDING = 50;
const NestedSequenceCompositionLite = (
  props: NestedCompositionProjectType["props"],
) => {
  const { layers, layerOrder, sequenceItems } = props;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zoomEvents: ZoomPoint[] = layers["layer-zoom"].liteItems
    .filter(
      (item) =>
        item.sequenceType === "standalone" && item.contentType === "zoom",
    )
    .map((item) => {
      const sequenceItem = sequenceItems[item.id];

      return {
        stayDuration: item.effectiveDuration,
        startFrame: item.startFrame,
        targetX: sequenceItem.editableProps.targetX,
        targetY: sequenceItem.editableProps.targetY,
        zoomLevel: sequenceItem.editableProps.zoomLevel,
        id: item.id,
      };
    });

  // Get the active zoom event for the current frame
  const activeZoomEvent = zoomEvents.find(
    (event) =>
      frame >= event.startFrame &&
      frame < event.startFrame + event.stayDuration, // Zoom-in + Stay + Zoom-out
  );

  // Default scale and origin if no zoom event is active
  const scale = activeZoomEvent
    ? interpolate(
        frame,
        [
          activeZoomEvent.startFrame,
          activeZoomEvent.startFrame + ZOOM_DURATION, // Zoom-in ends
          activeZoomEvent.startFrame +
            activeZoomEvent.stayDuration -
            ZOOM_DURATION, // Before zoom-out starts
          activeZoomEvent.startFrame + activeZoomEvent.stayDuration, // Zoom-out ends
        ],
        [1, activeZoomEvent.zoomLevel, activeZoomEvent.zoomLevel, 1],
        {
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.ease),
        },
      )
    : 1;

  //   const blurAmount = activeZoomEvent
  //     ? interpolate(
  //         frame,
  //         [
  //           activeZoomEvent.startFrame,
  //           activeZoomEvent.startFrame + ZOOM_DURATION / 2,
  //           activeZoomEvent.startFrame + ZOOM_DURATION,
  //           activeZoomEvent.startFrame +
  //             ZOOM_DURATION +
  //             activeZoomEvent.stayDuration,
  //           activeZoomEvent.startFrame +
  //             ZOOM_DURATION +
  //             activeZoomEvent.stayDuration +
  //             ZOOM_DURATION,
  //         ],
  //         [0, 2, 0, 0, 2], // Starts blurry, sharpens, stays sharp, and blurs again
  //         {
  //           extrapolateRight: "clamp",
  //         },
  //       )
  //     : 0;

  const originX = activeZoomEvent?.targetX || width / 2;
  const originY = activeZoomEvent?.targetY || height / 2;

  return (
    <AbsoluteFill
      className="bg-gradient-to-br from-[#7209B7] to-[yellow]"
      style={{
        padding: ZOOM_COMP_PADDING,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${originX}px ${originY}px`,
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          //   filter: `blur(${blurAmount}px)`, // Apply dynamic blur
        }}
        className="flex items-center justify-center"
        // className="rounded-3xl border-4 border-white shadow-2xl"
      >
        {/* Render grid */}
        {/* <RenderGrid rows={rows} cols={cols} /> */}

        {/* Target marker */}
        {/* {activeZoomEvent && (
            <div
              style={{
                position: "absolute",
                left: activeZoomEvent.targetX - 16,
                top: activeZoomEvent.targetY - 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            />
          )} */}
        {/* 
        <OffthreadVideo
          src={staticFile("videos/screen-recording.mov")}
          className="max-h-full object-contain shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]"
          muted
        /> */}

        <TransitionSeries
          name="video layer"
          layout="absolute-fill"
          className="box-border"
        >
          {layers[
            CONTENT_RESTRICT_LAYERS_TO_ID_MAP.VIDEO_LAYER_ID
          ].liteItems.map((item) => {
            return (
              <React.Fragment key={item.id}>
                <TransitionSeries.Sequence
                  durationInFrames={item.sequenceDuration}
                  name={item.id}
                  offset={item.offset}
                  layout="absolute-fill"
                  className="h-full w-full"
                >
                  <RenderSequence item={item} sequenceItems={sequenceItems} />
                </TransitionSeries.Sequence>
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </div>
    </AbsoluteFill>
  );
};

export default NestedSequenceCompositionLite;
