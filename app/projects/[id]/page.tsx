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

      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />

          <p className="font-mono text-sm font-medium">markdown video </p>
        </header>
        <div className="h-full w-full">
          <ResizablePanelGroup
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
                  <AIChat />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
