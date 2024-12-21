import React, { useMemo } from "react";

const markdownCommands = [
  "## !!scene --duration=5",
  "!transition --type=slide",
  "--direction=from-bottom --duration=0.5",
  "!media --src=video.mp4",
  "--delay=2 --animation=fade",
  "## !!scene.end",
  "!transition --type=fade",
  "!text --content='Hello World'",
  "--size=lg --color=blue",
  "!media --type=image --src=hero.jpg",
  "## !!scene --background=blur",
  "--animation=zoom --duration=3",
  "!caption 'Welcome to the future'",
  "!split --layout=grid",
  "--columns=2 --gap=4",
];

interface MarkdownBgProps {
  className?: string;
}

const MarkdownBackground = ({ className }: MarkdownBgProps) => {
  const gridElements = useMemo(() => {
    // Create a 6x8 grid
    const rows = 6;
    const cols = 8;
    const totalCells = rows * cols;

    // Shuffle the commands array
    const shuffledCommands = [...markdownCommands]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(totalCells * 0.3)); // Take 30% of total cells

    // Create an array of available cell indices
    const availableCells = Array.from({ length: totalCells }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, shuffledCommands.length);

    return shuffledCommands.map((command, index) => {
      const cellIndex = availableCells[index];
      const row = Math.floor(cellIndex / cols);
      const col = cellIndex % cols;

      // Add slight random offset within each cell
      const offsetX = Math.random() * 4 - 2; // -2px to +2px
      const offsetY = Math.random() * 4 - 2; // -2px to +2px

      return (
        <div
          key={cellIndex}
          className="absolute select-none whitespace-nowrap font-mono text-sm text-gray-600/20"
          style={{
            left: `calc(${(col * 100) / cols}% + ${offsetX}px)`,
            top: `calc(${(row * 100) / rows}% + ${offsetY}px)`,
          }}
        >
          {command}
        </div>
      );
    });
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      {/* <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent opacity-90" /> */}
      <div className="relative h-full w-full">{gridElements}</div>
    </div>
  );
};

export default MarkdownBackground;
