// plugins/text/config.ts

import type { AdapterConfig } from "../../core/types/adapter.type";

export const textConfig: AdapterConfig = {
  id: "text",
  pattern: {
    type: "component",
    pattern: "^\\s*!text\\b",
  },
  template: 'text --content="${1:Hello}" --size=${2:30} --family=${3:sans}',
  arguments: {
    content: {
      name: "content",
      type: "string",
      description: "Text content",
      required: true,
      default: "Default Text",
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
      default: 30,
      min: 12,
      max: 96,
      validations: [
        {
          type: "range",
          message: "Size must be between 12px and 96px",
          validate: (value) => Number(value) >= 12 && Number(value) <= 96,
          severity: "error",
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
  },
};

export const defaultTextArgValues = {
  content: "Default Text",
  size: 30,
  family: "sans",
};

export default textConfig;
