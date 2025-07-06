import { AVAILABLE_TEXT_ANIMATIONS } from "@/video/compositions/code-video-composition/components/composition-text";
import type { AdapterConfig } from "../../core/types/adapter.type";
import { backgroundPropsConfig, orderPropsConfig } from "../common/props";

export const defaultSectionArgValues = {
  cols: 1,
  rows: 1,
  gap: 16,
  items: [],
};

const sectionConfig: AdapterConfig = {
  id: "section",
  pattern: {
    type: "component",
    pattern: "^\\s*!section\\b",
  },
  description: "Create a layout section container for organizing content",
  template:
    'section --cols=${1:2} --gap=${2:16} --items=(\n  ${3:!text --content="Item 1"}\n  ${4:!text --content="Item 2"}\n)',
  arguments: {
    cols: {
      name: "cols",
      type: "number",
      description: "Number of columns in the grid",
      default: defaultSectionArgValues.cols,
      examples: {
        "1": "Single column - stack items vertically",
        "2": "Two columns - split into halves",
        "3": "Three columns - divide into thirds",
      },
      validations: [
        {
          type: "range",
          message: "Columns must be between 1 and 4",
          validate: (value) => Number(value) >= 1 && Number(value) <= 4,
          severity: "error",
        },
      ],
    },
    rows: {
      name: "rows",
      type: "number",
      description:
        "Number of rows in the grid (optional, auto-calculated if not specified)",
      default: defaultSectionArgValues.rows,
      validations: [
        {
          type: "range",
          message: "Rows must be between 1 and 4",
          validate: (value) => Number(value) >= 1 && Number(value) <= 4,
          severity: "warning",
        },
      ],
    },
    gap: {
      name: "gap",
      type: "number",
      description: "Space between grid items in pixels",
      default: defaultSectionArgValues.gap,
      validations: [
        {
          type: "range",
          message: "Gap must be between 0 and 64 pixels",
          validate: (value) => Number(value) >= 0 && Number(value) <= 64,
          severity: "warning",
        },
      ],
    },
    items: {
      name: "items",
      type: "string",
      description: "List of components to display in the grid layout",
      required: true,
      examples: {
        "(!)": "Items must be wrapped in parentheses",
        "(!text, !text)": "Multiple items separated by commas",
        "(!section(...), !text)": "Can include nested sections",
      },
      // Removed complex validations since they're now handled in the adapter
      validations: [
        {
          type: "required",
          message: "Items list is required",
          severity: "error",
        },
      ],
    },
    header: {
      name: "header",
      type: "string",
      description: "Optional header text above the grid",
      required: false,
    },
    footer: {
      name: "footer",
      type: "string",
      description: "Optional footer text below the grid",
      required: false,
    },
    background: {
      ...backgroundPropsConfig,
      required: false,
      default: "transparent",
    },
    order: orderPropsConfig,
    animation: {
      name: "animation",
      type: "string",
      description: "Animation type",
      // default: defaultSectionArgValues.,
      validations: [
        {
          type: "enum",
          message: "Invalid animation type",
          validate: (value) => AVAILABLE_TEXT_ANIMATIONS.includes(value),
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
  },
};

export default sectionConfig;
