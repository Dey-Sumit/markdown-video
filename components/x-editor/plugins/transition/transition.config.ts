// plugins/transition/config.ts
import type { AdapterConfig } from "../../core/types/adapter.type";
export const defaultTransitionValues = {
  type: "none",
  duration: 0.3,
  direction: "from-left",
};

export const transitionConfig: AdapterConfig = {
  id: "transition",
  pattern: {
    type: "component",
    pattern: "^\\s*!transition\\b",
  },
  template: "transition --type=${1:none} --duration=${2:0.3}",
  arguments: {
    type: {
      name: "type",
      type: "string",
      description: "Type of transition animation",
      required: true,
      default: defaultTransitionValues.type,
      examples: {
        slide: "Slides content in from the edge",
        fade: "Smoothly fades content in/out",
        magic: "Magic transition (works with code only)",
        wipe: "Wipes content in from the edge",
        flip: "Flips content in 3D",
      },
      validations: [
        {
          type: "required",
          message: "Transition type is required",
          severity: "error",
        },
        {
          type: "enum",
          message: "Invalid transition type",
          validate: (value) =>
            ["none", "slide", "magic", "wipe", "fade", "flip"].includes(value),
          severity: "error",
        },
      ],
    },
    duration: {
      name: "duration",
      type: "number",
      description: "Transition duration in seconds",
      default: defaultTransitionValues.duration,
      examples: {
        "0.3": "Smooth, default transition",
        "0.2": "Quick transition",
        "1.0": "Slow, dramatic transition",
      },
      validations: [
        {
          type: "range",
          message: "Duration must be between 0.2 and 1 second",
          validate: (value) => Number(value) >= 0.3 && Number(value) <= 2,
          severity: "error",
        },
      ],
    },
    direction: {
      name: "direction",
      type: "string",
      description: "Direction for slide/wipe transitions",
      default: defaultTransitionValues.direction,
      examples: {
        "from-bottom": "Slide/wipe from bottom",
        "from-left": "Slide/wipe from left",
        "from-right": "Slide/wipe from right",
        "from-top": "Slide/wipe from top",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid direction",
          validate: (value) =>
            ["from-bottom", "from-left", "from-right", "from-top"].includes(
              value,
            ),
          severity: "error",
        },
      ],
    },
  },
  description:
    "Transition with the previous scene. If multiple transition added, only the first one will be used.",
};


