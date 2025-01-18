import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultCodeArgValues = {
  theme: "midnight",
  fontSize: 38,
  align: "top",
};

const CODE_ALIGN_VALUES = ["top", "center"] as const;

export type CodeAlignValues = (typeof CODE_ALIGN_VALUES)[number];

export const codeConfig: AdapterConfig = {
  id: "code",
  pattern: {
    type: "codeBlockComponent",
    // pattern: "^`{3,4}\\w+\\s*!\\s*",
    pattern: "^`{3,4}\\w+\\s*!",
  },
  template:
    "```${1:js} ! --theme=${2:midnight} --font-size=${3:14}\n${4:// Your code here}\n```",
  arguments: {
    theme: {
      name: "theme",
      type: "string",
      description: "Code block theme preset",
      default: defaultCodeArgValues.theme,
      values: ["midnight", "rainbow"],
      examples: {
        midnight: "Midnight theme",
        rainbow: "Rainbow theme",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid preset style",
          validate: (value) => ["midnight", "rainbow"].includes(value),
          severity: "warning",
        },
      ],
    },
    fontSize: {
      name: "fontSize",
      type: "number",
      description: "Font size in pixels",
      default: defaultCodeArgValues.fontSize,
      validations: [
        {
          type: "range",
          message: "Font size must be between 12 and 24",
          validate: (value) => Number(value) >= 12 && Number(value) <= 24,
          severity: "warning",
        },
      ],
    },
    align: {
      name: "align",
      type: "string",
      description: "Code block alignment",
      default: defaultCodeArgValues.align,
      values: CODE_ALIGN_VALUES as unknown as string[],
      examples: {
        top: "Align to the top",
        center: "Center align",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid alignment value",
          validate: (value) =>
            CODE_ALIGN_VALUES.includes(value as CodeAlignValues),
          severity: "warning",
        },
      ],
    },
  },
};

export default codeConfig;
