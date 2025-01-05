import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position, IRange } from "monaco-editor";
import type {
  AdapterConfig,
  BaseAdapter,
  CommandContext,
} from "../types/adapter";

export abstract class AbstractAdapter implements BaseAdapter {
  constructor(
    protected readonly monaco: Monaco,
    public readonly config: AdapterConfig,
  ) {}

  provideCompletions(context: CommandContext): languages.CompletionItem[] {
    const type = this.getCompletionType(context);
    if (!type) return [];

    switch (type) {
      case "command":
        return this.getCommandCompletion(context);
      case "value":
        return this.getValueCompletions(context);
      case "argument":
        return this.getArgumentCompletions(context);
      default:
        return [];
    }
  }

  protected getCompletionType(
    context: CommandContext,
  ): "command" | "value" | "argument" | null {
    const { lineContent, position } = context;
    const trimmed = lineContent.trim();

    if (this.isCommandStart(trimmed)) return "command";
    if (!this.matchesPattern(lineContent)) return null;
    if (this.isValueContext(lineContent, position)) return "value";
    if (this.requiresWhitespace(lineContent, position)) return "argument";

    return null;
  }

  protected matchesPattern(lineContent: string): boolean {
    return new RegExp(this.config.pattern.pattern).test(lineContent);
  }

  protected isCommandStart(trimmed: string): boolean {
    if (this.config.pattern.type === "component") {
      const trigger = this.config.pattern.pattern.match(/\^\\s\*(\S+?)\w/)?.[1];
      return trimmed === trigger;
    }

    if (this.config.pattern.type === "codeComponent") {
      // TODO : add the
    }

    const leadingSymbols = this.config.pattern.leadingSymbols ?? [];
    return leadingSymbols.some(
      (symbol) => trimmed === symbol || trimmed === symbol.trim(),
    );
  }
  protected createRange(
    position: Position,
    startColumn?: number,
    endColumn?: number,
  ): IRange {
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: Math.max(1, startColumn ?? position.column),
      endColumn: Math.max(
        startColumn ?? position.column,
        endColumn ?? position.column,
      ),
    };
  }

  protected parseArguments(line: string): Set<string> {
    const args = new Set<string>();
    const matches = line.matchAll(/--(\w+)=/g);
    for (const match of matches) {
      args.add(match[1]);
    }
    return args;
  }

  protected requiresWhitespace(
    lineContent: string,
    position: Position,
  ): boolean {
    const textUntilCursor = lineContent.substring(0, position.column);

    if (/--(\w+)=\s*$/.test(textUntilCursor)) {
      const lastArgMatch = textUntilCursor.match(/.*?--\w+=[^-]*$/);
      return lastArgMatch ? /\s--\w+=[^-]*$/.test(lastArgMatch[0]) : false;
    }

    return /\s--\w*$/.test(textUntilCursor);
  }

  protected isValueContext(lineContent: string, position: Position): boolean {
    const textUntilCursor = lineContent.substring(0, position.column);
    const matchesWhitespace = this.requiresWhitespace(lineContent, position);
    const matchesValue = /--(\w+)=\s*$/.test(textUntilCursor);
    return matchesWhitespace && matchesValue;
  }

  protected getCommandCompletion(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { position, wordRange } = context;
    const trimmed = context.lineContent.trim();
    const leadingSymbols = this.config.pattern.leadingSymbols ?? [];
    const insertPrefix = leadingSymbols.some((s) => trimmed === s) ? " " : "";

    return [
      {
        label: this.config.id,
        kind: this.monaco.languages.CompletionItemKind.Snippet,
        insertText: `${insertPrefix}${this.config.template}`,
        insertTextRules:
          this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: this.createCompletionDoc([
          `### ${this.config.id}`,
          ...this.getArgumentDocs(),
        ]),
        range: wordRange || this.createRange(position),
      },
    ];
  }

  protected getArgumentCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const used = this.parseArguments(lineContent);
    const match = lineContent.substring(0, position.column).match(/--(\w*)$/);
    if (!match) return [];

    const startColumn = position.column - (match[1]?.length || 0);

    return Object.entries(this.config.arguments)
      .filter(([key]) => !used.has(key))
      .map(([key, arg]) => ({
        label: key,
        kind: this.monaco.languages.CompletionItemKind.Property,
        insertText: `${key}=`,
        documentation: this.createCompletionDoc([
          `### ${arg.name}`,
          arg.description || "",
          arg.required ? "**Required**" : "",
          this.getArgumentExamplesDoc(arg.examples),
        ]),
        range: this.createRange(position, startColumn, position.column),
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggestions",
        },
      }));
  }

  protected getValueCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const match = lineContent
      .substring(0, position.column)
      .match(/--(\w+)=\s*$/);
    if (!match) return [];

    const arg = this.config.arguments[match[1]];
    if (!arg?.examples) return [];

    return Object.entries(arg.examples).map(([value, desc]) => ({
      label: value,
      kind: this.monaco.languages.CompletionItemKind.Value,
      insertText: value,
      documentation: this.createCompletionDoc([`${value}: ${desc}`]),
      range: this.createRange(position, position.column, position.column),
    }));
  }

  protected getArgumentDocs(): string[] {
    return Object.entries(this.config.arguments).map(
      ([key, arg]) => `- \`--${key}\`: ${arg.description || "No description"}`,
    );
  }

  protected getArgumentExamplesDoc(examples?: Record<string, string>): string {
    if (!examples) return "";
    return (
      "**Examples:**\n" +
      Object.entries(examples)
        .map(([value, desc]) => `- \`${value}\`: ${desc}`)
        .join("\n")
    );
  }

  protected createCompletionDoc(sections: string[]): {
    value: string;
    isTrusted: boolean;
  } {
    return {
      value: sections.filter(Boolean).join("\n"),
      isTrusted: true,
    };
  }

  abstract provideDiagnostics(context: CommandContext): editor.IMarkerData[];

  provideHover?(context: CommandContext): languages.Hover | null {
    return null;
  }

  initialize?(): void {}

  dispose?(): void {}
}
