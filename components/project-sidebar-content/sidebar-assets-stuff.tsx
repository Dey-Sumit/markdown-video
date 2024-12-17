import React from "react";
import { SidebarHeader, SidebarContent } from "../ui/sidebar";
import { FileDropzone } from "../file-dropzone";
import { Separator } from "../ui/separator";
import { AssetGallery } from "../project-assets-gallery";

const SidebarAssetsStuff = () => {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-3">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Assets</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)_-var(--sidebar-width-icon))] p-3">
        <FileDropzone />
        <Separator className="my-2" />
        <AssetGallery />
      </SidebarContent>
    </>
  );
};

export default SidebarAssetsStuff;
