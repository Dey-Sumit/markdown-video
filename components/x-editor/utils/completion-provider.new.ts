// utils/completion-provider.ts
import { editor, languages, Position, type IRange } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";
import { type SceneProperty } from "../types.x-editor";
import { CORE_PROPS_CONFIG } from "../config/property-config";
import { EDITOR_LANGUAGE } from "../const";

export class EditorCompletionProvider {
  constructor(
    private readonly monaco: Monaco,
    private readonly properties: Record<string, SceneProperty>,
  ) {}

  private codeBlockTemplates = {
    js: {
      label: "```js ",
      insertText: "```js !\nconst example = () => {\n  ${1}\n}\n\n```",
    },
    jsx: {
      label: "```jsx",
      insertText:
        "```jsx !\nconst Component = () => {\n  return (\n    <div>\n      ${1}\n    </div>\n  )\n}\n\n```",
    },
    python: {
      label: "```python",
      insertText: "```python !\ndef example():\n    ${1}\n\n```",
    },
    swift: {
      label: "```swift",
      insertText: "```swift !\nfunc example() {\n    ${1}\n}\n\n```",
    },
  };
  /**
   * Creates a property completion suggestion
   * @param property Scene property to create suggestion for
   * @param position Current cursor position
   * @returns CompletionItem for the property
   */
  private createPropertySuggestion(
    property: SceneProperty,
    position: Position,
  ): languages.CompletionItem {
    return {
      label: property.name,
      kind: this.monaco.languages.CompletionItemKind.Property,
      insertText: property.name,
      detail: property.description,
      documentation: {
        value: this.generatePropertyDocumentation(property),
        isTrusted: true,
      },
      range: this.createCompletionRange(position, position.column),
      command: {
        id: "editor.action.triggerSuggest",
        title: "Suggest Arguments",
      },
    };
  }

  /**
   * Generates markdown documentation for property hover
   * @param property Scene property
   * @returns Markdown string
   */
  private generatePropertyDocumentation(property: SceneProperty): string {
    const argsList = Object.entries(property.arguments)
      .map(
        ([key, arg]) =>
          `- \`--${key}\`: ${arg.description || "No description"}`,
      )
      .join("\n");

    return [
      `### ${property.name}`,
      property.description || "",
      "#### Arguments:",
      argsList,
    ].join("\n");
  }

