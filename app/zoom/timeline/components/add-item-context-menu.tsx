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
import type {
  HoverInfo,
  useSequenceAddition,
} from "../utils/dom-ops/use-item-addition";

function AddItemContextMenu({
  children,
  onPresetAdd,
  hoverInfo,
}: {
  children: React.ReactNode;
  onPresetAdd: ReturnType<
    typeof useSequenceAddition
  >["mouseEventHandlers"]["onClick"];
  hoverInfo: HoverInfo;
}) {
  // const { layerId, offsetFrames, startFrame } = hoverInfo || {};
  // const addPresetToLayer = useVideoStore((state) => state.addPresetToLayer);
  // const addPreset = (presetId: string) => {
  //   const presetDetail = PRESET_COLLECTION[presetId];
  //   console.log("presetDetail", presetDetail, presetId);

  //   addPresetToLayer(
  //     layerId,
  //     {
  //       id: presetId,
  //       offset: offsetFrames,
  //       startFrame,
  //     },
  //     presetDetail,
  //   );
  // };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="mb-4 w-64">
        <ContextMenuItem
          className="text-xs"
          onClick={() => console.log("add text")}
        >
          Add Text
          <ContextMenuShortcut>T</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-xs"
          onClick={() => console.log("add text")}
        >
          Add Image
          <ContextMenuShortcut>I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-xs"
          onClick={() => console.log("add text")}
        >
          Add Video
          <ContextMenuShortcut>V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-xs"
          onClick={() => console.log("add text")}
        >
          Add Dummy
          <ContextMenuShortcut>D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-xs"
          onClick={() => console.log("add text")}
        >
          Add Audio
          <ContextMenuShortcut>A</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>Presets</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onClick={(e) =>
                onPresetAdd(e, {
                  sequenceType: "preset",
                  presetId: "preset-1",
                })
              }
            >
              Brut End Screen
            </ContextMenuItem>
            {/* <ContextMenuItem onClick={() => addPreset("preset-1")}>
              Brut Foreground
            </ContextMenuItem> */}
            <ContextMenuItem>Some other popular preset</ContextMenuItem>
            <ContextMenuItem>A custom preset as well</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>Last Added Presets</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Brut End Screen</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default AddItemContextMenu;
