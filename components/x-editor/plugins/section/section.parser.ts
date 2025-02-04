import BaseParser from "../../core/base/parser";

interface SectionData {
  cols?: number;
  rows?: number;
  direction?: "row" | "column";
  gap?: number;
  items: any[];
}

export class SectionPropsParser {
  parse(input: string): { data: SectionData } {
    // Remove !section prefix if present
    const content = input.startsWith("!section") ? input.slice(8) : input;

    const section: SectionData = {
      cols: undefined,
      rows: undefined,
      direction: "row",
      gap: 0,
      items: [],
    };

    // Extract properties before items
    const propsMatch = content.match(/--(\w+)=([^(\s]+)/g);
    if (propsMatch) {
      propsMatch.forEach((prop) => {
        const [key, value] = prop.replace("--", "").split("=");
        if (key === "cols" || key === "rows" || key === "gap") {
          section[key] = parseInt(value);
        } else if (key === "direction") {
          section[key] = value as "row" | "column";
        }
      });
    }

    // Extract items between parentheses
    const itemsMatch = content.match(/--items=\(([\s\S]*)\)/);
    if (itemsMatch) {
      section.items = this.parseItems(itemsMatch[1]);
    }

    return { data: section };
  }

  private parseItems(input: string): any[] {
    const items: any[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (char === "(") depth++;
      if (char === ")") depth--;

      if (char === "\n" && depth === 0 && current.trim()) {
        items.push(this.parseItem(current.trim()));
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      items.push(this.parseItem(current.trim()));
    }

    return items;
  }

  private parseItem(input: string): any {
    if (input.startsWith("!section")) {
      return new SectionPropsParser().parse(input).data;
    }

    // Parse text component
    if (input.startsWith("!text")) {
      const props: any = {};
      const matches = input.matchAll(/--(\w+)=(?:"([^"]*)"|([^"\s]*))/g);

      for (const match of matches) {
        const [, key, quotedValue, unquotedValue] = match;
        props[key] = quotedValue ?? unquotedValue;

        if (key === "size") {
          props[key] = parseInt(props[key]);
        }
      }

      return {
        type: "text",
        ...props,
      };
    }

    return input; // Return raw string for unknown types
  }
}

const sectionParser = new SectionPropsParser();
export default sectionParser;
