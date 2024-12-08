import { TooltipProvider } from "@/components/ui/tooltip";
import { compositionMetaData } from "@/video/compositions/code-video-composition/config";
import type { PlayerRef } from "@remotion/player";
import { PlayerFullscreen } from "./full-screen";
import { MuteButton } from "./mute";
import { PlayPauseButton } from "./play-pause-button";
import SeekBar from "./seek-bar";
import TimeDisplay from "./time-display";

const PlayerControls = ({
  playerRef,
  duration,
}: {
  playerRef: React.RefObject<PlayerRef>;
  duration: number;
}) => {
  return (
    <TooltipProvider>
      <section className="flex w-full flex-col gap-1 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlayPauseButton playerRef={playerRef} />
            <TimeDisplay
              playerRef={playerRef}
              fps={compositionMetaData.fps}
              durationInFrames={duration}
            />
            <MuteButton playerRef={playerRef} />
          </div>
          {/* <VolumeSlider playerRef={playerRef} /> */}
          <div>
            <PlayerFullscreen playerRef={playerRef} />
          </div>
        </div>
        <div className="px-2">
          <SeekBar durationInFrames={duration} playerRef={playerRef} />
        </div>
      </section>
    </TooltipProvider>
  );
};

export default PlayerControls;
