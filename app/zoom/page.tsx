"use client";
import Dropzone from "@/components/dropzone";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
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

const {
  SIDE_NAVBAR_WIDTH,
  NAVBAR_ITEM_CONTENT_WIDTH,
  TIMELINE: { TIMELINE_CONTAINER_HEIGHT },
} = LAYOUT;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const playerRef = useRef<PlayerRef>(null);

  const { zoomPoints, videos, background } = useZoomProjectStore();

  return (
    <div className="flex h-screen flex-col">
      {/* -------------------- video player and edit sequence container -------------------- */}

      <div
        className="flex flex-shrink-0 bg-green-800"
        style={{
          height: `calc(100vh - ${TIMELINE_CONTAINER_HEIGHT})`,
        }}
      >
        <section className="editorBg relative flex-[0.8]">
          <CompositionPreview playerRef={playerRef} />
        </section>
        <section className="flex-[0.2] border"></section>
      </div>

      <section>
        {zoomPoints && (
          <VideoTimelineProvider playerRef={playerRef}>
            <VideoTimeline>
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
            </VideoTimeline>
          </VideoTimelineProvider>
        )}
      </section>
    </div>
  );
};

export default Layout;

// "Error loading image with src: https://remotionlambda-useast1-q7hsmsvlrt.s3.us-east-1.amazonaws.com/sample-images/cave.jpg"
