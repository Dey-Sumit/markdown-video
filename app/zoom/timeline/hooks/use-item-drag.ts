import { useCallback } from "react";

import useThrottle from "./use-throttle";
import useVideoStore from "../store/video.store";
import type { LayerId, LiteSequenceItemType, StoreType } from "../timeline.types";

const SNAP_THRESHOLD = 10; // Define a threshold in frames for snapping

export const useItemDrag = (
  pixelsPerFrame: number,
  updateSequenceItemPositionInLayer: StoreType["updateSequenceItemPositionInLayer"],
) => {
  const layers = useVideoStore((store) => store.props.layers);
  const checkCollisionAndSnap = (
    layerItems: LiteSequenceItemType[],
    itemId: string,
    newStartFrame: number,
    newEndFrame: number,
  ): {
    hasCollision: boolean;
    snapTo: number | null;
    collisionExtent: number;
  } => {
    let snapTo: number | null = null;
    let minCollision = Infinity;

    for (const liteItem of layerItems) {
      if (liteItem.id === itemId) continue;

      const otherStartFrame = liteItem.startFrame;
      const otherEndFrame = otherStartFrame + liteItem.effectiveDuration;

      // Check for collision
      if (newStartFrame < otherEndFrame && newEndFrame > otherStartFrame) {
        // Calculate the extent of collision
        const leftCollision = Math.abs(newEndFrame - otherStartFrame);
        const rightCollision = Math.abs(newStartFrame - otherEndFrame);
        const collision = Math.min(leftCollision, rightCollision);

        if (collision < minCollision) {
          minCollision = collision;
          if (collision <= SNAP_THRESHOLD) {
            snapTo =
              leftCollision < rightCollision
                ? otherStartFrame - liteItem.effectiveDuration
                : otherEndFrame;
          }
        }
      }
    }

    return {
      hasCollision: minCollision !== Infinity,
      snapTo,
      collisionExtent: minCollision,
    };
  };

  const handleItemDrag = useCallback(
    (
      oldLayerId: LayerId,
      newLayerId: LayerId,
      itemId: string,
      deltaPositionX: number,
      deltaPositionY: number,
    ) => {
      const oldLayer = layers[oldLayerId];
      if (!oldLayer) return;

      const item = oldLayer.liteItems.find(
        (liteItem) => liteItem.id === itemId,
      );
      if (!item) return;

      const isLayerChanged = newLayerId !== oldLayerId;

      const newStartFrame = Math.max(
        0,
        Math.round(deltaPositionX / pixelsPerFrame),
      );

      // don't update if the change is less than 1 frame and the layer is the same
      if (Math.abs(newStartFrame - item.startFrame) < 1 && !isLayerChanged) {
        console.log("no update on any axis");
        return;
      }

      const newEndFrame = newStartFrame + item.effectiveDuration;

      const newLayer = layers[newLayerId]; // if the layer is not changed, this will be the same as oldLayer

      /*       const hasCollision = newLayer.liteItems.some((liteItem) => {
        if (liteItem.id === itemId) return false;
        const otherEndFrame = liteItem.startFrame + liteItem.effectiveDuration;
        return (
          newStartFrame < otherEndFrame && newEndFrame > liteItem.startFrame
        );
      });
 */

      /*       if (hasCollision) {
        console.log("collision detected");
        return;
      }

      console.log("updating item position", {
        oldLayerId,
        newLayerId,
        itemId,
        newStartFrame,
        oldStartFrame: item.startFrame,
      });

      // Only update the store if it's significantly different from the last update
      updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
        startFrame: newStartFrame,
      }); */

      const { hasCollision, snapTo, collisionExtent } = checkCollisionAndSnap(
        newLayer.liteItems,
        itemId,
        newStartFrame,
        newEndFrame,
      );

      if (hasCollision) {
        if (snapTo !== null && collisionExtent <= SNAP_THRESHOLD) {
          // Snap the item
          // console.log("Snapping item", { itemId, snappedStartFrame: snapTo });
          updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
            startFrame: snapTo,
          });
        } else {
          // Collision detected and beyond threshold, prevent the move
          console.log("Collision detected beyond threshold, move prevented");
          return;
        }
      } else {
        // No collision, update normally
        console.log("Updating item position", {
          oldLayerId,
          newLayerId,
          itemId,
          newStartFrame,
          oldStartFrame: item.startFrame,
        });
        updateSequenceItemPositionInLayer(oldLayerId, newLayerId, itemId, {
          startFrame: newStartFrame,
        });
      }
    },
    [layers, pixelsPerFrame, updateSequenceItemPositionInLayer],
  );

  // Use a more aggressive throttle for drag operations
  return useThrottle(handleItemDrag, 50);
};
