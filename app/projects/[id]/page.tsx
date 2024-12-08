import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import XEditor from "@/components/x-editor";
import XPlayer from "@/components/x-player";

function Project() {
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50} minSize={20}>
          <XEditor />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <XPlayer />
          {/* <div className="h-full w-full border">
            <CSSModifyTabs />
          </div> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Project;
