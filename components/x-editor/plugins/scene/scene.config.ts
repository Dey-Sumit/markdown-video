// components/x-editor/plugins/scene/config-1.ts

import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultSceneArgValues = {
  duration: 5,
  background: "transparent",
  title: "scene-title",
};

export const sceneConfig: AdapterConfig = {
  id: "scene",
  pattern: {
    type: "directive",
    pattern: "^\\s*#\\s*!scene\\b",
    leadingSymbols: ["#"],
  },
  description:
    "Scene is a basic building block of a video composition. It defines the duration, background color, and title of a scene.",
  template: "!scene --duration=${1:5}",
  arguments: {
    duration: {
      name: "duration",
      type: "number",
      description: "Scene duration in seconds",
      required: true,
      default: defaultSceneArgValues.duration,
      min: 3,
      examples: {
        "3": "Short scene",
        "5": "Standard scene",
        "10": "Extended scene",
      },
      validations: [
        {
          type: "required",
          message:
            "Duration is required. Should be greater than any transition on the scene",
          severity: "error",
        },
        // {
        //   type: "range",
        //   message: "Duration must be between 1 and 60 seconds",
        //   validate: (value) => Number(value) >= 3 && Number(value) <= 60,
        //   severity: "error",
        // },
      ],
    },
    background: {
      name: "background",
      type: "string",
      description: "Background color",
      examples: {
        transparent: "Default transparent ",
        white: "White background",
        black: "Black background",
        red: "Red background",
        [`"linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"`]:
          "Linear gradient ",
        [`"radial-gradient(circle, #237A57 25%, #093028 100%)"`]:
          "Radial gradient ",
        [`https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg`]:
          "Colorful abstract background",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid background value",
        },
      ],
      default: defaultSceneArgValues.background,
    },
    title: {
      name: "title",
      type: "string",
      description: "Scene identifier",
      required: false,
      default: defaultSceneArgValues.title,
    },
  },
};
