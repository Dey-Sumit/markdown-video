/**
 * Text Parser for processing text component strings with animations and styling
 * Handles inputs like: --content="Hello" --animate=fadeIn --duration=2
 */
interface TextData {
  content: string;
  animation?: string;
  duration?: number;
  delay?: number;
  fontSize?: number;
  fontWeight?: number | string;
  applyTo?: "word" | "character" | "line";
  color?: string;
}

class TextParser {
  private defaultConfig: TextData = {
    content: "",
    animation: "none",
    duration: 3,
    delay: 0,
    fontSize: 60,
    fontWeight: 700,
    applyTo: "word",
    color: "white",
  };

  private processValue(
    key: keyof TextData,
    value: string,
    errors: string[],
  ): any {
    try {
      switch (key) {
        case "duration":
        case "delay":
        case "fontSize":
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`Invalid number for ${key}: ${value}`);
            return this.defaultConfig[key];
          }
          return num;
        case "fontWeight":
          return !isNaN(Number(value)) ? Number(value) : value;
        case "applyTo":
          if (!["word", "character", "line"].includes(value)) {
            errors.push(`Invalid applyTo value: ${value}`);
            return this.defaultConfig[key];
          }
          return value as "word" | "character" | "line";
        case "animation":
          return value || "none";
        default:
          return value;
      }
    } catch (error) {
      errors.push(`Error processing ${key}: ${value}`);
      return this.defaultConfig[key];
    }
  }

  private isValidKey(key: string): key is keyof TextData {
    return key in this.defaultConfig;
  }

  parse(input: string): { data: TextData; errors: string[] } {
    const result: TextData = { ...this.defaultConfig };
    const errors: string[] = [];
    const regex = /--(\w+)=(?:"([^"]*?)"|([^\s]*))/g;
    let hasContent = false;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const [, key, quotedValue, unquotedValue] = match;
      let value = quotedValue !== undefined ? quotedValue : unquotedValue;

      if (key === "content") hasContent = true;

      if (key === "animate") {
        result.animation = value;
        continue;
      }

      if (this.isValidKey(key)) {
        //@ts-ignore - key is a valid key
        result[key] = this.processValue(key, value, errors);
      }
    }

    if (!hasContent) {
      errors.push("Missing content property");
    }

    return { data: result, errors };
  }

  parseStack(input: string): { data: TextData[]; errors: string[] } {
    const errors: string[] = [];
    const blocks = input
      .split(",")
      .map((block) => block.trim())
      .filter((block) => block.length > 0);

    if (blocks.length === 0) {
      return { data: [], errors: ["Empty text stack"] };
    }

    const results = blocks.map((block, index) => {
      const { data, errors: blockErrors } = this.parse(block);
      errors.push(...blockErrors.map((err) => `Block ${index + 1}: ${err}`));
      return data;
    });

    return { data: results, errors };
  }
}

export default TextParser;
