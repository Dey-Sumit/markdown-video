// Define the base interface for all parsed elements
interface BaseElement {
  type: string;
  [key: string]: any; // Allow for dynamic attributes
}

// Specific interfaces for different element types
interface SectionElement extends BaseElement {
  type: "section";
  cols?: number;
  items?: ParsedElement[];
}

interface TextElement extends BaseElement {
  type: "text";
  content?: string;
}

// Union type for all possible parsed elements
type ParsedElement = SectionElement | TextElement;

// Custom error class for parsing errors
class ParseError extends Error {
  constructor(
    message: string,
    public position: number,
  ) {
    super(`Parsing error at position ${position}: ${message}`);
    this.name = "ParseError";
  }
}

function parseCustomMarkup(input: string): ParsedElement {
  // Remove line breaks / extra spaces for easier processing
  const normalized = input.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  // The main recursive parse function
  let idx = 0;

  function parseElement(): ParsedElement {
    // Expect something like "!section" or "!text"
    if (!normalized.startsWith("!", idx)) {
      throw new ParseError("expected '!'", idx);
    }

    // Move past '!'
    idx++;

    // Read the command name (e.g. "section", "text")
    const cmdMatch = /^[a-zA-Z]+/.exec(normalized.slice(idx));
    if (!cmdMatch) {
      throw new ParseError("missing command after '!'", idx);
    }
    const command = cmdMatch[0];
    idx += command.length;

    // Build the result object with `type` = command
    const result: ParsedElement = { type: command } as ParsedElement;

    // Now parse possible attributes until we hit the end or a parenthesis or another '!'
    while (idx < normalized.length) {
      skipSpaces();

      // If we hit a closing parenthesis or new command '!', break out
      if (normalized[idx] === ")" || normalized[idx] === "!") {
        break;
      }

      // Expect something like "--cols=4" or "--content=\"some text\""
      if (!normalized.startsWith("--", idx)) {
        break; // No more attributes
      }

      // Move past '--'
      idx += 2;

      // Grab the attribute name
      const attrNameMatch = /^[a-zA-Z]+/.exec(normalized.slice(idx));
      if (!attrNameMatch) {
        throw new ParseError("expected attribute name", idx);
      }
      const attrName = attrNameMatch[0];
      idx += attrName.length;

      // Expect '=' next
      skipSpaces();
      if (normalized[idx] !== "=") {
        throw new ParseError(`expected '=' after attribute ${attrName}`, idx);
      }
      idx++;

      skipSpaces();

      // If the attribute is items=(
      // we need to parse a sub-block of items
      if (attrName === "items" && normalized[idx] === "(") {
        idx++; // skip '('
        // parse multiple elements until we reach the corresponding ')'
        const items: ParsedElement[] = [];
        while (idx < normalized.length && normalized[idx] !== ")") {
          skipSpaces();
          items.push(parseElement());
          skipSpaces();
        }
        if (normalized[idx] !== ")") {
          throw new ParseError("missing closing ')' for items", idx);
        }
        idx++; // skip ')'
        result.items = items;
      } else {
        // Otherwise parse a single value (number, string, etc.)
        // If it's a quoted string, parse until the closing quote
        if (normalized[idx] === '"') {
          idx++;
          let strVal = "";
          while (idx < normalized.length && normalized[idx] !== '"') {
            strVal += normalized[idx];
            idx++;
          }
          if (normalized[idx] !== '"') {
            throw new ParseError(
              `unterminated quote for attribute ${attrName}`,
              idx,
            );
          }
          idx++; // skip closing quote
          result[attrName] = strVal;
        } else {
          // Unquoted value, read until a space or parenthesis
          const valueMatch = /^[^\s)]+/.exec(normalized.slice(idx));
          if (!valueMatch) {
            throw new ParseError(`expected value after ${attrName}=`, idx);
          }
          const valueStr = valueMatch[0];
          idx += valueStr.length;

          // Try to convert numeric strings to numbers; otherwise keep as string
          if (!isNaN(Number(valueStr))) {
            result[attrName] = Number(valueStr);
          } else {
            result[attrName] = valueStr;
          }
        }
      }
      skipSpaces();
    }
    return result;
  }

  function skipSpaces(): void {
    while (idx < normalized.length && /\s/.test(normalized[idx])) {
      idx++;
    }
  }

  // Parse from the start
  const parsed = parseElement();

  // Return the resulting object
  return parsed;
}

export default parseCustomMarkup;
const example = `
 !section --cols=4 --x=y --gap=10 --items=(
    !text --content="Item 1"
    !text --content="Item 2"
    !section --cols=2 --gap=16 --items=(
      !text --content="Item 1" 
      !text --content="Item 2"
  )
)
`;

try {
  const result = parseCustomMarkup(example);
  console.log("result:", result);
} catch (e) {
  console.error(e);
}
