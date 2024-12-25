type BaseArgument = {
  type: "string" | "number" | "boolean";
  required?: boolean;
  default: string;
  processor?: (value: string) => any;
};

type StringArgument = BaseArgument & {
  type: "string";
  values?: string[];
  processor?: (value: string) => string;
};

type NumberArgument = BaseArgument & {
  type: "number";
  processor?: (value: string) => number;
};

type BooleanArgument = BaseArgument & {
  type: "boolean";
  processor?: (value: string) => boolean;
};

type ArgumentConfig = StringArgument | NumberArgument | BooleanArgument;

// Core configuration type
type CorePropertyConfig<T> = {
  name: string;
  prefix: "!" | "!!";
  arguments: {
    [K in keyof T]: ArgumentConfig;
  };
};

// Editor specific types
type EditorArgumentConfig = ArgumentConfig & {
  description: string;
  examples?: Record<string, string>;
};

type EditorPropertyConfig<T> = CorePropertyConfig<T> & {
  description: string;
  arguments: {
    [K in keyof T]: EditorArgumentConfig;
  };
};

// All possible argument types
type SceneArgs = {
  title: string;
  duration: number;
  background: string;
};

type TransitionArgs = {
  type: string;
  duration: number;
  direction: string;
  delay?: number;
  easing?: string;
};

type MediaArgs = {
  src: string;
  duration: number;
  animation: string;
  delay: number;
  withMotion: boolean;
};

type MarkArgs = {
  color: string;
  delay: number;
  duration: number;
  type: string;
};

type TextArgs = {
  content: string;
  duration: number;
  animation: string;
  delay: number;
  fontSize: string;
  fontWeight: string;
  applyTo: string;
};

const CORE_PROPS_CONFIG = {
  scene: {
    name: "scene",
    prefix: "!!" as const,
    arguments: {
      title: {
        type: "string",
        required: false,
        default: "",
      },
      duration: {
        type: "number",
        required: true,
        default: "3",
        processor: (value: string) => Number(value),
      },
      background: {
        type: "string",
        required: false,
        default: "transparent",
        values: ["#1a1a1a", "#713f12", "transparent"],
      },
    },
  },
  transition: {
    name: "transition",
    prefix: "!" as const,
    arguments: {
      type: {
        type: "string",
        required: true,
        default: "magic",
        values: ["slide", "magic", "wipe", "fade"],
      },
      duration: {
        type: "number",
        default: "0.3",
        processor: (value: string) => Number(value),
      },
      direction: {
        type: "string",
        default: "from-bottom",
        values: ["from-bottom", "from-left", "from-right", "from-top"],
      },
      delay: {
        type: "number",
        default: "0",
        processor: (value: string) => Number(value),
      },
    },
  },
  media: {
    name: "media",
    prefix: "!" as const,
    arguments: {
      src: {
        type: "string",
        required: true,
        default: "",
      },
      duration: {
        type: "number",
        default: "1",
        processor: (value: string) => Number(value),
      },
      animation: {
        type: "string",
        default: "fade",
        values: ["fade", "zoom", "slide"],
      },
      delay: {
        type: "number",
        default: "0.5",
        processor: (value: string) => Number(value),
      },
      withMotion: {
        type: "boolean",
        default: "true",
        processor: (value: string) => value === "true",
      },
    },
  },
  mark: {
    name: "mark",
    prefix: "!" as const,
    arguments: {
      color: {
        type: "string",
        default: "yellow",
        values: ["red", "blue", "green", "yellow"],
      },
      delay: {
        type: "number",
        default: "0",
        processor: (value: string) => Number(value),
      },
      duration: {
        type: "number",
        default: "1",
        processor: (value: string) => Number(value),
      },
      type: {
        type: "string",
        default: "highlight",
      },
    },
  },
  text: {
    name: "text",
    prefix: "!" as const,
    arguments: {
      content: {
        type: "string",
        required: true,
        default: "",
      },
      duration: {
        type: "number",
        default: "3",
        processor: (value: string) => Number(value),
      },
      animation: {
        type: "string",
        default: "fadeInSlideUp",
        values: ["fadeInSlideUp", "fadeInSlideDown", "fadeInOnly", "wobble"],
      },
      delay: {
        type: "number",
        default: "0",
        processor: (value: string) => Number(value),
      },
      fontSize: {
        type: "string",
        default: "60",
        processor: (value: string) => `${value}px`,
      },
      fontWeight: {
        type: "string",
        default: "700",
      },
      applyTo: {
        type: "string",
        default: "word",
      },
    },
  },
} satisfies CorePropsConfigType;

export type CorePropsConfigType = {
  scene: CorePropertyConfig<SceneArgs>;
  transition: CorePropertyConfig<TransitionArgs>;
  media: CorePropertyConfig<MediaArgs>;
  mark: CorePropertyConfig<MarkArgs>;
  text: CorePropertyConfig<TextArgs>;
};

type RuntimePropertyConfig<T> = {
  defaults: Record<keyof T, string>;
  validKeys: Array<keyof T>;
  processors: {
    [K in keyof T]?: (value: string) => T[K];
  };
};

function generateRuntimeConfig<T>(
  config: CorePropertyConfig<T>,
): RuntimePropertyConfig<T> {
  return {
    defaults: Object.entries(config.arguments).reduce(
      (acc, [key, arg]) => {
        acc[key as keyof T] = (arg as ArgumentConfig).default;
        return acc;
      },
      {} as Record<keyof T, string>,
    ),

    validKeys: Object.keys(config.arguments) as Array<keyof T>,

    processors: Object.entries(config.arguments).reduce(
      (acc, [key, arg]) => {
        const typedArg = arg as ArgumentConfig;
        if (typedArg.processor) {
          acc[key as keyof T] = typedArg.processor;
        }
        return acc;
      },
      {} as RuntimePropertyConfig<T>["processors"],
    ),
  };
}
// Generate all runtime configs
const RUNTIME_PROPS_CONFIG = {
  scene: generateRuntimeConfig(CORE_PROPS_CONFIG.scene),
  transition: generateRuntimeConfig(CORE_PROPS_CONFIG.transition),
  media: generateRuntimeConfig(CORE_PROPS_CONFIG.media),
  mark: generateRuntimeConfig(CORE_PROPS_CONFIG.mark),
  text: generateRuntimeConfig(CORE_PROPS_CONFIG.text),
};

export { CORE_PROPS_CONFIG, RUNTIME_PROPS_CONFIG };
