import { editor, languages, Position, type IRange } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";
import { EDITOR_LANGUAGE } from "../const";

interface SnippetDefinition {
  prefix: string;
  description: string;
  body: string[] | string;
}

export class SnippetProvider {
  private readonly snippets: Record<string, SnippetDefinition> = {
    scene: {
      prefix: "scene",
      description: "Create a new scene with basic structure",
      body: [
        "## !!scene --title=${1:Scene Title} --duration=${2:5}",
        "!transition --type=${3:fade} --duration=${4:0.3}",
        "```js !",
        "${0}",
        "```",
      ],
    },
    "scene-with-text": {
      prefix: "scenetext",
      description: "Create a scene with text overlay",
      body: [
        "## !!scene --title=${1:Text Scene} --duration=${2:5}",
        "!text --content=${3:Your Content} --animation=${4|typewriter,fade,slide|} --duration=${5:3}",
        "!transition --type=${6:fade} --duration=${7:0.3}",
        "${0}",
      ],
    },
    "scene-with-code": {
      prefix: "scenecode",
      description: "Create a scene focused on code display",
      body: [
        "## !!scene --title=${1:Code Scene} --duration=${2:8}",
        "!transition --type=${3:slide} --duration=${4:0.3}",
        "!font --size=${5:18} --weight=${6:400} --family=${7:monospace}",
        "```js !",
        "${0}",
        "```",
      ],
    },
    "scene-combined": {
      prefix: "scenefull",
      description: "Create a complete scene with code and text",
      body: [
        "## !!scene --title=${1:Full Scene} --duration=${2:10}",
        "!text --content=${3:Scene Description} --animation=typewriter --duration=${4:3}",
        "!transition --type=${5|fade,slide,zoom|} --duration=${6:0.3}",
        "!font --size=${7:18} --weight=400 --family=monospace",
        "```js !",
        "${0}",
        "```",
      ],
    },
  };

  constructor(private readonly monaco: Monaco) {}

  /**
   * Creates a completion item for a snippet
   */
  private createSnippetCompletion(
    snippet: SnippetDefinition,
    position: Position,
    range: IRange,
  ): languages.CompletionItem {
    const body = Array.isArray(snippet.body)
      ? snippet.body.join("\n")
      : snippet.body;

    return {
      label: snippet.prefix,
      kind: this.monaco.languages.CompletionItemKind.Snippet,
      documentation: {
        value: [
          `### ${snippet.prefix}`,
          snippet.description,
          "```markdown",
          body
            .replace(/\$\{\d+:([^}]+)\}/g, "$1")
            .replace(/\$\{\d+\|([^}]+)\|}/g, "$1")
            .replace(/\$\d+/g, ""),
          "```",
        ].join("\n"),
        isTrusted: true,
      },
      insertText: body,
      insertTextRules:
        this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
      // Make snippets appear at the top
      sortText: "0" + snippet.prefix,
    };
  }

  /**
   * Gets snippet suggestions based on current position and text
   */
  public getSnippetSuggestions(
    model: editor.ITextModel,
    position: Position,
  ): languages.CompletionItem[] {
    const lineContent = model.getLineContent(position.lineNumber);
    const wordUntilPosition = model.getWordUntilPosition(position);

    // Create range for the current word
    const range: IRange = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: wordUntilPosition.startColumn,
      endColumn: wordUntilPosition.endColumn,
    };

    // Only show snippets at the start of a line or after a newline
    const trimmedContent = lineContent.substring(0, position.column - 1).trim();
    if (trimmedContent.length > 0) {
      return [];
    }

    // Filter snippets based on current word
    const word = wordUntilPosition.word.toLowerCase();
    return Object.entries(this.snippets)
      .filter(([key]) => key.toLowerCase().includes(word))
      .map(([_, snippet]) =>
        this.createSnippetCompletion(snippet, position, range),
      );
  }

  /**
   * Registers the snippet provider with Monaco
   */
  public register(): void {
    this.monaco.languages.registerCompletionItemProvider(EDITOR_LANGUAGE, {
      triggerCharacters: ["s", "c", "t"], // Trigger for scene, code, text
      provideCompletionItems: (model, position) => ({
        suggestions: this.getSnippetSuggestions(model, position),
      }),
    });
  }
}

// Helper function to configure snippets
export const configureSnippets = (monaco: Monaco): void => {
  const snippetProvider = new SnippetProvider(monaco);
  snippetProvider.register();
};
