import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  CaptionSequenceItemType,
  FullSequenceContentType,
  LayerId,
  LayerType,
  LiteSequenceItemType,
  LiteSequencePresetItemType,
  StoreType,
  TransitionItemType,
  VideoSequenceItemType,
} from "../timeline.types";
import { EMPTY_PROJECT_4 } from "../dummy-project";
import {
  binarySearch,
  calculateItemIndices,
  calculateOffset,
} from "../utils/timeline.utils";
import { toast } from "sonner";
import { genId } from "../utils/misc.utils";
import { updateTokens } from "../utils/captions.utils";

/**
 * Custom hook for managing video store state.
 * @returns {StoreType} The video store state and actions.
 */

const useVideoStore = create<
  StoreType,
  [["zustand/devtools", never], ["zustand/immer", never]]
>(
  devtools(
    immer((set) => ({
      ...EMPTY_PROJECT_4,

      /* ------------------------------ Project level operations  ----------------------------- */
      loadProject: (project) => {
        set(project);
      },

      updateProject: (updates) => {
        set((state: StoreType) => {
          Object.assign(state, updates);
        });
      },

      /* ------------------------------ CRUD operation of Timeline  ----------------------------- */
      addSequenceItemToLayer: (layerId, newSeqLiteItem, contentProps) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Use the binary search utility function
          const insertIndex = binarySearch(
            layer.liteItems,
            newSeqLiteItem.startFrame,
            (item) => item.startFrame,
          );

          // Insert the new item
          layer.liteItems.splice(insertIndex, 0, newSeqLiteItem);

          // Update only the offset of the next lite item
          const nextItem = layer.liteItems[insertIndex + 1];

          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame -
              (newSeqLiteItem.startFrame + newSeqLiteItem.effectiveDuration);
          }

          // entry to sequence items
          // state.props.sequenceItems[newSeqLiteItem.id] = {
          //   // type: contentProps.type,
          //   id: newSeqLiteItem.id,
          //   layerId: layerId,
          //   editableProps: contentProps.editableProps,
          //   animations: contentProps.animations,
          //   type: contentProps.type,
          // };

          if (contentProps.type === "video") {
            state.props.sequenceItems[newSeqLiteItem.id] = {
              id: newSeqLiteItem.id,
              layerId,
              type: "video",
              animations: [],
              totalVideoDurationInFrames:
                contentProps.totalVideoDurationInFrames,
              editableProps: contentProps.editableProps,
            };
          } else if (contentProps.type === "text") {
            state.props.sequenceItems[newSeqLiteItem.id] = {
              id: newSeqLiteItem.id,
              layerId,
              type: "text",
              editableProps: contentProps.editableProps,
            };
          } else if (contentProps.type === "image") {
            state.props.sequenceItems[newSeqLiteItem.id] = {
              id: newSeqLiteItem.id,
              layerId,
              type: "image",
              editableProps: contentProps.editableProps,
            };
          } else if (contentProps.type === "audio") {
            state.props.sequenceItems[newSeqLiteItem.id] = {
              id: newSeqLiteItem.id,
              layerId,
              type: "audio",
              editableProps: contentProps.editableProps,
            };
          }

          console.log(
            `Added sequence item ${newSeqLiteItem.id} to layer ${layerId}`,
          );
        });
      },

      removeSequenceItemFromLayer: (layerId, itemId) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          if (itemIndex === -1) {
            console.warn(
              `Sequence item ${itemId} not found in layer ${layerId}`,
            );
            return;
          }

          // Remove the item
          layer.liteItems.splice(itemIndex, 1);

          // Adjust the offset of the next item if it exists
          if (itemIndex < layer.liteItems.length) {
            const nextItem = layer.liteItems[itemIndex];
            const prevItem =
              itemIndex > 0 ? layer.liteItems[itemIndex - 1] : null;

            nextItem.offset = prevItem
              ? nextItem.startFrame -
                (prevItem.startFrame + prevItem.effectiveDuration)
              : nextItem.startFrame;
          }

          // Remove from detailed items
          if (state.props.sequenceItems[layerId]) {
            delete state.props.sequenceItems[itemId];
          }

          console.info(`Removed sequence item ${itemId} from layer ${layerId}`);
        });
      },

      /*
        case 1 : change position on x axis
        case 2 : change position on y axis
        case 3 : change position on x and y axis
      */
      updateSequenceItemPositionInLayer: (
        oldLayerId,
        newLayerId,
        itemId,
        updates,
      ) => {
        set((state: StoreType) => {
          if (oldLayerId === newLayerId) {
            const layer = state.props.layers[oldLayerId];

            const { oldIndex: pastIdx, futureNewIndex: futureIdx } =
              calculateItemIndices(layer.liteItems, itemId, updates.startFrame);

            const movedItem = layer.liteItems[pastIdx];

            // Create the updated item
            const updatedItem = {
              ...movedItem,
              startFrame: updates.startFrame,
            };

            // If the indices are the same, no need to reorder, just update the item
            if (pastIdx === futureIdx) {
              layer.liteItems[pastIdx] = updatedItem;

              // Update the current item's offset
              updatedItem.offset = calculateOffset(
                layer.liteItems[pastIdx - 1],
                updatedItem,
              );

              // Optionally update the next item's offset if it exists
              const nextItem = layer.liteItems[pastIdx + 1];
              if (nextItem) {
                nextItem.offset = calculateOffset(updatedItem, nextItem);
              }

              /* --------------------------- handle transitions --------------------------- */
              if (updatedItem.transition?.incoming) {
                const prevItem = layer.liteItems[pastIdx - 1];
                if (prevItem) {
                  delete prevItem.transition?.outgoing;
                  prevItem.effectiveDuration = prevItem.sequenceDuration;
                }
                delete updatedItem.transition?.incoming;
                // TODO : adjust the startFrame of the updated item
              }

              if (updatedItem.transition?.outgoing) {
                const nextItem = layer.liteItems[pastIdx + 1];
                if (nextItem) {
                  delete nextItem.transition?.incoming;
                  delete updatedItem.transition?.outgoing;
                  updatedItem.effectiveDuration = updatedItem.sequenceDuration;
                  // TODO : adjust the startFrame of the next item
                  // updatedItem.startFrame = nextItem.startFrame;
                }
              }

              // check if any caption layer is linked, then adjust the position of the item as well
              //@ts-ignore
              adjustLinkedCaptionPosition(updatedItem, state.props);
            } else {
              // "id0" id1 id2 -> id1 "id0" id2
              const nextItemOfPastIdx = layer.liteItems[pastIdx + 1];
              const nextItemOfFutureIdx =
                layer.liteItems[
                  futureIdx > pastIdx ? futureIdx + 1 : futureIdx
                ]; // as before inserting the item, the futureIdx will be the index of the next item

              // Remove the item from its current position
              layer.liteItems.splice(pastIdx, 1);

              // Insert the item at its new position
              layer.liteItems.splice(futureIdx, 0, updatedItem);

              if (nextItemOfPastIdx) {
                nextItemOfPastIdx.offset = calculateOffset(
                  layer.liteItems[pastIdx - 1],
                  nextItemOfPastIdx,
                );
              }

              updatedItem.offset = calculateOffset(
                layer.liteItems[futureIdx - 1],
                updatedItem,
              );

              if (nextItemOfFutureIdx) {
                nextItemOfFutureIdx.offset = calculateOffset(
                  updatedItem,
                  nextItemOfFutureIdx,
                );
              }

              /* --------------------------- handle transitions --------------------------- */
              if (futureIdx > pastIdx) {
                if (updatedItem.transition?.incoming) {
                  const prevItem = layer.liteItems[pastIdx - 1];
                  if (prevItem) {
                    delete prevItem.transition?.outgoing;
                    prevItem.effectiveDuration = prevItem.sequenceDuration;
                  }
                  delete updatedItem.transition?.incoming;
                  // TODO : adjust the startFrame of the updated item
                }

                if (updatedItem.transition?.outgoing) {
                  const nextItem = layer.liteItems[pastIdx];
                  if (nextItem) {
                    delete nextItem.transition?.incoming;
                    delete updatedItem.transition?.outgoing;
                    updatedItem.effectiveDuration =
                      updatedItem.sequenceDuration;
                    // TODO : adjust the startFrame of the next item
                    // updatedItem.startFrame = nextItem.startFrame;
                  }
                }
              } else {
                if (updatedItem.transition?.incoming) {
                  const prevItem = layer.liteItems[pastIdx];
                  if (prevItem) {
                    delete prevItem.transition?.outgoing;
                    prevItem.effectiveDuration = prevItem.sequenceDuration;
                  }
                  delete updatedItem.transition?.incoming;
                  // TODO : adjust the startFrame of the updated item
                }
                if (updatedItem.transition?.outgoing) {
                  const nextItem = layer.liteItems[pastIdx + 1];
                  if (nextItem) {
                    delete nextItem.transition?.incoming;
                    delete updatedItem.transition?.outgoing;
                    updatedItem.effectiveDuration =
                      updatedItem.sequenceDuration;
                    // TODO : adjust the startFrame of the next item
                    // updatedItem.startFrame = nextItem.startFrame;
                  }
                }
              }

              // check if any caption layer is linked, then adjust the position of the item as well
              //@ts-ignore : FIX THIS
              adjustLinkedCaptionPosition(updatedItem, state.props);
            }

            // handle transitions
            // if (updatedItem.transition?.incoming) {
            //   const pastPrevItem = layer.liteItems[];
            //   if (prevItem) {
            //     delete prevItem.transition?.outgoing;
            //     prevItem.effectiveDuration = prevItem.sequenceDuration;
            //   }
            //   delete updatedItem.transition?.incoming;
            // }

            console.log(
              `Updated sequence item ${itemId} in layer ${oldLayerId}`,
            );
          } else {
            // ! THIS PART IS NOT REFACTORED
            // CASE 2 : Change position on y axis
            // NEED TO REFACTOR this. we need to make functions more modular, as changing layer means, insert in new layer and remove from old layer
            // Get references to the old and new layers
            const oldLayer = state.props.layers[oldLayerId];
            const newLayer = state.props.layers[newLayerId];

            // Find the item's current index in the old layer
            const itemIndexInOldLayer = oldLayer.liteItems.findIndex(
              (item) => item.id === itemId,
            );

            // Get the item that's being moved
            const movedItem = oldLayer.liteItems[itemIndexInOldLayer];

            // If the item hasn't moved and the layer hasn't changed, do nothing
            if (
              updates.startFrame === movedItem.startFrame &&
              oldLayerId === newLayerId
            ) {
              return;
            }

            // Create the updated item with the new start frame
            const updatedItem = {
              ...movedItem,
              startFrame: updates.startFrame,
            };

            // Find the new index for the item in the new layer

            const insertIndex = binarySearch(
              newLayer.liteItems,
              updatedItem.startFrame,
              (item) => item.startFrame,
            );

            const newOffset = calculateOffset(
              newLayer.liteItems[insertIndex - 1],
              updatedItem,
            );

            updatedItem.offset = newOffset;

            // Insert the item at its new position in the new layer
            newLayer.liteItems.splice(insertIndex, 0, updatedItem);
            // Update only the offset of the next lite item
            const nextItem = newLayer.liteItems[insertIndex + 1];
            if (nextItem) {
              nextItem.offset =
                nextItem.startFrame -
                (updatedItem.startFrame + updatedItem.effectiveDuration);
            }

            // HANDLE OPERATIONS OF OLD LAYER

            // Remove the item from the old layer
            oldLayer.liteItems.splice(itemIndexInOldLayer, 1);

            // Adjust the offset of the next item if it exists
            if (itemIndexInOldLayer < oldLayer.liteItems.length) {
              const nextItem = oldLayer.liteItems[itemIndexInOldLayer];
              const prevItem =
                itemIndexInOldLayer > 0
                  ? oldLayer.liteItems[itemIndexInOldLayer - 1]
                  : null;

              nextItem.offset = prevItem
                ? nextItem.startFrame -
                  (prevItem.startFrame + prevItem.effectiveDuration)
                : nextItem.startFrame;
            }

            // TODO : Handle transitions, there are bugs I noticed xD
            if (updatedItem.transition?.incoming) {
              const prevItem = oldLayer.liteItems[insertIndex - 1];
              if (prevItem) {
                delete prevItem.transition?.outgoing;
                prevItem.effectiveDuration = prevItem.sequenceDuration;
              }
              delete updatedItem.transition?.incoming;
            }

            if (updatedItem.transition?.outgoing) {
              const nextItem = oldLayer.liteItems[insertIndex + 1];
              if (nextItem) {
                delete nextItem.transition?.incoming;
                delete updatedItem.transition?.outgoing;
                updatedItem.effectiveDuration = updatedItem.sequenceDuration;
              }
            }

            // check if any caption layer is linked, then adjust the position of the item as well
            //@ts-ignore : FIX THIS
            adjustLinkedCaptionPosition(updatedItem, state.props);

            console.log(
              `Updated sequence item ${itemId} from layer ${oldLayerId} to ${newLayerId}`,
            );
          }
        });
      },

      /* ------------------------------ Update operation of Transitions  ----------------------------- */
      updateTextEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[itemId];
          if (!item || item.type !== "text") {
            console.warn(`Text item ${itemId} not found in layer ${layerId}`);
            return;
          }

          item.editableProps = {
            ...item.editableProps,
            ...updates,
          };
        });
      },

      updateImageEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[itemId];
          if (!item || item.type !== "image") {
            console.warn(`Image item ${itemId} not found in layer ${layerId}`);
            return;
          }

          item.editableProps = {
            ...item.editableProps,
            ...updates,
          };
        });
      },

      updateAudioEditableProps: (layerId, itemId, updates) => {
        set((state: StoreType) => {
          const item = state.props.sequenceItems[itemId];
          if (!item) {
            console.warn(`Audio item ${itemId} not found in layer ${layerId}`);
            return;
          }
          // TODO : handle this later
        });
      },

      updateVideoEditableProps: (layerId, itemId, updates) => {},

      /**
       * Frame Delta Scenarios:
       *
       * Left Resize (direction === "left"):
       * - Positive frameDelta: Expanding to the left
       *   The item's left edge moves earlier in time (to the left).
       *   Example: frameDelta = 10, item starts 10 frames earlier, duration increases by 10.
       *
       * - Negative frameDelta: Shrinking from the left
       *   The item's left edge moves later in time (to the right).
       *   Example: frameDelta = -10, item starts 10 frames later, duration decreases by 10.
       *
       * Right Resize (direction === "right"):
       * - Positive frameDelta: Expanding to the right
       *   The item's right edge moves later in time (to the right).
       *   Example: frameDelta = 10, duration increases by 10, end frame is 10 frames later.
       *
       * - Negative frameDelta: Shrinking from the right
       *   The item's right edge moves earlier in time (to the left).
       *   Example: frameDelta = -10, duration decreases by 10, end frame is 10 frames earlier.
       *
       * Note: The frameDelta value has already been validated and adjusted for snapping
       * in the useSeqItemResizeValidation hook before reaching this function.
       */
      updateSequenceItemDuration: (layerId, itemId, frameDelta, direction) => {
        set((state) => {
          const layer = state.props.layers[layerId];
          if (!layer) return; // Exit if layer not found

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );
          if (itemIndex === -1) return; // Exit if item not found

          const updatedItem = layer.liteItems[itemIndex];
          const nextItem = layer.liteItems[itemIndex + 1];

          if (
            direction === "left" &&
            updatedItem.sequenceType === "standalone" &&
            updatedItem.contentType === "video"
          ) {
            const videoItem = state.props.sequenceItems[
              itemId
            ] as VideoSequenceItemType;
            console.log(
              "videoItem.editableProps.videoStartsFromInFrames - frameDelta",
              frameDelta,
              videoItem.editableProps.videoStartsFromInFrames,
              videoItem.editableProps.videoStartsFromInFrames - frameDelta,
            );

            // check if the video starts from 0, then we can't move it to left
            // Preventing negative startFrame value for video. Error: Sorry about this! An error occurred: startFrom must be greater than equal to 0 instead got -91.
            if (
              videoItem.editableProps.videoStartsFromInFrames - frameDelta <
              0
            ) {
              toast.error(
                "Hey , you can't move the video to the left, as it will start from negative frames",
              );
              return;
            }
          }

          // Update startFrame and duration
          if (direction === "left") {
            updatedItem.startFrame -= frameDelta;
            updatedItem.offset -= frameDelta;
            updatedItem.effectiveDuration += frameDelta;
            updatedItem.sequenceDuration += frameDelta;
          } else {
            // direction === "right"
            updatedItem.effectiveDuration += frameDelta;
            updatedItem.sequenceDuration += frameDelta;
          }

          // Handle video specific updates
          if (
            updatedItem.sequenceType === "standalone" &&
            updatedItem.contentType === "video"
          ) {
            const videoItem = state.props.sequenceItems[
              itemId
            ] as VideoSequenceItemType;

            if (direction === "left") {
              videoItem.editableProps.videoStartsFromInFrames -= frameDelta;
            } else {
              // direction === "right"
              videoItem.editableProps.videoEndsAtInFrames += frameDelta;
            }
          }

          // Update the next item's offset if it exists
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame -
              (updatedItem.startFrame + updatedItem.effectiveDuration);
          }

          if (
            updatedItem.sequenceType === "standalone" &&
            (updatedItem.contentType === "video" ||
              updatedItem.contentType === "audio")
          ) {
            const linkedCaptionId = updatedItem.linkedCaptionId;
            const linkedCaptionLayerId = updatedItem.linkedCaptionLayerId;
            if (!linkedCaptionId || !linkedCaptionLayerId) return;
            const linkedCaptionLayer = state.props.layers[linkedCaptionLayerId];
            if (!linkedCaptionLayer) return;
            const linkedCaptionItemIndex =
              linkedCaptionLayer.liteItems.findIndex(
                (item) => item.id === linkedCaptionId,
              );
            if (linkedCaptionItemIndex === -1) return;
            const linkedCaptionItem =
              linkedCaptionLayer.liteItems[linkedCaptionItemIndex];
            linkedCaptionItem.startFrame = updatedItem.startFrame;
            linkedCaptionItem.offset = updatedItem.offset;
            linkedCaptionItem.sequenceDuration = updatedItem.sequenceDuration;
            linkedCaptionItem.effectiveDuration = updatedItem.effectiveDuration;
          }
          // update the linked caption item's duration and startFrame,offset

          console.log(`Updated item ${itemId} in layer ${layerId}:`);
        });
      },

      /* ------------------------------ CRUD operation of Transitions  ----------------------------- */
      updateTransitionInLayer: (layerId, transition, updates) => {},

      removeTransitionFromLayer: (layerId, transitionId) => {},

      addTransitionToLayer: (
        layerId: LayerId,
        itemId: string,
        position: "incoming" | "outgoing",
      ) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          if (itemIndex === -1) {
            console.warn(`Item ${itemId} not found in layer ${layerId}`);
            return;
          }

          const newTransitionId = `t-${Date.now()}`;
          const transitionDuration = 30; // Total transition duration
          const defaultTransition: Omit<
            TransitionItemType,
            "fromSequenceIndex"
          > = {
            id: newTransitionId,
            type: "wipe",
            duration: transitionDuration,
            properties: {
              easing: "linear",
            },
            fromSequenceId: "",
            toSequenceId: "",
          };

          // TODO : This if else block can be removed, we can use the upcoming loop for that.
          if (position === "incoming") {
            if (itemIndex > 0) {
              const prevItem = layer.liteItems[itemIndex - 1];
              const currentItem = layer.liteItems[itemIndex];
              if (!prevItem.transition) {
                prevItem.transition = {};
              }
              if (!currentItem.transition) {
                currentItem.transition = {};
              }
              prevItem.transition.outgoing = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              currentItem.transition.incoming = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              // Adjust startFrame of the current item by full transition duration
              currentItem.startFrame -= transitionDuration;

              defaultTransition.fromSequenceId = prevItem.id;
              defaultTransition.toSequenceId = itemId;

              // Update effective duration of previous item
              prevItem.effectiveDuration =
                prevItem.sequenceDuration - transitionDuration;
            }
          } else if (position === "outgoing") {
            if (itemIndex < layer.liteItems.length - 1) {
              const currentItem = layer.liteItems[itemIndex];
              const nextItem = layer.liteItems[itemIndex + 1];

              if (!currentItem.transition) {
                currentItem.transition = {};
              }
              if (!nextItem.transition) {
                nextItem.transition = {};
              }
              currentItem.transition.outgoing = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              nextItem.transition.incoming = {
                id: newTransitionId,
                duration: transitionDuration / 2,
              };

              // Adjust startFrame of the next item by full transition duration
              nextItem.startFrame -= transitionDuration;

              defaultTransition.fromSequenceId = itemId;
              defaultTransition.toSequenceId = nextItem.id;

              // Update effective duration of current item
              currentItem.effectiveDuration =
                currentItem.sequenceDuration - transitionDuration;
            }
          }

          // Propagate startFrame changes to all subsequent items
          if (transitionDuration > 0) {
            const startIndex =
              position === "incoming" ? itemIndex + 1 : itemIndex + 2; // from the next element, TODO : I think this step can be improved , as we are already upadting one adjacent element in the prev step, and that step can be removed.
            for (let i = startIndex; i < layer.liteItems.length; i++) {
              layer.liteItems[i].startFrame -= transitionDuration;
            }
          }

          // TODO : check if we need to fix it
          // if (!state.props.transitions[layerId]) {
          //   state.props.transitions[layerId] = {};
          // }

          // TODO : uncomment and fix the error
          /*      state.props.transitions[layerId][newTransitionId] = {
            ...defaultTransition,
            fromSequenceIndex:
              position === "outgoing" ? itemIndex : itemIndex - 1,
          }; */

          console.log(
            `Added ${position} transition ${newTransitionId} to item ${itemId} in layer ${layerId}`,
          );
        });
      },

      addPresetToLayer: (layerId, itemPosition, presetDetails) => {
        set((state: StoreType) => {
          const newItemId = genId("p", "preset");

          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Use the binary search utility function
          const insertIndex = binarySearch(
            layer.liteItems,
            itemPosition.startFrame,
            (item) => item.startFrame,
          );

          const {
            sequenceItems: presetSequenceItems,
            name,
            ...liteItemDetails
          } = presetDetails;

          const presetItem: LiteSequencePresetItemType = {
            ...liteItemDetails,
            startFrame: itemPosition.startFrame,
            offset: itemPosition.offset,
            id: newItemId,
            sequenceType: "preset",
          };

          // Insert the new item
          layer.liteItems.splice(insertIndex, 0, presetItem);

          // Update only the offset of the next lite item
          const nextItem = layer.liteItems[insertIndex + 1];
          if (nextItem) {
            nextItem.offset =
              nextItem.startFrame -
              (presetItem.startFrame + presetItem.effectiveDuration);
          }

          // Get default props based on content type

          // spread the presetItem.sequenceItems to the sequenceItems
          // Object.entries(presetSequenceItems).forEach(([itemId, item]) => {
          //   state.props.sequenceItems[itemId] = {
          //     ...item,
          //     layerId,
          //   };
          // });

          state.props.sequenceItems[newItemId] = {
            type: "preset",
            id: newItemId,
            layerId,
            presetId: presetDetails.presetId,
            sequenceItems: presetSequenceItems,
            editableProps: {
              positionAndDimensions: {
                top: 0,
                left: 0,
                width: 720,
                height: 1080,
              },
            },
          };

          console.log(`Added ${presetDetails} preset to layer ${layerId}`);
        });
      },

      addLayer: (data) => {
        const newLayerId = genId("l");
        set((state) => {
          const newLayer: LayerType = {
            id: newLayerId,
            name: `Layer ${state.props.layerOrder.length + 1}`,
            liteItems: [],
            isVisible: true,
            layerType: "normal",
          };

          let newLayerOrder = [...state.props.layerOrder];

          switch (data.position) {
            case "AT_TOP":
              newLayerOrder.unshift(newLayerId);
              break;
            case "ABOVE_CURRENT":
              const aboveIndex = newLayerOrder.indexOf(data.currentLayerId);
              if (aboveIndex !== -1) {
                newLayerOrder.splice(aboveIndex, 0, newLayerId);
              } else {
                newLayerOrder.unshift(newLayerId);
              }
              break;
            case "BELOW_CURRENT":
              const belowIndex = newLayerOrder.indexOf(data.currentLayerId);
              if (belowIndex !== -1) {
                newLayerOrder.splice(belowIndex + 1, 0, newLayerId);
              } else {
                newLayerOrder.push(newLayerId);
              }
              break;
            case "AT_BOTTOM":
            default:
              newLayerOrder.push(newLayerId);
              break;
          }

          return {
            props: {
              ...state.props,
              layers: {
                ...state.props.layers,
                [newLayerId]: newLayer,
              },
              layerOrder: newLayerOrder,
            },
          };
        });
      },

      removeLayer: (layerId: string) => {
        set((state) => {
          const { [layerId]: removedLayer, ...remainingLayers } =
            state.props.layers;
          const { [layerId]: removedSequenceItems, ...remainingSequenceItems } =
            state.props.sequenceItems;
          console.log(
            { removedLayer },
            state.props.layerOrder.filter((id) => id !== layerId),
          );

          return {
            props: {
              ...state.props,
              layers: remainingLayers,
              layerOrder: state.props.layerOrder.filter((id) => id !== layerId),
              sequenceItems: remainingSequenceItems,
            },
          };
        });
      },

      reorderLayers: (newOrder: string[]) => {
        set((state) => ({
          props: {
            ...state.props,
            layerOrder: newOrder,
          },
        }));
      },

      // updateLayerMetaData(layerId, updates) {
      //   set((state) => {
      //     const layer = state.props.layers[layerId];
      //     if (!layer) {
      //       console.warn(`Layer ${layerId} not found`);
      //       return;
      //     }

      //     layer.name = updates.name;
      //   });
      // },

      updateLayerMetadata: (layerId, updates) => {
        set((state) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return state; // Return the unchanged state if the layer is not found
          }

          // Create a new layers object with the updated layer
          const updatedLayers = {
            ...state.props.layers,
            [layerId]: {
              ...layer,
              ...updates,
            },
          };

          // Return the new state with the updated layers
          return {
            props: {
              ...state.props,
              layers: updatedLayers,
            },
          };
        });
      },

      // TODO : there is a a bug: split on item into two, delete the prev one, then resize from left and expand it. you will notice the video gets shifted.
      splitSequenceItem: (layerId, itemId, splitAtInFramesTimeline) => {
        set((state) => {
          // console.log("splitSequenceItem: Splitting sequence item", {
          //   splitAtInFramesTimeline,
          // });

          const layer = state.props.layers[layerId];

          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === itemId,
          );

          const originalLiteItem = layer.liteItems[itemIndex];

          const splitAtInLiteItem =
            splitAtInFramesTimeline - originalLiteItem.startFrame;
          console.log({
            splitAtInFramesTimeline,
            splitAtInLiteItem,
          });

          const originalItemDuration = originalLiteItem.sequenceDuration; // TODO : need to check if it's effective or sequence duration

          originalLiteItem.effectiveDuration = splitAtInLiteItem;
          originalLiteItem.sequenceDuration = splitAtInLiteItem;

          // -------- new lite item ops -------

          // @ts-ignore
          const newItemId = genId("s", originalLiteItem.contentType);

          const newItem: LiteSequenceItemType = {
            ...originalLiteItem,
            id: newItemId,
            startFrame: splitAtInFramesTimeline,
            offset: 0,
            sequenceDuration: originalItemDuration - splitAtInLiteItem,
            effectiveDuration: originalItemDuration - splitAtInLiteItem,
          };

          layer.liteItems.splice(itemIndex + 1, 0, newItem);

          const originalSequenceItem = state.props.sequenceItems[itemId];

          // duplicate the item in sequenceItems
          state.props.sequenceItems[newItemId] = {
            ...originalSequenceItem,
            id: newItemId,
          };

          if (
            originalLiteItem.sequenceType === "standalone" &&
            originalLiteItem.contentType === "video"
          ) {
            const tempOriginalVideoEndsAt = (
              originalSequenceItem as VideoSequenceItemType
            ).editableProps.videoEndsAtInFrames;
            const tempOriginalStartsAt = (
              originalSequenceItem as VideoSequenceItemType
            ).editableProps.videoStartsFromInFrames;

            console.log("tempOriginalVideoEndsAt : ", tempOriginalVideoEndsAt);

            (
              state.props.sequenceItems[itemId] as VideoSequenceItemType
            ).editableProps.videoEndsAtInFrames =
              tempOriginalStartsAt + splitAtInLiteItem;

            console.log(
              "UPDATED : original starts at ",
              (state.props.sequenceItems[itemId] as VideoSequenceItemType)
                .editableProps.videoStartsFromInFrames,
            );

            console.log(
              "UPDATED : original ends at ",
              (state.props.sequenceItems[itemId] as VideoSequenceItemType)
                .editableProps.videoEndsAtInFrames,
            );

            state.props.sequenceItems[newItemId] = {
              ...originalSequenceItem,
              id: newItemId,
              editableProps: {
                ...(state.props.sequenceItems[itemId] as VideoSequenceItemType)
                  .editableProps,
                videoStartsFromInFrames:
                  tempOriginalStartsAt + splitAtInLiteItem,
                videoEndsAtInFrames: tempOriginalVideoEndsAt,
              },
            } as VideoSequenceItemType;
            console.log("UPDATED : new Item starts at ", splitAtInLiteItem);
            console.log("UPDATED : new Item ends at ", tempOriginalVideoEndsAt);
          }

          console.log(`Split sequence item ${itemId} in layer ${layerId}`, {
            newItem,
          });
        });
      },

      linkCaptionToMedia: (
        layerId,
        sequenceId,
        captionLayerPayload = { captions: [] },
      ) => {
        set((state: StoreType) => {
          const layer = state.props.layers[layerId];
          if (!layer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Find the sequence item
          const itemIndex = layer.liteItems.findIndex(
            (item) => item.id === sequenceId,
          );
          if (itemIndex === -1) {
            console.warn(
              `Sequence item ${sequenceId} not found in layer ${layerId}`,
            );
            return;
          }

          const item = layer.liteItems[itemIndex];

          // Check if it's a video or audio item
          if (
            item.sequenceType === "standalone" &&
            (item.contentType === "video" || item.contentType === "audio")
          ) {
            // Generate a unique caption layer ID
            const captionLayerId = `caption-${sequenceId}-${Date.now()}`;

            // Create a new caption layer
            const newCaptionLayer: LayerType = {
              id: captionLayerId,
              name: `Captions for ${sequenceId}`,
              isVisible: true,
              liteItems: [],
              layerType: "caption",
            };

            // Add the caption layer to state
            state.props.layers[captionLayerId] = newCaptionLayer;

            // Add the caption layer to the layer order

            let newLayerOrder = [...state.props.layerOrder];
            newLayerOrder.unshift(captionLayerId);

            // Update the media item with the caption layer reference
            item.linkedCaptionLayerId = captionLayerId;

            console.log(
              `Linked caption layer ${captionLayerId} to media item ${sequenceId}`,
            );
          } else {
            console.warn(`Item ${sequenceId} is not a video or audio item`);
          }
        });
      },

      updatePositionAndDimensions: (layerId, itemId, updates) => {
        set((state) => {
          const item = state.props.sequenceItems[
            itemId
          ] as FullSequenceContentType;
          if (!item) {
            console.warn(`Item ${itemId} not found in layer ${layerId}`);
            return;
          }

          // if there is no change in the position and dimensions, then return
          if (
            updates?.top === item.editableProps.positionAndDimensions?.top &&
            updates?.left === item.editableProps.positionAndDimensions?.left &&
            updates?.width ===
              item.editableProps.positionAndDimensions?.width &&
            updates?.height === item.editableProps.positionAndDimensions?.height
          ) {
            console.log("No change in position and dimensions");

            return;
          }

          item.editableProps = {
            ...item.editableProps,
            positionAndDimensions: {
              ...item.editableProps.positionAndDimensions!,
              ...updates!,
            },
          };

          console.log(
            `Updated position and dimensions for item ${itemId} in layer ${layerId}:`,
          );
        });
      },

      updateCaptionText: (
        layerId: string,
        captionSequenceId: string,
        captionPageSequenceId: string,
        newText: string,
      ) => {
        set((state) => {
          console.log({ newText });

          const item = (
            state.props.sequenceItems[
              captionSequenceId
            ] as CaptionSequenceItemType
          )?.sequenceItems[captionPageSequenceId];

          if (!item || item.type !== "caption-page") {
            console.warn(
              `caption-page item ${captionSequenceId} not found in layer ${layerId}`,
            );
            return;
          }

          // Update text and recalculate tokens
          const updatedTokens = updateTokens(item.editableProps, newText);

          item.editableProps.text = newText;
          item.editableProps.tokens = updatedTokens;
        });
      },

      addFreshCaptionsToMedia: (
        linkedMediaLayerId,
        mediaId,
        newCaptionLayerId,
        { liteItems, sequenceItems },
      ) => {
        set((state) => {
          const mediaLayer = state.props.layers[linkedMediaLayerId];
          if (!mediaLayer) {
            console.warn(`Layer ${linkedMediaLayerId} not found`);
            return;
          }

          // Find the lite item
          const mediaItemIndex = mediaLayer.liteItems.findIndex(
            (item) => item.id === mediaId,
          );
          if (mediaItemIndex === -1) {
            console.warn(
              `Media item ${mediaId} not found in layer ${linkedMediaLayerId}`,
            );
            return;
          }

          const mediaItem = mediaLayer.liteItems[mediaItemIndex];

          const captionId = `caption-${mediaId}-${Date.now()}`;
          const newCaptionLayer: LayerType = {
            id: newCaptionLayerId,
            name: `Captions for ${mediaId}`,
            isVisible: true,
            liteItems: [
              {
                sequenceType: "caption",
                offset: mediaItem.offset,
                startFrame: mediaItem.startFrame,
                sequenceDuration: mediaItem.sequenceDuration,
                effectiveDuration: mediaItem.effectiveDuration,
                liteItems: liteItems,
                id: captionId,
              },
            ],
            layerType: "caption",
          };

          // Add the caption layer to state
          state.props.layers[newCaptionLayerId] = newCaptionLayer;

          // Add the caption layer to the layer order
          state.props.layerOrder.unshift(newCaptionLayerId);

          // Update the media lite-item item with the caption layer reference
          // find the mediaId using the mediaLayerId and link it

          // Check if it's a video or audio item
          if (
            mediaItem.sequenceType === "standalone" &&
            (mediaItem.contentType === "video" ||
              mediaItem.contentType === "audio")
          ) {
            // Update the media item with the caption layer reference
            mediaItem.linkedCaptionLayerId = newCaptionLayerId;
            mediaItem.linkedCaptionId = captionId;
          } else {
            console.warn(`Item ${mediaId} is not a video or audio item`);
          }

          // add sequenceItems to the state

          state.props.sequenceItems[captionId] = {
            type: "caption",
            id: captionId,
            layerId: newCaptionLayerId,
            sequenceItems,
            editableProps: {
              styles: {
                container: {
                  justifyContent: "center",
                  alignItems: "center",
                },
                element: {},
              },
              positionAndDimensions: {
                top: 300,
                left: 0,
                width: 720,
                height: 1080,
              },
            },
          };

          console.log(
            `Added caption layer ${newCaptionLayerId} to media item ${mediaId}`,
          );
        });
      },
      addTextBehindImageOps: (
        layerId,
        originalImageId,
        removedBackgroundLocalImageUrl,
      ) => {
        // we need to find the image data by it's id , duplicate all it's props from liteItems and sequenceItems and create a new Layer with the same data and add it to the layerOrder

        set((state) => {
          const imageLayer = state.props.layers[layerId];
          if (!imageLayer) {
            console.warn(`Layer ${layerId} not found`);
            return;
          }

          // Find the lite item
          const imageItemIndex = imageLayer.liteItems.findIndex(
            (item) => item.id === originalImageId,
          );
          if (imageItemIndex === -1) {
            console.warn(
              `Image item ${originalImageId} not found in layer ${layerId}`,
            );
            return;
          }

          const imageItem = imageLayer.liteItems[imageItemIndex];
          const newTextLayerId = genId("l");
          const newTextId = genId("s", "text");
          const newImageLayerId = genId("l");
          const newImageId = genId("s", "image");
          const newTextLayer: LayerType = {
            id: newTextLayerId,
            name: `Text for ${originalImageId}`,
            isVisible: true,
            liteItems: [
              {
                sequenceType: "standalone",
                offset: imageItem.offset,
                startFrame: imageItem.startFrame,
                sequenceDuration: imageItem.sequenceDuration,
                effectiveDuration: imageItem.effectiveDuration,
                id: newTextId,
                contentType: "text",
              },
            ],
            layerType: "normal",
          };

          const newImageLayer: LayerType = {
            id: newImageLayerId,
            name: `Text for ${originalImageId}`,
            isVisible: true,
            liteItems: [
              {
                sequenceType: "standalone",
                offset: imageItem.offset,
                startFrame: imageItem.startFrame,
                sequenceDuration: imageItem.sequenceDuration,
                effectiveDuration: imageItem.effectiveDuration,
                id: newImageId,
                contentType: "image",
              },
            ],
            layerType: "normal",
          };

          // Add the caption layer to state
          state.props.layers[newTextLayerId] = newTextLayer;
          state.props.layers[newImageLayerId] = newImageLayer;

          // Add the caption layer to the layer order
          state.props.layerOrder.unshift(newTextLayerId);
          state.props.layerOrder.unshift(newImageLayerId);

          // Update the media lite-item item with the caption layer reference
          // find the mediaId using the mediaLayerId and link it

          // add sequenceItems to the state

          state.props.sequenceItems[newTextId] = {
            type: "text",
            id: newTextId,
            layerId: newTextLayerId,
            editableProps: {
              styles: {
                container: {
                  justifyContent: "center",
                  alignItems: "center",
                },
                element: {},
              },
              text: "Hello World",
            },
          };
          state.props.sequenceItems[newImageId] = {
            type: "image",
            id: newImageId,
            layerId: newTextLayerId,
            editableProps: {
              styles: {
                container: {
                  justifyContent: "center",
                  alignItems: "center",
                },
                element: {},
              },
              imageUrl: removedBackgroundLocalImageUrl,
            },
          };
        });
      },
    })),

    {
      name: "VideoStore",
    },
  ),
);

