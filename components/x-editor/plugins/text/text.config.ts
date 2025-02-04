// plugins/text/config.ts
import { AVAILABLE_TEXT_ANIMATIONS } from "@/video/compositions/code-video-composition/components/composition-text";
import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultTextArgValues = {
  content: "Default Text",
  size: 120,
  weight: "bold",
  family: "sans",
  color: "white",
  blend: "normal",
  delay: 0,
  animation: "fadeInSlideUp",
  animationApplyTo: "word",
};

const textConfig: AdapterConfig = {
  id: "text",
  pattern: {
    type: "component",
    pattern: "^\\s*!text\\b",
  },
  description: "Add text in the scene. Multiple text components can be added.",
  template: 'text --content="${1:Default Text}" --color=${2:white}',
  arguments: {
    content: {
      name: "content",
      type: "string",
      description: "Text content",
      required: true,
      default: defaultTextArgValues.content,
      validations: [
        {
          type: "required",
          message: "Content is required",
          severity: "error",
        },
      ],
    },
    size: {
      name: "size",
      type: "number",
      description: "Font size in pixels",
      default: defaultTextArgValues.size,
      validations: [
        {
          type: "range",
          message: "Size must be between 12px and 200px",
          validate: (value) => Number(value) >= 12 && Number(value) <= 200,
          severity: "warning",
        },
      ],
    },
    weight: {
      name: "weight",
      type: "string",
      description: "Font weight",
      default: defaultTextArgValues.weight,
      validations: [
        {
          type: "enum",
          message: "Invalid font weight",
          validate: (value) =>
            ["light", "normal", "bold", "extrabold"].includes(value),
          severity: "warning",
        },
      ],
    },
    family: {
      name: "family",
      type: "string",
      description: "Font family",
      default: "sans",
      validations: [
        {
          type: "enum",
          message: "Invalid font family",
          validate: (value) => ["mono", "sans", "serif"].includes(value),
          severity: "warning",
        },
      ],
    },
    color: {
      name: "color",
      type: "string",
      description: "Text color or gradient",
      default: defaultTextArgValues.color,
      examples: {
        white: "White text",
        "gradient-blue-purple": "Blue to purple gradient",
        "gradient-red-orange": "Red to orange gradient",
      },
      validations: [
        {
          type: "pattern",
          message: "Invalid color format",
          pattern: "^(black|white|red|blue|green|yellow|gradient-\\w+-\\w+)$",
          severity: "warning",
        },
      ],
    },
    blend: {
      name: "blend",
      type: "string",
      description: "Blend mode",
      default: defaultTextArgValues.blend,
      validations: [
        {
          type: "enum",
          message: "Invalid blend mode",
          validate: (value) =>
            ["normal", "multiply", "overlay"].includes(value),
          severity: "warning",
        },
      ],
    },
    delay: {
      name: "delay",
      type: "number",
      description: "Animation delay in seconds",
      default: defaultTextArgValues.delay,
      validations: [
        {
          type: "range",
          message: "Delay must be between 0 and 10 seconds",
          validate: (value) => Number(value) >= 0 && Number(value) <= 10,
          severity: "warning",
        },
      ],
    },
    animation: {
      name: "animation",
      type: "string",
      description: "Animation type",
      default: defaultTextArgValues.animation,
      validations: [
        {
          type: "enum",
          message: "Invalid animation type",
          validate: (value) =>
            ["fadeInSlideUp", "fadeInSlideDown", "fadeInOnly"].includes(value),
          severity: "warning",
        },
      ],
      examples: {
        none: "No animation",
        fadeInSlideUp: "Fade in and slide up",
        fadeInSlideDown: "Fade in and slide down",
        fadeInOnly: "Fade in only",
        wobble: "Wobble effect",
        scaleIn: "Scale in",
        bounceIn: "Bounce in",
        flipIn: "Flip in",
        zoomOut: "Zoom out",
        wave: "Wave effect",
        // typewriter: "Typewriter effect",
        slideFromBehind: "Slide from behind",
      },
    },
    animationApplyTo: {
      name: "animationApplyTo",
      type: "string",
      description: "Animation target element",
      default: defaultTextArgValues.animationApplyTo,
      validations: [
        {
          type: "enum",
          message: "Invalid animation target",
          validate: (value) => ["word", "character", "line"].includes(value),
          severity: "warning",
        },
      ],
    },
  },
};

export default textConfig;
