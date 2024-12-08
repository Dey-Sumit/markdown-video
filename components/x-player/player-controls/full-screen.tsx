import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PlayerRef } from "@remotion/player";
import { Expand, Minimize } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

export const PlayerFullscreen: React.FC<{
  playerRef: React.RefObject<PlayerRef>;
}> = ({ playerRef }) => {
  const [supportsFullscreen, setSupportsFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const { current } = playerRef;

    if (!current) {
      return;
    }

    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    current.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      current.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [playerRef]);

  useEffect(() => {
    // Must be handled client-side to avoid SSR hydration mismatch
    setSupportsFullscreen(
      (typeof document !== "undefined" &&
        (document.fullscreenEnabled ||
          // @ts-expect-error Types not defined
          document.webkitFullscreenEnabled)) ??
        false,
    );
  }, []);

  const handleFullScreen = useCallback(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

    if (isFullscreen) {
      current.exitFullscreen();
    } else {
      current.requestFullscreen();
    }
  }, [isFullscreen, playerRef]);

  if (!supportsFullscreen) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFullScreen}
          className={cn("h-8 w-8")}
        >
          {isFullscreen ? <Minimize size={14} /> : <Expand size={14} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p> {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
