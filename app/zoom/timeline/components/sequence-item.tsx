import { type ComponentProps } from "react";
import { Rnd } from "react-rnd";
import { cn } from "@/lib/utils";

import {
  ALargeSmall,
  ArrowRightLeft,
  AudioLines,
  Image,
  Video,
} from "lucide-react";
import type {
  ContentType,
  LayerId,
  LiteSequenceItemType,
  LiteSequencePresetItemType,
} from "../timeline.types";
import { LAYOUT } from "../../layout.const";
import { useEditingStore } from "../store/editing.store";
import { useTimeline } from "../video-timeline-context";
import SequenceContextMenuWrapper from "./sequence-context-menu";

/**
 * Map of item types to their corresponding CSS classes for styling.
 */
export const ITEM_TYPE_TO_STYLES_MAP: Record<ContentType | "preset", string> = {
  text: "bg-green-600/50 border-green-700 before:bg-green-700 after:bg-green-700  ",
  image:
    "bg-purple-600/50 border-purple-600 before:bg-purple-600 after:bg-purple-600",
  video: "bg-pink-600/50 border-pink-600 before:bg-pink-600 after:bg-pink-600",
  audio:
    "bg-orange-600/50 border-orange-600 before:bg-orange-600 after:bg-orange-600",
  // TODO : remove this
  caption:
    "bg-green-600/50 border-green-600 before:bg-green-600 after:bg-green-600",
  preset: "bg-yellow-600/50 border-yellow-600  mouse-grab",
  "caption-page":
    " bg-green-600/50 border-green-600 before:bg-green-600 after:bg-green-600",
  div: "",
  dummy: "",
};

const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;

