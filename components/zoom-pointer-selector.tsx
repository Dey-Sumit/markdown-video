import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrossIcon } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface ZoomPointSelectorProps {
  onPositionChange?: (position: Position) => void;
  onZoomChange?: (zoomLevel: number) => void;
  defaultZoom?: number;
  defaultPosition?: Position;
  editorWidth?: number;
  editorHeight?: number;
}

const EDITOR_WIDTH = 1920;
const EDITOR_HEIGHT = 1080;

const ZoomPointSelector: React.FC<ZoomPointSelectorProps> = ({
  onPositionChange,
  onZoomChange,
  defaultZoom = 1,
  defaultPosition = { x: 0, y: 0 },
  editorWidth = EDITOR_WIDTH,
  editorHeight = EDITOR_HEIGHT,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [zoomLevel, setZoomLevel] = useState<number>(defaultZoom);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = width * (9 / 16);
        setContainerDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const getEditorCoordinates = (x: number, y: number): Position => {
    // Adjust coordinates by subtracting half the draggable point size (20px)
    const adjustedX = x + 20;
    const adjustedY = y + 20;

    // Map the coordinates to editor space
    const mappedX = Math.round(
      (adjustedX / containerDimensions.width) * editorWidth,
    );
    const mappedY = Math.round(
      (adjustedY / containerDimensions.height) * editorHeight,
    );

    // Ensure coordinates stay within bounds
    const boundedX = Math.max(0, Math.min(mappedX, editorWidth));
    const boundedY = Math.max(0, Math.min(mappedY, editorHeight));

    // Log the coordinate transformation for debugging
    console.log("Container dims:", containerDimensions);
    console.log("Raw coords:", { x, y });
    console.log("Adjusted coords:", { x: adjustedX, y: adjustedY });
    console.log("Mapped coords:", { x: boundedX, y: boundedY });

    return {
      x: boundedX,
      y: boundedY,
    };
  };

  return (
    <div className="space-y-6">
      {/* Zoom viewport */}
      <div className="relative w-full" ref={containerRef}>
        <div className="relative w-full pb-[56.25%]">
          <div className="absolute inset-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200/40 dark:border-gray-800/40"
                />
              ))}
            </div>

            {/* Draggable point */}
            {containerDimensions.width > 0 && (
              <Rnd
                default={{
                  x: 0,
                  y: 0,
                  width: 32,
                  height: 32,
                }}
                bounds="parent"
                enableResizing={false}
                onDragStart={() => setIsDragging(true)}
                onDragStop={(e, d) => {
                  setIsDragging(false);
                  const newPosition = getEditorCoordinates(d.x, d.y);
                  setPosition(newPosition);
                  onPositionChange?.(newPosition);
                }}
              >
                <div
                  className={`flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-primary/90 shadow-[0_0_12px_rgba(0,0,0,0.2)] ring-4 ring-primary/20 transition-all duration-200 hover:bg-primary ${isDragging ? "scale-90 shadow-[0_0_16px_rgba(0,0,0,0.3)]" : ""} `}
                ></div>
              </Rnd>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Coordinates display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="x-coordinate"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              X Position
            </Label>
            <Input
              id="x-coordinate"
              value={position.x.toFixed(0)}
              readOnly
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="y-coordinate"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Y Position
            </Label>
            <Input
              id="y-coordinate"
              value={position.y.toFixed(0)}
              readOnly
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Zoom slider */}
        <div className="space-y-2">
          <Label
            htmlFor="zoom-level"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Zoom Level
          </Label>
          <Slider
            id="zoom-level"
            min={1}
            max={5}
            step={0.1}
            value={[zoomLevel]}
            onValueChange={(value) => {
              setZoomLevel(value[0]);
              onZoomChange?.(value[0]);
            }}
            className="py-4"
          />
        </div>

        {/* Reset button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setPosition(defaultPosition);
              setZoomLevel(defaultZoom);
              onPositionChange?.(defaultPosition);
              onZoomChange?.(defaultZoom);
            }}
            className="text-sm"
          >
            Reset Position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZoomPointSelector;
