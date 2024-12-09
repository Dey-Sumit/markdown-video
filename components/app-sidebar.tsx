"use client";

import {
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
import BackgroundCustomiser from "./background-customiser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";

// This is sample data
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

interface SidebarContent {
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

const sidebarContents: Record<string, SidebarContent> = {
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
    component: <BackgroundCustomiser />,
  },
  Assets: {
    title: "Asset Manager",
    component: (
      <div className="p-4">
        {/* <FileUploader />
        <AssetList /> */}
      </div>
    ),
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-3">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>

        <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
          {sidebarContents[activeItem.title]?.component ?? null}
        </SidebarContent>

        <SidebarFooter>
          {/* <div className="p-1">
            <SidebarOptInForm />
          </div> */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </Sidebar>
  );
}