const SequenceItem = ({
  item,
  layerId,
  nextItemStartFrame,
}: {
  item: LiteSequenceItemType;
  layerId: LayerId;
  nextItemStartFrame: number | undefined;
}) => {
  const {
    throttledItemDrag,
    pixelsPerFrame,
    setDraggingLayerId,
    itemResizeHandler,
    setView,
    setActiveCaptionData,
    visibleLayerOrder,
    view,
  } = useTimeline();

  const setActiveSeqItem = useEditingStore((state) => state.setActiveSeqItem);
  const activeSeqItem = useEditingStore((state) => state.activeSeqItem);

  /* The adjustment of the x position is to account for the transition duration.
   - without transition : seq1 0 to 120: duration 120 frames, seq2 120 to 210 : duration 90 frames
   - with transition of 30 frames : seq1 0 to (120+15 outgoing) 135: duration 135 frames, seq2 135(120+15 incoming) to 210 : duration 75 frames
  */

  const x =
    (item.startFrame + (item.transition?.incoming?.duration || 0)) *
    pixelsPerFrame;

  const width =
    (item.sequenceDuration -
      (item.transition?.incoming?.duration || 0) -
      (item.transition?.outgoing?.duration || 0)) *
    pixelsPerFrame;

  const onDragStart = () => {
    setDraggingLayerId(layerId);
  };

  const onDragStop: ComponentProps<typeof Rnd>["onDragStop"] = (e, d) => {
    const centerY = d.y + TRACK_LAYER_HEIGHT_IN_PX / 2;
    const rawLayerIndex = centerY / TRACK_LAYER_HEIGHT_IN_PX;
    const snapLayerIndex = Math.floor(rawLayerIndex);
    const newLayerId = visibleLayerOrder[snapLayerIndex];

    if (d.x !== x || layerId !== newLayerId)
      throttledItemDrag(layerId, newLayerId, item.id, d.x, d.y);

    setDraggingLayerId(null);
  };

  const onResizeStop: ComponentProps<typeof Rnd>["onResizeStop"] = (
    e,
    direction,
    ref,
    delta,
    position,
  ) => {
    itemResizeHandler({
      layerId,
      item,
      deltaPixels: delta.width,
      direction: direction as "left" | "right",
      nextItemStartFrame,
    });
  };

  const layerIndex = visibleLayerOrder.indexOf(layerId);
  console.log("SequenceItem renders", item.id);

  return (
    <Rnd
      id={`sequence-item-${item.id}`}
      key={item.id}
      bounds="parent"
      position={{
        x,
        y: layerIndex * TRACK_LAYER_HEIGHT_IN_PX, // layerIndex * 32(TRACK_LAYER_HEIGHT),
      }}
      style={{
        cursor: "grab",
      }}
      size={{
        width,
        // height: TRACK_LAYER_HEIGHT,
        height: TRACK_LAYER_HEIGHT_IN_PX, // rem is not working
      }}
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,

        left: item.sequenceType !== "preset",
        right: item.sequenceType !== "preset",
        top: false,
        topLeft: false,
        topRight: false,
      }}
      dragAxis={
        item.sequenceType === "preset"
          ? "both"
          : item.sequenceType === "caption"
            ? "none"
            : item.contentType !== "caption-page"
              ? "both"
              : "x"
      }
      onDragStop={onDragStop}
      onDragStart={onDragStart}
      onResizeStop={onResizeStop}
      className={cn("relative box-border w-full")}
      dragGrid={[pixelsPerFrame, TRACK_LAYER_HEIGHT_IN_PX]}
    >
      <SequenceContextMenuWrapper
        key={item.id}
        layerId={layerId}
        itemId={item.id}
        transition={item.transition}
        startFrame={item.startFrame}
        type={
          item.sequenceType === "preset"
            ? "preset"
            : item.sequenceType === "caption"
              ? item.sequenceType
              : item.contentType
        }
      >
        <div
          className="relative flex h-full w-full items-center justify-center truncate px-0 text-[10px] font-medium text-white"
          onClick={(e) => {
            e.stopPropagation();
            if (
              item.sequenceType === "standalone" &&
              item.contentType === "caption-page"
            ) {
              setActiveSeqItem(layerId, item.id, "caption-page", {
                captionItemId: activeSeqItem?.itemId!,
                itemType: "caption",
              });
              return;
            }
            setActiveSeqItem(
              layerId,
              item.id,
              item.sequenceType === "standalone" ? item.contentType : "preset",
            );
          }}
        >
          {item.sequenceType === "preset" ? (
            <PresetItem
              item={item}
              layerId={layerId}
              pixelsPerFrame={pixelsPerFrame}
            />
          ) : item.sequenceType === "caption" ? null : (
            <div className="flex h-full w-full flex-col">
              {item.contentType === "video" &&
                view === "entire-timeline" &&
                item.linkedCaptionLayerId && (
                  <button
                    id="caption-item-preview-item"
                    onClick={(e) => {
                      e.stopPropagation();

                      setActiveSeqItem(
                        item.linkedCaptionLayerId!,
                        item.linkedCaptionId!,
                        "caption",
                      );

                      setActiveCaptionData({
                        videoLayerId: layerId,
                        videoItemId: item.id,
                        captionLayerId: item.linkedCaptionLayerId!,
                        durationInFrames: item.sequenceDuration, // TODO : confirm if it's not effective duration
                      });
                      setView("caption-edit");
                    }}
                    className="h-6 w-full rounded-sm border-2 border-yellow-500 bg-yellow-300/50 hover:bg-opacity-90"
                  >
                    <div className="h-full w-full rounded-none"></div>
                  </button>
                )}
              <div
                //   className="flex h-full w-full cursor-grab items-center justify-center"
                className={cn(
                  "relative box-border flex h-full w-full items-center justify-center rounded-[2px] border-2 shadow-inner hover:opacity-90 focus:bg-yellow-800",
                  ITEM_TYPE_TO_STYLES_MAP[item.contentType],
                  "before:absolute before:inset-y-[2px] before:left-[2px] before:w-1 before:rounded-lg before:content-['']",
                  "after:absolute after:inset-y-[2px] after:right-[2px] after:w-1 after:rounded-lg after:content-['']",
                  activeSeqItem?.itemId === item.id && "border-blue-500",
                )}
              >
                {item.contentType === "video" && <Video size={14} />}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                {item.contentType === "image" && <Image size={14} />}
                {item.contentType === "text" && <ALargeSmall size={14} />}
                {item.contentType === "audio" && <AudioLines size={14} />}
              </div>
            </div>
          )}
        </div>

        {/* --------------------------- Transition Element --------------------------- */}
        {item.transition?.incoming && (
          <button
            className="absolute inset-y-px left-0 z-10 flex h-auto items-center justify-center rounded-[4px] border border-orange-600 bg-orange-600/60"
            style={{
              width: item.transition?.incoming.duration * 2 * pixelsPerFrame,
              left: -item.transition?.incoming.duration * pixelsPerFrame - 2,
            }}
          >
            <ArrowRightLeft size={16} className="text-white" />
          </button>
        )}
      </SequenceContextMenuWrapper>
    </Rnd>
  );
};

