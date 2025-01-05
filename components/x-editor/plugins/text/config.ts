import type { Monaco } from "@monaco-editor/react";
import type { AdapterConfig, CommandContext } from "../../core/types/adapter";
import { AbstractAdapter } from "../../core/base/adapter";
import type { editor } from "monaco-editor";

// plugins/text/config.ts
const textConfig: AdapterConfig = {
  id: "text",
  pattern: {
    type: "component",
    prefix: ["!"],
  },
  template: 'text --content="${1:Hello}" --size=${2:30} --family=${3:sans}',
  arguments: {
    content: {
      name: "content",
      type: "string",
      description: "Text content",
      required: true,
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