// components/x-editor/plugins/scene/config.ts

import type { AdapterConfig } from "../../core/types/adapter.type";

export const sceneConfig: AdapterConfig = {
  id: "scene",
  pattern: {
    type: "directive",
    pattern: "^\\s*##\\s*!scene\\b",
    leadingSymbols: ["##"],
  },
  template: "!scene --duration=${2:5} --title=${1:scene-1}",
  arguments: {
    duration: {
      name: "duration",
      type: "number",
      description: "Scene duration in seconds",
      required: true,
      default: 5,
      min: 0,
      examples: {
        "3": "Short scene",
        "5": "Standard scene",
        "10": "Extended scene",
      },
      validations: [
        {
          type: "required",
          message: "Duration is required",
          severity: "error",
        },
        {
          type: "range",
          message: "Duration must be between 0 and 60 seconds",
          validate: (value) => Number(value) >= 0 && Number(value) <= 60,
          severity: "error",
        },
      ],
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
      validations: [
        {
          type: "enum",
          message: "Invalid background value",
          validate: (value) =>
            ["transparent", "black", "white"].includes(value),
          severity: "warning",
        },
      ],
    },
    title: {
      name: "title",
      type: "string",
      description: "Scene identifier",
      required: false,
    },
  },
};
