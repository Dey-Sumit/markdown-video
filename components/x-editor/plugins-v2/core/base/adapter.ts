import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position, IRange } from "monaco-editor";
import type {
  PropertyConfig,
  PropertyArgument,
  CommandContext,
} from "../types/property";
import type {
  IPropertyAdapter,
  ICompletionProvider,
  IDiagnosticsProvider,
  CommandPattern,
} from "../types/monaco";

export abstract class BasePropertyAdapter
  implements IPropertyAdapter, ICompletionProvider, IDiagnosticsProvider
{
  protected patterns: CommandPattern[] = [];

  constructor(
    protected readonly config: PropertyConfig,
    protected readonly monaco: Monaco,
  ) {
    this.initializePatterns();
  }

  public get name(): string {
    return this.config.name;
  }

  /**
   * Initialize command patterns - abstract method that must be implemented by subclasses
   */
  protected abstract initializePatterns(): void;

  /**
   * Required by ICompletionProvider interface
   */
  public abstract provideCompletions(
    context: CommandContext,
  ): languages.CompletionItem[];

  /**
   * Required by IDiagnosticsProvider interface
   */
  public abstract provideDiagnostics(
    context: CommandContext,
  ): editor.IMarkerData[];

  /**
   * Check if a line matches this property's pattern
   */
  protected matchesPattern(line: string): boolean {
    const { pattern } = this.config;
    const trimmed = line.trimStart();

    // Check leading symbols (e.g., ##, //)
    if (pattern.leadingSymbols?.length) {
      if (
        !pattern.leadingSymbols.some((symbol) => trimmed.startsWith(symbol))
      ) {
        return false;
      }
    }

    // Check prefix (!, !!)
    const prefixes = Array.isArray(pattern.prefix)
      ? pattern.prefix
      : [pattern.prefix];
    return prefixes.some((prefix) =>
      pattern.type === "inline"
        ? trimmed.includes(`${prefix}${this.config.name}`)
        : trimmed.includes(prefix),
    );
  }

  /**
   * Parse arguments from a command line
   */
  protected parseArguments(line: string): Record<string, string> {
    const args: Record<string, string> = {};
    const matches = line.matchAll(/--(\w+)=([^\s]+)/g);

    for (const match of matches) {
      args[match[1]] = match[2];
    }

    return args;
  }

  /**
   * Create monaco range with proper bounds checking
   */
  protected createRange(
    lineNumber: number,
    startColumn: number,
    endColumn: number,
  ): IRange {
    return {
      startLineNumber: lineNumber,
      endLineNumber: lineNumber,
      startColumn: Math.max(1, startColumn),
      endColumn: Math.max(startColumn, endColumn),
    };
  }

  /**
   * Generate documentation for property or argument
   */
  protected generateDocumentation(
    item: PropertyConfig | PropertyArgument,
    type: "property" | "argument" = "property",
  ): string {
    const parts = [`### ${item.name}`, item.description || ""];

    if ("type" in item) {
      // Argument-specific documentation
      parts.push(`**Type**: ${item.type}`);
      if (item.required) parts.push("**Required**");
      if (item.values) parts.push(`**Values**: ${item.values.join(", ")}`);
      if (item.min !== undefined || item.max !== undefined) {
        parts.push(`**Range**: ${item.min || "min"} to ${item.max || "max"}`);
      }
    } else {
      // Property-specific documentation
      const argsList = Object.entries(item.arguments)
        .map(([key, arg]) => {
          const required = arg.required ? "(required)" : "(optional)";
          return `- \`--${key}\` ${required}: ${arg.description || "No description"}`;
        })
        .join("\n");
      parts.push("#### Arguments:", argsList);
    }

    return parts.filter(Boolean).join("\n\n");
  }

  /**
   * Validate a single argument value
   */
  protected validateValue(
    key: string,
    value: string,
    argConfig: PropertyArgument,
  ): string | null {
    if (argConfig.type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return `${key} must be a number`;
      }
      if (argConfig.min !== undefined && num < argConfig.min) {
        return `${key} must be at least ${argConfig.min}`;
      }
      if (argConfig.max !== undefined && num > argConfig.max) {
        return `${key} must be at most ${argConfig.max}`;
      }
    }

    if (argConfig.values && !argConfig.values.includes(value)) {
      return `${key} must be one of: ${argConfig.values.join(", ")}`;
    }

    return null;
  }

  /**
   * Check if in argument suggestion context
   */
  protected isArgumentContext(line: string): boolean {
    return this.matchesPattern(line) && /--\w*$/.test(line);
  }

  /**
   * Check if in value suggestion context
   */
  protected isValueContext(line: string): boolean {
    return this.matchesPattern(line) && /--\w+=\w*$/.test(line);
  }

  /**
   * Get current argument being typed
   */
  protected getCurrentArgument(line: string): string | null {
    const match = line.match(/--(\w+)=\w*$/);
    return match ? match[1] : null;
  }

  /**
   * Get property-start completions
   */
  protected getPropertyCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { position, wordRange } = context;

    return [
      {
        label: this.config.name,
        kind: this.monaco.languages.CompletionItemKind.Property,
        documentation: {
          value: this.generateDocumentation(this.config),
          isTrusted: true,
        },
        insertText: `${this.config.name} --`,
        range:
          wordRange ||
          this.createRange(
            position.lineNumber,
            position.column,
            position.column,
          ),
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggest",
        },
      },
    ];
  }

  /**
   * Get argument completions
   */
  protected getArgumentCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { position, wordRange } = context;
    const currentArgs = this.parseArguments(context.lineContent);

    return Object.entries(this.config.arguments)
      .filter(([key]) => !currentArgs[key])
      .map(([key, arg]) => ({
        label: key,
        kind: this.monaco.languages.CompletionItemKind.Field,
        documentation: {
          value: this.generateDocumentation(arg, "argument"),
          isTrusted: true,
        },
        insertText: `${key}=`,
        range:
          wordRange ||
          this.createRange(
            position.lineNumber,
            position.column,
            position.column,
          ),
        command: {
          id: "editor.action.triggerSuggest",
          title: "Trigger Suggest",
        },
      }));
  }

  /**
   * Get value completions
   */
  protected getValueCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { position, wordRange, lineContent } = context;
    const currentArg = this.getCurrentArgument(lineContent);
    if (!currentArg) return [];

    const argConfig = this.config.arguments[currentArg];
    if (!argConfig) return [];

    return this.generateValueCompletions(argConfig, position, wordRange);
  }

  /**
   * Generate value-specific completions
   */
  protected generateValueCompletions(
    argConfig: PropertyArgument,
    position: Position,
    wordRange?: IRange,
  ): languages.CompletionItem[] {
    if (argConfig.values) {
      return argConfig.values.map((value) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        documentation: {
          value: [
            `### ${value}`,
            argConfig.examples?.[value] || "",
            argConfig.description || "",
          ].join("\n"),
          isTrusted: true,
        },
        insertText: value,
        range:
          wordRange ||
          this.createRange(
            position.lineNumber,
            position.column,
            position.column,
          ),
      }));
    }

    if (argConfig.type === "number") {
      const suggestions = argConfig.examples
        ? Object.entries(argConfig.examples)
        : [
            [argConfig.min?.toString() || "0", "Minimum value"],
            [argConfig.max?.toString() || "100", "Maximum value"],
          ];

      return suggestions.map(([value, description]) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        documentation: { value: description, isTrusted: true },
        insertText: value,
        range:
          wordRange ||
          this.createRange(
            position.lineNumber,
            position.column,
            position.column,
          ),
      }));
    }

    return [];
  }

  /**
   * Validate a line of content
   */
  protected validateLine(context: CommandContext): editor.IMarkerData[] {
    const { lineContent, position } = context;
    const markers: editor.IMarkerData[] = [];

    const args = this.parseArguments(lineContent);

    // Check required arguments
    Object.entries(this.config.arguments)
      .filter(([_, arg]) => arg.required)
      .forEach(([key, arg]) => {
        if (!args[key]) {
          markers.push({
            message: `Missing required argument: ${key}`,
            severity: this.monaco.MarkerSeverity.Error,
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 1,
            endColumn: lineContent.length + 1,
          });
        }
      });

    // Validate provided arguments
    Object.entries(args).forEach(([key, value]) => {
      const argConfig = this.config.arguments[key];

      if (!argConfig) {
        markers.push({
          message: `Unknown argument: ${key}`,
          severity: this.monaco.MarkerSeverity.Error,
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: lineContent.indexOf(`--${key}`) + 1,
          endColumn: lineContent.indexOf(`--${key}`) + key.length + 3,
        });
        return;
      }

      const valueError = this.validateValue(key, value, argConfig);
      if (valueError) {
        markers.push({
          message: valueError,
          severity: this.monaco.MarkerSeverity.Error,
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: lineContent.indexOf(`=${value}`) + 1,
          endColumn: lineContent.indexOf(`=${value}`) + value.length + 1,
        });
      }
    });

    return markers;
  }
}
