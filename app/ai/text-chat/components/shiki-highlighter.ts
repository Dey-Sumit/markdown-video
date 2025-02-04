import { getHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function highlight(code: string) {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ["github-dark"],
      langs: ["markdown"],
    });
  }

  try {
    return highlighter.codeToHtml(code, {
      lang: "markdown",
      theme: "github-dark",
    });
  } catch (error) {
    console.error("Highlighting error:", error);
    return code;
  }
}