  /**
   * Creates a completion item range
   * @param position Current cursor position
   * @param startColumn Starting column for the suggestion
   * @returns Monaco IRange object
   */
  private createCompletionRange(
    position: Position,
    startColumn: number,
  ): IRange {
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn,
      endColumn: position.column,
    };
  }

  private createArgumentKeySuggestions(
    propertyName: string,
    position: Position,
    currentWord: string, // Add this parameter
  ): languages.CompletionItem[] {
    const property = this.properties[propertyName];
    if (!property) return [];

    // Find where the current argument word starts
    const startColumn = position.column - (currentWord?.length || 0);

    return Object.entries(property.arguments).map(([key, arg]) => ({
      label: key,
      kind: this.monaco.languages.CompletionItemKind.Field,
      insertText: key,
      detail: arg.description,
      documentation: {
        value: [
          `**Type**: ${arg.type}`,
          arg.required ? "**Required**" : "Optional",
          arg.values ? `**Values**: ${arg.values.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        isTrusted: true,
      },
      // Adjust range to replace the current partial word
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: startColumn,
        endColumn: position.column,
      },
    }));
  }

  private createArgumentValueSuggestions(
    propertyName: string,
    argumentName: string,
    position: Position,
  ): languages.CompletionItem[] {
    const property = this.properties[propertyName];
    const argument = property?.arguments[argumentName];

    if (!property || !argument) return [];

    // If argument has predefined values with examples
    if (argument.values) {
      return argument.values.map((value) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        insertText: value,
        detail: argument.examples?.[value] || `Value for ${argumentName}`,
        documentation: {
          value: [
            `### ${value}`,
            argument.examples?.[value] || "",
            argument.description || "",
          ].join("\n"),
          isTrusted: true,
        },
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      }));
    }

    // For boolean arguments
    if (argument.type === "boolean") {
      return [
        {
          label: "true",
          kind: this.monaco.languages.CompletionItemKind.Value,
          insertText: "true",
          detail: argument.examples?.true || "Enable this feature",
          documentation: {
            value: [
              "### true",
              argument.examples?.true || "",
              argument.description || "",
            ].join("\n"),
            isTrusted: true,
          },
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column,
          },
          sortText: "0",
        },
        {
          label: "false",
          kind: this.monaco.languages.CompletionItemKind.Value,
          insertText: "false",
          detail: argument.examples?.false || "Disable this feature",
          documentation: {
            value: [
              "### false",
              argument.examples?.false || "",
              argument.description || "",
            ].join("\n"),
            isTrusted: true,
          },
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column,
          },
          sortText: "1",
        },
      ];
    }

    // For numeric arguments, suggest common values
    if (argument.type === "number") {
      const commonValues = argument.examples
        ? Object.keys(argument.examples)
        : ["0.1", "0.3", "0.5", "1", "2", "5"];

      return commonValues.map((value) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        insertText: value,
        detail:
          argument.examples?.[value] || `Suggested value for ${argumentName}`,
        documentation: {
          value: [
            `### ${value}`,
            argument.examples?.[value] || "",
            argument.description || "",
          ].join("\n"),
          isTrusted: true,
        },
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      }));
    }

    // For all other cases, return empty array
    return [];
  }

  private isClosingCodeBlock(
    model: editor.ITextModel,
    lineNumber: number,
  ): boolean {

    for (let i = lineNumber - 1; i >= 1; i--) {
      const line = model.getLineContent(i);
      if (line.trim().startsWith("```")) {
        return line.trim().match(/^```\w+/) !== null;
      }
    }

    return false;
  }

  public getPropertySuggestions(
    model: editor.ITextModel,
    position: Position,
  ): languages.CompletionList | null {
    const lineContent = model.getLineContent(position.lineNumber);

    // Check if inside code block
    let inCodeBlock = false;
    for (let i = 1; i <= position.lineNumber; i++) {
      const line = model.getLineContent(i);
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
      }
    }

    // if (inCodeBlock || lineContent.trim().startsWith("```")) return null; // Add scene template suggestion
    const trimmedContent = lineContent.trim();
    const isHashTrigger = trimmedContent === "#" || trimmedContent === "##";
    if (isHashTrigger) {
      const hashCount = trimmedContent.length; // Will be 1 or 2
      return {
        suggestions: [
          {
            label: "## !!scene",
            kind: this.monaco.languages.CompletionItemKind.Snippet,
            insertText:
              "## !!scene --title=${1:step-1} --duration=${2:5} --background=${3:transparent}",
            insertTextRules:
              this.monaco.languages.CompletionItemInsertTextRule
                .InsertAsSnippet,
            detail: "Create a new scene",
            documentation: {
              value: [
                "### Scene Template",
                this.properties.scene.description,
                "",
                "**Arguments:**",
                Object.entries(this.properties.scene.arguments)
                  .map(([key, arg]) => `- ${key}: ${arg.description}`)
                  .join("\n"),
              ].join("\n"),
              isTrusted: true,
            },
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - hashCount,
              endColumn: position.column,
            },
          },
        ],
      };
    }

    // Check for code block context
    if (lineContent.trim().match(/^`{1,3}$/)) {
      if (this.isClosingCodeBlock(model, position.lineNumber)) {
        return null;
      }
      return {
        suggestions: Object.entries(this.codeBlockTemplates).map(
          ([lang, template]) => {
            return {
              label: template.label,
              kind: this.monaco.languages.CompletionItemKind.Snippet,
              insertText: template.insertText,
              insertTextRules:
                this.monaco.languages.CompletionItemInsertTextRule
                  .InsertAsSnippet,
              sortText: "0" + lang, // Ensures sorting
              detail: "Code Block Template",
              documentation: {
                value: `Create a ${template.label} code block`,
                isTrusted: true,
              },
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - lineContent.trim().length,
                endColumn: position.column,
              },
            };
          },
        ),
      };
    }

    // Check for comment context
    const isInComment = lineContent.trimStart().startsWith("//");
    if (isInComment) {
      const commentContent = lineContent.trimStart().slice(2).trimStart();
      // Only suggest 'mark' when we have exactly "// !"
      if (commentContent === "!") {
        return {
          suggestions: [
            {
              label: "mark",
              kind: this.monaco.languages.CompletionItemKind.Property,
              insertText: "mark",
              detail: "Mark code segments for animation",
              range: this.createCompletionRange(position, position.column),
            },
          ],
        };
      }
    }

    // First check for argument context
    const argContext = this.getArgumentContext(lineContent);

    if (argContext) {
      // If we're after an equals sign, show value suggestions
      if (argContext.isAfterEquals) {
        return {
          suggestions: this.createArgumentValueSuggestions(
            argContext.propertyName,
            argContext.currentArgument!,
            position,
          ),
        };
      }

      // If we're after double dash, show argument key suggestions
      if (argContext.isAfterDoubleDash) {
        return {
          suggestions: this.createArgumentKeySuggestions(
            argContext.propertyName,
            position,
            argContext.currentArgument || "",
          ),
        };
      }
    }

    // If no argument context, check for property suggestions (! or !!)
    const singleExclamation = lineContent.trim() === "!";
    const exactSceneStart = lineContent.trim() === "## !!";

    if (!singleExclamation && !exactSceneStart) {
      return null;
    }

    const isSceneLevel = exactSceneStart;

    return {
      suggestions: Object.values(this.properties)
        .filter((prop) =>
          isSceneLevel ? prop.prefix === "!!" : prop.prefix === "!",
        )
        .map((prop) => this.createPropertySuggestion(prop, position)),
    };
  }

  private getArgumentContext(lineContent: string): {
    propertyName: string;
    isAfterDoubleDash: boolean;
    isAfterEquals: boolean;
    currentArgument?: string;
  } | null {
    // Find which property we're dealing with
    let propertyName: string | null = null;

    if (lineContent.trimStart().startsWith("## !!scene")) {
      propertyName = "scene";
    } else {
      for (const [name, property] of Object.entries(this.properties)) {
        const propertyStart = `${property.prefix}${property.name}`;
        if (lineContent.trimStart().startsWith(propertyStart)) {
          propertyName = name;
          break;
        }
      }
    }

    if (!propertyName) return null;

    // Parse all arguments in the line
    const args = Array.from(lineContent.matchAll(/--(\w+)(?:=([^-\s]*))?/g));

    // Find the argument where the cursor is located
    for (const match of args) {
      const argStart = match.index!;
      const argEnd = argStart + match[0].length;
      const argName = match[1];
      const hasEquals = match[0].includes("=");

      // If we found an argument with =, we're in value context
      if (hasEquals && !match[2]) {
        return {
          propertyName,
          isAfterDoubleDash: false,
          isAfterEquals: true,
          currentArgument: argName,
        };
      }
    }

    // If we're after a new --, we're in argument name context
    const lastDash = lineContent.lastIndexOf("--");
    if (lastDash !== -1 && !lineContent.slice(lastDash).includes("=")) {
      const currentArg =
        lineContent.slice(lastDash + 2).match(/^\w*/)?.[0] || "";
      return {
        propertyName,
        isAfterDoubleDash: true,
        isAfterEquals: false,
        currentArgument: currentArg,
      };
    }

    return null;
  }

  /**
   * Determines if the current position is in a valid argument suggestion context
   * @returns Object containing property name and context info, or null if not in argument context
   */
  private _getArgumentContext(lineContent: string): {
    propertyName: string;
    isAfterDoubleDash: boolean;
    isAfterEquals: boolean;
    currentArgument?: string;
  } | null {
    // Check for scene first
    if (lineContent.trimStart().startsWith("## !!scene")) {
      const lastDashIndex = lineContent.lastIndexOf("--");
      if (lastDashIndex === -1) return null;

      const afterText = lineContent.slice(lastDashIndex + 2);
      const equalsMatch = afterText.match(/(\w+)=$/);
      const argMatch = afterText.match(/^(\w*)/);

      return {
        propertyName: "scene",
        isAfterDoubleDash: true,
        isAfterEquals: !!equalsMatch,
        currentArgument: equalsMatch?.[1] || argMatch?.[1],
      };
    }
    // Handle mark in comments
    if (lineContent.trimStart().startsWith("//")) {
      const commentContent = lineContent.trimStart().slice(2).trimStart();

      // Check if it's a mark command (with any of the three syntaxes)
      const markMatch = commentContent.match(/^!mark(\([^\)]*\)|\[[^\]]*\])?/);
      if (markMatch) {
        const lastDashIndex = lineContent.lastIndexOf("--");
        if (lastDashIndex === -1) return null;

        const afterText = lineContent.slice(lastDashIndex + 2);
        const equalsMatch = afterText.match(/(\w+)=$/);
        const argMatch = afterText.match(/^(\w*)/);

        return {
          propertyName: "mark",
          isAfterDoubleDash: true,
          isAfterEquals: !!equalsMatch,
          currentArgument: equalsMatch?.[1] || argMatch?.[1],
        };
      }
    }

    for (const [propertyName, property] of Object.entries(this.properties)) {
      const propertyStart = `${property.prefix}${property.name}`;

      if (lineContent.trimStart().startsWith(propertyStart)) {
        // Check for -- at the current position
        const lastDashIndex = lineContent.lastIndexOf("--");
        if (lastDashIndex === -1) return null;

        const afterText = lineContent.slice(lastDashIndex + 2);

        // Changed regex to better handle the equals case
        const equalsMatch = afterText.match(/(\w+)=$/); // Match if equals is at end
        const argMatch = afterText.match(/^(\w*)/);

        return {
          propertyName,
          isAfterDoubleDash: true,
          isAfterEquals: !!equalsMatch,
          currentArgument: equalsMatch?.[1] || argMatch?.[1],
        };
      }
    }

    return null;
  }
}

export const configureCompletions = (monaco: Monaco) => {
  const provider = new EditorCompletionProvider(monaco, CORE_PROPS_CONFIG);

  return monaco.languages.registerCompletionItemProvider(EDITOR_LANGUAGE, {
    // Trigger on ! for properties and space for arguments
    triggerCharacters: ["!", " ", "-", "=", "#", "`"],
    /**
     * Provides completion suggestions based on context
     */
    provideCompletionItems: (model, position) => {
      const suggestions = provider.getPropertySuggestions(model, position);
      return suggestions || { suggestions: [] };
    },
  });
};
