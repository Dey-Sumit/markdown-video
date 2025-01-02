import type {
  FontsResult,
  IndividualReturnType,
  Mark,
  Media,
  PropsParserConfig,
  SceneMetaResult,
  TextProps,
  TransitionResult,
  TypeConfig,
} from "@/types/props.types";
import { generateFallbackPropsFormat } from "@/utils/utils";
import type { contentLayoutReturnType } from "../components/compone-layout-renderer";

class PraseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PropsParser";
  }
}
interface ParserOptions {
  withFallback?: boolean;
  fallbackInput?: string;
  silent?: boolean;
}

const configs: PropsParserConfig = {
  sceneMeta: {
    defaults: { title: "", duration: "3", background: "transparent" },
    validKeys: ["title", "duration", "background"],
    processors: {
      duration: (value) => Number(value),
    },
  },

  transition: {
    defaults: { type: "magic", duration: "0.3", direction: "from-bottom" },
    validKeys: ["type", "duration", "delay", "easing", "direction"],
    processors: {
      duration: (value) => Number(value),
      delay: (value) => Number(value),
    },
  },

  code: {
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
      animation: "none",
      delay: "0",
      fontSize: "60",
      fontWeight: "700",
      applyTo: "word",
      color: "white",
    },
    validKeys: [
      "content",
      "duration",
      "animation",
      "delay",
      "fontSize",
      "fontWeight",
      "applyTo",
      "color",
    ],
    processors: {
      duration: (value) => Number(value),
      delay: (value) => Number(value),
      fontSize: (value) => `${value}px`,
      fontWeight: (value) => value,
    },
  },
  contentLayout: {
    defaults: {},
    validKeys: ["component"],
    processors: {
      component: (value: string) => {
        console.log("inside contentLayout processors", { value });

        const match = value.match(/(\w+)\((.*)\)/);
        if (!match) return { name: value, data: {} };

        const [, name, paramsString] = match;
        const params: Record<string, number | string> = {};

        const paramMatches = paramsString.matchAll(/--(\w+)=([^\s]*)/g);
        for (const [, key, value] of paramMatches) {
          params[key] = !isNaN(Number(value)) ? Number(value) : value;
        }
        console.log("contentLayout processors", {
          value,
          name,
          params,
        });

        return {
          name,
          data: params,
        };
      },
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
} as const;

const FALLBACK_PROPS_RAW_FORMAT = generateFallbackPropsFormat(configs);

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
        type === "text" || type === "sceneMeta"
          ? /--(\w+)=\s*(?:"([^"]*?)"|([^\s]*))/g
          : type === "contentLayout"
            ? /--(\w+)=\s*((?:\w+\([^)]*\)|[^\s]*))/g
            : /--(\w+)=\s*([^\s]*)/g;

      const matches = [...input.matchAll(paramRegex)];
      console.log({ matches });

      if (matches.length === 0) {
        return this.processValues(config, config.defaults);
        // ! Not throwing error for now as it might break the user's flow.
        // throw new ParseError(
        //   `Invalid format of ${type} : Use --key=value syntax`,
        // );
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

  code(input: string, options?: ParserOptions): FontsResult {
    return this.parseArgs("code", input, options) as unknown as FontsResult;
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

  contentLayout(input: string, options?: ParserOptions) {
    return this.parseArgs("contentLayout", input, options)
      .component as contentLayoutReturnType;
  }
}

const propsParser = new PropsParser();

export default propsParser;
