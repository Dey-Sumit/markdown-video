import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import SidebarBlock from "./sidebar-block";

export const sidebarContents: Record<string, any> = {
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
  //   Assets: {
  //     title: "Asset Manager",
  //     component: (
  //       <div className="flex flex-col gap-4">
  //         <FileDropzone />
  //         <Separator />
  //         <AssetGallery />
  //       </div>
  //     ),
  //   },
  //   Docs: {
  //     title: "Documentation",
  //     component: (
  //       <div className="">
  //         <Docs />
  //       </div>
  //     ),
  //   },
  //   Render: {
  //     title: "Render Settings",
  //     component: <RenderSectionSidebarContent />,
  //   },
};
