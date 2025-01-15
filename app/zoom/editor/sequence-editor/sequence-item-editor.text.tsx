"use client";

import { useState } from "react";
import Editor from "~/components/editor/advanced-editor";
import { Button } from "~/components/ui/button";
import { useEditingStore } from "~/store/editing.store";
import useVideoStore from "~/store/video.store";
import type { TextSequenceItemType } from "~/types/timeline.types";

const SequenceItemEditorText = () => {
  const updateTextEditableProps = useVideoStore(
    (store) => store.updateTextEditableProps,
  );
  const activeSeqItemLite = useEditingStore((state) => state.activeSeqItem!);
  const sequenceItems = useVideoStore((store) => store.props.sequenceItems);

  const sequenceItem = sequenceItems[
    activeSeqItemLite.itemId
  ] as TextSequenceItemType;

  // console.log("activeSequenceItem editableProps", sequenceItem);

  const [editorText, setEditorText] = useState(
    sequenceItem?.editableProps?.text || "",
  );

  const handleSave = () => {
    updateTextEditableProps(
      activeSeqItemLite.layerId,
      activeSeqItemLite.itemId,
      { text: editorText },
    );
  };

  return (
    <>
      <div className="sticky inset-x-0 top-0 flex h-12 items-center justify-end gap-2 p-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSave}>
          Save
        </Button>
      </div>

      <Editor initialValue={editorText} onChange={setEditorText} />
    </>
  );
};

export default SequenceItemEditorText;
