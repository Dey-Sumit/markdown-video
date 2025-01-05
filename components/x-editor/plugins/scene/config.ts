// components/x-editor/plugins/scene/config.ts

import type { AdapterConfig } from "../../core/types/adapter";

export const sceneConfig: AdapterConfig = {
  id: "scene",
  pattern: {
    type: "directive",
    pattern: "^\\s*##\\s*!!scene\\b",
    leadingSymbols: ["##"],
  },
  template: "!!scene --duration=${2:5} --title=${1:scene-1}",
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
      description: "Background color",
      examples: {
        transparent: "Default transparent background",
        black: "Solid black background",
        white: "Solid white background",
      },
    },
  },
};
