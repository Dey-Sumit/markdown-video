import type { Monaco } from "@monaco-editor/react";
import type { editor, languages } from "monaco-editor";
import { BasePropertyAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/property";
import { transitionConfig } from "./config";

export class TransitionPropertyAdapter extends BasePropertyAdapter {
  constructor(monaco: Monaco) {
    super(transitionConfig, monaco);
  }

  /**
   * Initialize patterns specific to transition
   */
  protected initializePatterns(): void {
    this.patterns = [
      // Basic property completion
      {
        match: (context) => this.matchesPattern(context.lineContent),
        priority: 1,
        handle: (context) => this.getPropertyCompletions(context),
      },
      // Argument completion
      {
        match: (context) => this.isArgumentContext(context.lineContent),
        priority: 2,
        handle: (context) => this.getArgumentCompletions(context),
      },
      // Value completion
      {
        match: (context) => this.isValueContext(context.lineContent),
        priority: 3,
        handle: (context) => this.getValueCompletions(context),
      },
    ];
  }

  /**
   * Provide completions for transition properties
   */
  public provideCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    // Use base pattern matching
    const matchingPattern = this.patterns
      .filter((p) => p.match(context))
      .sort((a, b) => b.priority - a.priority)[0];

    if (matchingPattern) {
      return matchingPattern.handle(context);
    }

    return [];
  }

  /**
   * Provide diagnostics for transition properties
   */
  public provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    if (!this.matchesPattern(context.lineContent)) return [];

    // Use base validation
    return this.validateLine(context);
  }
}
