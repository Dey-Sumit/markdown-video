export function formatDocument(content: string): string {
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

function splitComponents(content: string): string[] {
  const components: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === "(") depth++;
    if (char === ")") depth--;

    current += char;

    // Split when we encounter a component boundary (depth === 0 and the next component starts with "!")
    if (depth === 0 && i + 1 < content.length && content[i + 1] === "!") {
      components.push(current.trim());
      current = "";
    }
  }

  // Add the last component if it exists
  if (current.trim()) {
    components.push(current.trim());
  }

  return components;
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
    // If there's no content, close the section
    result.push(`${indent})`);
    return result;
  }

  // Split the content into individual components
  const components = splitComponents(sectionContent.replace(/\)+$/, ""));

  // Process each component
  for (const comp of components) {
    const trimmed = comp.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("!section")) {
      // Handle nested section
      const nestedContent = extractNestedSection(trimmed);

      const nestedResult = formatSectionBlock(nestedContent, level + 1);
      result.push(...nestedResult);
    } else if (trimmed.startsWith("!text")) {
      // Handle text component
      result.push(`${indent}  ${trimmed}`);
    }
  }

  // Close the section
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
