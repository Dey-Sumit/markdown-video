import {
  ClipboardPaste,
  Copy,
  ImageIcon,
  MousePointer2,
  Music,
  Redo,
  Scissors,
  Type,
  Undo,
  Video,
  ZoomIn,
  ZoomInIcon,
  ZoomOut,
  type LucideProps,
} from "lucide-react";
import React, {
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { useEditingStore } from "../store/editing.store";
import { useTimeline } from "../video-timeline-context";

interface ToolbarItem {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  iconClassName?: string;
  label: string;
  onClick: () => void;
}

interface ToolbarCategory {
  name: string;
  items: ToolbarItem[];
}

// Add zoom constants
const ZOOM_STEP = 1;
const MAX_ZOOM = 10;
const MIN_ZOOM = 1;

const Toolbar = ({ children }: { children: React.ReactNode }) => {
  const setSelectedContentType = useEditingStore(
    (state) => state.setSelectedContentType,
  );
  // const { setTimelineZoom, zoom } = useTimeline();
  const selectedContentType = useEditingStore(
    (state) => state.selectedContentType,
  );
  // const { currentFrame } = useTimeline();

  const toolbarCategories: ToolbarCategory[] = [
    /* {
      name: "Selection",
      items: [
        {
          Icon: MousePointer2,
          label: "Select",
          onClick: () => console.log("Select clicked"),
        },
      ],
    }, */
    {
      name: "Insert",
      items: [
        {
          Icon: Type,
          label: "Text",
          onClick: () => setSelectedContentType("text"),
          iconClassName: "text-green-500",
        },
        {
          Icon: ImageIcon,
          label: "Image",
          onClick: () => setSelectedContentType("image"),
          iconClassName: "text-purple-500",
        },
        {
          Icon: Video,
          label: "Video",
          onClick: () => setSelectedContentType("video"),
          iconClassName: "text-pink-500",
        },
        {
          Icon: Music,
          label: "Audio",
          onClick: () => setSelectedContentType("audio"),
          iconClassName: "text-orange-500",
        },
      ],
    },
    /*  {
      name: "Edit",
      items: [
        {
          Icon: Scissors,
          label: "Cut",
          onClick: () => console.log("Cut clicked"),
        },
        {
          Icon: Copy,
          label: "Copy",
          onClick: () => console.log("Copy clicked"),
        },
        {
          Icon: ClipboardPaste,
          label: "Paste",
          onClick: () => console.log("Paste clicked"),
        },
      ],
    }, */
    /*  {
      name: "History",
      items: [
        {
          Icon: Undo,
          label: "Undo",
          onClick: () => console.log("Undo clicked"),
        },
        {
          Icon: Redo,
          label: "Redo",
          onClick: () => console.log("Redo clicked"),
        },
      ],
    }, */
    /* {
      name: "View",
      items: [
        {
          Icon: ZoomIn,
          label: "Zoom In",
          onClick: () => {
            const newZoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM);
            setTimelineZoom(newZoom);
          },
        },
        {
          Icon: ZoomOut,
          label: "Zoom Out",
          onClick: () => {
            const newZoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
            setTimelineZoom(newZoom);
          },
        },
      ],
    }, */
  ];

  // const playerControlCategories: ToolbarCategory[] = [
  //   {
  //     name: "Playback",
  //     items: [
  //       {
  //         Icon: MousePointer2,
  //         label: "Select",
  //         onClick: () => console.log("Select clicked"),
  //       },
  //       {
  //         Icon: PlayIcon, // Replace with actual play icon
  //         label: "Play",
  //         onClick: () => console.log("Play clicked"),
  //       },
  //       {
  //         Icon: PauseIcon, // Replace with actual pause icon
  //         label: "Pause",
  //         onClick: () => console.log("Pause clicked"),
  //       },
  //       {
  //         Icon: CurrentTimeIcon, // Replace with actual current time icon
  //         label: "Current Time",
  //         onClick: () => console.log("Current Time clicked"),
  //       },
  //       {
  //         Icon: VolumeMuteIcon, // Replace with actual volume mute icon
  //         label: "Mute",
  //         onClick: () => console.log("Mute clicked"),
  //       },
  //       {
  //         Icon: VolumeUnmuteIcon, // Replace with actual volume unmute icon
  //         label: "Unmute",
  //         onClick: () => console.log("Unmute clicked"),
  //       },
  //     ],
  //   },
  // ];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between space-x-1 p-1 shadow-sm">
        <React.Fragment>{children}</React.Fragment>
        <div className="flex items-center space-x-1">
          {toolbarCategories.map((category, categoryIndex) => (
            <React.Fragment key={category.name}>
              {categoryIndex > 0 && (
                <Separator orientation="vertical" className="h-8" />
              )}
              <div className="flex items-center space-x-2">
                {category.items.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={item.onClick}
                        className={cn(
                          "h-8 w-8",
                          selectedContentType === item.label.toLowerCase() &&
                            "bg-muted",
                        )}
                      >
                        <item.Icon size={14} className={item.iconClassName} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