export default useVideoStore;

interface UpdatedItem {
  sequenceType: string;
  contentType: string;
  linkedCaptionId?: string;
  linkedCaptionLayerId?: string;
  startFrame: number;
  offset: number;
}

function adjustLinkedCaptionPosition(
  updatedItem: UpdatedItem,
  stateProps: StoreType["props"],
): void {
  if (
    updatedItem.sequenceType === "standalone" &&
    (updatedItem.contentType === "video" || updatedItem.contentType === "audio")
  ) {
    const linkedCaptionId = updatedItem.linkedCaptionId;
    const linkedCaptionLayerId = updatedItem.linkedCaptionLayerId;
    if (!linkedCaptionId || !linkedCaptionLayerId) return;
    const linkedCaptionLayer = stateProps.layers[linkedCaptionLayerId];
    if (!linkedCaptionLayer) return;
    const linkedCaptionItemIndex = linkedCaptionLayer.liteItems.findIndex(
      (item) => item.id === linkedCaptionId,
    );
    if (linkedCaptionItemIndex === -1) return;
    const linkedCaptionItem =
      linkedCaptionLayer.liteItems[linkedCaptionItemIndex];
    linkedCaptionItem.startFrame = updatedItem.startFrame;
    linkedCaptionItem.offset = updatedItem.offset;
  }
}
