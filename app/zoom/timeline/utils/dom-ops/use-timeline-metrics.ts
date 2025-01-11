import { useCallback, useEffect, useRef, useState } from "react";

interface TimelineMetricsOptions {
  durationInFrames: number;
  initialZoom?: number;
  minZoom?: number; // Add minimum zoom level
  maxZoom?: number; // Add maximum zoom level
}

export const useTimelineMetrics = ({
  durationInFrames,
  initialZoom = 1,
  minZoom = 1, // Default min zoom
  maxZoom = 10, // Default max zoom
}: TimelineMetricsOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(initialZoom);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const pixelsPerFrame = (containerWidth / durationInFrames) * zoom;

  const frameToPixels = useCallback(
    (frame: number) => {
      return frame * pixelsPerFrame;
    },
    [pixelsPerFrame],
  );

  const pixelsToFrame = useCallback(
    (pixels: number) => {
      return Math.round(pixels / pixelsPerFrame);
    },
    [pixelsPerFrame],
  );

  // Set timeline zoom with bounds checking
  const setTimelineZoom = useCallback(
    (newZoom: number) => {
      const boundedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(boundedZoom);
    },
    [minZoom, maxZoom],
  );

  // Calculate total timeline width
  const totalTimelineWidth = containerWidth * zoom;

  // Scroll to center on a specific frame
  const scrollToFrame = useCallback(
    (frame: number) => {
      if (containerRef.current) {
        const targetPosition = frameToPixels(frame);
        const scrollLeft = targetPosition - containerWidth / 2;
        containerRef.current.scrollLeft = Math.max(
          0,
          Math.min(scrollLeft, totalTimelineWidth - containerWidth),
        );
      }
    },
    [containerWidth, frameToPixels, totalTimelineWidth],
  );

  // Handle zoom around cursor position
  const handleZoomChange = useCallback(
    (newZoom: number, cursorX: number) => {
      if (!containerRef.current) return;

      // Get current center frame before zoom
      const cursorOffset = scrollPosition + cursorX;
      const frameAtCursor = pixelsToFrame(cursorOffset);

      // Apply new zoom
      setTimelineZoom(newZoom);

      // Calculate new scroll position to maintain cursor position
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const newPixelPosition = frameToPixels(frameAtCursor);
          const newScrollLeft = newPixelPosition - cursorX;
          containerRef.current.scrollLeft = Math.max(0, newScrollLeft);
        }
      });
    },
    [scrollPosition, pixelsToFrame, frameToPixels, setTimelineZoom],
  );

  return {
    containerRef,
    containerWidth,
    pixelsPerFrame,
    frameToPixels,
    pixelsToFrame,
    setTimelineZoom,
    handleZoomChange,
    zoom,
    scrollToFrame,
    scrollPosition,
    totalTimelineWidth,
  };
};
