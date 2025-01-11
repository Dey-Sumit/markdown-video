"use client";

import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { useRef } from "react";
import useVideoStore from "../store/video.store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@radix-ui/react-switch";
import { scrollToTop, scrollToBottom } from "../utils/utils";

function LayerContentMenuWrapper({
  layerId,
  children,
}: {
  layerId: string;
  children: React.ReactNode;
}) {
  const layer = useVideoStore((state) => state.props.layers[layerId]);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const removeLayer = useVideoStore((state) => state.removeLayer);
  const addLayer = useVideoStore((state) => state.addLayer);

  const updateLayerMetadata = useVideoStore(
    (state) => state.updateLayerMetadata,
  );

  const handleSaveRename = () => {
    const newName = nameInputRef.current?.value;
    if (newName) {
      updateLayerMetadata(layerId, { name: newName });
    }
  };

  const isVisible = layer.isVisible;

  const handleVisibilityToggle = (checked: boolean) => {
    updateLayerMetadata(layerId, { isVisible: checked });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger className="text-red-700">
            <Trash className="mr-2 size-4" />
            Delete Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={() => removeLayer(layerId)}
              className="cursor-pointer text-red-700 focus:bg-red-900 focus:text-white"
            >
              <Trash className="mr-2 size-4" />
              Yes, Delete it! 😡
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Plus className="mr-2 size-4" />
            Add Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            <ContextMenuItem
              onClick={() => {
                addLayer({
                  position: "AT_TOP",
                });
                scrollToTop("layerContainer");
              }}
            >
              <ArrowUp className="mr-2 size-4" />
              Insert at the Top
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                addLayer({
                  position: "ABOVE_CURRENT",
                  currentLayerId: layerId,
                })
              }
            >
              <ArrowUp className="mr-2 size-4" />
              Insert Above Current
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                addLayer({
                  position: "BELOW_CURRENT",
                  currentLayerId: layerId,
                })
              }
            >
              <ArrowDown className="mr-2 size-4" />
              Insert Below Current
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                addLayer({
                  position: "AT_BOTTOM",
                });
                scrollToBottom("layerContainer");
              }}
            >
              <ArrowDown className="mr-2 size-4" />
              Insert at the Bottom
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Edit className="mr-2 size-4" />
            Rename Layer
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-64 p-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRename();
              }}
              className="flex items-center space-x-2"
            >
              <Input
                ref={nameInputRef}
                defaultValue={layer.name}
                className="h-8 flex-grow focus-visible:ring-1"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="h-8 px-2"
              >
                <Save className="size-4" />
              </Button>
            </form>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          {isVisible ? (
            <Eye className="mr-2 size-4" />
          ) : (
            <EyeOff className="mr-2 size-4" />
          )}
          <span className="flex-grow">{isVisible ? "Visible" : "Hidden"}</span>
          <Switch
            checked={isVisible}
            onCheckedChange={handleVisibilityToggle}
          />
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default LayerContentMenuWrapper;
