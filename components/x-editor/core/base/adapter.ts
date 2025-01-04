// components/x-editor/core/base/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position, IRange } from "monaco-editor";
import type {
  BaseAdapter,
  CommandContext,
  CommandPattern,
} from "../types/adapter";

/**
 * Abstract base adapter that provides core functionality for editor plugins.
 * Handles pattern matching, range creation, and defines required provider interfaces.
 */
export abstract class AbstractAdapter implements BaseAdapter {
  /**
   * Creates a new adapter instance
   * @param monaco - Monaco editor instance
   * @param id - Unique identifier for this adapter
   * @param pattern - Command pattern configuration for matching
   */
  constructor(
    protected readonly monaco: Monaco,
    public readonly id: string,
    public readonly pattern: CommandPattern,
  ) {}

  /**
   * Checks if a line matches this adapter's command pattern
   * @param lineContent - Current line content to check
   * @returns True if line matches adapter's pattern
   */
  protected matchesPattern(lineContent: string): boolean {
    const trimmed = lineContent.trimStart();
    const hasLeadingSymbol =
      !this.pattern.leadingSymbols?.length ||
      this.pattern.leadingSymbols.some((symbol) => trimmed.startsWith(symbol));

    const prefixes = Array.isArray(this.pattern.prefix)
      ? this.pattern.prefix
      : [this.pattern.prefix];

    return (
      hasLeadingSymbol && prefixes.some((prefix) => trimmed.includes(prefix))
    );
  }

  /**
   * Creates a Monaco editor range with proper bounds checking
   * @param position - Current cursor position
   * @param startColumn - Start column of range
   * @param endColumn - End column of range
   * @returns IRange object with validated bounds
   */
  protected createRange(
    position: Position,
    startColumn: number,
    endColumn: number,
  ): IRange {
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: Math.max(1, startColumn),
      endColumn: Math.max(startColumn, endColumn),
    };
  }

  /**
   * Provides completion items for the current context
   * @param context - Current editor context
   */
  abstract provideCompletions(
    context: CommandContext,
  ): languages.CompletionItem[];

  /**
   * Provides diagnostic markers for the current context
   * @param context - Current editor context
   */
  abstract provideDiagnostics(context: CommandContext): editor.IMarkerData[];

  /**
   * Optional hover provider implementation
   * @param context - Current editor context
   */
  provideHover?(context: CommandContext): languages.Hover | null {
    return null;
  }

  /** Called when adapter is initialized */
  initialize?(): void {}

  /** Called when adapter is disposed */
  dispose?(): void {}
}
