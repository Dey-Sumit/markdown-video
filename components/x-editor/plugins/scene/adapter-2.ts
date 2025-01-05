// plugins/scene/adapter.ts
// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter";
import { sceneConfig } from "./config";

export class SceneAdapter extends AbstractAdapter {
  private completionHandlers = {
    scene: {
      pattern: (trimmed: string) => trimmed === "#" || trimmed === "##",
      getPrefix: (trimmed: string) =>
        trimmed === "#" ? "# " : trimmed === "##" ? " " : "",
      getTemplate: () => "scene --duration=${2:5} --title=${1:scene-1}",
      kind: () => this.monaco.languages.CompletionItemKind.Snippet,
    },
    argument: {
      insertSuffix: "=",
      kind: () => this.monaco.languages.CompletionItemKind.Property,
      shouldTriggerSuggestions: true,
    },
    value: {
      kind: () => this.monaco.languages.CompletionItemKind.Value,
    },
  };

  provideCompletions(context: CommandContext): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const trimmed = lineContent.trim();

    // Scene declaration
    if (this.completionHandlers.scene.pattern(trimmed)) {
      return [
        {
          label: "!!scene",
          kind: this.completionHandlers.scene.kind(),
          insertText: `${this.completionHandlers.scene.getPrefix(trimmed)}!!${this.completionHandlers.scene.getTemplate()}`,
          insertTextRules:
            this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: this.createCompletionDoc(sceneConfig.documentation),
          range: this.getWordRange(context),
        },
      ];
    }

    if (!this.matchesPattern(lineContent)) return [];

    // Value completions
    if (this.isValueContext(lineContent, position)) {
      return this.getCompletionsFromConfig("value", context);
    }

    // Argument completions
    if (this.requiresWhitespace(lineContent, position)) {
      return this.getCompletionsFromConfig("argument", context);
    }

    return [];
  }

  private getCompletionsFromConfig(
    type: "argument" | "value",
    context: CommandContext,
  ): languages.CompletionItem[] {
    const handler = this.completionHandlers[type];
    const items =
      type === "value"
        ? this.getValueItems(context)
        : this.getArgumentItems(context);

    return items.map((item) => ({
      ...item,
      kind: handler.kind(),
      insertText: `${item.label}${handler.insertSuffix || ""}`,
      range: this.getWordRange(context),
      ...(handler.shouldTriggerSuggestions && {
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggestions",
        },
      }),
    }));
  }

  private getValueItems(context: CommandContext) {
    const arg = this.getCurrentArgument(context);
    return arg?.examples
      ? Object.entries(arg.examples).map(([value, desc]) => ({
          label: value,
          documentation: this.createCompletionDoc([desc]),
        }))
      : [];
  }

  private getArgumentItems(context: CommandContext) {
    const currentArgs = this.parseArguments(context.lineContent);
    return Object.entries(sceneConfig.arguments)
      .filter(([key]) => !currentArgs.has(key))
      .map(([key, arg]) => ({
        label: key,
        documentation: this.createCompletionDoc([
          `### ${arg.name}`,
          arg.description,
          arg.required ? "**Required**" : "",
          this.getExamplesDoc(arg.examples),
        ]),
      }));
  }
}
