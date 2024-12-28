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
import MinimalDocs from "./minimal-docs";
import { Brush, ChefHat } from "lucide-react";

const Playground = () => {
  const isMobile = useIsMobile();
  return (
    <section>
      <div className="mb-10 flex flex-col items-center justify-center gap-8 md:mb-16">
        <div className={cn("relative flex items-start justify-center gap-8")}>
          <SparklesText
            text="Playground"
            className="md:text-7xl"
            sparklesCount={7}
          />
          <RainbowButton className="flex items-center justify-center rounded-full px-5 py-1 text-primary">
            Beta
            <Brush strokeWidth={1.5} className="pl-2" />
          </RainbowButton>
        </div>
      </div>

      {isMobile ? (
        <div className="flex items-center justify-center rounded-lg border p-4 text-center">
          <h3 className="">
            Open the page on large screen to view the playground
          </h3>
        </div>
      ) : (
        <div className="relative h-[90vh]">
          <div className="absolute -inset-x-4 h-px bg-border md:-inset-x-10" />
          <div className="absolute -inset-y-4 w-px bg-border md:-inset-y-10" />
          <div className="absolute -inset-x-4 top-full h-0.5 bg-border md:-inset-x-10" />
          <div className="absolute -inset-y-4 left-full w-px bg-border md:-inset-y-10" />

          <div className="absolute inset-0">
            <div
              className={cn("relative h-[90vh] w-full rounded-lg p-px pb-0.5")}
            >
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] bg-black md:min-w-[450px]"
                // style={{
                //   boxShadow:
                //     "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
                // }}
              >
                <ResizablePanel
                  defaultSize={50}
                  minSize={20}
                  className="border-r-0 pt-14"
                >
                  <ClientSideEditor />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  defaultSize={50}
                  minSize={20}
                  className="border-l-0"
                >
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel
                      defaultSize={58}
                      minSize={20}
                      className="border-b-0 pb-0"
                    >
                      <ClientXPlayer />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={42} minSize={20}>
                      <div className="h-full overflow-scroll">
                        <MinimalDocs />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Playground;
