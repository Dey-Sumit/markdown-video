import type { PlayerRef } from "@remotion/player";
import React, { useEffect, useState } from "react";

interface TimeFormatOptions {
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  showFrames?: boolean;
  showMilliseconds?: boolean;
}

export const formatTime = (
  frame: number,
  fps: number,
  options: TimeFormatOptions = {
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    showFrames: true,
    showMilliseconds: false,
  },
): string => {
  const totalSeconds = frame / fps;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = Math.floor(frame % fps);
  const milliseconds = Math.floor(((frame % 1) * 1000) / fps);

  const parts: string[] = [];

  if (options.showHours || hours > 0) {
    parts.push(String(hours).padStart(2, "0"));
  }

  if (options.showMinutes || options.showHours || hours > 0) {
    parts.push(String(minutes).padStart(2, "0"));
  }

  if (options.showSeconds) {
    parts.push(String(seconds).padStart(2, "0"));
  }

  if (options.showFrames) {
    parts.push(String(frames).padStart(2, "0"));
  }

  if (options.showMilliseconds) {
    parts.push(String(milliseconds).padStart(3, "0"));
  }

  return parts.join(":");
};

interface TimeDisplayProps {
  durationInFrames: number;
  fps: number;
  playerRef: React.RefObject<PlayerRef>;
  formatOptions?: TimeFormatOptions;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  durationInFrames,
  fps,
  playerRef,
  formatOptions = {
    showHours: false,
    showMinutes: true,
    showSeconds: true,
    showFrames: true,
    showMilliseconds: false,
  },
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const { current } = playerRef;
    if (!current) return;

    const onTimeUpdate = () => {
      setTime(current.getCurrentFrame());
    };

    current.addEventListener("frameupdate", onTimeUpdate);
    return () => {
      current.removeEventListener("frameupdate", onTimeUpdate);
    };
  }, [playerRef]);

  return (
    <div style={{ fontFamily: "monospace" }}>
      <span>
        {formatTime(time, fps, formatOptions)}/
        {formatTime(durationInFrames, fps, formatOptions)}
      </span>
    </div>
  );
};

export default TimeDisplay;

// Usage example:
// <TimeDisplay
//   durationInFrames={300}
//   fps={30}
//   playerRef={playerRef}
//   formatOptions={{
//     showHours: false,
//     showMinutes: true,
//     showSeconds: true,
//     showFrames: true,
//     showMilliseconds: false
//   }}
// />
