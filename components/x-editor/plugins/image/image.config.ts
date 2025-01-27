// plugins/image/config.ts
import type { AdapterConfig } from "../../core/types/adapter.type";
import type { ImageInputProps } from "./image.types";

// TODO : need to type the default args value as well.
export const defaultImageArgValues: ImageInputProps = {
  src: "",
  width: 400,
  height: 300,
  animation: "fadeIn",
  delay: 0,
  duration: 1,
};

export const imageConfig: AdapterConfig = {
  id: "image",
  pattern: {
    type: "component",
    pattern: "^\\s*!image\\b",
  },
  description:
    "Add an image to the scene with optional animations and styling.",
  template:
    'image --src="${1:https://fakeimg.pl/450x400/?text=DUMMY-IMAGE}" --width=${2:400} --height=${3:300}',
  arguments: {
    src: {
      name: "src",
      type: "string",
      description: "Image source URL or path",
      required: true,
      validations: [
        {
          type: "required",
          message: "Image source is required",
          severity: "error",
        },
        {
          type: "pattern",
          message: "Invalid image URL format",
          pattern: "^[\"']?(https?://|/).+?[\"']?$",
          severity: "warning",
        },
      ],
    },
    width: {
      name: "width",
      type: "number",
      description: "Image width in pixels",
      default: defaultImageArgValues.width,
      validations: [
        {
          type: "range",
          message: "Width must be between 50 and 1920 pixels",
          validate: (value) => Number(value) >= 50 && Number(value) <= 1920,
          severity: "warning",
        },
      ],
    },
    height: {
      name: "height",
      type: "number",
      description: "Image height in pixels",
      default: defaultImageArgValues.height,
      validations: [
        {
          type: "range",
          message: "Height must be between 50 and 1080 pixels",
          validate: (value) => Number(value) >= 50 && Number(value) <= 1080,
          severity: "warning",
        },
      ],
    },
    animation: {
      name: "animation",
      type: "string",
      description: "Entry animation type",
      default: defaultImageArgValues.animation,
      examples: {
        none: "No animation",
        fadeIn: "Simple fade in",
        zoomIn: "Zoom in from center",
        slideInLeft: "Slide in from left",
        slideInRight: "Slide in from right",
        slideInTop: "Slide in from top",
        slideInBottom: "Slide in from bottom",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid animation type",
          validate: (value) =>
            [
              "none",
              "fadeIn",
              "zoomIn",
              "slideInLeft",
              "slideInRight",
              "slideInTop",
              "slideInBottom",
            ].includes(value),
          severity: "warning",
        },
      ],
    },
    delay: {
      name: "delay",
      type: "number",
      description: "Animation delay in seconds",
      default: defaultImageArgValues.delay,
      validations: [
        {
          type: "range",
          message: "Delay must be between 0 and 10 seconds",
          validate: (value) => Number(value) >= 0 && Number(value) <= 10,
          severity: "warning",
        },
      ],
    },
    duration: {
      name: "duration",
      type: "number",
      description: "Animation duration in seconds",
      default: defaultImageArgValues.duration,
      validations: [
        {
          type: "range",
          message: "Duration must be between 0.1 and 5 seconds",
          validate: (value) => Number(value) >= 0.1 && Number(value) <= 5,
          severity: "warning",
        },
      ],
    },
  },
};

export default imageConfig;
