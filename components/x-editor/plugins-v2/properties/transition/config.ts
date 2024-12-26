// src/plugins-v2/properties/transition/config.ts

import {
  type PropertyConfig,
  type CommandType,
} from "../../core/types/property";

export const transitionConfig: PropertyConfig = {
  name: "transition",
  pattern: {
    type: "inline",
    prefix: "!",
  },
  description: "Defines transition effects between scenes",
  arguments: {
    type: {
      name: "type",
      type: "string",
      values: ["fade", "slide", "zoom", "wipe"],
      description: "Type of transition effect",
      required: true,
      examples: {
        fade: "Smooth fade transition",
        slide: "Slide content in/out",
        zoom: "Zoom in/out effect",
        wipe: "Wipe across the screen",
      },
    },
    duration: {
      name: "duration",
      type: "number",
      min: 0.1,
      max: 2.0,
      description: "Duration of transition in seconds",
      required: true,
      examples: {
        "0.3": "Quick transition",
        "1.0": "Standard transition",
        "2.0": "Slow, dramatic transition",
      },
    },
    direction: {
      name: "direction",
      type: "string",
      values: ["from-left", "from-right", "from-top", "from-bottom"],
      description: "Direction of the transition effect",
      examples: {
        "from-left": "Content slides in from left",
        "from-right": "Content slides in from right",
        "from-top": "Content slides in from top",
        "from-bottom": "Content slides in from bottom",
      },
    },
  },
};
