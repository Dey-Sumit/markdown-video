import type { PropertyConfig } from "../../core/types/property";

export const textConfig: PropertyConfig = {
  name: "text",
  pattern: {
    type: "inline",
    prefix: "!",
  },
  description: "Add text with custom styling",
  arguments: {
    family: {
      name: "family",
      type: "string",
      values: ["mono", "sans", "serif", "lord"],
      description: "Font family to use",
      required: true,
      examples: {
        mono: "Monospace font for code",
        sans: "Clean sans-serif font",
        serif: "Classic serif font",
        lord: "Decorative font for headings",
      },
    },
    size: {
      name: "size",
      type: "number",
      min: 12,
      max: 96,
      description: "Font size in pixels",
      required: true,
      examples: {
        "16": "Default paragraph size",
        "24": "Subheading size",
        "32": "Heading size",
        "48": "Large display size",
      },
    },
    weight: {
      name: "weight",
      type: "string",
      values: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      description: "Font weight",
      examples: {
        "400": "Normal weight",
        "700": "Bold weight",
      },
    },
    align: {
      name: "align",
      type: "string",
      values: ["left", "center", "right", "justify"],
      description: "Text alignment",
      examples: {
        left: "Left-aligned text",
        center: "Centered text",
        right: "Right-aligned text",
        justify: "Justified text",
      },
    },
  },
};
