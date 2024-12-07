import XEditor from "@/components/x-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { X } from "lucide-react";
import XPlayer from "@/components/x-player";

function Project() {
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-[200px]  md:min-w-[450px]">
        <ResizablePanel defaultSize={90}>
          <XEditor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={10}>
          <XPlayer />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Project;
