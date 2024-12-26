import * as monaco from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import BasePropertyAdapter from "./base";
import {
  type EditorContext,
  type ICompletionProvider,
  type IDiagnosticsProvider,
  type PropertyArgument,
  type PropertyConfig,
} from "../types";

/**
 * Configuration specific to transition property
 */
export const transitionConfig: PropertyConfig = {
  name: "transition",
  prefix: "!",
  description: "Defines transition effects between scenes",
  arguments: {
    type: {
      name: "type",
      type: "string",
      values: ["fade", "slide", "zoom", "wipe"],
      description: "Type of transition effect",
      required: true,
      examples: {
        fade: "Smooth fade transition between scenes",
        slide: "Slide content in/out",
        zoom: "Zoom in/out effect",
        wipe: "Wipe across the screen",
      },
    },
    duration: {
      name: "duration",
      type: "number",
      min: 0.1,
      max: 2.0,
      description: "Duration of transition in seconds",
      required: true,
      examples: {
        "0.3": "Quick transition",
        "1.0": "Standard transition",
        "2.0": "Slow, dramatic transition",
      },
    },
    direction: {
      name: "direction",
      type: "string",
      values: ["from-left", "from-right", "from-top", "from-bottom"],
      description: "Direction of the transition effect",
      dependencies: {
        type: {
          value: "slide",
          description: "Direction is only applicable for slide transitions",
        },
      },
      examples: {
        "from-left": "Content slides in from left",
        "from-right": "Content slides in from right",
        "from-top": "Content slides in from top",
        "from-bottom": "Content slides in from bottom",
      },
    },
  },
  syntax: /^!transition(\s+--\w+=[\w.-]+)+$/,
};

/**
 * Implements transition-specific behavior while leveraging base functionality
 */
export class TransitionPropertyAdapter
  extends BasePropertyAdapter
  implements ICompletionProvider, IDiagnosticsProvider
{
  constructor(monaco: Monaco) {
    super(transitionConfig, monaco);
  }

  /**
   * Initialize transition-specific command patterns
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
   * Check if we're in an argument suggestion context
   */
  private isArgumentContext(line: string): boolean {
    return line.includes("!transition") && /--\w*$/.test(line);
  }

  /**
   * Check if we're in a value suggestion context
   */
  private isValueContext(line: string): boolean {
    return line.includes("!transition") && /--\w+=\w*$/.test(line);
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
   * Get argument-specific completions
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
        // Filter out dependent arguments that don't meet their dependencies
        .filter(([key, arg]) => {
          if (!arg.dependencies) return true;
          return Object.entries(arg.dependencies).every(
            ([depKey, dep]) => currentArgs[depKey] === dep.value,
          );
        })
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
   * Get value-specific completions
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
            [argConfig.min?.toString() || "0.1", "Minimum value"],
            [argConfig.max?.toString() || "2.0", "Maximum value"],
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

    if (arg.dependencies) {
      const deps = Object.entries(arg.dependencies)
        .map(([key, dep]) => `- Requires \`${key}=${dep.value}\``)
        .join("\n");
      parts.push("**Dependencies**:", deps);
    }

    return parts.filter(Boolean).join("\n\n");
  }

  /**
   * Get the current argument being typed
   */
  private getCurrentArgument(line: string): string | null {
    const match = line.match(/--(\w+)=\w*$/);
    return match ? match[1] : null;
  }

  /**
   * Provide diagnostics for transition syntax and values
   */
  public provideDiagnostics(
    context: EditorContext,
  ): monaco.editor.IMarkerData[] {
    const { lineContent, position } = context;
    const markers: monaco.editor.IMarkerData[] = [];

    // Only process lines with transitions
    if (!lineContent.includes("!transition")) return markers;

    // Validate basic syntax
    if (!this.config.syntax?.test(lineContent.trim())) {
      markers.push({
        message:
          "Invalid transition syntax. Expected: !transition --type=<value> --duration=<value>",
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

      // Validate dependencies
      if (argConfig.dependencies) {
        Object.entries(argConfig.dependencies).forEach(([depKey, dep]) => {
          if (args[depKey] !== dep.value) {
            markers.push({
              message: `Argument '${key}' requires ${depKey}=${dep.value}`,
              severity: this.monaco.MarkerSeverity.Error,
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: lineContent.indexOf(`--${key}`) + 1,
              endColumn: lineContent.indexOf(`=${value}`) + value.length + 1,
            });
          }
        });
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

    return null;
  }
}
