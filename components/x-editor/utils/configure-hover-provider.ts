import type { Monaco } from "@monaco-editor/react";
import { CORE_PROPS_CONFIG } from "../config/property-config";
import { EDITOR_LANGUAGE } from "../const";

const HOVER_DOCS = {
  scene: {
    title: "Scene Declaration",
    description: "Defines a new scene with configurable duration and styling",
    args: {
      title: "Unique identifier for the scene",
      duration: "Duration in seconds for this scene",
      background: "Background color/style for the scene",
    },
  },
  text: {
    title: "Text Component",
    description: "Adds animated text content to the scene",
    args: {
      content: "Text content to display",
      applyTo: "Target scope (word | line | block)",
      fontSize: "Font size in pixels",
      fontWeight: "Font weight (100-900)",
      animation: "Animation style",
      duration: "Animation duration",
      delay: "Delay before animation",
    },
  },
  media: {
    title: "Media Component",
    description: "Displays image or video content",
    // args: CORE_PROPS_CONFIG.media.arguments,
    args: {
      src: "URL of the media file",
      duration: "Duration in seconds",
      animation: "Animation style",
      delay: "Delay before animation",
      withMotion: "Enable motion effect",
    },
  },
  transition: {
    title: "Transition Component",
    description: "Configures scene transition effects",
    // args: CORE_PROPS_CONFIG.transition.arguments,
    args: {
      type: "Transition effect type",
      duration: "Transition duration",
      delay: "Delay before transition",
    },
  },
  mark: {
    title: "Code Mark",
    description: "Highlights code segments for animation",
    // args: CORE_PROPS_CONFIG.mark.arguments,
    args: {
      color: "Highlight color",
      delay: "Delay before animation",
      duration: "Animation duration",
      type: "Highlight type",
    },
  },
};

export const configureHoverProvider = (monaco: Monaco) => {
  monaco.languages.registerHoverProvider(EDITOR_LANGUAGE, {
    provideHover: (model, position) => {
      const line = model.getLineContent(position.lineNumber);

      // Scene hover
      if (line.match(/^##\s*!!scene/)) {
        return {
          contents: getHoverContent(HOVER_DOCS.scene),
        };
      }

      // Component hovers
      const componentMatch = line.match(/!(text|media|transition)/);
      if (componentMatch) {
        const component = componentMatch[1] as keyof typeof HOVER_DOCS;
        return {
          contents: getHoverContent(HOVER_DOCS[component]),
        };
      }

      // Code mark hover
      if (line.match(/!mark/)) {
        return {
          contents: getHoverContent(HOVER_DOCS.mark),
        };
      }

      return null;
    },
  });
};

// TODO : we can add more stuff in the docs like examples, required fields , available values for properties etc
function getHoverContent(doc: (typeof HOVER_DOCS)[keyof typeof HOVER_DOCS]) {
  return [
    { value: `# ${doc.title}` },
    { value: doc.description },
    {
      value:
        "### Arguments\n" +
        Object.entries(doc.args)
          .map(([key, desc]) => `- --${key}: ${desc}`)
          .join("\n"),
    },
  ];
}
