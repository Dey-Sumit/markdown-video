import React from "react";
import { SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar";
import { SidebarBlock } from "../project-sidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { ArrowUpFromDot } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRendering } from "@/hooks/use-rendering";
import useCompositionStore from "@/store/composition-store";
import { Slider } from "../ui/slider";
import { useSearchParams } from "next/navigation";

const Megabytes: React.FC<{
  sizeInBytes: number;
}> = ({ sizeInBytes }) => {
  const megabytes = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  }).format(sizeInBytes);
  return <span className="opacity-60">{megabytes}</span>;
};

const RenderingSettingStuff = () => {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const owner = searchParams.get("owner");
  const renderDisabled = owner !== "sumit";

  // const
  const scenes = useCompositionStore((state) => state.scenes);
  const styles = useCompositionStore((state) => state.styles);
  const { renderMedia, state, undo } = useRendering(
    "code-transition-composition",
    {
      scenes,
      styles,
    },
  );
  // Helper function to get button text based on state
  const getButtonText = () => {
    if (state.status === "rendering") {
      const progress = Math.round(state.progress * 100);
      return `Processing ${progress}%`;
    }
    return "Prepare Export";
  };

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Render</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <div className="flex flex-col gap-y-7">
          <SidebarBlock label="Video Title">
            <Input
              type="text"
              placeholder="Enter video title"
              defaultValue="My Video"
            />
          </SidebarBlock>

          <SidebarBlock label="Resolution" containerClassName="-mt-3">
            <Select>
              <SelectTrigger className="-mt-1">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080p">1080p</SelectItem>
                <SelectItem value="720p">720p</SelectItem>
                <SelectItem value="480p">480p</SelectItem>
              </SelectContent>
            </Select>
          </SidebarBlock>

          <SidebarBlock label="Frame Rate" containerClassName="-mt-3">
            <Select>
              <SelectTrigger className="-mt-1">
                <SelectValue placeholder="Select frame rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </SidebarBlock>

          <SidebarBlock label="Bitrate">
            <Slider defaultValue={[1000]} max={10000} min={100} step={100} />
          </SidebarBlock>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={renderMedia}
          className="border-2"
          disabled={renderDisabled}
        >
          {state.status === "invoking"
            ? "Rendering..."
            : state.status === "rendering"
              ? getButtonText()
              : state.status === "done"
                ? "Render Again"
                : "Render"}
        </Button>
        {state.status === "done" && (
          <Button
            className="h-8 gap-1.5 text-sm"
            size="sm"
            variant="bezel"
            asChild
          >
            <a href={state.url}>
              Download video
              <Megabytes sizeInBytes={state.size}></Megabytes>
              <ArrowUpFromDot className="size-4" />
            </a>
          </Button>
        )}
      </SidebarFooter>
    </>
  );
};

export default RenderingSettingStuff;
