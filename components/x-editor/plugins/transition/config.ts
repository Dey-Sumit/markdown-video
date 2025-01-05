import type { AdapterConfig } from "../../core/types/adapter";

// plugins/transition/config.ts
const transitionConfig: AdapterConfig = {
  id: "transition",
  pattern: {
    type: "component",
    pattern: "^\\s*!transition\\b",
  },
  template: "transition --type=${1:fade} --duration=${2:0.5}",
  arguments: {
    type: {
      name: "type",
      type: "string",
      description: "Transition type",
      required: true,
      values: ["fade", "slide", "wipe"],
    },
    duration: {
      name: "duration",
      type: "number",
      description: "Transition duration in seconds",
      required: true,
      min: 0,
      examples: {
        "0.5": "Short duration",
        "1": "Standard duration",
        "2": "Long duration",
      },
    },
  },
};

export default transitionConfig;
