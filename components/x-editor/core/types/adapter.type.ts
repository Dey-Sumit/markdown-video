// src/core/types/adapter.ts
import type { Position, IRange, editor, languages } from "monaco-editor";

interface BaseAdapter {
  readonly config: AdapterConfig;
  matchesPattern(lineContent: string): boolean;
  provideCompletions(context: CommandContext): languages.CompletionItem[];
  provideDiagnostics(context: CommandContext): editor.IMarkerData[];
  provideHover(context: CommandContext): languages.Hover | null;

  initialize?(): void;
  initialize?(): void; // Notice no parameters
  dispose?(): void;
}

export interface MonacoMarkdownString {
  value: string;
  isTrusted?: boolean;
}
interface ValidationRule {
  type: "required" | "pattern" | "range" | "enum" | "custom";
  message: string;
  pattern?: string;
  validate?: (value: any) => boolean;
  severity?: "error" | "warning";
}

export interface ArgCompletionInfo {
  key: string;
  arg: ArgumentConfig;
  isRequired: boolean;
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
  validations?: ValidationRule[];
}
export interface AdapterConfig {
  id: string;
  pattern: CommandPattern;
  template: string;
  arguments: Record<string, ArgumentConfig>;
  description?: string;
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
  pattern: string; // Regex pattern
  leadingSymbols?: string[];
}

export type { BaseAdapter, CommandContext };
