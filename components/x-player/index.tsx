"use client";

import useCompositionStore from "@/store/composition-store";
import CodeVideoComposition from "@/video/compositions/code-video-composition";
import { compositionMetaData } from "@/video/compositions/code-video-composition/config";
import { Player, type PlayerRef } from "@remotion/player";
import { useRef } from "react";
import PlayerControls from "./player-controls";

const XPlayer = () => {
  const playerRef = useRef<PlayerRef>(null);
  const duration = useCompositionStore((state) => state.duration);
  const scenes = useCompositionStore((state) => state.scenes);
  const { width, height, fps } = compositionMetaData;

  return (
    <div>
      <div
        style={{
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <Player
          component={CodeVideoComposition}
          durationInFrames={duration}
          fps={fps}
          compositionHeight={height}
          compositionWidth={width}
          style={{
            width: "100%",
            height: "100%",
          }}
          className=""
          loop
          initiallyMuted
          overflowVisible
          inputProps={{
            scenes: scenes,
          }}
          ref={playerRef}
          errorFallback={({ error }) => {
            return (
              <div className="h-full w-full text-4xl">
                There was an error: {JSON.stringify(error)}{" "}
              </div>
            );
          }}
        />
      </div>
      <PlayerControls duration={duration} playerRef={playerRef} />
    </div>
  );
};

export default XPlayer;
