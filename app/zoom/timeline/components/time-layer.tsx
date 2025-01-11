import { useMemo } from "react";
import { useTimeline } from "../video-timeline-context";
import useVideoStore from "../store/video.store";

const TIME_PADDING = 0; // pixels padding on each side
const TimeLayer = () => {
  const {
    containerWidth,
    handleTimeLayerClick,

    zoom = 1, // Add zoom from context
    frameToPixels,
  } = useTimeline();

  const compositionDurationInFrames = useVideoStore(
    (state) => state.props.compositionMetaData.duration,
  );

  const timelineDurationInFrames = compositionDurationInFrames;
  const fps = useVideoStore((state) => state.props.compositionMetaData.fps);

  // Calculate the total width based on zoom
  const totalWidth = containerWidth * zoom;

  const timeMarkers = useMemo(() => {
    const durationInSeconds = Math.ceil(timelineDurationInFrames / fps);

    // Base number of markers we want to show
    const targetMarkers = 10;

    // Calculate seconds per marker based on zoom
    let secondsPerMarker = Math.ceil(durationInSeconds / targetMarkers / zoom);

    // Round to nearest nice number
    const roundToNice = (num: number) => {
      const niceNumbers = [1, 2, 5, 10, 15, 30, 60];
      return niceNumbers.reduce((prev, curr) =>
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev,
      );
    };

    secondsPerMarker = roundToNice(secondsPerMarker);

    const markers = [];
    for (
      let second = 0;
      second <= durationInSeconds;
      second += secondsPerMarker
    ) {
      const frame = second * fps;
      const position = frameToPixels(frame) + TIME_PADDING;

      // Only add marker if it fits within the container
      if (position <= totalWidth) {
        markers.push({
          time: second,
          frame,
          position,
        });
      }
    }

    return markers;
  }, [timelineDurationInFrames, fps, zoom, frameToPixels, totalWidth]);

  // const formatTime = (seconds: number) => {
  //   if (seconds < 60) return `${seconds}s`;
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  // };
  // Replace the existing formatTime function with this:
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div
      onClick={handleTimeLayerClick}
      className="relative h-full border-t bg-black text-[8px] text-gray-300"
      style={{
        width: totalWidth,
      }}
    >
      {/* Time markers */}
      {timeMarkers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex select-none flex-col items-center"
          style={{
            left: `${marker.position}px`,
            transform:
              index === 0
                ? "translateX(0%)"
                : index === timeMarkers.length - 1
                  ? "translateX(-100%)"
                  : "translateX(-50%)",
          }}
        >
          <div className="h-2 w-px bg-gray-400" />
          <span>{formatTime(marker.time)}</span>
        </div>
      ))}

      {/* Sub-markers for more detail */}
      {zoom > 2 &&
        timeMarkers.map((marker, index) => {
          if (index === timeMarkers.length - 1) return null;

          const nextMarker = timeMarkers[index + 1];
          const subMarkers = [];
          const subCount = 4; // Number of sub-markers between main markers

          for (let i = 1; i < subCount; i++) {
            const position =
              marker.position +
              ((nextMarker.position - marker.position) * i) / subCount;

            subMarkers.push(
              <div
                key={`sub-${marker.time}-${i}`}
                className="absolute flex select-none flex-col items-center"
                style={{
                  left: `${position}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="h-1 w-px bg-gray-500 opacity-50" />
              </div>,
            );
          }
          return subMarkers;
        })}
    </div>
  );
};
export default TimeLayer;
