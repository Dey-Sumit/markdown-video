// components/x-editor/core/base/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, languages, Position, IRange } from "monaco-editor";
import type {
  BaseAdapter,
  CommandContext,
  CommandPattern,
} from "../types/adapter";

/**
 * Abstract base adapter for editor plugins providing core functionality for:
 * - Pattern matching for commands
 * - Argument parsing and validation
 * - Completion suggestions
 * - Documentation generation
 *
 * @example
 * class MyAdapter extends AbstractAdapter {
 *   constructor(monaco: Monaco) {
 *     super(monaco, "myPlugin", { prefix: "!", type: "inline" });
 *   }
 * }
 */
export abstract class AbstractAdapter implements BaseAdapter {
  /**
   * Initializes adapter with Monaco instance and configuration
   *
   * @example
   * constructor(monaco) {
   *   super(monaco, "myPlugin", {
   *     prefix: "!",
   *     type: "inline",
   *     leadingSymbols: ["//"]
   *   });
   * }
   */
  constructor(
    protected readonly monaco: Monaco,
    public readonly id: string,
    public readonly pattern: CommandPattern,
  ) {}

  /**
   * Checks if line matches configured pattern with leading symbols and prefixes
   * Handles whitespace flexibility in pattern matching
   *
   * @example
   * -> With config: { leadingSymbols: ["##"], prefix: "!!" }
   * "##    !!"   ✓ (whitespace allowed)
   * "  ##  !!"   ✓ (leading whitespace allowed)
   * "!!##"       ✗ (wrong order)
   * "##!!"       ✓ (no whitespace required)
   *
   * -> With config: { leadingSymbols: ["##"], prefix: ["!", "!!"] }
   * "##    !"    ✓ (matches first prefix)
   * "##    !!"   ✓ (matches second prefix)
   * "#!"         ✗ (invalid leading symbol)
   */
  protected matchesPattern(lineContent: string): boolean {
    const leadingSymbols = this.pattern.leadingSymbols ?? [];
    const prefixes = Array.isArray(this.pattern.prefix)
      ? this.pattern.prefix
      : [this.pattern.prefix];

    const pattern = new RegExp(
      `^\\s*(${leadingSymbols.join("|")})\\s*(${prefixes.join("|")})`,
    );
    return pattern.test(lineContent);
  }

  /*   protected matchesPattern(lineContent: string): boolean {
    const trimmed = lineContent.trimStart(); // Handles "##     !!"
    const hasLeadingSymbol = this.pattern.leadingSymbols.some((symbol) =>
      trimmed.startsWith(symbol),
    );

    return hasLeadingSymbol && trimmed.includes(this.pattern.prefix);
  } */

  /**
   * Creates validated Monaco editor range
   * Ensures start/end columns are valid and non-negative
   *
   * @example
   * createRange(
   *   {lineNumber: 1, column: 5}, // position
   *   3,  // start
   *   8   // end
   * ) // Range{1,3,1,8}
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
   * Extracts argument names from command line
   * Matches arguments in format --name=value
   *
   * @example
   * parseArguments("--title=test --duration=5")
   * -> Set{"title", "duration"}
   */
  protected parseArguments(line: string): Set<string> {
    const args = new Set<string>();
    const matches = line.matchAll(/--(\w+)=/g);
    for (const match of matches) {
      args.add(match[1]);
    }
    return args;
  }

  /**
   * Validates proper argument spacing
   * Ensures whitespace between arguments and before values
   *
   * @example
   * -> Valid:
   * "## !!scene --title=test --duration=5"
   * -> Invalid (no space):
   * "## !!scene --title=test--duration=5"
   */
  protected requiresWhitespace(
    lineContent: string,
    position: Position,
  ): boolean {
    const textUntilCursor = lineContent.substring(0, position.column);

    // For value completion
    if (/--(\w+)=\s*$/.test(textUntilCursor)) {
      const lastArgMatch = textUntilCursor.match(/.*?--\w+=[^-]*$/);
      return lastArgMatch ? /\s--\w+=[^-]*$/.test(lastArgMatch[0]) : false;
    }

    // For argument completion
    return /\s--\w*$/.test(textUntilCursor);
  }

  /**
   * Checks if cursor is in value completion context
   * Validates whitespace and argument format
   *
   * @example
   * -> Triggers completion:
   * "## !!scene --title="
   * "## !!scene --title= "
   * -> No completion:
   * "## !!scene --title=test--"
   */
  protected isValueContext(lineContent: string, position: Position): boolean {
    const textUntilCursor = lineContent.substring(0, position.column);
    const matchesWhitespace = this.requiresWhitespace(lineContent, position);
    const matchesValue = /--(\w+)=\s*$/.test(textUntilCursor);

    console.log("Value Context Check:", {
      textUntilCursor,
      matchesWhitespace,
      matchesValue,
    });

    return matchesWhitespace && matchesValue;
  }

  /**
   * Creates formatted documentation for completions
   * Filters empty sections and joins with newlines
   *
   * @example
   * createCompletionDoc([
   *   "### Title",
   *   "", // filtered
   *   "Description"
   * ]) // "### Title\nDescription"
   */
  protected createCompletionDoc(sections: string[]): {
    value: string;
    isTrusted: boolean;
  } {
    return {
      value: sections.filter(Boolean).join("\n"),
      isTrusted: true,
    };
  }

  /**
   * Required completion provider implementation
   * Should handle different completion contexts:
   * - Command completion (e.g. !!scene)
   * - Argument completion (e.g. --title)
   * - Value completion (e.g. --title=)
   *
   * @example
   * provideCompletions({lineContent: "## !!", position}) {
   *   if (isSceneStart) return sceneCompletions;
   *   if (isValueContext) return valueCompletions;
   *   return argCompletions;
   * }
   */
  abstract provideCompletions(
    context: CommandContext,
  ): languages.CompletionItem[];

  /**
   * Required diagnostics provider implementation
   * Should validate:
   * - Command syntax
   * - Required arguments
   * - Argument values
   * - Argument spacing
   *
   * @example
   * provideDiagnostics({lineContent: "## !!scene"}) {
   *   return [{
   *     message: "Missing required argument: duration",
   *     severity: MarkerSeverity.Error
   *   }];
   * }
   */
  abstract provideDiagnostics(context: CommandContext): editor.IMarkerData[];

  /**
   * Optional hover provider implementation
   * Provides documentation on hover over:
   * - Commands
   * - Arguments
   * - Values
   *
   * @example
   * provideHover({lineContent: "## !!scene"}) {
   *   return {
   *     contents: [{value: "Creates new scene block"}]
   *   };
   * }
   */
  provideHover?(context: CommandContext): languages.Hover | null {
    return null;
  }

  /** Called when adapter is initialized */
  initialize?(): void {}

  /**
   * Optional initialization hook
   * Called when adapter is registered
   */
  initialize?(): void;

  /**
   * Optional cleanup hook
   * Called when adapter is unregistered
   */
  dispose?(): void {}
}
