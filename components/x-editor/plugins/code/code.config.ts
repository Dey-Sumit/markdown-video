import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultCodeArgValues = {
  presetStyle: "midnight",
  fontSize: 14,
};

export const codeConfig: AdapterConfig = {
  id: "code",
  pattern: {
    type: "codeComponent",
    pattern: "^`{3,4}\\w+\\s*!\\s*",
  },
  template:
    "```${1:js} ! --theme=${2:midnight} --font-size=${3:14}\n${4:// Your code here}\n```",
  arguments: {
    presetStyle: {
      name: "presetStyle",
      type: "string",
      description: "Code block theme preset",
      default: defaultCodeArgValues.presetStyle,
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
  },
};

export default codeConfig;
