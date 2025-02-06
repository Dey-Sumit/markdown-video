export function formatDocument(content: string): string {
  // First encode any problematic URL patterns
  content = content
    .split("\n")
    .map((line) => encodeUrlPatterns(line))
    .join("\n");

  const squeezedContent = preprocessContent(content);

  const lines = squeezedContent.trim().split("\n");
  const scenes = detectScenes(lines);

  // Format each scene
  const formattedScenes = scenes.map((scene) => {
    const sceneLines = lines.slice(scene.start, scene.end + 1);
    return formatScene(sceneLines); // Format the entire scene
  });

  // Join the formatted scenes with double newlines
  return formattedScenes.join("\n\n");
}

function encodeUrlPatterns(line: string): string {
  // Only process lines that contain quotes
  if (!line.includes('"')) return line;

  // Find content within quotes
  return line.replace(/"([^"]+)"/g, (match, quotedContent) => {
    // Replace ._something_ patterns with encoded version
    const encodedContent = quotedContent.replace(
      /\._([^_\s.]+)_\./g,
      (match) => {
        // Get the content between dots and underscores
        const content = match.slice(2, -2); // Remove ._ from start and _. from end
        return `.%5F${content}%5F.`; // Add back dots but encode the underscores
      },
    );

    return `"${encodedContent}"`;
  });
}

function formatSceneLine(line: string): string {
  const sceneMatch = line.match(/^#\s*!scene\b/);
  if (!sceneMatch) return line; // If it's not a scene header, return as-is

  // Extract arguments (e.g., --duration=5, --title=scene)
  const args: string[] = [];
  // const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);
  const argMatches = line.matchAll(/--(\w+)=("[^"]*"|[^-\s][^-\s]*)/g);

  for (const match of argMatches) {
    args.push(`--${match[1]}=${match[2]}`);
  }

  // Reconstruct the formatted scene header
  const formattedLine = `# !scene ${args.join(" ")}`;
  return formattedLine;
}

function detectScenes(lines: string[]): { start: number; end: number }[] {
  const scenes: { start: number; end: number }[] = [];
  let currentScene: { start: number; end: number } | null = null;

  for (let i = 0; i < lines.length; i++) {
    if (isSceneHeader(lines[i])) {
      if (currentScene) {
        currentScene.end = i - 1; // End the previous scene
        scenes.push(currentScene);
      }
      currentScene = { start: i, end: lines.length - 1 }; // Start a new scene
    }
  }

  // Add the last scene if it exists
  if (currentScene) {
    scenes.push(currentScene);
  }

  return scenes;
}

function isSceneHeader(line: string): boolean {
  return /^#\s*!scene\b/.test(line); // Check if the line starts with "# !scene"
}

function formatScene(lines: string[]): string {
  const formattedLines: string[] = [];

  // Format the scene header
  const sceneHeader = formatSceneLine(lines[0]);
  formattedLines.push(sceneHeader);

  // Format the rest of the lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    if (line.startsWith("!section")) {
      // Handle nested sections
      const formattedSection = formatSectionBlock(line, 1);
      formattedLines.push(...formattedSection);
    } else {
      // Handle other components (e.g., !text)
      formattedLines.push("  " + line);
    }
  }

  return formattedLines.join("\n");
}

function extractNestedSection(content: string): string {
  let count = 0;
  let i = 0;

  // Iterate through the content to find the end of the nested section
  for (; i < content.length; i++) {
    const char = content[i];
    if (char === "(") count++;
    if (char === ")") count--;

    // Stop when the closing parenthesis is found and the count is balanced
    if (count === 0 && char === ")") break;
  }

  // Extract the nested section content
  const result = content.slice(0, i + 1);

  return result;
}

function formatSectionBlock(content: string, level: number): string[] {
  const indent = "  ".repeat(level);
  const result: string[] = [];

  // Extract the section header and content
  const [header, ...rest] = content.split("--items=(");
  const sectionContent = rest.join("--items=(");

  // Add the section header with proper indentation
  result.push(`${indent}${header.trim()} --items=(`);

  if (!sectionContent) {
    result.push(`${indent})`);
    return result;
  }

  // Remove trailing parentheses and split the content into components
  const strippedContent = sectionContent.replace(/\)+$/, "");
  const lines = strippedContent.split(/\n|(?=!)/);

  // Process each component
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith("!section")) {
      const nestedContent = extractNestedSection(line);
      const nestedResult = formatSectionBlock(nestedContent, level + 1);
      result.push(...nestedResult);
    } else if (line.startsWith("!")) {
      // Handle any component that starts with !
      result.push(`${indent}  ${line}`);
    }
  }

  result.push(`${indent})`);
  return result;
}

function preprocessContent(input: string): string {
  const lines = input.split("\n");
  let result = "";
  let parenthesesCount = 0;
  let currentSection = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("# !scene")) {
      if (currentSection) {
        result += currentSection + "\n";
      }
      result += line + "\n";
      currentSection = "";
      continue;
    }

    if (line.startsWith("!section")) {
      currentSection += line;
      parenthesesCount += (line.match(/\(/g) || []).length;
      parenthesesCount -= (line.match(/\)/g) || []).length;

      if (parenthesesCount === 0) {
        result += currentSection + "\n";
        currentSection = "";
      }
      continue;
    }

    if (currentSection && !line.startsWith("!section")) {
      currentSection += " " + line;
      parenthesesCount += (line.match(/\(/g) || []).length;
      parenthesesCount -= (line.match(/\)/g) || []).length;

      if (parenthesesCount === 0) {
        result += currentSection + "\n";
        currentSection = "";
      }
    } else if (line) {
      result += line + "\n";
    }
  }

  return result.trim();
}
