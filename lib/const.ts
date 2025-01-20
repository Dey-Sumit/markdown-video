import type { ProjectStyles } from "@/types/project.types";

export const DEFAULT_COMPOSITION_STYLES: ProjectStyles = {
  backgroundContainer: {
    background: {
      color: "",
      gradient: {
        angle: 0,
        colors: ["#4338ca", "#5b21b6"],
      },
      image: "",
      activeType: "color",
    },
    fontFamily: "Inter",
  },
  sceneContainer: {
    inset: 0,
    padding: 40,
    borderRadius: 10,
  },
};

export const AUTO_SAVE_DELAY = 5000; // 5 seconds

//export const FALLBACK_DURATION_IN_FRAMES = 30 * 3; // 3 seconds
export const FALLBACK_DURATION_IN_FRAMES = 30 * 3; // Will show 90 in hover
