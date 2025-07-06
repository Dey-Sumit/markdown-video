"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function ResizableDemo() {
  return (
    <div className="flex h-screen w-screen bg-blue-600">
      <div className="h-full w-48 shrink-0 bg-zinc-950 p-6 text-white">
        sidebar
      </div>
      <div className="h-full w-full overflow-hidden border-2 border-red-800 bg-red-400/40 p-10">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel className="h-full w-full">
            <div className="h-full w-full overflow-auto">
              <div className="h-full w-[1000px] bg-gray-900 p-10">1</div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                <div className="h-full overflow-auto overscroll-contain">
                  <div className="h-full w-[1000px] bg-gray-800 p-10">2</div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="h-full overflow-auto overscroll-contain">
                  <div className="flex h-full w-[1000px] gap-4 bg-zinc-900 p-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="mb-2">
                        <div>
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-800">
                            {i}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default ResizableDemo;
