import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import ClientSideEditor from "@/components/x-editor/dynamic-x-editor";
import { ProjectSidebar2 } from "@/components/project-sidebar-2";
import ClientXPlayer from "@/components/x-editor/dynamic-x-player";
import AIChat from "@/components/chat";
import AIChatComponent from "@/app/ai/new-chat/page";
import AiChatFAB from "@/app/ai/new-chat/ai-chat-fab";

function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <ProjectSidebar2 />

      <SidebarInset className="overflow-scroll">
        {/* <div className="w-[200vw] border bg-green-700 p-10">hello</div> */}

        {/* <div className="h-full w-full overflow-hidden border-2 border-red-800 p-10">
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
        </div> */}

        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />

          <p className="font-mono text-sm font-medium">markdown video </p>
        </header>
        <div className="flex h-full w-full overflow-hidden">
          <div className="relative flex-[0.7]">
            <ClientSideEditor />
            <AiChatFAB />
          </div>
          <div className="flex-[0.3]">
            <ClientXPlayer />
          </div>

          {/* <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg md:min-w-[450px]"
          >
            <ResizablePanel defaultSize={50} minSize={20}>
              <ClientSideEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={80} minSize={20}>
                  <ClientXPlayer />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20} minSize={20}>
                  <AIChatComponent renderAs="component" />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
