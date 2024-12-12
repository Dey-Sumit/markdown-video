// utils/completion-provider.ts
import { editor, languages, Position, type IRange } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";
import { type SceneProperty } from "../types.x-editor";
import { EDITOR_PROPERTIES } from "../config/scene-properties";

export class EditorCompletionProvider {
  constructor(
    private readonly monaco: Monaco,
    private readonly properties: Record<string, SceneProperty>,
  ) {}

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
      insertText: key, // Removed = as per point 2
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

    // If argument has predefined values, suggest them
    if (argument.values) {
      return argument.values.map((value) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        insertText: value,
        detail: `Value for ${argumentName}`,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      }));
    }

    // For number type, maybe suggest some common values
    if (argument.type === "number") {
      return ["0.1", "0.3", "0.5", "1", "2", "5"].map((value) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        insertText: value,
        detail: `Example value for ${argumentName}`,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column,
          endColumn: position.column,
        },
      }));
    }

    return [];
  }

  public getPropertySuggestions(
    model: editor.ITextModel,
    position: Position,
  ): languages.CompletionList | null {
    const lineContent = model.getLineContent(position.lineNumber);
    console.log("Current line content:", lineContent);

    // First check for argument context
    const argContext = this.getArgumentContext(lineContent);
    console.log("Argument context:", argContext);

    if (
      argContext &&
      argContext.isAfterDoubleDash &&
      !argContext.isAfterEquals
    ) {
      return {
        suggestions: this.createArgumentKeySuggestions(
          argContext.propertyName,
          position,
          argContext.currentArgument || "", // Pass the current partial word
        ),
      };
    }

    if (argContext?.isAfterEquals) {
      return {
        suggestions: this.createArgumentValueSuggestions(
          argContext.propertyName,
          argContext.currentArgument!,
          position,
        ),
      };
    }

    // Original property suggestion logic
    const singleExclamation = lineContent.trim() === "!";
    const exactSceneStart = lineContent.trim() === "## !!";

    if (!singleExclamation && !exactSceneStart) {
      console.log("No valid trigger found");
      return null;
    }

    const isSceneLevel = exactSceneStart;

    const suggestions = Object.values(this.properties)
      .filter((prop) =>
        isSceneLevel ? prop.prefix === "!!" : prop.prefix === "!",
      )
      .map((prop) => this.createPropertySuggestion(prop, position));

    return { suggestions };
  }

  /**
   * Determines if the current position is in a valid argument suggestion context
   * @returns Object containing property name and context info, or null if not in argument context
   */
  private getArgumentContext(lineContent: string): {
    propertyName: string;
    isAfterDoubleDash: boolean;
    isAfterEquals: boolean;
    currentArgument?: string;
  } | null {
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
  const provider = new EditorCompletionProvider(monaco, EDITOR_PROPERTIES);

  return monaco.languages.registerCompletionItemProvider("markdown", {
    // Trigger on ! for properties and space for arguments
    triggerCharacters: ["!", " ", "-", "="],

    /**
     * Provides completion suggestions based on context
     */
    provideCompletionItems: (model, position) => {
      const suggestions = provider.getPropertySuggestions(model, position);
      return suggestions || { suggestions: [] };
    },
  });
};
