interface TransitionData {
  type: string;
  duration: number;
  delay?: number;
  easing?: string;
  direction?: string;
}

class TransitionParser {
  private defaultConfig: TransitionData = {
    type: "magic",
    duration: 0.3,
    delay: 0,
    easing: "ease",
    direction: "from-bottom",
  };

  private processValue(
    key: keyof TransitionData,
    value: string,
    errors: string[],
  ): any {
    try {
      switch (key) {
        case "duration":
        case "delay":
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`Invalid number for ${key}: ${value}`);
            return this.defaultConfig[key];
          }
          return num;
        default:
          return value;
      }
    } catch (error) {
      errors.push(`Error processing ${key}: ${value}`);
      return this.defaultConfig[key];
    }
  }

  private isValidKey(key: string): key is keyof TransitionData {
    return key in this.defaultConfig;
  }

  parse(input: string): { data: TransitionData; errors: string[] } {
    const result: TransitionData = { ...this.defaultConfig };
    const errors: string[] = [];
    const regex = /--(\w+)=(?:"([^"]*?)"|([^\s]*))/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const [, key, quotedValue, unquotedValue] = match;
      let value = quotedValue !== undefined ? quotedValue : unquotedValue;

      if (this.isValidKey(key)) {
        // @ts-ignore - key is a valid key
        result[key] = this.processValue(key, value, errors);
      }
    }

    return { data: result, errors };
  }
}

export default TransitionParser;
