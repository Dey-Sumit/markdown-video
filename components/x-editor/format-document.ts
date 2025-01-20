/**
 * Formats a scene-based document with specific spacing and indentation rules.
 *
 * Formatting rules:
 * 1. Scene headers stay as single lines with normalized argument spacing
 * 2. Components under scenes are indented with a tab
 * 3. No blank lines between components within the same scene
 * 4. One blank line between scenes
 * 5. Preserves hyphenated values in arguments
 *
 * @param content - The raw document content to format
 * @returns The formatted document content
 */
export function formatDocument(content: string): string {
  let lines = content.trim().split("\n");
  const formattedLines: string[] = [];
  let isInScene = false;
  let isInCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]; // Keep original line with indentation
    const trimmedLine = rawLine.trim();

    // Handle code blocks
    if (trimmedLine.startsWith("```")) {
      isInCodeBlock = !isInCodeBlock;
      formattedLines.push(rawLine);
      continue;
    }

    if (isInCodeBlock) {
      formattedLines.push(rawLine); // Use raw line to preserve indentation
      continue;
    }
    // Skip empty lines between components
    if (!trimmedLine && isInScene) continue;

    if (isSceneHeader(trimmedLine)) {
      // Add blank line before scene (except for first scene)
      if (formattedLines.length > 0) {
        formattedLines.push("");
      }

      // Format and add scene line
      formattedLines.push(formatSceneLine(trimmedLine));
      isInScene = true;
    } else if (isComponent(trimmedLine) && isInScene) {
      // Add component with tab indentation
      formattedLines.push(`  ${formatComponentLine(trimmedLine)}`);
    }
  }

  return formattedLines.join("\n");
}

/**
 * Formats a scene header line by normalizing its arguments and spacing.
 * Example:
 * Input:  "## !scene --duration=5    random text  --title=scene-1"
 * Output: "## !scene --duration=5 --title=scene-1"
 */
function formatSceneLine(line: string): string {
  // Extract the basic scene command
  const [sceneCmd] = line.match(/^#\s*!scene\b/) || [""];
  if (!sceneCmd) return line;

  // Extract and preserve all valid arguments with their values
  const args: string[] = [];
  const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);

  for (const match of argMatches) {
    args.push(`--${match[1]}=${match[2]}`);
  }

  // Reconstruct with proper spacing
  return `# !scene ${args.join(" ")}`;
}

/**
 * Formats a component line by normalizing its arguments and spacing.
 */
function formatComponentLine(line: string): string {
  // Extract the component command
  const [componentCmd] = line.match(/^!\w+\b/) || [""];
  if (!componentCmd) return line;

  // Extract all valid arguments with their values
  const args: string[] = [];
  const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);

  for (const match of argMatches) {
    args.push(`--${match[1]}=${match[2]}`);
  }

  // Reconstruct with proper spacing
  return `${componentCmd} ${args.join(" ")}`;
}

/**
 * Checks if a line is a scene header.
 */
function isSceneHeader(line: string): boolean {
  return /^#\s*!scene\b/.test(line);
}

/**
 * Checks if a line is a component.
 */
function isComponent(line: string): boolean {
  return /^!\w+\b/.test(line) && !line.startsWith("`");
}
