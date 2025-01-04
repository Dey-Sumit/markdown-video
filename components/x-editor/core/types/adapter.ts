// src/core/types/adapter.ts
import type { Position, IRange, editor, languages } from "monaco-editor";

interface BaseAdapter {
  readonly id: string;
  readonly pattern: CommandPattern;

  provideCompletions(context: CommandContext): languages.CompletionItem[];
  provideDiagnostics(context: CommandContext): editor.IMarkerData[];
  provideHover?(context: CommandContext): languages.Hover | null;

  initialize?(): void;
  dispose?(): void;
}

interface CommandContext {
  lineContent: string;
  position: Position;
  model: editor.ITextModel;
  wordRange?: IRange;
  inCodeBlock?: boolean;
}

interface CommandPattern {
  prefix: string | string[];
  leadingSymbols?: string[];
  type: "scene" | "property" | "inline";
}

export type { BaseAdapter, CommandContext, CommandPattern };
