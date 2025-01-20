// plugins/highlight/config.ts
import type { AdapterConfig } from "../../core/types/adapter.type";

export const defaultHighlightArgValues = {
  color: "red",
  duration: 1,
  delay: 0,
};

export const highlightConfig: AdapterConfig = {
  id: "highlight",
  pattern: {
    type: "codeComponent",
    pattern:
      "^\\s*(?://|#|--|/\\*|<!--)\\s*!highlight(?:\\(\\d+:\\d+\\)|\\[\\d+:\\d+\\])?\\b",
  },
  description: "Add highlighting effects to code sections",
  template: "!highlight --color=${1:red} --duration=${2:1} --delay=${3:0}",
  arguments: {
    color: {
      name: "color",
      type: "string",
      description: "Highlight color",
      default: defaultHighlightArgValues.color,
      examples: {
        red: "Red highlight",
        blue: "Blue highlight",
        green: "Green highlight",
        yellow: "Yellow highlight",
        purple: "Purple highlight",
      },
      validations: [
        {
          type: "enum",
          message: "Invalid color",
          validate: (value) =>
            ["red", "blue", "green", "yellow", "purple"].includes(value),
          severity: "warning",
        },
      ],
    },
    duration: {
      name: "duration",
      type: "number",
      description: "Duration of highlight animation in seconds",
      default: defaultHighlightArgValues.duration,
      validations: [
        {
          type: "range",
          message: "Duration must be between 0.1 and 5 seconds",
          validate: (value) => Number(value) >= 0.1 && Number(value) <= 5,
          severity: "warning",
        },
      ],
    },
    delay: {
      name: "delay",
      type: "number",
      description: "Delay before highlight animation starts in seconds",
      default: defaultHighlightArgValues.delay,
      validations: [
        {
          type: "range",
          message: "Delay must be between 0 and 10 seconds",
          validate: (value) => Number(value) >= 0 && Number(value) <= 10,
          severity: "warning",
        },
      ],
    },
  },
};

export default highlightConfig;
