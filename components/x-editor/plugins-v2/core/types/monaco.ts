// src/plugins-v2/core/types/monaco.ts

import type { editor, languages } from "monaco-editor";
import type { CommandContext } from "./property";

/**
 * Pattern for matching and handling command suggestions
 */
export interface CommandPattern {
  /** Function to test if this pattern matches the current context */
  match: (context: CommandContext) => boolean;
  /** Priority of this pattern (higher numbers take precedence) */
  priority: number;
  /** Handler function to process the matched pattern */
  handle: (context: CommandContext) => languages.CompletionItem[];
}

/**
 * Provider interface for completion suggestions
 */
export interface ICompletionProvider {
  /**
   * Provide completion items based on context
   */
  provideCompletions(context: CommandContext): languages.CompletionItem[];
}

/**
 * Provider interface for diagnostics
 */
export interface IDiagnosticsProvider {
  /**
   * Provide diagnostic markers based on context
   */
  provideDiagnostics(context: CommandContext): editor.IMarkerData[];
}

/**
 * Provider interface for hover information
 */
export interface IHoverProvider {
  /**
   * Provide hover information based on context
   */
  provideHover(context: CommandContext): languages.Hover | null;
}

/**
 * Core interfaces that property adapters can implement
 */
export interface IPropertyAdapter {
  /** Property name */
  readonly name: string;
  /** Initialize the adapter */
  initialize?(): void;
  /** Cleanup resources */
  dispose?(): void;
}
