import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultCodeArgValues = {
  theme: "midnight",
  fontSize: 14,
  align: "left-top",
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
      values: [
        "left-center",
        "right-center",
        "left-top",
        "right-top",
        "left-bottom",
        "right-bottom",
        "center-center",
      ],
      examples: {
        "left-center": "Left Center",
        "right-center": "Right Center",
        "left-top": "Left Top",
        "right-top": "Right Top",
        "left-bottom": "Left Bottom",
        "right-bottom": "Right Bottom",
        "center-center": "Center Center",
      },
    },
  },
};

export default codeConfig;
