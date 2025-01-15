"use client";
import ZoomPointSelector from "@/components/zoom-pointer-selector";
import type { Position } from "react-rnd";

const MyComponent: React.FC = () => {
  const handlePositionChange = (position: Position) => {
    console.log("Position:", position);
  };

  const handleZoomChange = (zoomLevel: number) => {
    console.log("Zoom level:", zoomLevel);
  };

  return (
    <ZoomPointSelector
      onPositionChange={handlePositionChange}
      onZoomChange={handleZoomChange}
      aspectRatio={16 / 9}
      containerWidth={600}
      defaultZoom={1}
      defaultPosition={{ x: 0, y: 0 }}
    />
  );
};

export default MyComponent;
