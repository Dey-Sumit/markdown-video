import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PlayerRef } from "@remotion/player";
import { Pause, Play } from "lucide-react";
import React, { useCallback, useEffect } from "react";
export const PlayPauseButton: React.FC<{
  playerRef: React.RefObject<PlayerRef>;
}> = ({ playerRef }) => {
  console.log("PlayPauseButton", playerRef);

  const [playing, setPlaying] = React.useState(
    () => playerRef.current?.isPlaying() ?? false,
  );

  useEffect(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

    const onPlay = () => {
      setPlaying(true);
    };

    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const onToggle = useCallback(() => {
    console.log("onToggle", playerRef);

    playerRef.current?.toggle();
  }, [playerRef]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8")}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{playing ? "Pause" : "Play"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
