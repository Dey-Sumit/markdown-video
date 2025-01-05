// components/x-editor/plugins/scene/config.ts

import type { PropertyConfig } from "../../core/types/property";

export const sceneConfig: PropertyConfig = {
  name: "scene",
  pattern: {
    type: "scene",
    prefix: ["!!"],
    leadingSymbols: ["##"],
  },
  description: "Creates a new scene block",
  arguments: {
    title: {
      name: "title",
      type: "string",
      description: "Scene identifier",
      required: false,
    },
    duration: {
      name: "duration",
      type: "number",
      description: "Scene duration in seconds",
      required: true,
      min: 0,
      examples: {
        "3": "Short scene",
        "5": "Standard scene",
        "10": "Extended scene",
      },
    },
    background: {
      name: "background",
      type: "string",
      description: "Background color or CSS color value",
      required: false,
      examples: {
        transparent: "Default transparent background",
        black: "Solid black background",
        white: "Solid white background",
        "#FF5733": "Custom hex color",
        "rgb(255, 87, 51)": "Custom RGB color",
      },
    },
  },
};
