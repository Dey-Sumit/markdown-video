import { linearTiming, TransitionSeries } from "@remotion/transitions";
import DOMPurify from "dompurify";
import {
  AbsoluteFill,
  getRemotionEnvironment,
  Img,
  OffthreadVideo,
  Series,
} from "remotion";

import { slide } from "@remotion/transitions/slide";

import React, { useCallback, useState } from "react";
import type {
  CaptionSequenceItemType,
  LiteSequenceCaptionItemType,
  LiteSequenceItemType,
  NestedCompositionProjectType,
  StyledSequenceItem,
} from "../timeline/timeline.types";
import useThrottle from "../timeline/hooks/use-throttle";
import useVideoStore from "../timeline/store/video.store";
// import { SortedOutlines } from "~/components/new-player/sorted-outlines";
// import useThrottle from "~/hooks/use-throttle";
// import useVideoStore from "~/store/video.store";
// import type {
//   CaptionSequenceItemType,
//   LiteSequenceCaptionItemType,
//   LiteSequenceItemType,
//   NestedCompositionProjectType,
//   StyledSequenceItem,
// } from "~/types/timeline.types";
// import SubtitlePage from "../captions/SubtitlePage";

// TODO : use this
export const SafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ["div", "p", "span", "strong", "s", "u", "mark"],
    ALLOWED_ATTR: ["style"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

const SequenceItemRenderer: React.FC<{
  item: StyledSequenceItem;
}> = ({ item }) => {
  if (item.type === "preset") {
    return null;
  }

  const renderContent = () => {
    switch (item.type) {
      case "div":
        return <div style={item.editableProps?.styles?.element}></div>;
      case "text":
        return (
          <div
            style={item.editableProps?.styles?.element}
            dangerouslySetInnerHTML={{ __html: item.editableProps.text }}
            // TODO : added flex and justify-center and all here, might not be needed
            className="prose prose-2xl prose-invert flex items-center justify-center space-y-0 whitespace-pre-wrap [&>*]:my-0"
          />
        );
      case "image":
        return (
          <>
            <AbsoluteFill
              style={item.editableProps?.styles?.overlay}
              className=""
            />
            <Img
              src={item.editableProps.imageUrl}
              style={{
                objectFit: "cover",
                ...item.editableProps?.styles?.element,
              }}
              className="box-content"
            />
          </>
        );
      case "video":
        return (
          <OffthreadVideo
            src={item.editableProps.videoUrl}
            style={item.editableProps?.styles?.element}
            className="object-cover"
            startFrom={item.editableProps.videoStartsFromInFrames}
            endAt={item.editableProps.videoEndsAtInFrames}
          />
        );
      /* case "caption-page":
        return (
          <SubtitlePage
            captionWidth={
              item.editableProps.positionAndDimensions?.width || 720
            }
            page={{
              startMs: item.editableProps.startMs,
              text: item.editableProps.text,
              tokens: item.editableProps.tokens,
            }}
          />
        ); */

      default:
        return null;
    }
  };

  return (
    <AbsoluteFill
      style={{
        ...item.editableProps?.styles?.container,
        ...item.editableProps?.positionAndDimensions,
      }}
    >
      {renderContent()}
    </AbsoluteFill>
  );
};

const RenderSequence: React.FC<{
  item: LiteSequenceItemType;
  sequenceItems: Record<string, StyledSequenceItem>;
}> = ({ item, sequenceItems }) => {
  if (item.sequenceType === "standalone") {
    const sequenceItem = sequenceItems[item.id];

    return sequenceItem ? <SequenceItemRenderer item={sequenceItem} /> : null;
  }

  if (item.sequenceType === "preset") {
    const presetSequenceItem = sequenceItems[item.id] as StyledSequenceItem & {
      type: "preset";
    };

    if (!presetSequenceItem) {
      return null;
    }

    return (
      <NestedSequenceComposition
        //@ts-ignore,the props are not needed.Visible prop later.
        layers={item.layers}
        layerOrder={item.layerOrder}
        sequenceItems={presetSequenceItem.sequenceItems}
        compositionMetaData={{
          width: 0, // You might want to pass these values from parent
          height: 0,
          fps: 0,
          duration: item.sequenceDuration,
          compositionId: item.id,
        }}
      />
    );
  }

  return null;
};

const layerContainer: React.CSSProperties = {
  overflow: "hidden",
};

const NestedSequenceComposition = (
  props: NestedCompositionProjectType["props"],
) => {
  const updatePositionAndDimensions = useVideoStore(
    (state) => state.updatePositionAndDimensions,
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const throttledUpdatePositionAndDimensions = useThrottle(
    updatePositionAndDimensions,
    40,
  );

  const { layers, layerOrder, sequenceItems } = props;

  const changeItem = useCallback(
    (
      layerId: string,
      itemId: string,
      updater: (item: StyledSequenceItem) => StyledSequenceItem,
    ) => {
      const item = sequenceItems[itemId];
      if (!item) return;

      const updatedItem = updater(item);
      const positionUpdates = updatedItem.editableProps.positionAndDimensions;

      if (positionUpdates) {
        throttledUpdatePositionAndDimensions(layerId, itemId, positionUpdates);
      }
    },
    [sequenceItems, throttledUpdatePositionAndDimensions],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) {
        return;
      }

      setSelectedItem(null);
    },
    [setSelectedItem],
  ); // Flatten all liteItems from all layers into a single array

  return (
    <AbsoluteFill className="border bg-black" onPointerDown={onPointerDown}>
      <AbsoluteFill className="font-serif" style={layerContainer}>
        {[...layerOrder].reverse().map((layerId) => {
          if (layers[layerId].layerType === "caption") {
            const captionLiteItem = layers[layerId]
              .liteItems[0] as LiteSequenceCaptionItemType;
            const captionItemId = captionLiteItem.id;
            const captionSequenceItem = sequenceItems[
              captionItemId
            ] as CaptionSequenceItemType;
            const captionPageSequenceItems = captionSequenceItem.sequenceItems;
            return (
              <CaptionRenderer
                key={layerId}
                layerId={layerId}
                captionSequenceItem={captionSequenceItem}
                captionPageSequenceItems={captionPageSequenceItems}
                liteItems={captionLiteItem.liteItems}
                captionLiteItem={captionLiteItem}
                containerEditableProps={captionSequenceItem.editableProps}
              />
            );
          }
          return (
            <TransitionSeries key={layerId} name={layerId} layout="none">
              {layers[layerId].liteItems.map((item) => {
                return (
                  <React.Fragment key={item.id}>
                    <TransitionSeries.Sequence
                      durationInFrames={item.sequenceDuration}
                      name={item.id}
                      offset={item.offset}
                      layout="none"
                    >
                      <RenderSequence
                        item={item}
                        // sequenceItems={
                        //   sequenceItems[layerId].
                        // }
                        sequenceItems={sequenceItems}
                      />
                    </TransitionSeries.Sequence>
                    {item.transition?.outgoing && (
                      <TransitionSeries.Transition
                        presentation={slide()}
                        timing={linearTiming({
                          durationInFrames:
                            item.transition.outgoing.duration * 2,
                        })}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </TransitionSeries>
          );
        })}
      </AbsoluteFill>
      {/*  {getRemotionEnvironment().isPlayer ? (
        <SortedOutlines
          layers={layers}
          layerOrder={layerOrder}
          sequenceItems={sequenceItems}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          changeItem={changeItem}
        />
      ) : null} */}
    </AbsoluteFill>
  );
};

export default NestedSequenceComposition;

const CaptionRenderer = ({
  layerId,
  captionSequenceItem,
  captionPageSequenceItems,
  liteItems,
  captionLiteItem,
  containerEditableProps,
}: {
  layerId: string;
  captionSequenceItem: CaptionSequenceItemType;
  captionPageSequenceItems: Record<string, StyledSequenceItem>;
  liteItems: LiteSequenceItemType[];
  captionLiteItem: LiteSequenceCaptionItemType;
  containerEditableProps: StyledSequenceItem["editableProps"];
}) => {
  return (
    <AbsoluteFill
      style={containerEditableProps.positionAndDimensions}
      className="pointer-events-none"
    >
      <Series>
        <Series.Sequence
          durationInFrames={captionLiteItem.sequenceDuration}
          name={captionLiteItem.id}
          offset={captionLiteItem.offset}
          layout="none"
        >
          <Series key={layerId}>
            {liteItems.map((item) => {
              const sequenceItem = captionPageSequenceItems[item.id];

              return (
                <Series.Sequence
                  key={item.id}
                  durationInFrames={item.sequenceDuration}
                  name={item.id}
                  offset={item.offset}
                  layout="none"
                >
                  <SequenceItemRenderer item={sequenceItem} />
                </Series.Sequence>
              );
            })}
          </Series>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
