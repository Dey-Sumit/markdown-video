// plugins/text/config.ts

import type { AdapterConfig } from "../../core/types/adapter.type";

const textConfig: AdapterConfig = {
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
      min: 12,
      max: 96,
      examples: {
        "16": "Paragraph text",
        "24": "Subheading",
        "48": "Heading",
      },
    },
    family: {
      name: "family",
      type: "string",
      values: ["mono", "sans", "serif"],
      description: "Font family",
    },
  },
};

export default textConfig;
