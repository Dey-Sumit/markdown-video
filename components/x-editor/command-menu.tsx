import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import { editor } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";
import { Input } from "../ui/input";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description: string;
  type: "template" | "action";
  action?: () => void;
  template?: string;
  keywords?: string[];
  category?: string;
}

export interface Position {
  top: number;
  left: number;
}

interface CommandMenuProps {
  position: Position;
  onClose: () => void;
  isVisible: boolean;
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
}

const COMMANDS: Command[] = [
  {
    id: "scene-text-transition",
    type: "template",
    label: "Scene: Text with Transition",
    description: "Create scene with text and entrance animation",
    template: `## !!scene --title=Text --duration=4 --background=black
!text --content="Your Text With Animation" --animation=fadeInSlideUp --duration=3 --delay=0.5
!transition --type=slide --duration=0.3 --direction=from-left`,
    category: "Scenes",
    keywords: ["scene", "text", "transition"],
  },

  {
    id: "scene-code-transition",
    type: "template",
    label: "Scene: Code with Transition",
    description: "Code scene with entrance animation",
    template: `## !!scene --title=Code --duration=4 --background=transparent
!transition --type=slide --duration=0.8 --direction=from-bottom

\`\`\`js !

const fastestEditor = () => {

    return "markdownvideo.com"

}

fastestEditor()

\`\`\``,
    category: "Scenes",
    keywords: ["scene", "code", "transition"],
  },
  {
    id: "scene-full",
    type: "template",
    label: "Scene: Full Template",
    description: "Complete scene with text, code and transitions",
    template: `## !!scene --title=Full --duration=8
!transition --type=fade --duration=0.3

\`\`\`js !
// Your code here
\`\`\``,
    category: "Scenes",
    keywords: ["scene", "full", "complete"],
  },
  {
    id: "scene",
    type: "template",
    label: "Create Scene",
    description: "Add new scene with basic structure",
    template: `## !!scene --title=Scene --duration=5\n!transition --type=fade --duration=0.3\n\`\`\`js !\n\n\`\`\``,
    keywords: ["scene", "new", "create"],
    category: "Scenes",
  },
  {
    id: "text",
    type: "template",
    label: "Add Text",
    description: "Insert text overlay",
    template: `!text --content="Your Text" --animation=fade --duration=3`,
    keywords: ["text", "overlay", "content"],
    category: "Content",
  },
  {
    id: "transition",
    type: "template",
    label: "Add Transition",
    description: "Insert transition effect",
    template: `!transition --type=fade --duration=0.3`,
    keywords: ["transition", "animation", "effect"],
    category: "Effects",
  },
  {
    id: "docs",
    type: "action",
    label: "Open Documentation",
    description: "Open the documentation in a new tab",
    action: () => window.open("https://docs.example.com", "_blank"),
    keywords: ["docs", "documentation", "help"],
    category: "Help",
  },
  {
    id: "feedback",
    type: "action",
    label: "Give Feedback",
    description: "Send feedback to improve the editor",
    action: () => window.open("https://feedback.example.com", "_blank"),
    keywords: ["feedback", "report", "issue", "bug"],
    category: "Help",
  },
];

const CommandMenu = memo(
  ({ position, onClose, isVisible, editor, monaco }: CommandMenuProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredCommands = searchTerm
      ? COMMANDS.filter(
          (command) =>
            command.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            command.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            command.keywords?.some((keyword) =>
              keyword.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        )
      : COMMANDS;

    const handleCommand = useCallback(
      (command: Command) => {
        if (command.type === "action" && command.action) {
          command.action();
        } else if (command.type === "template" && editor && monaco) {
          const model = editor.getModel();
          if (model) {
            const position = editor.getPosition();
            if (position) {
              const selections = editor.getSelections() || [];
              model.pushEditOperations(
                selections,
                [
                  {
                    range: new monaco.Range(
                      position.lineNumber,
                      position.column - 1,
                      position.lineNumber,
                      position.column,
                    ),
                    text: command.template || "",
                  },
                ],
                () => selections,
              );
              editor.focus();
            }
          }
        }
        onClose();
      },
      [editor, monaco, onClose],
    );
    useEffect(() => {
      if (isVisible && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isVisible]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setSearchTerm("");
          requestAnimationFrame(() => {
            editor?.focus();
          });
          onClose();
        }
      };

      if (isVisible) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isVisible, onClose, editor]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (!isVisible) return;

        switch (e.key) {
          case "ArrowDown":
          case "ArrowUp": {
            e.preventDefault();
            let newIndex = selectedIndex;

            if (e.key === "ArrowDown") {
              if (selectedIndex < filteredCommands.length - 1) {
                newIndex = selectedIndex + 1;
              }
            } else {
              if (selectedIndex > 0) {
                newIndex = selectedIndex - 1;
              }
            }

            setSelectedIndex(newIndex);

            const listItems = menuRef.current?.querySelectorAll("li");
            const item = listItems?.[newIndex];
            const container = menuRef.current?.querySelector(".max-h-72");

            if (item && container) {
              const itemRect = item.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              const isOutOfView =
                itemRect.bottom > containerRect.bottom ||
                itemRect.top < containerRect.top;

              if (isOutOfView) {
                item.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }
            }
            break;
          }
          case "Enter":
            e.preventDefault();
            if (filteredCommands.length > 0) {
              handleCommand(filteredCommands[selectedIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
        }
      };

      if (isVisible) {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    }, [isVisible, selectedIndex, handleCommand, filteredCommands.length]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [searchTerm]);

    if (!isVisible) return null;

    // Group commands by category
    const groupedCommands = filteredCommands.reduce(
      (acc, command) => {
        const category = command.category || "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(command);
        return acc;
      },
      {} as Record<string, Command[]>,
    );

    return (
      <div
        ref={menuRef}
        className="absolute z-50 w-80 overflow-hidden rounded-lg border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-xl backdrop-blur-lg"
        style={{
          top: position.top + 20,
          left: position.left,
        }}
      >
        <div className="border-b p-2">
          <Input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commands..."
            className="w-full border bg-transparent text-sm"
          />
        </div>
        {filteredCommands.length > 0 ? (
          <ul className="max-h-72 overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div
                key={category}
                className="border-b border-neutral-800 last:border-0"
              >
                {/* <div className="bg-neutral-950/50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {category}
                </div> */}
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <li
                      key={command.id}
                      className={`cursor-pointer border-l-2 px-4 py-3 transition-colors ${
                        globalIndex === selectedIndex
                          ? "border-l-2 border-primary bg-primary/30"
                          : "border-transparent hover:bg-primary/10"
                      }`}
                      onClick={() => handleCommand(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium text-gray-200">
                          {command.label}
                        </div>
                        {command.type === "action" && (
                          <div className="rounded-md bg-neutral-800 px-1.5 py-1.5 text-xs text-neutral-400">
                            <ExternalLink size={16} />
                          </div>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {command.description}
                      </div>
                    </li>
                  );
                })}
              </div>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-3 text-sm text-gray-400">
            No commands found
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.position.top === nextProps.position.top &&
      prevProps.position.left === nextProps.position.left
    );
  },
);

CommandMenu.displayName = "CommandMenu";

export default CommandMenu;
