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
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
const EditorSettings = () => {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Render</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
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
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between">
          <Button className="">Save</Button>
          <Button className="" variant="secondary">
            Save as Global 
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
};

export default EditorSettings;
