interface BaseElement {
  type: string;
  [key: string]: any;
}

interface ElementParser {
  canParse(line: string): boolean;
  parse(line: string): BaseElement;
}

class TextParser implements ElementParser {
  canParse(line: string): boolean {
    return line.trim().startsWith("!text");
  }

  parse(line: string): BaseElement {
    const result = { type: "text" };
    const attrPattern = /--([a-zA-Z]+)="([^"]*)"/g;
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      const [, key, value] = match;
      result[key] = value;
    }

    return result;
  }
}

class SectionParser implements ElementParser {
  constructor(private mainParser: SectionWrapperParser) {}

  canParse(line: string): boolean {
    return line.trim().startsWith("!section");
  }

  parse(line: string, nestedContent?: string[]): BaseElement {
    const result = { type: "section" };

    // Updated pattern to handle quoted strings, numbers, and unquoted values
    const attrPattern = /--([a-zA-Z]+)=(?:"([^"]*)"|(\d+)|([^-\s]+))/g;
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      const [, key, quotedValue, numberValue, unquotedValue] = match;
      if (key !== "items") {
        // Use the first non-undefined value among quotedValue, numberValue, and unquotedValue
        const value =
          quotedValue ?? (numberValue ? Number(numberValue) : unquotedValue);
        result[key] = value;
      }
    }

    // If we have nested content, parse it
    if (nestedContent && nestedContent.length > 0) {
      result.items = this.mainParser.parseLines(nestedContent);
    }

    return result;
  }
}

class SectionWrapperParser {
  private parsers: ElementParser[];

  constructor() {
    // Note: SectionParser is added after construction to avoid circular dependency
    this.parsers = [new TextParser()];
    this.parsers.push(new SectionParser(this));
  }

  parseLines(lines: string[]): BaseElement[] {
    const results: BaseElement[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check if this line starts a nested structure
      if (line.includes("--items=(")) {
        const [nestedContent, newIndex] = this.collectNestedContent(lines, i);
        const parser = this.parsers.find((p) => p.canParse(line));

        if (parser instanceof SectionParser) {
          results.push(parser.parse(line, nestedContent));
        }

        i = newIndex; // Skip the nested lines
      } else {
        // Normal line parsing
        const parser = this.parsers.find((p) => p.canParse(line));
        if (parser) {
          results.push(parser.parse(line));
        }
      }
    }

    return results;
  }

  private collectNestedContent(
    lines: string[],
    startIndex: number,
  ): [string[], number] {
    const nestedContent: string[] = [];
    let depth = 0;
    let i = startIndex;

    // Skip the current line as it's the section declaration
    i++;

    // Collect lines until we find the matching closing parenthesis
    for (; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes("(")) depth++;
      if (line.includes(")")) depth--;

      // If depth is -1, we've found the end of our current section
      if (depth < 0) {
        break;
      }

      nestedContent.push(line);
    }

    // Remove the last line if it's just a closing parenthesis
    if (
      nestedContent.length > 0 &&
      nestedContent[nestedContent.length - 1] === ")"
    ) {
      nestedContent.pop();
    }

    return [nestedContent, i];
  }

  parse(input: string): BaseElement {
    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return this.parseLines(lines)[0];
  }
}

// Export the parser
const sectionWrapperParser = new SectionWrapperParser();
export default sectionWrapperParser;
