type AnimationType =
  | "fade"
  | "scale"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "bounce-in"
  | "spin-in"
  | "flip-in"
  | "zig-zag"
  | "pop-in";

interface ImageProps {
  src: string;
  description?: string;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  withMotion?: boolean;
}

interface ImageParserConfig {
  defaultProps?: Partial<ImageProps>;
}

class ImageParser {
  private defaultConfig: ImageProps;

  constructor(config?: ImageParserConfig) {
    this.defaultConfig = {
      src: "",
      description: "",
      animation: "slide-up",
      duration: 3,
      delay: 0,
      withMotion: true,
      ...config?.defaultProps,
    };
  }

  private isValidAnimation(animation: string): animation is AnimationType {
    return [
      "fade",
      "scale",
      "slide-left",
      "slide-right",
      "slide-up",
      "slide-down",
      "bounce-in",
      "spin-in",
      "flip-in",
      "zig-zag",
      "pop-in",
    ].includes(animation);
  }

  private processValue(
    key: keyof ImageProps,
    value: string,
    errors: string[],
  ): any {
    try {
      switch (key) {
        case "animation":
          return this.isValidAnimation(value)
            ? value
            : this.defaultConfig.animation;
        case "duration":
        case "delay":
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`Invalid number for ${key}: ${value}`);
            return this.defaultConfig[key];
          }
          return num;
        case "withMotion":
          return value === "true";
        default:
          return value;
      }
    } catch (error) {
      errors.push(`Error processing ${key}: ${value}`);
      return this.defaultConfig[key];
    }
  }

  parse(input: string): { data: ImageProps; errors: string[] } {
    const result: ImageProps = { ...this.defaultConfig };
    const errors: string[] = [];

    const matches = input.matchAll(/--(\w+)=(?:"([^"]*?)"|([^\s]*))/g);

    for (const [, key, quotedValue, unquotedValue] of matches) {
      if (key in this.defaultConfig) {
        const value = quotedValue || unquotedValue;

        // @ts-ignore - key is a valid key
        result[key as keyof ImageProps] = this.processValue(
          key as keyof ImageProps,
          value,
          errors,
        );
      }
    }

    if (!result.src) errors.push("src is required");
    return { data: result, errors };
  }
}

export default ImageParser;
