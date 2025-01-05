import type { Monaco } from "@monaco-editor/react";
import type {
  editor,
  languages,
  Position,
  IRange,
  MarkerSeverity,
} from "monaco-editor";
import type {
  AdapterConfig,
  ArgCompletionInfo,
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

  protected validateArgument(
    name: string,
    value: string | undefined,
    position: Position,
    line: string, // Add line parameter
  ): editor.IMarkerData[] {
    const arg = this.config.arguments[name];
    if (!arg?.validations) return [];

    const markers: editor.IMarkerData[] = [];

    for (const rule of arg.validations) {
      let isValid = true;

      switch (rule.type) {
        case "required":
          isValid = value !== undefined;
          break;
        case "range":
        case "enum":
        case "custom":
          isValid = value ? (rule.validate?.(value) ?? true) : true;
          break;
        case "pattern":
          isValid = value ? new RegExp(rule.pattern!).test(value) : true;
          break;
      }

      if (!isValid) {
        markers.push({
          severity: this.getSeverity(rule.severity),
          message: rule.message,
          ...this.getDiagnosticRange(position, name, value, line),
        });
      }
    }

    return markers;
  }

  private getSeverity(severity?: string): MarkerSeverity {
    switch (severity) {
      case "error":
        return this.monaco.MarkerSeverity.Error;
      case "warning":
        return this.monaco.MarkerSeverity.Warning;
      default:
        return this.monaco.MarkerSeverity.Info;
    }
  }

  private getDiagnosticRange(
    position: Position,
    name: string,
    value: string | undefined,
    line: string,
  ): IRange {
    if (value === undefined) {
      const commandMatch = line.match(this.config.pattern.pattern);
      return {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: (commandMatch?.index || 0) + 1,
        endColumn: line.length + 1,
      };
    }

    const argMatch = line.match(new RegExp(`--${name}=([^\\s]+)`));
    if (!argMatch) return this.createRange(position);

    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: argMatch.index! + argMatch[0].indexOf(value) + 1,
      endColumn: argMatch.index! + argMatch[0].length + 1,
    };
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

  matchesPattern(lineContent: string): boolean {
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

  /*   protected parseArguments(line: string): Set<string> {
    const args = new Set<string>();
    const matches = line.matchAll(/--(\w+)=/g);
    for (const match of matches) {
      args.add(match[1]);
    }
    return args;
  } */

  protected parseArguments(line: string): Map<string, string | undefined> {
    const args = new Map<string, string | undefined>();
    const matches = line.matchAll(/--(\w+)(?:=([^\s]+))?/g);

    // Add all explicitly defined arguments
    for (const match of matches) {
      args.set(match[1], match[2]);
    }

    // Check required args that are missing
    Object.entries(this.config.arguments).forEach(([name, arg]) => {
      if (
        arg.validations?.some((v) => v.type === "required") &&
        !args.has(name)
      ) {
        args.set(name, undefined);
      }
    });

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

  private sortCompletions(a: ArgCompletionInfo, b: ArgCompletionInfo): number {
    if (a.isRequired !== b.isRequired) return a.isRequired ? -1 : 1;
    return a.key.localeCompare(b.key);
  }

  protected getArgumentCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { lineContent, position } = context;
    const used = this.parseArguments(lineContent);
    const match = lineContent.substring(0, position.column).match(/--(\w*)$/);
    if (!match) return [];

    const startColumn = position.column - (match[1]?.length || 0);

    // Include all args (used or not) and mark required
    const args: ArgCompletionInfo[] = Object.entries(this.config.arguments)
      .map(([key, arg]) => ({
        key,
        arg,
        isRequired:
          arg.validations?.some((v) => v.type === "required") ?? false,
      }))
      // Filter non-required used args
      .filter(({ key, isRequired }) => !used.has(key) || isRequired);

    return args
      .sort((a, b) => this.sortCompletions(a, b))
      .map(({ key, arg, isRequired }) => ({
        label: `${key}${isRequired ? " (required)" : ""}`,
        kind: this.monaco.languages.CompletionItemKind.Property,
        insertText: `${key}=`,
        documentation: this.createCompletionDoc([
          `### ${arg.name}`,
          arg.description || "",
          isRequired ? "**Required**" : "",
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

  /*  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    if (!this.matchesPattern(context.lineContent)) return [];

    const markers: editor.IMarkerData[] = [];
    const args = this.parseArguments(context.lineContent);

    for (const [name, value] of args.entries()) {
      markers.push(
        ...this.validateArgument(
          name,
          value,
          context.position,
          context.lineContent,
        ),
      );
    }

    return markers;
  } */

  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    if (!this.matchesPattern(context.lineContent)) return [];

    console.log("=== Diagnostic Details ===");
    const args = this.parseArguments(context.lineContent);
    console.log("Parsed arguments:", args);

    const markers: editor.IMarkerData[] = [];

    // Important: Also check for required args that aren't present
    for (const [argName, argConfig] of Object.entries(this.config.arguments)) {
      console.log(`Checking argument: ${argName}`, argConfig);
      if (
        argConfig.validations?.some((v) => v.type === "required") &&
        !args.has(argName)
      ) {
        console.log(`Missing required argument: ${argName}`);
        markers.push({
          severity: this.monaco.MarkerSeverity.Error,
          message: `Required argument '${argName}' is missing`,
          ...this.getDiagnosticRange(
            context.position,
            argName,
            undefined,
            context.lineContent,
          ),
        });
      }
    }

    // Check existing args
    for (const [name, value] of args.entries()) {
      console.log(`Validating argument: ${name} = ${value}`);
      markers.push(
        ...this.validateArgument(
          name,
          value,
          context.position,
          context.lineContent,
        ),
      );
    }

    console.log("Final markers:", markers);
    return markers;
  }
  provideHover?(context: CommandContext): languages.Hover | null {
    return null;
  }

  initialize?(): void {}

  dispose?(): void {}
}
