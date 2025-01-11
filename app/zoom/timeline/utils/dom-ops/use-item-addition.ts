import { getVideoMetadata } from "@remotion/media-utils";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ContentType, LayerId } from "../../timeline.types";
import { useEditingStore } from "../../store/editing.store";
import useVideoStore from "../../store/video.store";
import { useTimeline } from "../../video-timeline-context";
import { genId } from "../misc.utils";
import { calculatePlaceholderDuration } from "../timeline.utils";
import { toast } from "sonner";
import { TIMELINE } from "../../timeline.const";
import useThrottle from "../../hooks/use-throttle";

const { MAX_PLACEHOLDER_FRAMES: MAX_PLACEHOLDER_DURATION_IN_FRAMES } = TIMELINE;

export interface HoverInfo {
  layerId: LayerId;
  startFrame: number;
  durationInFrames: number;
  offsetFrames: number;
  startX: number;
  width: number;
}

export function useSequenceAddition(layerId: LayerId, pixelsPerFrame: number) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const lastHoverInfoRef = useRef<HoverInfo | null>(null); // since , onclick or other events, hoverInfo may be reset to null, so we need to store the last hoverInfo

  const selectedNewItemType = useEditingStore(
    (state) => state.selectedContentType,
  );

  const { draggingLayerId, handleTimeLayerClick } = useTimeline();

  const validateAndAddItem = useNewItemValidation();

  const liteItems = useVideoStore(
    (state) => state.props.layers[layerId]?.liteItems,
  );

  const duration = useVideoStore(
    (state) => state.props.compositionMetaData.duration,
  );

  const handleBgLayerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingLayerId !== null && draggingLayerId !== layerId) return;

      const rect = e.currentTarget?.getBoundingClientRect();
      if (!rect) {
        console.error("Bounding rect not found");
        return;
      }
      const x = e.clientX - rect.left;

      const startFrame = Math.floor(x / pixelsPerFrame);

      const placeholderInfo = calculatePlaceholderDuration(
        liteItems,
        startFrame,
        duration,
        MAX_PLACEHOLDER_DURATION_IN_FRAMES,
      );

      const newHoverInfo = {
        layerId,
        startFrame: placeholderInfo.adjustedStartFrame,
        durationInFrames: placeholderInfo.duration,
        offsetFrames: placeholderInfo.offsetFrames,
        startX: placeholderInfo.adjustedStartFrame * pixelsPerFrame,
        width: placeholderInfo.duration * pixelsPerFrame,
      };
      setHoverInfo(newHoverInfo);
      lastHoverInfoRef.current = newHoverInfo;
    },
    [liteItems, layerId, duration, pixelsPerFrame, draggingLayerId],
  );

  const throttledHandleBgLayerMouseMove = useThrottle(
    handleBgLayerMouseMove,
    20,
  );

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const handleAddNewItem = useCallback(
    async (
      e: React.MouseEvent<HTMLDivElement>,
      selectedContentType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetId: string;
          },
    ) => {
      if (!lastHoverInfoRef.current) {
        console.error("hoverInfo is null, cannot add new item");
        return;
      }

      const {
        startFrame: adjustedStartFrame,
        durationInFrames: placeholderDuration,
        offsetFrames,
      } = lastHoverInfoRef.current;

      if (selectedContentType.sequenceType === "standalone") {
        const contentType =
          selectedContentType.contentType || selectedNewItemType; //selectedContentType.contentType may come from context menu
        validateAndAddItem({
          layerId,
          duration: placeholderDuration,
          startFrame: adjustedStartFrame,
          offset: offsetFrames,
          selectedContentType: {
            sequenceType: "standalone",
            contentType,
          },
        });
      } else {
        validateAndAddItem({
          layerId,
          duration: placeholderDuration,
          startFrame: adjustedStartFrame,
          offset: offsetFrames,
          selectedContentType: {
            sequenceType: "preset",
            presetId: selectedContentType.presetId,
          },
        });
      }
      handleTimeLayerClick(e); // so that the playhead moves to the newly added item
    },
    [layerId, selectedNewItemType, handleTimeLayerClick, validateAndAddItem],
  );

  const mouseEventHandlers = useMemo(
    () => ({
      onMouseMove: throttledHandleBgLayerMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleAddNewItem,
    }),
    [throttledHandleBgLayerMouseMove, handleMouseLeave, handleAddNewItem],
  );

  return {
    hoverInfo,
    mouseEventHandlers,
    handleAddNewItem,
  };
}

