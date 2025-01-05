// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter";
import { sceneConfig } from "./config";

export class SceneAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, "scene", sceneConfig.pattern);
  }

  provideCompletions(context: CommandContext): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const trimmed = lineContent.trim();

    // Scene declaration triggers
    if (trimmed === "#" || trimmed === "##") {
      return this.getSceneDeclarationCompletion(context);
    }

    if (!this.matchesPattern(lineContent)) {
      return [];
    }

    // Value completions
    if (this.isValueContext(lineContent, position)) {
      return this.getValueCompletions(context);
    }

    // Argument completions
    if (this.requiresWhitespace(lineContent, position)) {
      return this.getArgumentCompletions(context);
    }

    return [];
  }

  private getSceneDeclarationCompletion(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position, wordRange } = context;
    const trimmed = lineContent.trim();
    const insertPrefix = trimmed === "#" ? "# " : trimmed === "##" ? " " : "";

    return [
      {
        label: "!!scene",
        kind: this.monaco.languages.CompletionItemKind.Snippet,
        insertText: `${insertPrefix}!!scene --duration=\${2:5} --title=\${1:scene-1}`,
        insertTextRules:
          this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: this.createCompletionDoc([
          "### Scene Declaration",
          sceneConfig.description,
          "",
          "**Arguments:**",
          Object.entries(sceneConfig.arguments)
            .map(([key, arg]) => `- ${key}: ${arg.description}`)
            .join("\n"),
        ]),
        range:
          wordRange ||
          this.createRange(
            position,
            position.column - trimmed.length,
            position.column,
          ),
      },
    ];
  }

  private getValueCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const textUntilCursor = lineContent.substring(0, position.column);

    const match = textUntilCursor.match(/--(\w+)=\s*$/);
    if (!match) return [];

    const [, argName] = match;
    const arg = sceneConfig.arguments[argName];

    if (!arg?.examples) return [];

    return Object.entries(arg.examples).map(([value, description]) => ({
      label: value,
      kind: this.monaco.languages.CompletionItemKind.Value,
      insertText: value,
      detail: description,
      documentation: this.createCompletionDoc([
        `Example: ${value}`,
        description,
      ]),
      range: this.createRange(position, position.column, position.column),
    }));
  }

  private getArgumentCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const match = lineContent.substring(0, position.column).match(/--(\w*)$/);
    if (!match) return [];

    const currentArgs = this.parseArguments(lineContent);
    const startColumn = position.column - (match[1]?.length || 0);

    return Object.entries(sceneConfig.arguments)
      .filter(([key]) => !currentArgs.has(key))
      .map(([key, arg]) => ({
        label: key,
        kind: this.monaco.languages.CompletionItemKind.Property,
        insertText: `${key}=`,
        documentation: this.createCompletionDoc([
          `### ${arg.name}`,
          arg.description!,
          arg.required ? "\n**Required**" : "",
          arg.examples
            ? "\n**Examples:**\n" +
              Object.entries(arg.examples)
                .map(([value, desc]) => `- \`${value}\`: ${desc}`)
                .join("\n")
            : "",
        ]),
        range: this.createRange(position, startColumn, position.column),
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggestions",
        },
      }));
  }

  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    return [];
  }
}
