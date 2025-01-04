"use client";

import CodeVideoComposition from "@/video/compositions/code-video-composition";
import { compositionMetaData } from "@/video/compositions/code-video-composition/config";
import { Player, type PlayerRef } from "@remotion/player";
import { useRef, useState } from "react";
import PlayerControls from "./player-controls";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useProjectStore } from "@/store/project-store";

const XPlayer = () => {
  const playerRef = useRef<PlayerRef>(null);
  const {
    currentProject: { duration, scenes, styles },
  } = useProjectStore();


  const { width, height, fps } = compositionMetaData;
  const [reloadKey, setReloadKey] = useState(1);

  return (
    <section>
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
          overflowVisible
          inputProps={{
            scenes: scenes,
            styles: styles,
          }}
          key={reloadKey}
          ref={playerRef}
          errorFallback={({ error }) => {
            return <ErrorView error={error} setReloadKey={setReloadKey} />;
          }}
        />
      </div>
      <PlayerControls
        duration={duration}
        playerRef={playerRef}
        key={reloadKey}
      />
    </section>
  );
};

export default XPlayer;

const ErrorView = ({
  error,
  setReloadKey,
}: {
  error: Error;
  setReloadKey: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[90%] w-[90%] flex-col items-center justify-center gap-8 border bg-gray-950 p-8 text-4xl">
        <pre className="whitespace-pre-line leading-10">
          There was an error: {JSON.stringify(error.message)}{" "}
        </pre>

        <Button
          className="flex items-center justify-center gap-4 p-16 text-4xl"
          onClick={() => setReloadKey((prev) => prev + 1)}
        >
          Reload Player
          <RefreshCcw className="ml-4 size-14" />
        </Button>
      </div>
    </div>
  );
};
