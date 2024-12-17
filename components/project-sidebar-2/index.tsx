"use client";
import { type ComponentProps, useState } from "react";
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
import { Book, Code, Command, FolderOpen, Palette, Rocket } from "lucide-react";
import { NavUser } from "../nav-user";
// import BackgroundCustomiser from "../background-customiser";
import dynamic from "next/dynamic";
import Docs from "../docs";
const DynamicBackgroundCustomiser = dynamic(
  () => import("../project-sidebar-content/background-customiser"),
  {
    ssr: false,
    loading: () => <div>Loading x...</div>,
  },
);
const RenderingSettingStuff = dynamic(
  () => import("../project-sidebar-content/rendering-setting"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

const SidebarAssetsStuff = dynamic(
  () => import("../project-sidebar-content/sidebar-assets-stuff"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

const EditorSettings = dynamic(
  () => import("../project-sidebar-content/editor-setting"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

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
      isActive: true,
    },
    {
      title: "Editor",
      url: "#",
      icon: Code,
      isActive: false,
    },

    // {
    //   title: "Project",
    //   url: "#",
    //   icon: Clapperboard,
    //   isActive: false,
    // },
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
      title: "Docs",
      url: "#",
      icon: Book,
      isActive: false,
    },
    // {
    //   title: "Help",
    //   url: "#",
    //   icon: HelpCircle,
    //   isActive: false,
    //   subItems: ["Feedback", "Shortcuts", "Report Bug"],
    // },
  ],
};
export function ProjectSidebar2({ ...props }: ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = useState("Background");
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
                        setActiveItem(item.title);
                        setOpen(true);
                      }}
                      isActive={activeItem === item.title}
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
        {activeItem === "Background" ? (
          <DynamicBackgroundCustomiser />
        ) : activeItem === "Render" ? (
          <RenderingSettingStuff />
        ) : activeItem === "Assets" ? (
          <SidebarAssetsStuff />
        ) : activeItem === "Editor" ? (
          <EditorSettings />
        ) : activeItem === "Project" ? (
          <div>Project</div>
        ) : activeItem === "Docs" ? (
          <Docs />
        ) : null}
        <SidebarRail />
      </Sidebar>
    </Sidebar>
  );
}
