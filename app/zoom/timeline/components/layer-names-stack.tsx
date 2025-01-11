"use client";

import { Reorder, useDragControls } from "framer-motion";
import { EyeOff, GripVertical } from "lucide-react";
import React, { useMemo, useRef } from "react";

import { filterCaptionLayers } from "./video-timeline";
import { LAYOUT } from "../../layout.const";
import useVideoStore from "../store/video.store";
import type { LayerType } from "../timeline.types";
import LayerContentMenuWrapper from "./layer-context-menu-wrapper";

interface LayerItemProps {
  layer: LayerType;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;
const DraggableLayerItem: React.FC<LayerItemProps> = ({
  layer,
  constraintsRef,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={layer.id}
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
      style={{
        height: `${TRACK_LAYER_HEIGHT_IN_PX}px`,
        width: "100%",
      }}
      className="border-b"
      transition={{
        duration: 0.3,
      }}
    >
      <LayerContentMenuWrapper layerId={layer.id}>
        <div className="relative flex h-full w-full items-center px-1">
          <div
            className="reorder-handle mr-2 cursor-move"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical size={16} className="text-white/30" />
          </div>
          <span className="line-clamp-1 select-none text-xs capitalize">
            {layer.name}
          </span>
          {!layer.isVisible && (
            <EyeOff className="absolute right-0 mr-2 size-3" />
          )}
        </div>
      </LayerContentMenuWrapper>
    </Reorder.Item>
  );
};

const LayerStack: React.FC = React.memo(() => {
  const layers = useVideoStore((state) => state.props.layers);
  const orderedLayers = useVideoStore((state) => state.props.layerOrder);
  const reorderLayers = useVideoStore((state) => state.reorderLayers);

  const constraintsRef = useRef(null);

  const nonCaptionLayers = useMemo(
    () => filterCaptionLayers(orderedLayers, layers),
    [orderedLayers, layers],
  );

  return (
    <Reorder.Group
      axis="y"
      values={nonCaptionLayers}
      onReorder={(newLayerOrder) => {
        reorderLayers(newLayerOrder);
      }}
      className="relative"
      ref={constraintsRef}
    >
      {nonCaptionLayers.map((layerId) => (
        <DraggableLayerItem
          key={layerId}
          layer={layers[layerId]}
          constraintsRef={constraintsRef}
        />
      ))}
    </Reorder.Group>
  );
});

export default LayerStack;