export const useNewItemValidation = () => {
  const addSequenceItemToLayer = useVideoStore(
    (state) => state.addSequenceItemToLayer,
  );
  const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);
  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);

  // const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);
  const VIDEO_URL =
    "https://video-editor-user-upload-assets.s3.ap-south-1.amazonaws.com/saul%20cropped.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRzBFAiBy3AR1pD8asFuyH%2BxmHlslJEdB4hcCl%2BQi8zWoTy1aPwIhAKwqz3CvR0yn6dHcVduyv314w4aNSXSt9lKMkaFmiy16KssDCC8QABoMMDU4MjY0MjUyMzcxIgz9GIpakb0q1dwcHD4qqAPRPBkQuCyVWtnlSundPCS5QeUq72V5WNFsP%2FnB2pIsi9w5vok1MtVq%2Bo6tvGIZHJ2zGBLUkRxqgLERpZbXEw9erb1550sQ23pOS%2B6p9T%2FBJGzKSdQTz2wmvcniM8p6ZVgZBEMb1vlfTsppMU09IPMVVT3rywuLxxHxBTuywlpWG%2FofyiUkLlZwVw2DWOfpTF0qsx6v%2BIo8LBIjoXxg57vJXobnjIJfYPoqp6mBJFyWOu5pDyC1eK8efU2ueED2ZKg7z91nMDP503XqOpm4p3EGSYjruVTWnhfQT%2FeLXszVeq%2BHk2F1aO052AmRd%2FbDvcw9LFFLtWSUwdiMpVcGW8OLK%2B%2F6NcPZ5BHuQpA2ZCawTUNxEfZslrV75ccLKONbsio8%2F%2BrVjlZKzQmZoKHqodxhXeATFwHRAJkAss6Xicx0tYruxo0wwd9mR3%2BBGziQKtIG4c9i8JOdIWsJ00eVrDWGPWzPlgRwHJI9ptg7IiOtBHlcL2z4FeB55ds%2FrQgTjpl7abSwZO69dX%2Fh8WAJ7dqfkSBmmxDpk2dduUUvYKStDOhjkILy6Y3MMMDB4rkGOuQC48RzLGor85K1gOIzs5bPH0WNFs%2F9wygMbth65ineWSLMj4UVerltU9AiOstBxQvYjoKPUMGAO3FLcHiTjGFZacqvqBICRJcA2FwxTE0mYmFDb13W0Ey29Zf9AynaYPiQ%2BjI6JqEWZc20a%2FV3AhxgbI8lDRHKMhihamlX32qYDxAWr%2B78uoxptJswYd83Df3u5zK9t4RBZGa%2FhULiZ1jiqJ9xXT6X1YM5mbKLNajBemWgI2HObL5Odn2QJGqe889e1OlS6xBulPqHSDC9T2CeUNPWiCpYb2BvVkKkZiVy%2F87xogsR2w2OflwyPJvPEHphfqUYUaTtVEKqqxbPDLHz85EQHEKHBlMl9N3VRtp84k%2FC9moP4%2FAG3nLf5DMxUNYDKho32ysbImOtyaTUctcla6WfGAZtgrb181DyvIgdOktVQt3qu3AIobIw4H41146cNZasdT6VYe93fip6EQQDhY6NY3Y%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JYCTNPWVJ%2F20241116%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20241116T134033Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=1ba9145b0ec46b51751bbf0452827ddc17c8daea77cea9213dd5cbd11963735b";
  // const VIDEO_URL = staticFile("sample-videos/saul-cropped.mp4");

  return useCallback(
    async (newItemData: {
      layerId: LayerId;
      startFrame: number;
      duration: number;
      offset: number;
      selectedContentType:
        | {
            sequenceType: "standalone";
            contentType?: ContentType;
          }
        | {
            sequenceType: "preset";
            presetId: string;
          };
    }) => {
      const { layerId, startFrame, duration, offset, selectedContentType } =
        newItemData;

      // Perform validations
      if (startFrame < 0 || duration <= 0) {
        console.error("Invalid start frame or duration");
        return false;
      }

      if (selectedContentType.sequenceType === "standalone") {
        const contentType = selectedContentType.contentType || "dummy"; // Default to "dummy" if not specified
        const newItemId = genId("s", contentType);
        if (contentType !== "video" && contentType !== "audio") {
          // call the store action with the validated data
          addSequenceItemToLayer(
            layerId,
            {
              contentType,
              id: newItemId,
              offset,
              sequenceDuration: duration,
              effectiveDuration: duration,
              sequenceType: "standalone",
              startFrame,
            },
            contentType === "text"
              ? {
                  type: "text",
                  editableProps: {
                    styles: {
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.2)",
                      },
                      element: {},
                    },
                    text: "<h1>Your text</h1>",
                    positionAndDimensions: {
                      top: 0,
                      left: 0,
                      width: 720,
                      height: 1080,
                    },
                  },
                  id: newItemId,
                  layerId,
                }
              : {
                  type: "image",
                  editableProps: {
                    styles: {
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                      },
                      element: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                    positionAndDimensions: {
                      top: 0,
                      left: 0,
                      width: 720,
                      height: 1080,
                    },
                    imageUrl:
                      "https://no-protection-bucket.s3.us-east-1.amazonaws.com/images/ronaldo.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIFezEXhmmFr9voTydL8A9MVwqLpugKGKH867wpDZatMOAiBkYg%2BnueOJJ7b3tOOZ6pRGpIuCa2PUB6fqV2QpWopoFirLAwhoEAAaDDA1ODI2NDI1MjM3MSIMgygHa3XRYFG1cR11KqgDsbad7dw9zhiux6sfDdu7xJLM0ZB1paCXajrPCLTnDfe4cAIAyQT7CaijOn7fViPDjq0bg15%2BBwl0rNtnjC9o236TpnY8bq0xFIPcPwSxwFO5MqalTDzHZyfvF4FJdtOsM8QDDf1ixQGNnbfVwaKFVqhgsIq38NxMRj6cVDYgJnIaX5VsxWiKJWFYCIEvwdI6NDEwtnqYZa%2B4Utf3HtRCG5%2F%2B9kU%2FCJMuB51W3lk0NQXvFWmAlxuMU30%2FCzv4FKdb6jtPeEImz4ckWbTg8I8mBzAB1kiszWiyT8oGY1ytTEX%2BmH1%2BWtLXgCz%2BO%2BjA6dJ4IyzL1diChDL4EZFgr9Fdex3hrli%2FW6gszJ%2BTUJ4n3qTxPsO2XfIi5tU%2F4e0P6Z2EYNc7LmFkzAy0RCAsRn3Czas%2BKT%2BxP27na1w9UornYNXRP2wt2RA%2BRH%2B1RdT2nwambuH2gUTIsUu%2BDOAB12Gh2KnrrAKeGRe97L%2BQauHBKcW08uBDrxv3VKuDoKWILwbSOh7XrS9yDDiq1gVe%2F3YYU0DpQlidkq2H%2F2DbW3D3frfM3xWZwnfiZzCrkO%2B5BjrlAnX%2BSV3zNLrLXpkt%2BRrVKHPnENKtkp3DMJB1XNPXlg5rxfxuOFTymsH%2BfKsEJPDqod787CwoHbVpo9XMjVRFvEr4h73VfyQ0lbDvlI%2BOdl%2B4lQLl4YB2xsNhh4cfkTy9vyMiqgrs780qlxd6zBEmh9aKyoTWslqiFpqPmuN5e6DLnkJamHDibflPRv11hUZfB5kDgUV5ad9OeSLtyLzP0hsblZYVMAaU902hJNx%2FWYXZZ3lFg9gfULv0bFAdKJS1ujEL6yZ2xvO7QnDtmkNQW6JwEv8Com5xEHCC9Cbvw1p7XK9FnuYKHHc2g3bDGN3%2FY1N8F2JHH1GzhxDmdY61n5wuC08wMVFAH41m5XRw6fh6Tlc1k%2FWosTCqPMkwUdP1K%2B1CbBvrLc8wshxexn6Quyr1PXOG2gAi6FV4%2FmyoIvov9%2BgFARd9IZ0b%2ByCgfEbQjALS%2Fxx%2FFFN5w01Pc%2BA5VarepP34Hw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQ3EGR57JV56LSLU7%2F20241118%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241118T231215Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=4052a09f820f81faa3a659ef00fac62cc4771839f8771f7057aba1c518fa5228",
                    // "https ://images.pexels.com/photos/20787/pexels-photo.jpg",
                  },
                  animations: [
                    {
                      type: "scale",
                      from: 1,
                      to: 0.7,
                      duration: 240,
                      startAt: 120, // Starts immediately at frame 0
                    },
                  ],

                  id: newItemId,
                  layerId,
                },
          );
        } else {
          // TODO : THIS IS ASYNC, we need it only for the total duration, so we should not wait for this
          // instead we can use a loader / or disable resizing until this is done, but we will add it immediately

          const data = await getVideoMetadata(VIDEO_URL);

          addSequenceItemToLayer(
            layerId,
            {
              contentType,
              id: newItemId,
              offset,
              sequenceDuration: data.durationInSeconds * 30,
              effectiveDuration: data.durationInSeconds * 30,
              sequenceType: "standalone",
              startFrame,
              linkedCaptionLayerId: null,
              linkedCaptionId: null,
            },
            {
              type: "video",
              editableProps: {
                videoEndsAtInFrames: data.durationInSeconds * 30,
                videoStartsFromInFrames: 0,
                styles: {
                  container: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  element: {
                    width: "100%",
                    height: "100%",
                  },
                  overlay: {},
                },
                positionAndDimensions: {
                  top: 0,
                  left: 0,
                  width: 720,
                  height: 1080,
                },
                videoUrl: VIDEO_URL,
              },
              totalVideoDurationInFrames: data.durationInSeconds * 30,
              id: newItemId,
              layerId,
              animations: [],
            },
          );
        }

        setActiveSeqItem(layerId, newItemId, contentType);
      } else {
        toast.error("Preset addition is not implemented yet");
        // addPresetToLayer(
        //   layerId,
        //   {
        //     startFrame,
        //     offset,
        //   },
        //   PRESET_COLLECTION[selectedContentType.presetId],
        // );
        // contentType = "preset";
        // presetId = selectedContentType.presetId;
      }
    },
    [addSequenceItemToLayer, addPresetToLayer, setActiveSeqItem],
  );
};
