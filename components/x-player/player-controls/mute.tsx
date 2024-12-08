import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlayerRef } from "@remotion/player";
import { Volume2, VolumeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

export const MuteButton: React.FC<{
  playerRef: React.RefObject<PlayerRef>;
}> = ({ playerRef }) => {
  const [muted, setMuted] = useState(true);

  const onClick = React.useCallback(() => {
    if (!playerRef.current) {
      return;
    }

    if (playerRef.current.isMuted()) {
      playerRef.current.unmute();
    } else {
      playerRef.current.mute();
    }
  }, [playerRef]);

  useEffect(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

    const onMuteChange = () => {
      setMuted(current.isMuted());
    };

    current.addEventListener("mutechange", onMuteChange);
    return () => {
      current.removeEventListener("mutechange", onMuteChange);
    };
  }, [playerRef]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={"h-8 w-8"}
        >
          {muted ? <VolumeOff size={14} /> : <Volume2 size={14} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{muted ? "Unmute" : "Mute"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
