import type { Monaco } from "@monaco-editor/react";
import type { editor, languages } from "monaco-editor";
import { BasePropertyAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/property";
import { textConfig } from "./config";

export class TextPropertyAdapter extends BasePropertyAdapter {
  constructor(monaco: Monaco) {
    super(textConfig, monaco);
  }

  protected initializePatterns(): void {
    this.patterns = [
      {
        match: (context) => this.matchesPattern(context.lineContent),
        priority: 1,
        handle: (context) => this.getPropertyCompletions(context),
      },
      {
        match: (context) => this.isArgumentContext(context.lineContent),
        priority: 2,
        handle: (context) => this.getArgumentCompletions(context),
      },
      {
        match: (context) => this.isValueContext(context.lineContent),
        priority: 3,
        handle: (context) => this.getValueCompletions(context),
      },
    ];
  }

  public provideCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const matchingPattern = this.patterns
      .filter((p) => p.match(context))
      .sort((a, b) => b.priority - a.priority)[0];

    if (matchingPattern) {
      return matchingPattern.handle(context);
    }

    return [];
  }

  public provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    if (!this.matchesPattern(context.lineContent)) return [];
    return this.validateLine(context);
  }
}
