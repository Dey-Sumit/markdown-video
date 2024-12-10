import type { TransitionType } from "../types.composition";

type PostProcessor = (value: string) => string | number;

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

interface MediaResult {
  src: string;
  type: string;
  alt?: string;
  duration: number;
}
interface TypeConfig {
  defaults: Record<string, string>;
  validKeys: string[];
  processors?: Record<string, PostProcessor>;
}

class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

const configs: Record<"transition" | "fonts" | "media", TypeConfig> = {
  transition: {
    defaults: { type: "fade", duration: "1" },
    validKeys: ["type", "duration", "delay", "easing"],
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
    defaults: { src: "", type: "image", duration: "1" },
    validKeys: ["src", "type", "alt", "duration"],
    processors: {
      duration: (value) => Number(value),
    },
  },
};

class PropsParser {
  private parseArgs<T extends keyof typeof configs>(
    type: T,
    input: string,
  ): Record<string, string | number> {
    const config = configs[type];

    if (!input?.trim()) {
      return this.processValues(config, { ...config.defaults });
    }

    try {
      const params: Record<string, string> = {};
      const paramRegex = /--(\w+)=([^\s]+)/g;
      const matches = [...input.matchAll(paramRegex)];

      if (matches.length === 0) {
        throw new ParseError("Invalid format. Use --key=value syntax");
      }

      matches.forEach(([, key, value]) => {
        if (!value) {
          throw new ParseError(`Missing value for key: ${key}`);
        }
        if (!config.validKeys.includes(key)) {
          throw new ParseError(`Invalid key: ${key} for type: ${type}`);
        }
        params[key] = value;
      });

      return this.processValues(config, { ...config.defaults, ...params });
    } catch (error) {
      throw error instanceof ParseError
        ? error
        : new ParseError("Failed to parse input");
    }
  }

  private processValues(
    config: TypeConfig,
    values: Record<string, string>,
  ): Record<string, string | number> {
    const result: Record<string, string | number> = { ...values };

    if (config.processors) {
      Object.entries(values).forEach(([key, value]) => {
        if (config.processors?.[key]) {
          result[key] = config.processors[key](value);
        }
      });
    }

    return result;
  }
  // TODO : add a fallback input string, so if it throws error (means it's not a valid input), it should get fallback again and parse it.
  transition(input: string): TransitionResult {
    return this.parseArgs("transition", input) as unknown as TransitionResult;
  }

  fonts(input: string): FontsResult {
    return this.parseArgs("fonts", input) as unknown as FontsResult;
  }

  media(input: string): MediaResult {
    return this.parseArgs("media", input) as unknown as MediaResult;
  }
}

const propsParser = new PropsParser();

export default propsParser;
