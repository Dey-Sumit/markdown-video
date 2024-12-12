import type { SceneProperty } from "../types.x-editor";

// config/editor-properties.ts
export const EDITOR_PROPERTIES: Record<string, SceneProperty> = {
  scene: {
    name: "scene",
    prefix: "!!",
    description: "Creates a new scene block with specific duration",
    arguments: {
      title: {
        name: "title",
        type: "string",
        required: true,
        description: "Unique identifier for the scene",
      },
      duration: {
        name: "duration",
        type: "number",
        required: true,
        description: "Duration in seconds for this scene",
        examples: {
          "5": "Short scene, good for quick transitions",
          "15": "Standard scene length",
          "30": "Extended scene for detailed content",
        },
      },
    },
  },
  transition: {
    name: "transition",
    prefix: "!",
    description: "Adds an animation when transitioning to this scene",
    arguments: {
      type: {
        name: "type",
        type: "string",
        values: ["slide", "fade"],
        description: "Type of transition animation to apply",
        examples: {
          slide: "Slides content in from the edge",
          fade: "Smoothly fades content in/out",
        },
      },
      duration: {
        name: "duration",
        type: "number",
        description: "How long the transition takes (in seconds)",
        examples: {
          "0.3": "Smooth, default transition",
          "0.1": "Quick transition",
          "0.5": "Slow, dramatic transition",
        },
      },
    },
  },
};
