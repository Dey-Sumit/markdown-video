import BaseParser from "../../core/base/parser";
import sectionConfig, { defaultSectionArgValues } from "./section.config";
import type { Section, Component, SectionInputProps } from "./section.types";

export class SectionParser {
  private baseParser: BaseParser<SectionInputProps>;

  constructor() {
    this.baseParser = new BaseParser(sectionConfig, defaultSectionArgValues);
  }

  parse(input: string): {
    data: Section;
    errors?: string[];
  } {
    try {
      // First pass: parse the section properties
      const { data: sectionData } = this.baseParser.parse(input);
      console.log("parse sectionData", sectionData);

      // Extract items string from the input
      const itemsMatch = input.match(/--items=\((.*)\)/s);
      if (!itemsMatch) {
        return {
          data: this.createSection(sectionData, []),
          errors: ["No items found in section"],
        };
      }

      // Parse the items
      const items = this.parseItems(itemsMatch[1]);

      return {
        data: this.createSection(sectionData, items),
      };
    } catch (error) {
      return {
        data: this.createEmptySection(),
        errors: [(error as Error).message],
      };
    }
  }

  private createSection(data: SectionInputProps, items: Component[]): Section {
    return {
      type: "section",
      id: this.baseParser.generateId(),
      data: {
        ...data,
        items,
      },
    };
  }

  private createEmptySection(): Section {
    return {
      type: "section",
      id: this.baseParser.generateId(),
      data: {
        ...defaultSectionArgValues,
        items: [],
      },
    };
  }

  private parseItems(input: string): Component[] {
    const items: Component[] = [];
    let currentItem = "";
    let depth = 0;

    // Split items handling nested parentheses
    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      // Track nested structure depth
      if (char === "(") depth++;
      if (char === ")") depth--;

      // Only split on commas at the root level
      if (char === "," && depth === 0) {
        if (currentItem.trim()) {
          const item = this.parseItem(currentItem.trim());
          if (item) items.push(item);
        }
        currentItem = "";
      } else {
        currentItem += char;
      }
    }

    // Handle last item
    if (currentItem.trim()) {
      const item = this.parseItem(currentItem.trim());
      if (item) items.push(item);
    }

    return items;
  }

  private parseItem(input: string): Component | null {
    // Early return for empty input
    if (!input) return null;

    // Handle nested sections
    if (input.startsWith("!section")) {
      return this.parse(input).data;
    }

    // Handle other component types
    const componentMatch = input.match(/!([\w]+)\s*(.*)/);
    if (!componentMatch) return null;

    const [, type, propsString] = componentMatch;

    return {
      type: type as Component["type"],
      data: this.parseComponentProps(propsString),
    };
  }

  private parseComponentProps(input: string): Record<string, any> {
    const props: Record<string, any> = {};
    const matches = input.matchAll(
      /--(\w+)=([^,\s()]+|"[^"]*"|'[^']*'|\([^)]*\))/g,
    );

    for (const [, key, value] of matches) {
      props[key] = this.processValue(value);
    }

    return props;
  }

  private processValue(value: string): any {
    // Remove surrounding quotes if present
    value = value.replace(/^["']|["']$/g, "");

    // Handle numbers
    if (/^\d+$/.test(value)) return Number(value);
    if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

    // Handle booleans
    if (value === "true") return true;
    if (value === "false") return false;

    // Handle arrays (if needed)
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    // Handle nested parentheses content
    if (value.startsWith("(") && value.endsWith(")")) {
      return this.parseItems(value.slice(1, -1));
    }

    return value;
  }
}

// Create singleton instance
const sectionParser = new SectionParser();
export default sectionParser;
