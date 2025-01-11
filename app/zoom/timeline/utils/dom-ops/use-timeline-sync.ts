import type { PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useState } from "react";

interface TimelineSyncProps {
  playerRef: React.RefObject<PlayerRef>;
  currentFrame: number;
  frameToPixels: (frame: number) => number;
  pixelsToFrame: (pixels: number) => number;
  containerWidth: number;
  zoom: number; // Add zoom
}
export const useTimelineSynchronization = ({
  playerRef,
  currentFrame,
  frameToPixels,
  pixelsToFrame,
  containerWidth,
  zoom,
}: TimelineSyncProps) => {
  // Remove scrollPosition from props
  const [playheadPosition, setPlayheadPosition] = useState({ x: 0, y: 0 });

  // Update position when frame changes
  useEffect(() => {
    const newPosition = frameToPixels(currentFrame);
    setPlayheadPosition({ x: newPosition, y: 0 });
  }, [currentFrame, frameToPixels]);

  const seekToFrame = useCallback(
    (frame: number) => {
      if (playerRef.current) {
        playerRef.current.seekTo(frame);
      }
    },
    [playerRef],
  );

  const handlePlayheadDrag = useCallback(
    (_e: any, d: { x: number; y: number }) => {
      const totalWidth = containerWidth * zoom;
      const boundedX = Math.max(0, Math.min(d.x, totalWidth));

      setPlayheadPosition({ x: boundedX, y: 0 });
      seekToFrame(pixelsToFrame(boundedX));
    },
    [containerWidth, pixelsToFrame, seekToFrame, zoom],
  );

  const handleTimeLayerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const containerRect = e.currentTarget?.getBoundingClientRect();
      if (!containerRect) return;

      const clickX = e.clientX - containerRect.left;
      const totalWidth = containerWidth * zoom;
      const boundedX = Math.max(0, Math.min(clickX, totalWidth));

      setPlayheadPosition({ x: boundedX, y: 0 });
      seekToFrame(pixelsToFrame(boundedX));
    },
    [containerWidth, pixelsToFrame, seekToFrame, zoom],
  );

  return {
    playheadPosition,
    handlePlayheadDrag,
    handleTimeLayerClick,
    seekToFrame,
  };
};
