// types/index.ts
import * as monaco from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

/**
 * Common context shared across all providers
 */
export interface EditorContext {
  lineContent: string;
  position: monaco.Position;
  model: editor.ITextModel;
  wordRange?: monaco.IRange;
}

/**
 * Core interfaces for different provider types
 * Properties can implement only what they need
 */
export interface ICompletionProvider {
  provideCompletions(context: EditorContext): monaco.languages.CompletionItem[];
}

export interface IDiagnosticsProvider {
  provideDiagnostics(context: EditorContext): editor.IMarkerData[];
}

export interface IHoverProvider {
  provideHover(context: EditorContext): monaco.languages.Hover | null;
}

/**
 * Pattern matching for command recognition
 */
export interface CommandPattern {
  /** Function to test if this pattern matches the current context */
  match: (context: EditorContext) => boolean;
  /** Priority of this pattern (higher numbers take precedence) */
  priority: number;
  /** Handler function to process the matched pattern */
  handle: (context: EditorContext) => monaco.languages.CompletionItem[];
}

/**
 * Configuration for a property's argument
 */
export interface PropertyArgument {
  name: string;
  type: "string" | "number" | "boolean";
  description?: string;
  values?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  examples?: Record<string, string>;
  // Custom validation function
  validate?: (value: string) => string | null;
  // Dependencies on other arguments
  dependencies?: {
    [key: string]: {
      value: string;
      values?: string[]; // Allowed values when dependency is met
      description?: string;
    };
  };
}

/**
 * Main configuration for a property
 */
export interface PropertyConfig {
  name: string;
  prefix: string | string[];
  description: string;
  arguments: Record<string, PropertyArgument>;
  // Custom syntax validation
  syntax?: RegExp;
  examples?: Record<string, string>;
  // Contextual suggestions based on document state
  contextual?: {
    suggestions?: boolean;
    validation?: boolean;
  };
}

/**
 * Represents a diagnostic error or warning
 */
export interface Diagnostic {
  message: string;
  severity: "error" | "warning" | "info";
  line: number;
  startColumn: number;
  endColumn: number;
  code?: string;
  source?: string;
}

/**
 * Interface that all property adapters must implement
 */
export interface IPropertyAdapter {
  /** Unique identifier for this property */
  readonly name: string;
  /** Property configuration */
  readonly configuration: Readonly<PropertyConfig>;
  /** Initialize the adapter */
  initialize?(): void;
  /** Cleanup any resources */
  dispose?(): void;
}

/**
 * Plugin registration options
 */
export interface PluginOptions {
  /** Whether to run diagnostics on initialization */
  runInitialDiagnostics?: boolean;
  /** Custom trigger characters for completion */
  triggerCharacters?: string[];
  /** Debounce time for diagnostics (ms) */
  diagnosticsDebounce?: number;
}
