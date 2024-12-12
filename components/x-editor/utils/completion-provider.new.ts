// utils/completion-provider.ts
import { editor, languages, Position, type IRange } from "monaco-editor";
import { type Monaco } from "@monaco-editor/react";
import { EDITOR_PROPERTIES, type SceneProperty } from "../types.x-editor";

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

  public getPropertySuggestions(
    model: editor.ITextModel,
    position: Position,
  ): languages.CompletionList | null {
    const lineContent = model.getLineContent(position.lineNumber);
    console.log("Current line content:", lineContent);

    // Exact matches only
    const singleExclamation = lineContent.trim() === "!";
    const exactSceneStart = lineContent.trim() === "## !!";

    if (!singleExclamation && !exactSceneStart) {
      console.log("No valid trigger found");
      return null;
    }

    const isSceneLevel = exactSceneStart;
    console.log("Is scene level:", isSceneLevel);

    const suggestions = Object.values(this.properties)
      .filter((prop) =>
        isSceneLevel ? prop.prefix === "!!" : prop.prefix === "!",
      )
      .map((prop) => this.createPropertySuggestion(prop, position));

    return { suggestions };
  }
}

export const configureCompletions = (monaco: Monaco) => {
  const provider = new EditorCompletionProvider(monaco, EDITOR_PROPERTIES);

  return monaco.languages.registerCompletionItemProvider("markdown", {
    // Trigger on ! for properties and space for arguments
    triggerCharacters: ["!", " "],

    /**
     * Provides completion suggestions based on context
     */
    provideCompletionItems: (model, position) => {
      const suggestions = provider.getPropertySuggestions(model, position);
      return suggestions || { suggestions: [] };
    },
  });
};
