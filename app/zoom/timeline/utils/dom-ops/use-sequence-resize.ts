import { useCallback } from "react";
import useVideoStore from "../../store/video.store";
import type { LayerId, LiteSequenceItemType } from "../../timeline.types";
import useThrottle from "../../hooks/use-throttle";

const SNAP_THRESHOLD = 10; // Define this based on your requirements

type handleResizeArgs = {
  layerId: LayerId;
  deltaPixels: number;
  direction: "left" | "right";
  nextItemStartFrame?: number;
  item: LiteSequenceItemType;
};
// 1. DOM Event Handler Layer, takes care of frame delta calculation, throttling.
export const useSeqItemResizeHandler = (pixelsPerFrame: number) => {
  const validateAndUpdateResize = useSeqItemResizeValidation();

  const handleResize = useCallback(
    ({
      layerId,
      deltaPixels,
      direction,
      nextItemStartFrame,
      item,
    }: handleResizeArgs) => {
      const frameDelta = Math.round(deltaPixels / pixelsPerFrame);

      validateAndUpdateResize({
        layerId,
        frameDelta,
        direction,
        nextItemStartFrame,
        item,
      });
    },
    [pixelsPerFrame, validateAndUpdateResize],
  );

  return useThrottle(handleResize, 50);
};

// 2. Validation and Cleanup Layer
export const useSeqItemResizeValidation = () => {
  const updateSequenceItemDuration = useVideoStore(
    (state) => state.updateSequenceItemDuration,
  );

  return useCallback(
    ({
      layerId,
      frameDelta,
      direction,
      nextItemStartFrame,
      item,
    }: {
      layerId: LayerId;
      frameDelta: number;
      direction: "left" | "right";
      nextItemStartFrame?: number;
      item: LiteSequenceItemType;
    }) => {
      const itemEndFrame = item.startFrame + item.effectiveDuration;

      let adjustedFrameDelta = frameDelta; // for snapping purpose

      if (direction === "left" && frameDelta > item.offset) {
        const overlapBy = frameDelta - item.offset;
        if (overlapBy > SNAP_THRESHOLD) return;
        adjustedFrameDelta = item.offset;
      } else if (
        direction === "right" &&
        nextItemStartFrame &&
        frameDelta + itemEndFrame > nextItemStartFrame
      ) {
        const overlapBy = frameDelta + itemEndFrame - nextItemStartFrame;
        if (overlapBy > SNAP_THRESHOLD) return;
        adjustedFrameDelta = nextItemStartFrame - itemEndFrame;
      }

      updateSequenceItemDuration(
        layerId,
        item.id,
        adjustedFrameDelta,
        direction,
      );
    },
    [updateSequenceItemDuration],
  );
};
