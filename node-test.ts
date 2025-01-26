function formatDocument(content: string): string {
  const lines = content.trim().split("\n");
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
  const argMatches = line.matchAll(/--(\w+)=([^-\s"][^"]*|"[^"]*")/g);

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

  // Format the rest of the lines with indentation
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      formattedLines.push("  " + line); // Indent non-empty lines
    }
  }

  return formattedLines.join("\n");
}

function extractNestedSection(content: string): string {
  let count = 0;
  let i = 0;

  console.log(`Input Content: ${content}`); // Debug log

  // Iterate through the content to find the end of the nested section
  for (; i < content.length; i++) {
    const char = content[i];
    if (char === "(") count++;
    if (char === ")") count--;

    console.log(`Char: ${char}, Count: ${count}`); // Debug log

    // Stop when the closing parenthesis is found and the count is balanced
    if (count === 0 && char === ")") break;
  }

  // Extract the nested section content
  const result = content.slice(0, i + 1);
  console.log(`Extracted Content: ${result}`); // Debug log
  return result;
}

const input = `
# !scene --duration=5 --title=scene
!section --cols=2 --rows=2 --items=(!section --cols=1 --rows=1 --items=(!text --content="Nested" --size=30 !text --content="Text" --size=30) !text --content="Main" --size=40)
`;

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

  console.log(`Input Content: ${content}`); // Debug log

  // Extract the section header and content
  const [header, ...rest] = content.split("--items=(");
  const sectionContent = rest.join("--items=(");

  console.log(`Header: ${header}`); // Debug log
  console.log(`Section Content: ${sectionContent}`); // Debug log

  // Add the section header with proper indentation
  result.push(`${indent}${header.trim()} --items=(`);

  if (!sectionContent) {
    // If there's no content, close the section
    result.push(`${indent})`);
    return result;
  }

  // Split the content into individual components
  const components = splitComponents(sectionContent.replace(/\)+$/, ""));
  console.log(`Components: ${JSON.stringify(components)}`); // Debug log

  // Process each component
  for (const comp of components) {
    const trimmed = comp.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("!section")) {
      // Handle nested section
      const nestedContent = extractNestedSection(trimmed);
      console.log(`Nested Content: ${nestedContent}`); // Debug log
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

const nestedContent = `!section --cols=1 --rows=1 --items=(!text --content="Nested" --size=30 !text --content="Text" --size=30)`;

console.log(formatSectionBlock(nestedContent, 1).join("\n"));
