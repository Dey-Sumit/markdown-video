"use client";

import { cn } from "@/lib/utils";
import { LAYOUT } from "../../layout.const";
import { useEditingStore } from "../../timeline/store/editing.store";
import SequenceItemEditorCaption from "./sequence-item-editor.caption";
import SequenceItemEditorImage from "./sequence-item-editor.image";
import SequenceItemEditorText from "./sequence-item-editor.text";
import SequenceItemEditorZoom from "./sequence-item-editor.zoom";

const {
  TIMELINE: { TIMELINE_CONTAINER_HEIGHT },
  PROJECT_HEADER_HEIGHT,
} = LAYOUT;

const SequenceItemEditorRenderer = () => {
  const activeSeqItem = useEditingStore((store) => store.activeSeqItem);
  console.log({ activeSeqItem });

  // TODO : w-96? is it needed?
  return (
    <section
      className={cn(
        "w-full overflow-y-scroll overscroll-contain rounded-lg border border-neutral-900 bg-background p-4",
        "gradient-bg h-full",
      )}
    >
      {/* <div className="sticky inset-x-0 top-0 h-12 border-b"></div>
      <div className="h-screen"></div>
      <div className="h-screen border"></div> */}
      {/*      {activeSeqItem?.itemType === "text" && (
        <SequenceItemEditorText key={activeSeqItem.itemId} />
      )}
      {activeSeqItem?.itemType === "image" && <SequenceItemEditorImage />}
      {(activeSeqItem?.itemType === "caption" ||
        activeSeqItem?.parentItem?.itemType === "caption") && (
        <SequenceItemEditorCaption />
      )} */}
      {activeSeqItem?.itemType === "zoom" && (
        <SequenceItemEditorZoom key={activeSeqItem.itemId} />
      )}
    </section>
  );
};

export default SequenceItemEditorRenderer;
