import { Layers, type LucideProps } from "lucide-react";
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
import useVideoStore from "../store/video.store";
import { scrollToTop } from "../utils/utils";

interface ToolbarItem {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  onClick: () => void;
}

interface ToolbarCategory {
  name: string;
  items: ToolbarItem[];
}

const LayerToolbar: React.FC = () => {
  const addLayer = useVideoStore((state) => state.addLayer);

  const handleAddLayer = () => {
    addLayer({
      position: "AT_TOP",
    });
    scrollToTop("layerContainer");
  };

  const toolbarCategories: ToolbarCategory[] = [
    {
      name: "Layers",
      items: [
        {
          Icon: Layers,
          label: "Add Layer",
          onClick: handleAddLayer,
        },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex h-full items-center justify-start space-x-1">
        {toolbarCategories.map((category, categoryIndex) => (
          <React.Fragment key={category.name}>
            {categoryIndex > 0 && (
              <Separator orientation="vertical" className="h-8" />
            )}
            <div className="flex items-center space-x-1">
              {category.items.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={item.onClick}
                      className="flex gap-2 text-xs"
                    >
                      <item.Icon size={12} />
                      {/* {item.label} */}
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
    </TooltipProvider>
  );
};

export default LayerToolbar;
