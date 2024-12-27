import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import ClientSideEditor from "./x-editor/dynamic-x-editor";
import XPlayer from "./x-player";
import SparklesText from "./sparkle-text";
import { RainbowButton } from "./ui/rainbow-button";
import { before } from "node:test";
import { cn } from "@/lib/utils";

const Playground = () => {
  return (
    <section>
      <div
        className={cn("relative flex items-start justify-center gap-6 pb-20")}
      >
        <SparklesText text="Playground" className="md:text-7xl" />
        <RainbowButton className="h-9 rounded-full text-primary">
          Beta
        </RainbowButton>
      </div>

      <div
        className={cn(
          "relative h-[80vh] w-full overflow-hidden rounded-lg border-2",
        )}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50} minSize={20}>
            <ClientSideEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <XPlayer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  );
};

export default Playground;
