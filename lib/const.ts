import type { ProjectStyles } from "./dexie-db";

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
