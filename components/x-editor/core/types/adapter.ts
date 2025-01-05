// src/core/types/adapter.ts
import type { Position, IRange, editor, languages } from "monaco-editor";

interface BaseAdapter {
  readonly config: AdapterConfig;

  provideCompletions(context: CommandContext): languages.CompletionItem[];
  provideDiagnostics(context: CommandContext): editor.IMarkerData[];
  provideHover?(context: CommandContext): languages.Hover | null;

  initialize?(): void;
  dispose?(): void;
}
export interface ArgumentConfig {
  name: string;
  type: "string" | "number" | "boolean";
  description?: string;
  required?: boolean;
  values?: string[]; // For enum-like values
  examples?: Record<string, string>; // Value -> Description

  // For number type
  min?: number;
  max?: number;

  // Default value
  default?: string | number | boolean;
}
export interface AdapterConfig {
  id: string;
  pattern: CommandPattern;
  template: string;
  arguments: Record<string, ArgumentConfig>;
}
interface CommandContext {
  lineContent: string;
  position: Position;
  model: editor.ITextModel;
  wordRange?: IRange;
  inCodeBlock?: boolean;
}

interface CommandPattern {
  type: "directive" | "component" | "codeComponent"; 
  prefix: string | string[];
  leadingSymbols?: string[];
}

export type { BaseAdapter, CommandContext, CommandPattern };
