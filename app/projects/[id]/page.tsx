import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { AppSidebar } from "@/components/project-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import XEditor from "@/components/x-editor";
import XPlayer from "@/components/x-player";

function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />

          <p className="text-sm font-medium">The Ox Oven Project</p>
        </header>
        <div className="h-full w-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px] md:min-w-[450px]"
          >
            <ResizablePanel defaultSize={50} minSize={20}>
              {/* <XEditor /> */}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={20}>
              <XPlayer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
