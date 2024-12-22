"use client";

import {
  ArrowUpFromDot,
  Book,
  Clapperboard,
  Code,
  Command,
  FolderOpen,
  HelpCircle,
  Palette,
  Rocket,
} from "lucide-react";
import * as React from "react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
// import BackgroundCustomiser from "./background-customiser";
import Docs from "./docs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { FileDropzone } from "./file-dropzone";
import { AssetGallery } from "./project-assets-gallery";
import { Button } from "./ui/button";
import { useRendering } from "@/hooks/use-rendering";
import useCompositionStore from "@/store/composition-store";
import { Input } from "./ui/input";

const data = {
  user: {
    name: "Sumit",
    email: "sumit@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Background",
      url: "#",
      icon: Palette,
      isActive: false,
    },
    {
      title: "Project",
      url: "#",
      icon: Clapperboard,
      isActive: false,
    },
    {
      title: "Assets",
      url: "#",
      icon: FolderOpen,
      isActive: false,
    },
    {
      title: "Render",
      url: "#",
      icon: Rocket,
      isActive: false,
    },
    {
      title: "Editor",
      url: "#",
      icon: Code,
      isActive: true,
    },
    {
      title: "Docs",
      url: "#",
      icon: Book,
      isActive: false,
    },
    {
      title: "Help",
      url: "#",
      icon: HelpCircle,
      isActive: false,
      subItems: ["Feedback", "Shortcuts", "Report Bug"],
    },
  ],
};

interface SidebarStuff {
  title: string;
  component: React.ReactNode;
}

export const SidebarBlock = ({
  children,
  label,
  containerClassName,
}: {
  children: React.ReactNode;
  label: string;
  containerClassName?: string;
}) => (
  <div className={cn("flex flex-col gap-3.5", containerClassName)}>
    <div className="flex items-center gap-2">
      <Label className="shrink-0 text-sm">{label}</Label>
      <Separator className="flex-1" />
    </div>
    {children}
  </div>
);
const RenderSectionSidebarContent = () => {
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
    <div className="flex flex-col gap-y-7">
      <SidebarBlock label="Video Title">
        <Input type="text" placeholder="Enter video title" value={"My Video"} />
      </SidebarBlock>
      {/* <SidebarBlock label="Codec">
        <Select>
          <SelectTrigger className="-mt-1">
            <SelectValue placeholder="Select codec" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h264">H264</SelectItem>
            <SelectItem value="h265">H265</SelectItem>
          </SelectContent>
        </Select>
      </SidebarBlock> */}

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

      <SidebarBlock label="Frame Rate">
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

      <SidebarFooter>
        <Button onClick={renderMedia} className="border-2">
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
              {/* <Megabytes sizeInBytes={state.size}></Megabytes> */}
              <ArrowUpFromDot className="size-4" />
            </a>
          </Button>
        )}
      </SidebarFooter>
    </div>
  );
};

const sidebarContents: Record<string, SidebarStuff> = {
  Editor: {
    title: "Editor Settings",
    component: (
      <div className="flex flex-col gap-y-7">
        <SidebarBlock label="Editor theme">
          <Select>
            <SelectTrigger className="-mt-1">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </SidebarBlock>

        <SidebarBlock label="Font Size" containerClassName="-mt-3">
          <Slider defaultValue={[14]} max={24} min={12} step={1} />
        </SidebarBlock>

        <SidebarBlock label="Line height">
          <Slider defaultValue={[1.5]} max={2} min={1} step={0.1} />
        </SidebarBlock>

        <SidebarBlock label="Font Family">
          <Select>
            <SelectTrigger className="-mt-1">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans-serif">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </SidebarBlock>
      </div>
    ),
  },
  Background: {
    title: "Background Settings",
    component: null,
    // component: <BackgroundCustomiser />,
  },
  Assets: {
    title: "Asset Manager",
    component: (
      <div className="flex flex-col gap-4">
        <FileDropzone />
        <Separator />
        <AssetGallery />
      </div>
    ),
  },
  Docs: {
    title: "Documentation",
    component: (
      <div className="">
        <Docs />
      </div>
    ),
  },
  Render: {
    title: "Render Settings",
    component: <RenderSectionSidebarContent />,
  },
};

const RenderSettingStuff = () => {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Render</div>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <RenderSectionSidebarContent />
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </>
  );
};

const DocsStuff = () => {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Docs</div>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <Docs />
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </>
  );
};

const RenderAssetManagerStuff = () => {
  return (
    <div className="flex flex-col gap-4">
      <FileDropzone />
      <Separator />
      <AssetGallery />
    </div>
  );
};

const SidebarStuffComponent = (key: string) => {
  switch (key) {
    // case "Background":
    //   return <BackgroundCustomiser />;
    case "Project":
      return <RenderSectionSidebarContent />;
    case "Assets":
      return <RenderAssetManagerStuff />;
    case "Render":
      return <RenderSettingStuff />;
    case "Editor":
      return <RenderSectionSidebarContent />;
    case "Docs":
      return <DocsStuff />;
    case "Help":
      return <Docs />;
    default:
      return null;
  }
};

export function ProjectSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  return null;
}
