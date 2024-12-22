import type { TransitionType } from "../types.composition";

type IndividualReturnType = string | number | boolean;

type PostProcessor = (value: string) => IndividualReturnType;

interface SceneMetaResult {
  name?: string;
  duration: number;
}

/* interface ZoomResult {
  level: number;
  delay: number;
  point: { x: number; y: number };
} */

// TODO : add direction here
interface TransitionResult {
  type: TransitionType;
  duration: number;
  delay?: number;
  easing?: string;
  direction: string;
}

interface FontsResult {
  family: string;
  size: string;
  weight: string;
  lineHeight?: string;
}

interface TypeConfig {
  defaults: Record<string, string>;
  validKeys: string[];
  processors?: Record<string, PostProcessor>;
}
interface Mark {
  delay: number;
  duration: number;
  type: string;
  color: string;
}

interface Media {
  src: string;
  duration: number;
  delay: number;
  animation: string;
  withMotion: boolean;
}

export interface TextProps {
  content: string;
  duration: number;
  animation: string;
  delay: number;
  fontSize: string;
  fontWeight: string;
}

class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}
interface ParserOptions {
  withFallback?: boolean;
  fallbackInput?: string;
  silent?: boolean;
}
// !text --content="Coding Challenge: Repeat a string with ellipsis" --duration=3 --animation=fadeInSlideUp --delay=1
// --fontSize=60 --fontWeight=700 --textAlign=center
const FALLBACK_PROPS_RAW_FORMAT = {
  sceneMeta: "--title= --duration=3",
  transition: "--type=magic --duration=0.3 --direction=from-bottom",
  fonts: "--family=arial --size=16 --weight=400",
  media: "--src= --duration=1 --animation=fade --delay=0.5 --withMotion=true",
  mark: "--delay=0 --duration=1 --type=highlight --color=yellow",
  text: "--content= --duration=3 --animation=fadeInSlideUp --delay=1 --fontSize=60 --fontWeight=700 ",
};

const configs: Record<
  "transition" | "fonts" | "media" | "sceneMeta" | "mark" | "text",
  TypeConfig
> = {
  transition: {
    defaults: { type: "magic", duration: "0.3", direction: "from-bottom" },
    validKeys: ["type", "duration", "delay", "easing", "direction"],
    processors: {
      duration: (value) => Number(value),
      delay: (value) => Number(value),
    },
  },
  fonts: {
    defaults: { family: "arial", size: "16", weight: "400" },
    validKeys: ["family", "size", "weight", "lineHeight"],
    processors: {
      size: (value) => `${value}px`,
      lineHeight: (value) => `${value}em`,
      weight: (value) => value,
    },
  },
  media: {
    defaults: {
      src: "",
      duration: "1",
      animation: "fade",
      delay: "0.5",
      withMotion: "true",
    },
    validKeys: ["src", "duration", "animation", "delay", "withMotion"], // TODO : type this tightly with the scene property config
    processors: {
      duration: (value) => Number(value),
      delay: (value) => Number(value),
      withMotion: (value) => value === "true",
    },
  },
  sceneMeta: {
    defaults: { title: "", duration: "3" },
    validKeys: ["title", "duration"],
    processors: {
      duration: (value) => Number(value),
    },
  },
  mark: {
    defaults: { delay: "0", duration: "1", type: "highlight", color: "yellow" },
    validKeys: ["delay", "duration", "type", "color"],
    processors: {
      delay: (value) => Number(value),
      duration: (value) => Number(value),
    },
  },
  text: {
    defaults: {
      content: "",
      duration: "3",
      animation: "fadeInSlideUp",
      delay: "1",
      fontSize: "60",
      fontWeight: "700",
    },
    validKeys: [
      "content",
      "duration",
      "animation",
      "delay",
      "fontSize",
      "fontWeight",
    ],
    processors: {
      duration: (value) => Number(value),
      delay: (value) => Number(value),
      fontSize: (value) => `${value}px`,
      fontWeight: (value) => value,
    },
  },
  /*  zoom: {
    defaults: { level: "1", delay: "0", point: "(0,0)" },
    validKeys: ["level", "delay", "point"],
    processors: {
      level: Number,
      delay: Number,
      point: (value) => {
        const [x, y] = value.slice(1, -1).split(",").map(Number);
        return { x, y };
      },
    },
  }, */
};

