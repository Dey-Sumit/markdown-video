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
} from "../types/adapter.type";
import { capitalizeFirstLetter } from "@/lib/utils";

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

  protected getBlockContent(
    model: editor.ITextModel,
    startLine: number,
  ): {
    content: string;
    startLine: number;
    endLine: number;
  } | null {
    const lineCount = model.getLineCount();
    let content = "";
    let endLine = startLine;
    let depth = 0;

    // Get first line
    const firstLine = model.getLineContent(startLine);
    content += firstLine;

    // Find opening parenthesis
    const openParenIndex = firstLine.indexOf("(");
    if (openParenIndex === -1) return null;

    // Count initial parentheses
    for (const char of firstLine.slice(openParenIndex)) {
      if (char === "(") depth++;
      if (char === ")") depth--;
    }

    // Continue reading lines until we find the matching closing parenthesis
    for (let i = startLine + 1; i <= lineCount && depth > 0; i++) {
      const line = model.getLineContent(i);
      content += "\n" + line;

      for (const char of line) {
        if (char === "(") depth++;
        if (char === ")") depth--;
      }

      endLine = i;
      if (depth === 0) break;
    }

    return {
      content,
      startLine,
      endLine,
    };
  }

  protected createMultiLineRange(
    startLine: number,
    endLine: number,
    model: editor.ITextModel,
  ): IRange {
    return {
      startLineNumber: startLine,
      endLineNumber: endLine,
      startColumn: 1,
      endColumn: model.getLineMaxColumn(endLine),
    };
  }

  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    if (!this.matchesPattern(context.lineContent)) return [];

    // Allow components to override validation behavior
    const customValidation = this.validateComponent?.(context);
    if (customValidation) {
      return customValidation;
    }

    // Default validation behavior
    const args = this.parseArguments(context.lineContent);
    const markers: editor.IMarkerData[] = [];

    // Check required args
    for (const [argName, argConfig] of Object.entries(this.config.arguments)) {
      if (
        argConfig.validations?.some((v) => v.type === "required") &&
        !args.has(argName)
      ) {
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
  }

  protected validateComponent?(
    context: CommandContext,
  ): editor.IMarkerData[] | null;

  protected getHoverType(
    word: string,
    lineContent: string,
    position: Position,
  ): "command" | "argument" | "value" | null {
    if (word === this.config.id) {
      return "command";
    }

    // Check if it's an argument name
    if (this.config.arguments[word]) {
      return "argument";
    }

    // Check if it's a value
    const valueMatch = lineContent.match(
      new RegExp(`--\\w+=(${word}|"${word}")`),
    );
    if (valueMatch) {
      return "value";
    }

    return null;
  }

  protected getWordAtPosition(
    lineContent: string,
    position: Position,
  ): string | null {
    const commandRegex =
      this.config.pattern.type === "directive"
        ? /!\w+/ // For !!scene
        : /!\w+/; // For !text

    const cmdMatch = lineContent.match(commandRegex);
    if (cmdMatch) {
      const startCol = cmdMatch.index! + 1;
      const endCol = startCol + this.config.id.length;
      if (position.column >= startCol && position.column <= endCol) {
        return this.config.id;
      }
    }
    // Check if we're on an argument name
    const argMatch = /--(\w+)(?==)/g;
    let match;
    while ((match = argMatch.exec(lineContent)) !== null) {
      const startCol = match.index + 3; // Skip '--'
      const endCol = startCol + match[1].length;

      if (position.column >= startCol && position.column <= endCol) {
        return match[1]; // Return just the argument name
      }
    }

    // Check if we're on a value
    const valueRegex = /--\w+=([^-\s"]+|"[^"]*")/g;
    while ((match = valueRegex.exec(lineContent)) !== null) {
      const valueStart = match.index + match[0].indexOf("=") + 1;
      const value = match[1].replace(/^"|"$/g, ""); // Remove quotes if present
      const valueEnd = valueStart + match[1].length;

      if (position.column >= valueStart && position.column <= valueEnd) {
        return value;
      }
    }

    return null;
  }

  protected getCommandHover(word: string): languages.Hover {
    const contents = [
      {
        value: [
          `## ${capitalizeFirstLetter(this.config.id)}`,
          "",
          this.config.description || "No description available",
          "",
          "Arguments:",
          ...Object.entries(this.config.arguments).map(
            ([name, arg]) =>
              `- \`--${name}\`: ${arg.description}${arg.required ? " (required)" : ""}`,
          ),
        ].join("\n"),
        isTrusted: true,
      },
    ];

    return { contents };
  }

  protected getArgumentHover(argName: string): languages.Hover | null {
    const arg = this.config.arguments[argName];
    if (!arg) return null;

    const contents = [
      {
        value: [
          `### ${arg.name}`,
          "",
          arg.description || "No description available",
          "",
          arg.required ? "**Required**" : "Optional",
          "",
          arg.type === "number" &&
          (arg.min !== undefined || arg.max !== undefined)
            ? `Range: ${arg.min ?? "-∞"} to ${arg.max ?? "∞"}`
            : "",
          "",
          this.getArgumentExamplesDoc(arg.examples),
        ]
          .filter(Boolean)
          .join("\n"),
        isTrusted: true,
      },
    ];

    return { contents };
  }

  protected getValueHover(
    value: string,
    lineContent: string,
  ): languages.Hover | null {
    // Extract argument name from line
    const argMatch = lineContent.match(/--(\w+)=[^-\s]*$/);
    if (!argMatch) return null;

    const argName = argMatch[1];
    const arg = this.config.arguments[argName];
    if (!arg) return null;

    let content = "";

    // If it's an enum type argument with predefined values
    if (arg.values?.includes(value)) {
      content = `Valid value for ${argName}`;
    }

    // If it has examples, show the example description
    if (arg.examples?.[value]) {
      content = arg.examples[value];
    }

    if (!content) return null;

    return {
      contents: [
        {
          value: content,
          isTrusted: true,
        },
      ],
    };
  }

  provideHover(context: CommandContext): languages.Hover | null {
    const { lineContent, position } = context;

    if (!this.matchesPattern(lineContent)) {
      return null;
    }

    // Get word/argument under cursor
    const word = this.getWordAtPosition(lineContent, position);
    if (!word) return null;

    // Determine what we're hovering over (command, argument, or value)
    const hoverType = this.getHoverType(word, lineContent, position);

    switch (hoverType) {
      case "command":
        return this.getCommandHover(word);
      case "argument":
        return this.getArgumentHover(word);
      case "value":
        return this.getValueHover(word, lineContent);
      default:
        return null;
    }
  }

  initialize?(): void {}

  dispose?(): void {}
}
