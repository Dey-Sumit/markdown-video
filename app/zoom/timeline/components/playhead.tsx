import { type RefObject, useCallback, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { LAYOUT } from "../../layout.const";
import useThrottle from "../hooks/use-throttle";
import { useTimeline } from "../video-timeline-context";

const {
  TIMELINE: { PLAY_HEAD_WIDTH_IN_PX },
} = LAYOUT;

const PlayHead = () => {
  const {
    handlePlayheadDrag,
    playheadPosition,
    containerRef,
    zoom,
    containerWidth,
  } = useTimeline(); // Remove scrollPosition

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: PLAY_HEAD_WIDTH_IN_PX,
        height: 100,
      }}
      position={playheadPosition}
      dragAxis="x"
      bounds="parent"
      enableResizing={false}
      onDrag={(e, data) => {
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const rightEdge = data.x + PLAY_HEAD_WIDTH_IN_PX;
          const leftEdge = data.x;

          // Bound check against total width
          const maxX = containerWidth * zoom - PLAY_HEAD_WIDTH_IN_PX;
          const boundedX = Math.max(0, Math.min(data.x, maxX));

          // Scroll logic
          const scrollSpeed = Math.ceil(zoom * 5);
          const scrollTriggerMargin = 100;

          if (rightEdge > containerRect.width - scrollTriggerMargin) {
            container.scrollLeft += scrollSpeed;
          }
          if (leftEdge < scrollTriggerMargin) {
            container.scrollLeft -= scrollSpeed;
          }

          // Pass the actual position for frame calculation
          handlePlayheadDrag?.(e, { ...data, x: boundedX });
        }
      }}
      dragHandleClassName="playhead-handle"
    >
      <div className="absolute left-0 top-4 flex h-full w-full flex-col items-center rounded-xl">
        <div className="playhead-handle -mb-px size-4 cursor-grab rounded-full border border-indigo-500 bg-indigo-600 transition-all hover:size-5" />
        <div className="h-full w-full border border-indigo-500 bg-indigo-600" />
      </div>
    </Rnd>
  );
};

export default PlayHead;

interface PlayHeadProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  initialTop?: number;
  trackLayerCount?: number;
  trackHeight?: string;
}

const {
  TIMELINE: { TRACK_LAYER_HEIGHT_IN_PX },
} = LAYOUT;

const THROTTLE_MS = 0;
const PLAYHEAD_WIDTH = 1;
const PlayHead2: React.FC<PlayHeadProps> = ({
  scrollContainerRef,
  initialTop = 12,
  trackLayerCount: layers = 7,
}) => {
  const {
    handlePlayheadDrag,
    playheadPosition,
    containerRef,
    zoom,
    containerWidth,
  } = useTimeline(); // Remove scrollPosition
  const [scrollTop, setScrollTop] = useState<number>(initialTop);

  /**
   * Calculate maximum scrollable height based on content
   * @returns Maximum scroll value in pixels
   */
  const maxScroll = useCallback(() => {
    if (!scrollContainerRef.current) return 0;
    const containerHeight = scrollContainerRef.current.clientHeight;

    const contentHeight = TRACK_LAYER_HEIGHT_IN_PX * (layers + 1);
    return Math.max(0, contentHeight - containerHeight);
  }, [layers, scrollContainerRef]);

  /**
   * Update playhead position based on current scroll position
   * Ensures scroll position stays within bounds
   */
  const updateScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentScroll = Math.min(container.scrollTop, maxScroll());
    setScrollTop(initialTop + currentScroll);
  }, [initialTop, maxScroll, scrollContainerRef]);

  // Throttle scroll updates for performance while maintaining smooth animation
  const throttledScrollHandler = useThrottle(updateScrollPosition, THROTTLE_MS);

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", throttledScrollHandler);
    return () =>
      container.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler, scrollContainerRef]);

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: PLAYHEAD_WIDTH,
        height: 182,
      }}
      position={playheadPosition}
      dragAxis="x"
      bounds="parent"
      enableResizing={false}
      className="z-20"
      style={{ top: `${scrollTop}px` }}
      onDrag={(e, data) => {
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const rightEdge = data.x + PLAY_HEAD_WIDTH_IN_PX;
          const leftEdge = data.x;

          // Bound check against total width
          const maxX = containerWidth * zoom - PLAY_HEAD_WIDTH_IN_PX;
          const boundedX = Math.max(0, Math.min(data.x, maxX));

          // Scroll logic
          const scrollSpeed = Math.ceil(zoom * 5);
          const scrollTriggerMargin = 100;

          if (rightEdge > containerRect.width - scrollTriggerMargin) {
            container.scrollLeft += scrollSpeed;
          }
          if (leftEdge < scrollTriggerMargin) {
            container.scrollLeft -= scrollSpeed;
          }

          // Pass the actual position for frame calculation
          handlePlayheadDrag?.(e, { ...data, x: boundedX });
        }
      }}
      dragHandleClassName="playhead-handle"
    >
      <div
        // layout
        className="absolute left-0 top-0 flex h-full w-full flex-col items-center rounded-xl"
      >
        <div className="playhead-handle -mb-px size-4 cursor-grab rounded-full border border-indigo-500 bg-indigo-600 transition-all hover:size-5" />
        <div className="h-full w-full border border-indigo-500 bg-indigo-600" />
      </div>
    </Rnd>
  );
};

export { PlayHead2 };
