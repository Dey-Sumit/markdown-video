"use client";

import useVideoStore from "../../timeline/store/video.store";
import { useEditingStore } from "../../timeline/store/editing.store";
import type { ZoomSequenceItemType } from "../../timeline/timeline.types";
import ZoomPointSelector from "@/components/zoom-pointer-selector";
import type { Position } from "react-rnd";

const SequenceItemEditorZoom = () => {
  const updateZoomEditableProps = useVideoStore(
    (store) => store.updateZoomEditableProps,
  );
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);

  const sequenceItem = sequenceItems[
    activeSeqItemLite.itemId
  ] as ZoomSequenceItemType;


  const handlePositionChange = (position: Position) => {
    console.log("Position:", position);
    updateZoomEditableProps(
      activeSeqItemLite.layerId,
      activeSeqItemLite.itemId,
      { targetX: position.x, targetY: position.y },
    );
  };

  const handleZoomChange = (zoomLevel: number) => {
    console.log("Zoom level:", zoomLevel);
    updateZoomEditableProps(
      activeSeqItemLite.layerId,
      activeSeqItemLite.itemId,
      { zoomLevel },
    );
  };

  return (
    <>
      <ZoomPointSelector
        onPositionChange={handlePositionChange}
        onZoomChange={handleZoomChange}
        defaultZoom={sequenceItem?.editableProps.zoomLevel}
        defaultPosition={{
          x: sequenceItem?.editableProps.targetX,
          y: sequenceItem?.editableProps.targetY,
        }}
      />
    </>
  );
};

export default SequenceItemEditorZoom;
