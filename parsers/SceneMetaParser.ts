interface SceneMetaProps {
  title: string;
  duration: number;
  background: string;
}

interface SceneMetaConfig {
  defaultProps?: Partial<SceneMetaProps>;
}

type ProcessedValues = {
  [K in keyof SceneMetaProps]: SceneMetaProps[K];
};

class SceneMetaParser {
  private defaultConfig: SceneMetaProps;

  constructor(config?: SceneMetaConfig) {
    this.defaultConfig = {
      title: "",
      duration: 5,
      background: "transparent",
      ...config?.defaultProps,
    };
  }

  private processValue(
    key: keyof SceneMetaProps,
    value: string,
    errors: string[],
  ): ProcessedValues[keyof SceneMetaProps] {
    try {
      switch (key) {
        case "duration": {
          const num = Number(value);
          if (isNaN(num) || num <= 0) {
            errors.push(`Invalid number for ${key}: ${value}`);
            return this.defaultConfig[key];
          }
          return num;
        }
        case "title":
        case "background":
          return value;
        default:
          return this.defaultConfig[key];
      }
    } catch (error) {
      errors.push(`Error processing ${key}: ${value}`);
      return this.defaultConfig[key];
    }
  }

  parse(input: string): { data: SceneMetaProps; errors: string[] } {
    const result = { ...this.defaultConfig };
    const errors: string[] = [];

    if (!input.startsWith("!!scene")) {
      errors.push("Input must start with !!scene");
      return { data: result, errors };
    }

    const matches = input.matchAll(/--(\w+)=(?:"([^"]*?)"|([^\s]*))/g);

    for (const [, key, quotedValue, unquotedValue] of matches) {
      if (key in this.defaultConfig) {
        const value = quotedValue || unquotedValue;
        const processedValue = this.processValue(
          key as keyof SceneMetaProps,
          value,
          errors,
        );
        // @ts-ignore - key is a string, but we know it's a key of SceneMetaProps
        result[key as keyof SceneMetaProps] = processedValue;
      }
    }

    return { data: result, errors };
  }
}

export default SceneMetaParser;
