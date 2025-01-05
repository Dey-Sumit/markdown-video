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

  private isValueContext(lineContent: string, position: Position): boolean {
    const textUntilCursor = lineContent.substring(0, position.column);

    // Require whitespace before argument
    const valueContextRegex = /(?:\s|^)--(\w+)=\s*$/;
    return valueContextRegex.test(textUntilCursor);
  }

  /**
   * Checks if current context requires scene-specific completions
   * @param context Current command context
   * @returns Boolean indicating if in scene completion context
   */
  private isSceneCompletionContext(context: CommandContext): boolean {
    const { lineContent } = context;
    const trimmed = lineContent.trim();

    // Handle "#" trigger for new scene
    if (trimmed === "#" || trimmed === "##") {
      return true;
    }

    // Handle scene argument completions
    if (this.matchesPattern(lineContent)) {
      const hasPartialArg = /(?:\s|^)--(\w*)(?:$|\s)/.test(lineContent);
      const hasPartialValue = /(?:\s|^)--[\w-]+=\w*$/.test(lineContent);

      return hasPartialArg || hasPartialValue;
    }

    return false;
  }

  private getValueCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const textUntilCursor = lineContent.substring(0, position.column);

    // Updated regex to match the argument name before cursor
    const match = textUntilCursor.match(/--(\w+)=\s*$/);

    if (!match) return [];

    const [, argName] = match;

    const arg = sceneConfig.arguments[argName];
    if (!arg || !arg.examples) return [];

    // Since we're at the end of the equals sign, start column is just current position
    return Object.entries(arg.examples).map(([value, description]) => ({
      label: value,
      kind: this.monaco.languages.CompletionItemKind.Value,
      insertText: value,
      detail: description,
      documentation: {
        value: `Example: ${value}\n${description}`,
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

  /**
   * Get completion items for a new scene declaration
   */
  private getSceneDeclarationCompletion(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position, wordRange } = context;
    const trimmed = lineContent.trim();

    // Determine the prefix based on current content
    let insertPrefix;
    if (trimmed === "#") {
      insertPrefix = "# "; // Single # case
    } else if (trimmed === "##") {
      insertPrefix = " "; // Double ## case, just add space
    } else {
      insertPrefix = ""; // Any other case
    }

    return [
      {
        label: "!!scene",
        kind: this.monaco.languages.CompletionItemKind.Snippet,
        insertText: `${insertPrefix}!!scene --duration=\${2:5} --title=\${1:scene-1}`,
        insertTextRules:
          this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: {
          value: [
            "### Scene Declaration",
            sceneConfig.description,
            "",
            "**Arguments:**",
            Object.entries(sceneConfig.arguments)
              .map(([key, arg]) => `- ${key}: ${arg.description}`)
              .join("\n"),
          ].join("\n"),
          isTrusted: true,
        },
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

  /**
   * Get completion items for scene arguments
   */
  private getArgumentCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position, wordRange } = context;

    const beforeCursor = lineContent.substring(0, position.column);
    const partialArg = beforeCursor.match(/--(\w*)$/);

    if (!partialArg) return [];
    const currentArgs = this.parseArguments(lineContent);
    const startColumn = position.column - (partialArg[1]?.length || 0);

    return Object.entries(sceneConfig.arguments)
      .filter(([key]) => !currentArgs.has(key))
      .map(([key, arg]) => ({
        label: key,
        kind: this.monaco.languages.CompletionItemKind.Property,
        insertText: `${key}=`,
        documentation: {
          value: [
            `### ${arg.name}`,
            arg.description,
            arg.required ? "\n**Required**" : "",
            arg.examples
              ? "\n**Examples:**\n" +
                Object.entries(arg.examples)
                  .map(([value, desc]) => `- \`${value}\`: ${desc}`)
                  .join("\n")
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
          isTrusted: true,
        },
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn,
          endColumn: position.column,
        },
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggestions",
        },
      }));
  }

  /**
   * Parse existing arguments from a line
   */
  private parseArguments(line: string): Set<string> {
    const args = new Set<string>();
    const matches = line.matchAll(/--(\w+)=/g);
    for (const match of matches) {
      args.add(match[1]);
    }
    return args;
  }

  provideCompletions(context: CommandContext): languages.CompletionItem[] {
    if (!this.isSceneCompletionContext(context)) {
      return [];
    }

    const { lineContent, position } = context;

    if (this.isValueContext(lineContent, position)) {
      return this.getValueCompletions(context);
    }

    // New scene declaration
    if (lineContent.trim() === "#" || lineContent.trim() === "##") {
      return this.getSceneDeclarationCompletion(context);
    }

    // Argument completions
    if (/--\w*$/.test(lineContent)) {
      return this.getArgumentCompletions(context);
    }

    return [];
  }

  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    // We'll implement diagnostics next
    return [];
  }
}
