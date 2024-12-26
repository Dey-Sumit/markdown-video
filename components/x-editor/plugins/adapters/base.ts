// adapters/base.ts
import * as monaco from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import {
  type PropertyConfig,
  type EditorContext,
  type CommandPattern,
} from "../types";

/**
 * Base class for property adapters with common functionality
 */
abstract class BasePropertyAdapter {
  protected patterns: CommandPattern[] = [];

  constructor(
    protected readonly config: PropertyConfig,
    protected readonly monaco: Monaco,
  ) {
    this.initializePatterns();
  }

  /**
   * Get the property name
   */
  public get name(): string {
    return this.config.name;
  }

  /**
   * Get the property configuration
   */
  public get configuration(): Readonly<PropertyConfig> {
    return this.config;
  }

  /**
   * Initialize command patterns for this property
   * Override this to add custom patterns
   */
  protected initializePatterns(): void {
    // Add default patterns
    this.patterns.push({
      match: (context) => this.isPropertyStart(context.lineContent),
      priority: 1,
      handle: (context) => this.getPropertyCompletions(context),
    });
  }

  /**
   * Create a Monaco range object, handling edge cases
   */
  protected createRange(
    lineNumber: number,
    startColumn: number,
    endColumn: number,
  ): monaco.IRange {
    return {
      startLineNumber: lineNumber,
      endLineNumber: lineNumber,
      startColumn: Math.max(1, startColumn), // Ensure column is never less than 1
      endColumn: Math.max(startColumn, endColumn),
    };
  }

  /**
   * Check if line starts with property prefix
   */
  protected isPropertyStart(line: string): boolean {
    const prefixes = Array.isArray(this.config.prefix)
      ? this.config.prefix
      : [this.config.prefix];

    const trimmed = line.trimStart();
    return prefixes.some(
      (prefix) =>
        trimmed.startsWith(`${prefix}${this.config.name}`) ||
        trimmed.startsWith(`${prefix}`),
    );
  }

  /**
   * Parse arguments from a command line
   */
  protected parseArguments(line: string): Record<string, string> {
    const args: Record<string, string> = {};
    const matches = line.matchAll(/--(\w+)=([\w.-]+)/g);

    for (const match of matches) {
      args[match[1]] = match[2];
    }

    return args;
  }

  /**
   * Get basic property suggestions
   */
  protected getPropertyCompletions(
    context: EditorContext,
  ): monaco.languages.CompletionItem[] {
    const { position } = context;

    return [
      {
        label: this.config.name,
        kind: this.monaco.languages.CompletionItemKind.Property,
        documentation: {
          value: this.generatePropertyDocumentation(),
          isTrusted: true,
        },
        insertText: `${this.config.name} --`,
        range:
          context.wordRange ||
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
   * Generate markdown documentation for property
   */
  protected generatePropertyDocumentation(): string {
    const argsList = Object.entries(this.config.arguments)
      .map(([key, arg]) => {
        const required = arg.required ? "(required)" : "(optional)";
        return `- \`--${key}\` ${required}: ${arg.description || "No description"}`;
      })
      .join("\n");

    return [
      `### ${this.config.name}`,
      this.config.description || "",
      "#### Arguments:",
      argsList,
    ].join("\n\n");
  }
}

export default BasePropertyAdapter;
