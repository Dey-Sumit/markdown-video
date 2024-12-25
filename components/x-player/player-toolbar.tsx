import { TooltipProvider } from "@/components/ui/tooltip";
import { type PlayerRef } from "@remotion/player";
import React from "react";

const Toolbar = ({
  children,
  playerRef,
}: {
  children: React.ReactNode;
  playerRef: React.RefObject<PlayerRef>;
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between shadow-sm">
        <React.Fragment>{children}</React.Fragment>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