class PropsParser {
  private processValues<T extends keyof typeof configs>(
    config: TypeConfig,
    values: Record<string, string>,
  ): Record<string, IndividualReturnType> {
    const result: Record<string, IndividualReturnType> = { ...values };

    if (config.processors) {
      Object.entries(values).forEach(([key, value]) => {
        if (config.processors?.[key]) {
          try {
            result[key] = config.processors[key](value);
          } catch (error) {
            // If processor fails, keep original value
            console.warn(`Failed to process value for ${key}: ${value}`);
            result[key] = value;
          }
        }
      });
    }

    return result;
  }
  private parseArgs<T extends keyof typeof configs>(
    type: T,
    input: string,
    options?: ParserOptions,
  ): Record<string, IndividualReturnType> {
    const config = configs[type];
    const fallbackInput =
      options?.fallbackInput || FALLBACK_PROPS_RAW_FORMAT[type];

    try {
      const params: Record<string, string> = {};
      const paramRegex =
        type === "text"
          ? /--(\w+)=(?:"([^"]*?)"|([^\s]*))/g
          : /--(\w+)=([^\s]*)/g;
      const matches = [...input.matchAll(paramRegex)];

      if (matches.length === 0) {
        throw new ParseError(
          `Invalid format of ${type} : Use --key=value syntax`,
        );
      }

      // First pass: collect all valid values
      matches.forEach((match) => {
        const [, key, quotedValue, unquotedValue] = match;
        const value = quotedValue !== undefined ? quotedValue : unquotedValue;

        if (value && config.validKeys.includes(key)) {
          params[key] = value;
        }
      });

      // If we have fallback enabled and there are missing/invalid values
      if (options?.withFallback) {
        const fallbackMatches = [...fallbackInput.matchAll(paramRegex)];
        const missingKeys = config.validKeys.filter((key) => !(key in params));

        fallbackMatches.forEach(([, key, value]) => {
          if (missingKeys.includes(key)) {
            if (!options?.silent) {
              console.warn(
                `Fallback: Using default value for ${key} in ${type}`,
              );
            }
            params[key] = value;
          }
        });
      }

      return this.processValues(config, { ...config.defaults, ...params });
    } catch (error) {
      if (options?.withFallback) {
        if (!options?.silent) {
          console.warn(`Fallback: Invalid ${type} input, using defaults`);
        }
        return this.parseArgs(type, fallbackInput);
      }
      throw error;
    }
  }

  transition(input: string, options?: ParserOptions): TransitionResult {
    return this.parseArgs(
      "transition",
      input,
      options,
    ) as unknown as TransitionResult;
  }

  text(input: string, options?: ParserOptions): TextProps {
    return this.parseArgs("text", input, options) as unknown as TextProps;
  }

  fonts(input: string, options?: ParserOptions): FontsResult {
    return this.parseArgs("fonts", input, options) as unknown as FontsResult;
  }

  media(input: string, options?: ParserOptions): Media {
    return this.parseArgs("media", input, options) as unknown as Media;
  }

  sceneMeta(input: string, options?: ParserOptions): SceneMetaResult {
    return this.parseArgs(
      "sceneMeta",
      input,
      options,
    ) as unknown as SceneMetaResult;
  }

  mark(input: string, options?: ParserOptions): Mark {
    return this.parseArgs("mark", input, options) as unknown as Mark;
  }
}

const propsParser = new PropsParser();

export default propsParser;
