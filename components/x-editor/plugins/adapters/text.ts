// adapters/text.ts
import * as monaco from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import BasePropertyAdapter from "./base";
import {
  type PropertyConfig,
  type EditorContext,
  type ICompletionProvider,
  type IDiagnosticsProvider,
  type PropertyArgument,
} from "../types";

/**
 * Configuration for text property
 */
const textConfig: PropertyConfig = {
  name: "text",
  prefix: "!",
  description: "Add text with custom styling",
  arguments: {
    family: {
      name: "family",
      type: "string",
      values: ["mono", "sans", "serif", "lord"],
      description: "Font family to use",
      required: true,
      examples: {
        mono: "Monospace font for code",
        sans: "Clean sans-serif font",
        serif: "Classic serif font",
        lord: "Decorative font for headings",
      },
    },
    size: {
      name: "size",
      type: "number",
      min: 12,
      max: 96,
      description: "Font size in pixels",
      required: true,
      examples: {
        "16": "Default paragraph size",
        "24": "Subheading size",
        "32": "Heading size",
        "48": "Large display size",
      },
    },
    weight: {
      name: "weight",
      type: "number",
      values: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      description: "Font weight",
      examples: {
        "400": "Normal weight",
        "700": "Bold weight",
      },
    },
    color: {
      name: "color",
      type: "string",
      description: "Text color",
      examples: {
        red: "Red text",
        blue: "Blue text",
        green: "Green text",
        "#FF0000": "Custom red color",
      },
    },
    align: {
      name: "align",
      type: "string",
      values: ["left", "center", "right", "justify"],
      description: "Text alignment",
      examples: {
        left: "Left-aligned text",
        center: "Centered text",
        right: "Right-aligned text",
        justify: "Justified text",
      },
    },
  },
  syntax: /^!text(\s+--\w+=[\w#.-]+)+$/,
};

/**
 * Text property adapter implementation
 */
export class TextPropertyAdapter
  extends BasePropertyAdapter
  implements ICompletionProvider, IDiagnosticsProvider
{
  constructor(monaco: Monaco) {
    super(textConfig, monaco);
  }

  /**
   * Initialize text-specific command patterns
   */
  protected initializePatterns(): void {
    super.initializePatterns();

    // Add pattern for argument suggestions
    this.patterns.push({
      match: (context) => this.isArgumentContext(context.lineContent),
      priority: 2,
      handle: (context) => this.getArgumentCompletions(context),
    });

    // Add pattern for value suggestions
    this.patterns.push({
      match: (context) => this.isValueContext(context.lineContent),
      priority: 3,
      handle: (context) => this.getValueCompletions(context),
    });
  }

  /**
   * Check for argument suggestion context
   */
  private isArgumentContext(line: string): boolean {
    return line.includes("!text") && /--\w*$/.test(line);
  }

  /**
   * Check for value suggestion context
   */
  private isValueContext(line: string): boolean {
    return line.includes("!text") && /--\w+=\w*$/.test(line);
  }

  /**
   * Provide completions based on context
   */
  public provideCompletions(
    context: EditorContext,
  ): monaco.languages.CompletionItem[] {
    // Find the highest priority matching pattern
    const matchingPattern = this.patterns
      .filter((p) => p.match(context))
      .sort((a, b) => b.priority - a.priority)[0];

    if (matchingPattern) {
      return matchingPattern.handle(context);
    }

    return [];
  }

  /**
   * Get argument completions
   */
  private getArgumentCompletions(
    context: EditorContext,
  ): monaco.languages.CompletionItem[] {
    const { position, wordRange } = context;
    const currentArgs = this.parseArguments(context.lineContent);

    return (
      Object.entries(this.config.arguments)
        // Filter out arguments that are already used
        .filter(([key]) => !currentArgs[key])
        .map(([key, arg]) => ({
          label: key,
          kind: this.monaco.languages.CompletionItemKind.Field,
          documentation: {
            value: this.generateArgumentDocumentation(arg),
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
        }))
    );
  }

  /**
   * Get value completions
   */
  private getValueCompletions(
    context: EditorContext,
  ): monaco.languages.CompletionItem[] {
    const { lineContent, position, wordRange } = context;
    const currentArg = this.getCurrentArgument(lineContent);
    if (!currentArg) return [];

    const argConfig = this.config.arguments[currentArg];
    if (!argConfig) return [];

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
            [argConfig.min?.toString() || "12", "Minimum size"],
            [argConfig.max?.toString() || "96", "Maximum size"],
          ];

      return suggestions.map(([value, description]) => ({
        label: value,
        kind: this.monaco.languages.CompletionItemKind.Value,
        documentation: {
          value: `${description}`,
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

    return [];
  }

  /**
   * Get current argument being typed
   */
  private getCurrentArgument(line: string): string | null {
    const match = line.match(/--(\w+)=\w*$/);
    return match ? match[1] : null;
  }

  /**
   * Generate documentation for an argument
   */
  private generateArgumentDocumentation(arg: PropertyArgument): string {
    const parts = [
      `### ${arg.name}`,
      arg.description || "",
      `**Type**: ${arg.type}`,
      arg.required ? "**Required**" : "Optional",
    ];

    if (arg.values) {
      parts.push(`**Values**: ${arg.values.join(", ")}`);
    }

    if (arg.min !== undefined || arg.max !== undefined) {
      parts.push(`**Range**: ${arg.min || "min"} to ${arg.max || "max"}`);
    }

    return parts.filter(Boolean).join("\n\n");
  }

  /**
   * Provide diagnostics for text syntax and values
   */
  public provideDiagnostics(
    context: EditorContext,
  ): monaco.editor.IMarkerData[] {
    const { lineContent, position } = context;
    const markers: monaco.editor.IMarkerData[] = [];

    // Only process lines with text commands
    if (!lineContent.includes("!text")) return markers;

    // Validate basic syntax
    if (!this.config.syntax?.test(lineContent.trim())) {
      markers.push({
        message:
          "Invalid text syntax. Expected: !text --family=<value> --size=<value> [--weight=<value>] [--color=<value>] [--align=<value>]",
        severity: this.monaco.MarkerSeverity.Error,
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        endColumn: lineContent.length + 1,
      });
      return markers;
    }

    // Validate arguments and their values
    const args = this.parseArguments(lineContent);

    // Check for required arguments
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

    // Validate each provided argument
    Object.entries(args).forEach(([key, value]) => {
      const argConfig = this.config.arguments[key];

      // Unknown argument
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

      // Validate value
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

  /**
   * Validate a single argument value
   */
  private validateValue(
    key: string,
    value: string,
    config: PropertyArgument,
  ): string | null {
    // Use custom validation if provided
    if (config.validate) {
      return config.validate(value);
    }

    // Type-specific validation
    if (config.type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return `${key} must be a number`;
      }
      if (config.min !== undefined && num < config.min) {
        return `${key} must be at least ${config.min}`;
      }
      if (config.max !== undefined && num > config.max) {
        return `${key} must be at most ${config.max}`;
      }
    }

    // Validate against allowed values
    if (config.values && !config.values.includes(value)) {
      return `${key} must be one of: ${config.values.join(", ")}`;
    }

    // Color validation for color argument
    if (key === "color" && !value.match(/^(#[0-9A-Fa-f]{6}|[a-zA-Z]+)$/)) {
      return `${key} must be a valid color name or hex code (e.g., 'red' or '#FF0000')`;
    }

    return null;
  }
}

