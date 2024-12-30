import type { SceneProperty } from "../types.x-editor";

export const EDITOR_PROPERTIES: Record<string, SceneProperty> = {
  scene: {
    name: "scene",
    prefix: "!!",
    description: "Creates a new scene block with specific duration",
    arguments: {
      title: {
        name: "title",
        type: "string",
        required: false,
        description: "Unique identifier for the scene",
      },
      duration: {
        name: "duration",
        type: "number",
        required: true,
        description: "Duration in seconds for this scene",
        examples: {
          "3": "3 Seconds | Short scene, good for quick transitions",
          "5": "5 Seconds | Standard scene length",
          "7.5": "7.5 Seconds | Extended scene for detailed content",
        },
      },
      background: {
        name: "background",
        type: "string",
        required: false,
        description: "Background color for the scene",
        // TODO : duplicate config
        values: ["black", "white", "red", "blue", "green", "yellow"],
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
        required: true,
        values: ["slide", "magic", "wipe", "fade"],
        description: "Type of transition animation to apply",
        examples: {
          slide: "Slides content in from the edge",
          fade: "Smoothly fades content in/out",
          magic: "It's Magic, works with code only",
          wipe: "Wipes content in from the edge",
        },
      },
      duration: {
        name: "duration",
        type: "number",
        required: false,
        description: "How long the transition takes (in seconds)",
        examples: {
          "0.3": "Smooth, default transition",
          "0.1": "Quick transition",
          "0.5": "Slow, dramatic transition",
        },
      },
      direction: {
        name: "direction",
        type: "string",
        required: false,
        description: "Direction of the transition",
        examples: {
          "from-bottom": "Slide in from the bottom",
          "from-left": "Slide in from the left",
          "from-right": "Slide in from the right",
          "from-top": "Slide in from the top",
        },
        values: ["from-bottom", "from-left", "from-right", "from-top"],
      },
    },
  },
  media: {
    name: "media",
    prefix: "!",
    description: "Adds media content to the scene",
    arguments: {
      src: {
        name: "src",
        type: "string",
        required: true,
        description: "URL of the media content to display",
      },
      duration: {
        name: "duration",
        type: "number",
        required: false,
        description: "How long the transition takes (in seconds)",
        examples: {
          "0.3": "Smooth, default transition",
          "0.1": "Quick transition",
          "0.5": "Slow, dramatic transition",
        },
      },
      animation: {
        name: "animation",
        type: "string",
        required: false,
        description: "Animation to apply to the media content",
        values: ["fade", "zoom", "slide"],
        examples: {
          fade: "Default | Smoothly fades content in/out",
          zoom: "Zooms in on the content",
          slide: "Slides content in from the edge",
        },
      },
      delay: {
        name: "delay",
        type: "number",
        required: false,
        description: "Delay before animation starts (in seconds)",
        examples: {
          "0.3": "Short delay",
          "1": "Medium delay",
          "2": "Long delay",
        },
      },
      withMotion: {
        name: "withMotion",
        type: "boolean",
        required: false,
        description: "Adds subtle motion effect to the media content",
        examples: {
          true: "Default | Enable motion effect",
          false: "Disable motion effect",
        },
      },
    },
  },
  mark: {
    name: "mark",
    prefix: "!",
    description: "Marks code segments for animation",
    arguments: {
      color: {
        name: "color",
        type: "string",
        values: ["red", "blue", "green", "yellow"],
        description: "Color of the highlight",
        examples: {
          red: "Highlight in red color",
          blue: "Highlight in blue color",
          green: "Highlight in green color",
          yellow: "Highlight in yellow color",
        },
      },
      delay: {
        name: "delay",
        type: "number",
        description: "Delay before animation starts (in seconds)",
        examples: {
          "0.3": "Short delay",
          "1": "Medium delay",
          "2": "Long delay",
        },
      },
      duration: {
        name: "duration",
        type: "number",
        description: "Duration of the highlight animation (in seconds)",
        examples: {
          "0.5": "Quick highlight",
          "1": "Standard duration",
          "2": "Extended highlight",
        },
      },
    },
  },
  text: {
    name: "text",
    prefix: "!",
    description: "Adds text content to the scene",
    arguments: {
      content: {
        name: "content",
        type: "string",
        required: true,
        description: "Text content to display",
      },
      duration: {
        name: "duration",
        type: "number",
        required: false,
        description: "How long the text stays on screen (in seconds)",
        examples: {
          "0.3": "Short duration",
          "1": "Standard duration",
          "2": "Extended duration",
        },
      },
      animation: {
        name: "animation",
        type: "string",
        required: false,
        description: "Animation to apply to the text content",
        values: [
          "fadeInSlideUp",
          "fadeInSlideDown",
          "fadeInOnly",
          "wobble",
          "bounceIn",
          "flipIn",
          "zoomOut",
          "wave",
          "scaleIn ",
        ],
        examples: {
          fadeInSlideUp: "Slide up from the bottom",
          fadeInSlideDown: "Slide down from the top",
          fadeInOnly: "Fade in without sliding",
        },
      },
      delay: {
        name: "delay",
        type: "number",
        required: false,
        description: "Delay before animation starts (in seconds)",
        examples: {
          "0.3": "Short delay",
          "1": "Medium delay",
          "2": "Long delay",
        },
      },
      crazy: {
        name: "crazy",
        type: "number",
        required: false,
        description: "Delay before animation starts (in seconds)",
        examples: {
          "0.3": "Short delay",
          "1": "Medium delay",
          "2": "Long delay",
        },
      },
      color: {
        name: "color",
        type: "string",
        required: false,
        description: "Color of the text",
        examples: {
          "#1a1a1a": "Dark Gray background",
          "#713f12": "Dark Navy Blue background",
          "#7f1d1d": "Midnight Blue background",
          "#1e3a8a": "Charcoal Gray background",
          "#663399": "Rebecca Purple background",
          "rgb(64, 64, 64)": "Dim Gray background",
          "rgb(34, 40, 49)": "Gunmetal Gray background",
          red: "Red background",
        },
      },
    },
  },
};
