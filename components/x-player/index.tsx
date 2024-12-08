"use client";

import CodeVideoComposition from "@/video/compositions/code-video-composition";
import { compositionMetaData } from "@/video/compositions/code-video-composition/config";
import { Step } from "@/video/compositions/code-video-composition/types.composition";
import { Player, PlayerRef } from "@remotion/player";
import { useRef } from "react";
import PlayerControls from "./player-controls";

const duration = 180;
const HARDCODED_STEPS: Step[] = [
  {
    code: {
      meta: "Example 1: All promises resolve",
      value:
        '\nconst user = {\n  name: "Lorem",\n  age: 26,\n}\n\nconsole.log(user)\n//           ^?\n',
      lang: "typescript",
      code: '\nconst user = {\n  name: "Lorem",\n  age: 26,\n}\n\nconsole.log(user)\n//           ^?\n',
      tokens: [
        "\n",
        ["const", "#FF7B72"],
        " ",
        ["user", "#79C0FF"],
        " ",
        ["=", "#FF7B72"],
        " ",
        ["{", "#C9D1D9"],
        "\n  ",
        ["name:", "#C9D1D9"],
        " ",
        ['"Lorem"', "#A5D6FF"],
        [",", "#C9D1D9"],
        "\n  ",
        ["age:", "#C9D1D9"],
        " ",
        ["26", "#79C0FF"],
        [",", "#C9D1D9"],
        "\n",
        ["}", "#C9D1D9"],
        "\n\n",
        ["console.", "#C9D1D9"],
        ["log", "#D2A8FF"],
        ["(user)", "#C9D1D9"],
        "\n",
        ["//           ^?", "#8B949E"],
        "\n",
      ],
      annotations: [],
      themeName: "github-dark",
      style: {
        color: "#c9d1d9",
        background: "#0d1117",
        colorScheme: "dark",
      },
    },
    duration: 180,
    fontUtils: "",
    transition: "magic",
  },
];
const XPlayer = () => {
  const playerRef = useRef<PlayerRef>(null);

  return (
    <div>
      <div
        className="grid place-items-center border text-white"
        style={{
          aspectRatio: `${compositionMetaData.width} / ${compositionMetaData.height}`,
        }}
      >
        <Player
          component={CodeVideoComposition}
          durationInFrames={duration}
          fps={compositionMetaData.fps}
          compositionHeight={compositionMetaData.height}
          compositionWidth={compositionMetaData.width}
          style={{
            width: "100%",
            height: "100%",
          }}
          className=""
          loop
          initiallyMuted
          overflowVisible
          inputProps={{
            steps: HARDCODED_STEPS,
          }}
          ref={playerRef}
        />
      </div>
      <PlayerControls duration={duration} playerRef={playerRef} />
    </div>
  );
};

export default XPlayer;
