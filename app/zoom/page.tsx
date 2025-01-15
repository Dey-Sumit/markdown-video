"use client";
import React, { useRef } from "react";
import { LAYOUT } from "./layout.const";
// import VideoAndTimeline from "./components/video-and-timeline";
import type { PlayerRef } from "@remotion/player";
import CompositionPreview from "./components/compisition-preview";
import { useZoomProjectStore } from "./store/zoom.store";
import { VideoTimelineProvider } from "./timeline/video-timeline-context";

import { Separator } from "@radix-ui/react-separator";
import { PlayPauseButton } from "./timeline/components/player-controls/play-pause-button";
import TimeDisplay from "./timeline/components/player-controls/time-display";
import { MuteButton } from "./timeline/components/player-controls/mute";
import { VolumeSlider } from "./timeline/components/player-controls/volume-slider";
import { PlayerFullscreen } from "./timeline/components/player-controls/full-screen";
import VideoTimeline from "./timeline/components/video-timeline";
import Toolbar from "./timeline/components/toolbar";
import dynamic from "next/dynamic";
import SequenceItemEditor from "./editor/sequence-editor/sequence-item-editor";

const {
  SIDE_NAVBAR_WIDTH,
  NAVBAR_ITEM_CONTENT_WIDTH,
  TIMELINE: { TIMELINE_CONTAINER_HEIGHT },
  PROJECT_HEADER_HEIGHT,
} = LAYOUT;

const Page = () => {
  const playerRef = useRef<PlayerRef>(null);

  const { zoomPoints, videos, background } = useZoomProjectStore();

  return (
    <div className="flex h-screen flex-col bg-black">
      <div
        className="shrink-0 border-b border-neutral-900"
        style={{
          height: PROJECT_HEADER_HEIGHT,
        }}
      />
      {/* -------------------- video player and edit sequence container -------------------- */}

      {/* -------------------- video player and edit sequence container -------------------- */}

      <div
        className="flex flex-shrink-0"
        style={{
          height: `calc(100vh - ${TIMELINE_CONTAINER_HEIGHT} - ${PROJECT_HEADER_HEIGHT})`,
        }}
      >
        <section className="editorBg relative flex flex-[0.75] flex-col">
          <CompositionPreview playerRef={playerRef} />
          <Toolbar>
            <div className="flex items-center space-x-3">
              <PlayPauseButton playerRef={playerRef} />
              <TimeDisplay
                playerRef={playerRef}
                fps={30}
                durationInFrames={1000} // TODO : FIXED
              />
              <MuteButton playerRef={playerRef} />
              <VolumeSlider playerRef={playerRef} />
              <PlayerFullscreen playerRef={playerRef} />
              <Separator orientation="vertical" className="h-8" />
            </div>
          </Toolbar>
        </section>
        <section className="flex-[0.25] p-4">
          {/* --------------------  sequence item editor container starts -------------------- */}
          <SequenceItemEditor />
          {/* -------------------- sequence item editor container ends -------------------- */}
        </section>
      </div>

      <section className="relative h-full">
        {zoomPoints && (
          <VideoTimelineProvider playerRef={playerRef}>
            <VideoTimeline />
          </VideoTimelineProvider>
        )}
      </section>
    </div>
  );
};

export default Page;
