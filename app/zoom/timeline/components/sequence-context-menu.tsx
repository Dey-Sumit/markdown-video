import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEditingStore } from "../store/editing.store";
import useVideoStore from "../store/video.store";
import type {
  LayerId,
  LiteSequenceItemType,
  ContentType,
} from "../timeline.types";
import { useTimeline } from "../video-timeline-context";

function SequenceContextMenuWrapper({
  children,
  layerId,
  itemId,
  transition,
  startFrame,
  type,
}: {
  children: React.ReactNode;
  layerId: LayerId;
  itemId: string;
  transition: LiteSequenceItemType["transition"];
  startFrame: number;
  type: "preset" | ContentType;
}) {
  const {
    removeSequenceItemFromLayer,
    addTransitionToLayer,
    removeTransitionFromLayer,
    splitSequenceItem,
  } = useVideoStore();

  const { playheadPosition, pixelsPerFrame } = useTimeline();

  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);

  const clearActiveSeqItem = useEditingStore(
    (store) => store.clearActiveSeqItem,
  );

  const handleDeleteSeqItem = () => {
    removeSequenceItemFromLayer(layerId, itemId);
    if (
      activeSeqItem &&
      activeSeqItem.itemId === itemId &&
      activeSeqItem.itemType !== "caption-page"
    ) {
      clearActiveSeqItem();
    }
  };

  const handleSplitSeqItem = () => {
    console.log("handleSplitSeqItem: Splitting sequence item", layerId, itemId);

    const playheadPositionInFrames = Math.floor(
      playheadPosition.x / pixelsPerFrame,
    );
    splitSequenceItem(layerId, itemId, playheadPositionInFrames);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="mb-4 w-64">
        {type !== "preset" && (
          <>
            <ContextMenuItem inset onClick={handleSplitSeqItem}>
              Split
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        {/*        <ContextMenuItem inset>
          Duplicate
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Mute/Unmute
          <ContextMenuShortcut>M</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Hide/Show
          <ContextMenuShortcut>H</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Split
          <ContextMenuShortcut>Ctrl+S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Lock/Unlock
          <ContextMenuShortcut>L</ContextMenuShortcut>
        </ContextMenuItem> */}

        <ContextMenuSub>
          <ContextMenuSubTrigger inset> Transitions</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              disabled={!transition?.incoming}
              onClick={() =>
                removeTransitionFromLayer(layerId, transition?.incoming?.id!)
              }
            >
              Delete Start Transition
            </ContextMenuItem>
            <ContextMenuItem
              disabled={!transition?.outgoing}
              onClick={() =>
                removeTransitionFromLayer(layerId, transition?.outgoing?.id!)
              }
            >
              Delete End Transition
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => addTransitionToLayer(layerId, itemId, "incoming")}
            >
              Add Incoming/Start
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => addTransitionToLayer(layerId, itemId, "outgoing")}
            >
              Add Outgoing/End
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        <ContextMenuItem
          inset
          className="text-red-700"
          onClick={handleDeleteSeqItem}
        >
          Delete
          <ContextMenuShortcut className="text-red-700">
            Del
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default SequenceContextMenuWrapper;
