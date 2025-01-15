"use client";

import { GripVertical } from "lucide-react";
import { useRef } from "react";
import { LAYOUT } from "../../layout.const";
import type { LayerType } from "../timeline.types";
import { useTimeline } from "../video-timeline-context";
import Layer, { HoverLayer } from "./layer";
import { PlayHead2 } from "./playhead";
import useVideoStore from "../store/video.store";
import TimeLayer from "./time-layer";

const {
  SIDE_NAVBAR_WIDTH,
  TIMELINE: {
    TRACK_LAYER_HEIGHT,
    TIMELINE_CONTAINER_HEIGHT,
    TRACK_LAYER_HEIGHT_IN_PX,
    LAYER_NAME_STACK_WIDTH,
  },
} = LAYOUT;

export const filterCaptionLayers = (
  orderedLayers: string[],
  layers: Record<string, LayerType>,
) => {
  return orderedLayers.filter(
    (layerId) => layers[layerId].layerType !== "caption",
  );
};

const VideoTimeline = () => {
  const {
    containerRef,
    activeCaptionData,
    visibleLayerOrder,
    pixelsPerFrame,
    view,
    setView,
  } = useTimeline();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="pattern-bg-black-orchid"
      style={{ left: SIDE_NAVBAR_WIDTH, height: TIMELINE_CONTAINER_HEIGHT }}
    >
      {/* TIMELINE BODY STARTS */}
      <div
        className="scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/30 hover:scrollbar-thumb-gray-900/80 relative flex overflow-x-auto overflow-y-auto border-x border-neutral-900"
        style={{
          height: TIMELINE_CONTAINER_HEIGHT,
        }}
        ref={scrollContainerRef}
      >
        {/* ------------------------- Layers section starts ------------------------  */}

        {/* ------------------------------ Left Section -----------------------------  */}
        {/*  <div className="sticky left-0 z-50">
          <div
            className="sticky left-0 top-0 z-30 border-b border-r border-t bg-black"
            style={{
              height: TRACK_LAYER_HEIGHT,
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            {view === "entire-timeline" ? (
              <LayerToolbar />
            ) : (
              <button
                onClick={() => {
                  setView("entire-timeline");
                }}
                className="flex h-full w-full items-center justify-center space-x-1 p-2 text-sm text-orange-500"
              >
                <MoveLeft size={14} className="" />
                <span className="">Timeline</span>
              </button>
            )}
          </div>

          <div
            className="h-fit divide-y divide-gray-800 border-r bg-black"
            style={{
              width: LAYER_NAME_STACK_WIDTH,
            }}
          >
            {view === "entire-timeline" ? (
              <LayerNamesStack />
            ) : (
              <CaptionLayerStack
                videoLayerId={activeCaptionData?.videoLayerId!}
                captionLayerId={activeCaptionData?.captionLayerId!}
              />
            )}
          </div>
        </div> */}
        {/* <div className="w-0 bg-transparent"></div> */}

        {/* ------------------------------ Right Section -----------------------------  */}
        <div className="w-max flex-1" ref={containerRef}>
          <div
            className="sticky top-0 z-10 flex-1 border-b border-neutral-900"
            style={{
              height: TRACK_LAYER_HEIGHT,
            }}
          >
            <TimeLayer />
          </div>

          <div
            className="relative flex-1"
            style={{
              height: visibleLayerOrder.length * TRACK_LAYER_HEIGHT_IN_PX,
            }}
          >
            {view === "entire-timeline" && (
              <div className="absolute inset-0">
                {visibleLayerOrder.map((layerId) => (
                  <div
                    key={layerId}
                    className="relative border-b border-neutral-900"
                    style={{
                      height: TRACK_LAYER_HEIGHT_IN_PX,
                    }}
                  >
                    <HoverLayer
                      key={layerId}
                      layerId={layerId}
                      pixelsPerFrame={pixelsPerFrame}
                    />
                  </div>
                ))}
              </div>
            )}
            {visibleLayerOrder.map((layerId) => (
              <Layer key={layerId} layerId={layerId} />
            ))}
          </div>

          {/* ------------------------- PlayHead --------------------------  */}

          <PlayHead2
            scrollContainerRef={scrollContainerRef}
            trackLayerCount={visibleLayerOrder.length}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoTimeline;

const CaptionLayerStack: React.FC<{
  videoLayerId: string;
  captionLayerId: string;
}> = ({ videoLayerId, captionLayerId }) => {
  const layers = useVideoStore((state) => state.props.layers);

  // Just the two layers we need
  const visibleLayers = [captionLayerId, videoLayerId];

  return (
    <div className="relative">
      {visibleLayers.map((layerId) => (
        <LayerItem
          key={layerId}
          layer={layers[layerId]}

          // Not passing constraintsRef since we don't need drag
        />
      ))}
    </div>
  );
};

const LayerItem = ({ layer }: { layer: LayerType }) => {
  return (
    <div
      style={{
        height: `${TRACK_LAYER_HEIGHT_IN_PX}px`,
        width: "100%",
      }}
      className="border-b border-neutral-900"
    >
      <div className="relative flex h-full w-full items-center px-1">
        <div className="reorder-handle mr-2 cursor-move">
          <GripVertical size={16} className="text-white/30" />
        </div>
        <span className="line-clamp-1 select-none text-xs capitalize">
          {layer.name}
        </span>
      </div>
    </div>
  );
};
