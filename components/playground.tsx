"use client";
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import ClientSideEditor from "./x-editor/dynamic-x-editor";
import { cn } from "@/lib/utils";
import ClientXPlayer from "./x-editor/dynamic-x-player";
import SparklesText from "./sparkle-text";
import { RainbowButton } from "./ui/rainbow-button";
import { useIsMobile } from "@/hooks/use-mobile";

const Playground = () => {
  const isMobile = useIsMobile();
  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className={cn("relative flex items-start justify-center gap-8")}>
          <SparklesText text="Playground" className="md:text-7xl" />
          <RainbowButton className="h-9 rounded-full px-6 text-primary">
            Beta
          </RainbowButton>
        </div>
        <div className="text-sm">
          <p>I know the docs is pending :), I am working on it.</p>
        </div>
      </div>

      {isMobile ? (
        <div className="flex items-center justify-center rounded-lg border p-4 text-center">
          <h3 className="">
            Open the page on large screen to view the playground
          </h3>
        </div>
      ) : (
        <div className={cn("relative mt-12 h-[90vh] w-full rounded-lg")}>
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] bg-black md:min-w-[450px]"
            style={{
              boxShadow:
                "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            }}
          >
            <ResizablePanel
              defaultSize={50}
              minSize={20}
              className="border border-r-0 pt-14"
            >
              <ClientSideEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={50}
              minSize={20}
              className="border border-l-0 pt-14"
            >
              <ClientXPlayer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </section>
  );
};

export default Playground;
