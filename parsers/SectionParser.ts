import ImageParser from "./ImageParser";
import TextParser from "./TextParser";
import VideoParser from "./VideoParser";

type ContentType = "section" | "text" | "image" | "video" | "component";

interface ContentBase {
  type: ContentType;
  data: Record<string, any>;
}

interface SectionData extends ContentBase {
  type: "section";
  data: {
    cols?: number;
    rows?: number;
    direction?: "row" | "column";
    gap?: number;
    items: ContentBase[];
  };
}

interface ComponentData extends ContentBase {
  type: "component";
  name: string;
  data: Record<string, any>;
}

class SectionParser {
  private textParser: TextParser;
  private imageParser: ImageParser;
  private videoParser: VideoParser;

  constructor() {
    this.textParser = new TextParser();
    this.imageParser = new ImageParser();
    this.videoParser = new VideoParser();
  }

  private defaultConfig = {
    gap: 0,
    direction: "row",
  };

  private parseProps(input: string): Record<string, any> {
    const props: Record<string, any> = {};
    const matches = input.matchAll(/--(\w+)=([^,\s()]+)/g);

    for (const [, key, value] of matches) {
      props[key] = this.processValue(key, value);
    }

    return props;
  }

  private processValue(key: string, value: string): any {
    // Remove quotes if present
    value = value.replace(/^"|"$/g, "");

    if (["cols", "rows", "gap"].includes(key)) {
      return Number(value);
    }
    if (value === "true") return true;
    if (value === "false") return false;
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  private parseSection(input: string): SectionData {
    // Replace newlines with spaces first
    input = input.replace(/\n/g, " ");

    const props: Record<string, any> = { ...this.defaultConfig };
    // Extract section properties
    const propsMatch = input.match(/--(\w+)=([^()\s]+)/g);
    if (propsMatch) {
      propsMatch.forEach((prop) => {
        const [key, value] = prop.replace("--", "").split("=");
        props[key] = this.processValue(key, value);
      });
    }

    // Extract items
    const itemsMatch = input.match(/--items=\((.*)\)/s);
    const items = itemsMatch ? this.parseItems(itemsMatch[1]) : [];

    return {
      type: "section",
      data: {
        ...props,
        items,
      },
    };
  }

  private parseItems(input: string): ContentBase[] {
    const items: ContentBase[] = [];
    let currentItem = "";
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === "(") depth++;
      if (char === ")") depth--;

      if (char === "," && depth === 0) {
        if (currentItem.trim()) {
          items.push(this.parseItem(currentItem.trim()));
        }
        currentItem = "";
      } else {
        currentItem += char;
      }
    }

    if (currentItem.trim()) {
      items.push(this.parseItem(currentItem.trim()));
    }

    return items;
  }

  private parseItem(input: string): ContentBase {
    if (input.startsWith("!section")) {
      return this.parseSection(input.slice(8));
    } else if (input.startsWith("!text")) {
      const { data } = this.textParser.parse(input.slice(5));
      return {
        type: "text",
        data,
      };
    } else if (input.startsWith("!image")) {
      const { data } = this.imageParser.parse(input.slice(6));
      return {
        type: "image",
        data,
      };
    } else if (input.startsWith("!video")) {
      const { data } = this.videoParser.parse(input.slice(6));
      return {
        type: "video",
        data,
      };
    } else if (input.startsWith("!comp")) {
      return this.parseComponent(input.slice(5));
    }

    throw new Error(`Unknown item type: ${input}`);
  }

  private parseComponent(input: string): ComponentData {
    const nameMatch = input.match(/--name=(\w+)/);
    if (!nameMatch) throw new Error("Component name is required");

    const name = nameMatch[1];
    const propsMatch = input.match(/\((.*)\)/s);
    const props = propsMatch ? this.parseProps(propsMatch[1]) : {};

    return {
      type: "component",
      name,
      data: props,
    };
  }

  parse(input: string): ContentBase {
    try {
      if (!input.startsWith("!section")) {
        throw new Error("Content must start with !section");
      }
      return this.parseSection(input.slice(8));
    } catch (_error) {
      const error = _error as Error;

      throw new Error(`Failed to parse content: ${error.message}`);
    }
  }
}

const sectionParser = new SectionParser();
export default SectionParser;
export { sectionParser };
