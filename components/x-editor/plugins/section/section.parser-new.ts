interface BaseElement {
  type: string;
  [key: string]: any;
}

interface ElementParser {
  canParse(line: string): boolean;
  parse(line: string): BaseElement;
}

class ImageParser implements ElementParser {
  canParse(line: string): boolean {
    return line.trim().startsWith("!image");
  }

  parse(line: string): BaseElement {
    const result = { type: "image" };
    // Updated pattern to match SectionParser's pattern
    const attrPattern = /--([a-zA-Z]+)=(?:"([^"]*)"|(\d+)|([^-\s]+))/g;
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      const [, key, quotedValue, numberValue, unquotedValue] = match;
      // Use the first non-undefined value among quotedValue, numberValue, and unquotedValue
      const value =
        quotedValue ?? (numberValue ? Number(numberValue) : unquotedValue);
      result[key] = value;
    }

    return result;
  }
}

class TextParser implements ElementParser {
  canParse(line: string): boolean {
    return line.trim().startsWith("!text");
  }

  parse(line: string): BaseElement {
    const result = { type: "text" };
    // Updated pattern to match SectionParser's pattern
    const attrPattern = /--([a-zA-Z]+)=(?:"([^"]*)"|(\d+)|([^-\s]+))/g;
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      const [, key, quotedValue, numberValue, unquotedValue] = match;
      // Use the first non-undefined value among quotedValue, numberValue, and unquotedValue
      const value =
        quotedValue ?? (numberValue ? Number(numberValue) : unquotedValue);
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
    const attrPattern = /--([a-zA-Z]+)=(?:"([^"]*)"|(\d+)|([^-\s]+))/g;
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      const [, key, quotedValue, numberValue, unquotedValue] = match;
      if (key !== "items") {
        const value =
          quotedValue ?? (numberValue ? Number(numberValue) : unquotedValue);
        result[key] = value;
      }
    }

    if (nestedContent && nestedContent.length > 0) {
      result.items = this.mainParser.parseLines(nestedContent);
    }

    return result;
  }
}

class SectionWrapperParser {
  private parsers: ElementParser[];

  constructor() {
    this.parsers = [new TextParser(), new ImageParser()];
    this.parsers.push(new SectionParser(this));
  }

  parseLines(lines: string[]): BaseElement[] {
    const results: BaseElement[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.includes("--items=(")) {
        const [nestedContent, newIndex] = this.collectNestedContent(lines, i);
        const parser = this.parsers.find((p) => p.canParse(line));

        if (parser instanceof SectionParser) {
          results.push(parser.parse(line, nestedContent));
        }

        i = newIndex;
      } else {
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

    i++;

    for (; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes("(")) depth++;
      if (line.includes(")")) depth--;

      if (depth < 0) break;

      nestedContent.push(line);
    }

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

// Test the updated parser
const sectionWrapperParser = new SectionWrapperParser();

export default sectionWrapperParser;

const result =
  sectionWrapperParser.parse(`!section --cols=1 --gap=16 --order=2 --background=yellow --items=(
  !text --content="like the one you are seeing right now" --animation=bounceIn --background=yellow
)`);

console.log(JSON.stringify(result, null, 2));
