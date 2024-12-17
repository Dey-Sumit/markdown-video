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
import { Code, Command, Palette } from "lucide-react";
import { NavUser } from "../nav-user";
// import BackgroundCustomiser from "../background-customiser";
const DynamicBackgroundCustomiser = dynamic(
  () => import("../background-customiser"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);
import { sidebarContents } from "./project-sidebar-content";
import dynamic from "next/dynamic";
const data = {
  user: {
    name: "Sumit",
    email: "sumit@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Editor",
      url: "#",
      icon: Code,
      isActive: true,
    },
    {
      title: "Background",
      url: "#",
      icon: Palette,
      isActive: false,
    },
    // {
    //   title: "Project",
    //   url: "#",
    //   icon: Clapperboard,
    //   isActive: false,
    // },
    // {
    //   title: "Assets",
    //   url: "#",
    //   icon: FolderOpen,
    //   isActive: false,
    // },
    // {
    //   title: "Render",
    //   url: "#",
    //   icon: Rocket,
    //   isActive: false,
    // },

    // {
    //   title: "Docs",
    //   url: "#",
    //   icon: Book,
    //   isActive: false,
    // },
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
  const [activeItem, setActiveItem] = useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  //   return null;
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
                      //   onClick={() => {
                      //     setActiveItem(item);
                      //     setOpen(true);
                      //   }}
                      //   isActive={activeItem.title === item.title}
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
          {/* {sidebarContents[activeItem.title]?.component ?? null} */}
          <DynamicBackgroundCustomiser />
        </SidebarContent>

        {/* <SidebarFooter>
         
        </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>
    </Sidebar>
  );
}
