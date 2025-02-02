// components/x-editor/plugins/scene/config-1.ts

import type { AdapterConfig } from "../../core/types/adapter.type";
import { backgroundPropsConfig } from "../common/props";

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
      ...backgroundPropsConfig,
      required: false,
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
