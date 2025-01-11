import type { PlayerRef } from "@remotion/player";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useTimelineMetrics } from "./utils/dom-ops/use-timeline-metrics";
import type { LayerId } from "./timeline.types";
import { useSeqItemResizeHandler } from "./utils/dom-ops/use-sequence-resize";
import { useTimelineSynchronization } from "./utils/dom-ops/use-timeline-sync";
import { useItemDrag } from "./hooks/use-item-drag";
import useVideoStore from "./store/video.store";
import { useCurrentPlayerFrame } from "./hooks/use-current-player-frame";

type CaptionData = {
  videoLayerId: string;
  videoItemId: string;
  captionLayerId: string;
  durationInFrames: number;
} | null;

type TimelineView = "caption-edit" | "entire-timeline";

// Extract types from the hooks/functions
type TimelineMetrics = ReturnType<typeof useTimelineMetrics>;
type TimelineSynchronization = ReturnType<typeof useTimelineSynchronization>;
type ItemDragHandler = ReturnType<typeof useItemDrag>;
type SeqItemResizeHandler = ReturnType<typeof useSeqItemResizeHandler>;

type Values = {
  playheadPosition: TimelineSynchronization["playheadPosition"];
  containerWidth: TimelineMetrics["containerWidth"];
  containerRef: TimelineMetrics["containerRef"];
  pixelsPerFrame: TimelineMetrics["pixelsPerFrame"];
  throttledItemDrag: ItemDragHandler;
  itemResizeHandler: SeqItemResizeHandler;
  handlePlayheadDrag: TimelineSynchronization["handlePlayheadDrag"];
  handleTimeLayerClick: TimelineSynchronization["handleTimeLayerClick"];
  currentFrame: number;
  draggingLayerId: LayerId | null;
  setDraggingLayerId: (layerId: LayerId | null) => void;
  // Caption edit values
  view: TimelineView;
  setView: (view: TimelineView) => void;
  activeCaptionData: CaptionData;
  setActiveCaptionData: (data: CaptionData) => void;
  visibleLayerOrder: string[];

  setTimelineZoom: TimelineMetrics["setTimelineZoom"];
  handleZoomChange: TimelineMetrics["handleZoomChange"];
  zoom: TimelineMetrics["zoom"];
  scrollToFrame: TimelineMetrics["scrollToFrame"];
  scrollPosition: TimelineMetrics["scrollPosition"];
  totalTimelineWidth: TimelineMetrics["totalTimelineWidth"];
  frameToPixels: TimelineMetrics["frameToPixels"];
  pixelsToFrame: TimelineMetrics["pixelsToFrame"];
};

const VideoTimelineContext = createContext<Values>(null as any);

export const useTimeline = () => {
  const context = useContext(VideoTimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within VideoTimelineProvider");
  }
  return context;
};

export const VideoTimelineProvider = ({
  children,
  playerRef,
}: {
  children: React.ReactNode;
  playerRef: React.RefObject<PlayerRef>;
}) => {
  // Original timeline state
  const [draggingLayerId, setDraggingLayerId] = useState<LayerId | null>(null);

  // Caption edit state
  const [view, setView] = useState<TimelineView>("entire-timeline");
  const [activeCaptionData, setActiveCaptionData] = useState<CaptionData>(null);

  const props = useVideoStore((store) => store.props);
  const orderedLayers = useVideoStore((store) => store.props.layerOrder);
  const layers = useVideoStore((store) => store.props.layers);

  const updateSequenceItemPositionInLayer = useVideoStore(
    (store) => store.updateSequenceItemPositionInLayer,
  );

  const currentFrame = useCurrentPlayerFrame(playerRef);

  const durationInFrames = props!.compositionMetaData.duration;

  const {
    containerRef,
    containerWidth,
    pixelsPerFrame,
    frameToPixels,
    pixelsToFrame,
    setTimelineZoom,
    handleZoomChange,
    zoom,
    scrollToFrame,
    scrollPosition,
    totalTimelineWidth,
  } = useTimelineMetrics({ durationInFrames });

  const { playheadPosition, handlePlayheadDrag, handleTimeLayerClick } =
    useTimelineSynchronization({
      containerWidth,
      frameToPixels,
      pixelsToFrame,
      playerRef,
      currentFrame,
      zoom,
    });

  const throttledItemDrag = useItemDrag(
    pixelsPerFrame,
    updateSequenceItemPositionInLayer,
  );

  const itemResizeHandler = useSeqItemResizeHandler(pixelsPerFrame);

  // Calculate visible layers based on view
  const visibleLayerOrder = useMemo(() => {
    if (view === "caption-edit" && activeCaptionData) {
      return [activeCaptionData.captionLayerId, activeCaptionData.videoLayerId];
    }

    // Filter out caption layers for timeline view
    return orderedLayers.filter(
      (layerId) => layers[layerId].layerType !== "caption",
    );
  }, [view, activeCaptionData, orderedLayers, layers]);

  const value = {
    // Original timeline values
    playheadPosition,
    containerWidth,
    containerRef,
    pixelsPerFrame,
    throttledItemDrag,
    itemResizeHandler,
    handlePlayheadDrag,
    handleTimeLayerClick,
    currentFrame,
    draggingLayerId,
    setDraggingLayerId,
    // Caption edit values
    view,
    setView,
    activeCaptionData,
    setActiveCaptionData,
    visibleLayerOrder,
    setTimelineZoom,
    handleZoomChange,
    zoom,
    scrollToFrame,
    scrollPosition,
    totalTimelineWidth,
    frameToPixels,
    pixelsToFrame,
  };

  return (
    <VideoTimelineContext.Provider value={value}>
      {children}
    </VideoTimelineContext.Provider>
  );
};
