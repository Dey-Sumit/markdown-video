"use client";

import { MergeIcon, MoreVertical, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type {
  CaptionPageSequenceItemType,
  CaptionSequenceItemType,
  LiteSequenceCaptionItemType,
} from "~/types/timeline.types";

export default function SequenceItemEditorCaption() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSeqItem = useEditingStore((state) => state.activeSeqItem!);
  console.log({ activeSeqItem });

  const activeCaptionId =
    activeSeqItem.itemType === "caption"
      ? activeSeqItem.itemId
      : activeSeqItem.parentItem.captionItemId;

  const layers = useVideoStore((store) => store.props.layers);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);

  const updateCaptionText = useVideoStore((store) => store.updateCaptionText);

  const captionSequenceItems = (
    sequenceItems[activeCaptionId] as CaptionSequenceItemType
  ).sequenceItems;

  // Get the caption layer which contains ordered liteItems
  const captionItem = layers[activeSeqItem.layerId]
    .liteItems[0] as LiteSequenceCaptionItemType;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTextChange = (id: string, newText: string) => {
    updateCaptionText(activeSeqItem.layerId, activeCaptionId, id, newText);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleFocus = (id: string) => {
    setActiveId(id);
  };

  const handleBlur = () => {
    setActiveId(null);
  };

  const frameToTimestamp = (frame: number) => {
    const fps = 30; // Get this from your composition metadata if needed
    const totalSeconds = frame / fps;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleMerge = (currentIndex: number) => {
    // if (currentIndex < captionItem.length - 1) {
    //   // Implement merge logic using your store update function
    console.log("Merge functionality to be implemented");
    // }
  };

  const handleDelete = (pageId: string) => {
    // Implement delete logic using your store update function
    console.log("Delete functionality to be implemented");
  };
  console.log({ captionSequenceItems });

  return (
    <div className="max-h-[500px] space-y-2 overflow-y-auto pt-4">
      {captionItem.liteItems.map((liteItem, index) => {
        const captionText = (
          captionSequenceItems[liteItem.id] as CaptionPageSequenceItemType
        ).editableProps.text;

        return (
          <div
            key={liteItem.id}
            className={`group relative flex items-start justify-between space-x-4 border-l-2 py-2 transition-colors duration-200 ${
              activeId === liteItem.id
                ? "border-orange-700"
                : "border-transparent hover:border-muted-foreground"
            }`}
            onClick={() => inputRefs.current[index]?.focus()}
          >
            <div className="flex-1 space-y-1 pl-4">
              <div className="flex space-x-1 text-xs text-muted-foreground">
                <span>{frameToTimestamp(liteItem.startFrame)}</span>
                <span>→</span>
                <span>
                  {frameToTimestamp(
                    liteItem.startFrame + liteItem.sequenceDuration,
                  )}
                </span>
              </div>
              <Input
                //@ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                value={captionText}
                onChange={(e) => handleTextChange(liteItem.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(liteItem.id)}
                onBlur={handleBlur}
                className="h-auto bg-background p-2 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleMerge(index)}>
                  <MergeIcon className="mr-2 h-4 w-4" />
                  Merge with next
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(liteItem.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}