// memoize the component
// const MemoizedSequenceItem = memo(SequenceItem, (prevProps, nextProps) => {
//   return prevProps.item.id === nextProps.item.id;
// });

export default SequenceItem;

//@ts-ignore
const _PresetItem = ({
  liteItems,
  layerId,
  pixelsPerFrame,
}: {
  liteItems: LiteSequenceItemType[];
  layerId: LayerId;
  pixelsPerFrame: number;
}) => {
  // TODO : WTF is this?
  if (1 === 1)
    return (
      <div className="flex h-full w-full">
        {liteItems.map((item) => {
          const width =
            (item.sequenceDuration -
              (item.transition?.incoming?.duration || 0) -
              (item.transition?.outgoing?.duration || 0)) *
            pixelsPerFrame;

          return (
            <div
              key={item.id}
              className={cn(
                "h-full cursor-pointer select-none rounded-sm border",

                ITEM_TYPE_TO_STYLES_MAP[
                  item.sequenceType === "standalone"
                    ? item.contentType
                    : item.sequenceType
                ],
              )}
              style={{
                // transform: `translateX(${x}px)`,
                // transform: `translate(${x}px, 1px)`,
                width: `${width}px`,
              }}
            ></div>
          );
        })}
      </div>
    );

  return (
    <>
      {liteItems.map((item) => {
        const x =
          (item.startFrame + (item.transition?.incoming?.duration || 0)) *
          pixelsPerFrame;

        const width =
          (item.sequenceDuration -
            (item.transition?.incoming?.duration || 0) -
            (item.transition?.outgoing?.duration || 0)) *
          pixelsPerFrame;

        return (
          <Rnd
            key={item.id}
            bounds="parent"
            position={{
              x,
              y: 1,
            }}
            size={{
              width,
              height: "96%",
            }}
            enableResizing={false}
            dragAxis="x"
            className={cn(
              "box-border cursor-pointer select-none rounded-sm border-2 !bg-red-950 hover:opacity-90 focus:bg-yellow-800",
              /*  getItemStyle(
                item.sequenceType === "standalone"
                  ? item.contentType
                  : item.sequenceType,
              ), */
            )}
            dragGrid={[1, 0]}
          >
            {item.id.slice(0, 1)}
            {/* --------------------------- Transition Element --------------------------- */}
            {/* {item.transition?.incoming && (
              <button
                className="absolute left-0 top-0 z-10 flex h-full select-none items-center justify-center rounded-[4px] border border-green-200 bg-gradient-to-r from-green-500/80 to-green-500/80"
                style={{
                  width: item.transition?.incoming.duration * 2 * pixelsPerFrame,
                  left: -(item.transition?.incoming.duration * pixelsPerFrame),
                }}
              >
                <ArrowRightLeft size={16} className="-ml-1 text-white" />
              </button>
            )} */}
          </Rnd>
        );
      })}
    </>
  );
};

const PresetItem = ({
  item,
  layerId,
  pixelsPerFrame,
}: {
  item: LiteSequencePresetItemType;
  layerId: string;
  pixelsPerFrame: number;
}) => {
  return <div>{item.id}</div>;
};
