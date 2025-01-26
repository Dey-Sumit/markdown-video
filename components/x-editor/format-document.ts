export function formatDocument(content: string): string {
  const lines = content.trim().split("\n");
  const formattedLines: string[] = [];
  let indentLevel = 0;
  let isInCodeBlock = false;
  let parenthesesStack = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle code blocks
    if (line.startsWith("```")) {
      isInCodeBlock = !isInCodeBlock;
      formattedLines.push(line);
      continue;
    }

    if (isInCodeBlock) {
      formattedLines.push(line);
      continue;
    }

    // Skip empty lines
    if (!line) continue;

    // Process the line
    if (isSceneHeader(line)) {
      // Add blank line before scene (except first scene)
      if (formattedLines.length > 0) {
        formattedLines.push("");
      }
      formattedLines.push(formatSceneLine(line));
      indentLevel = 1;
    } else if (isComponent(line)) {
      const formatted = formatComponentLine(line);

      // Handle section component's nested structure
      if (formatted.includes("--items=(")) {
        parenthesesStack++;
        indentLevel++;
      }

      // Add proper indentation
      const indent = "  ".repeat(indentLevel);
      formattedLines.push(indent + formatted);

      // Check for closing parenthesis
      const closingCount = (formatted.match(/\)/g) || []).length;
      parenthesesStack -= closingCount;
      if (parenthesesStack < 0) parenthesesStack = 0;
      indentLevel = parenthesesStack + 1;
    }
  }

  return formattedLines.join("\n");
}

function formatSceneLine(line: string): string {
  const sceneMatch = line.match(/^#\s*!scene\b/);
  if (!sceneMatch) return line;

  const args: string[] = [];
  const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);

  for (const match of argMatches) {
    args.push(`--${match[1]}=${match[2]}`);
  }

  // Preserve any additional text after the arguments
  const extraText = line
    .replace(/^#\s*!scene\b((?:\s+--\w+=(?:[^-\s"][^"]*|"[^"]*"))*)\s*/, "")
    .trim();
  const formattedLine = `# !scene ${args.join(" ")}`;

  return extraText ? `${formattedLine} ${extraText}` : formattedLine;
}

function formatComponentLine(line: string): string {
  const [componentCmd] = line.match(/^!\w+\b/) || [""];
  if (!componentCmd) return line;

  const args: string[] = [];
  const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);

  for (const match of argMatches) {
    args.push(`--${match[1]}=${match[2]}`);
  }

  return `${componentCmd} ${args.join(" ")}`;
}

function isSceneHeader(line: string): boolean {
  return /^#\s*!scene\b/.test(line);
}

function isComponent(line: string): boolean {
  return /^!\w+\b/.test(line) && !line.startsWith("`");
}
