import React, { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FloatingEditButtonProps {
  editor: editor.IStandaloneCodeEditor;
}

interface Position {
  top: number;
  left: number;
}

const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ editor }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      const selection = editor.getSelection();

      if (!selection || selection.isEmpty()) {
        setVisible(false);
        setShowInput(false);
        return;
      }

      // Get coordinates for the selection start
      const startPosition = editor.getScrolledVisiblePosition(
        selection.getStartPosition(),
      );

      if (startPosition) {
        // Position the button above the selection
        setPosition({
          top: startPosition.top - 40, // 40px above selection
          left: startPosition.left,
        });
        setVisible(true);
      }
    };

    // Add selection change listener
    const disposable = editor.onDidChangeCursorSelection(handleSelectionChange);

    // Handle scroll events to update position
    const scrollDisposable = editor.onDidScrollChange(() => {
      handleSelectionChange();
    });

    // Cleanup listeners
    return () => {
      disposable.dispose();
      scrollDisposable.dispose();
    };
  }, [editor]);

  const handleEdit = (): void => {
    setShowInput(true);
    // Get selected text and set as initial value
    const selection = editor.getSelection();
    const model = editor.getModel();
    if (selection && model) {
      const selectedText = model.getValueInRange(selection);
      setInputValue(selectedText);
    }
  };

  const handleInputSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const selection = editor.getSelection();
    if (selection) {
      // Create an editor operation
      editor.executeEdits("user-edit", [
        {
          range: selection,
          text: inputValue,
          forceMoveMarkers: true,
        },
      ]);
    }
    setShowInput(false);
    setVisible(false);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === "Escape") {
      setShowInput(false);
      setVisible(false);
    }
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setShowInput(false);
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        top: Math.max(0, position.top),
        left: position.left,
      }}
    >
      {!showInput ? (
        <Button
          variant="default"
          size="sm"
          className="shadow-lg"
          onClick={handleEdit}
        >
          Edit
        </Button>
      ) : (
        <form onSubmit={handleInputSubmit} className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleInputKeyDown}
            className="h-8 w-64"
            autoFocus
          />
          <Button type="submit" size="sm">
            Save
          </Button>
        </form>
      )}
    </div>
  );
};

export default FloatingEditButton;
