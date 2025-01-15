/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import AddItemContextMenu from "./add-item-context-menu";
import AddItemPlaceholder from "./add-item-placeholder";
import SequenceItem from "./sequence-item";
import { LAYOUT } from "../../layout.const";
import { selectLiteItems } from "../store/reselector/video-store.reselector";
import useVideoStore from "../store/video.store";
import type { LayerId, LiteSequenceCaptionItemType } from "../timeline.types";
import { useSequenceAddition } from "../utils/dom-ops/use-item-addition";
import { useTimeline } from "../video-timeline-context";

interface LayerProps {
  layerId: LayerId;
}
const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;

const Layer: React.FC<LayerProps> = React.memo(({ layerId }) => {
  const { view, activeCaptionData } = useTimeline();
  const layer = useVideoStore((state) => state.props.layers[layerId]);
  const liteItems = useVideoStore((state) => selectLiteItems(state, layerId));

  // Filter items based on view and layer type
  const visibleItems = useMemo(() => {
    // If it's a normal layer and we're in caption-edit view
    if (layer.layerType === "normal" && view === "caption-edit") {
      // Only show the linked video/audio item
      return liteItems.filter(
        (item) => item.id === activeCaptionData?.videoItemId,
      );
    }

    // For caption layers or regular timeline view, show all items
    return liteItems;
  }, [liteItems, layer.layerType, view, activeCaptionData?.videoItemId]);

  if (layer.layerType === "caption") {
    const captionPageItems = (layer.liteItems[0] as LiteSequenceCaptionItemType)
      .liteItems;
    return (
      <>
        {captionPageItems.map((item) => {
          const nextItemStartFrame =
            captionPageItems[captionPageItems.indexOf(item) + 1]?.startFrame;
          return (
            <SequenceItem
              key={item.id}
              item={item}
              layerId={layerId}
              nextItemStartFrame={nextItemStartFrame}
            />
          );
        })}
      </>
    );
  }

  return (
    <>
      {visibleItems.map((item) => {
        const nextItemStartFrame =
          visibleItems[visibleItems.indexOf(item) + 1]?.startFrame;
        return (
          <SequenceItem
            key={item.id}
            item={item}
            layerId={layerId}
            nextItemStartFrame={nextItemStartFrame}
          />
        );
      })}
    </>
  );
});

export default Layer;

interface HoverLayerProps {
  layerId: LayerId;
  pixelsPerFrame: number;
}

export const HoverLayer: React.FC<HoverLayerProps> = React.memo(
  ({ layerId, pixelsPerFrame }) => {
    const {
      hoverInfo,
      mouseEventHandlers: {
        onMouseMove,
        onMouseLeave,
        onClick: onClickHandler,
      },
    } = useSequenceAddition(layerId, pixelsPerFrame);

    return (
      <>
        <AddItemContextMenu hoverInfo={hoverInfo!} onPresetAdd={onClickHandler}>
          {/* -------------------------- Background Layer for handing clicks and hover -------------------------- */}

          <div
            className="absolute inset-0"
            style={{ height: TRACK_LAYER_HEIGHT_IN_PX }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
              onClickHandler(e, {
                sequenceType: "standalone",
              });
            }}
          />
          {/* -------------------------- Item adding placeholder for handing clicks and hover -------------------------- */}

          {hoverInfo && (
            <AddItemPlaceholder
              startX={hoverInfo.startX}
              width={hoverInfo.width}
              overrideType={layerId === "layer-zoom" ? "zoom" : undefined}
            />
          )}
        </AddItemContextMenu>
      </>
    );
  },
);

HoverLayer.displayName = "HoverLayer";
