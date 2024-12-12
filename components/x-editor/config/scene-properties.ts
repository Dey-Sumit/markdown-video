import type { SceneProperty } from "../types.x-editor";

export const EDITOR_PROPERTIES: Record<string, SceneProperty> = {
  scene: {
    name: "scene",
    prefix: "!!",
    arguments: {
      title: { name: "title", type: "string", required: true },
      duration: { name: "duration", type: "number", required: true },
    },
  },
  transition: {
    name: "transition",
    prefix: "!",
    arguments: {
      type: {
        name: "type",
        type: "string",
        values: ["slide", "fade"],
      },
      duration: { name: "duration", type: "number" },
    },
  },
};
