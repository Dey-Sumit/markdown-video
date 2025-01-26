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

const input = `
# !scene --duration=5 --title=scene
!section --cols=2 --rows=2 --items=(!section --cols=1 --rows=1 --items=(!text --content="Nested" --size=30 !text --content="Text" --size=30) !text --content="Main" --size=40)
`;
console.log(formatDocument(input));
