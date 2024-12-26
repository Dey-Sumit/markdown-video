import type { editor, IRange, Position } from "monaco-editor";

/**
 * Type of property value
 */
export type PropertyValueType = "string" | "number" | "boolean";

/**
 * Context for command processing
 */
export interface CommandContext {
  lineContent: string;
  position: Position;
  model: editor.ITextModel;
  wordRange?: IRange;
}
/**
 * Base configuration for a property argument
 */
export interface PropertyArgument {
  name: string;
  type: PropertyValueType;
  description?: string;
  required?: boolean;
  values?: string[]; // Predefined values
  min?: number; // For number type
  max?: number; // For number type
  examples?: Record<string, string>; // Example values with descriptions
  // Add runtime processors later
  // processor?: (value: string) => any;
}

/**
 * Command type - defines how the property appears in markdown
 */
export type CommandType = "inline" | "scene" | "comment";

/**
 * Configuration for how a property is recognized in text
 */
export interface PropertyPattern {
  type: CommandType;
  prefix: string | string[]; // e.g., '!' or '!!'
  leadingSymbols?: string[]; // e.g., '##' for scenes, '//' for comments // TODO , need other comments syntax also
}

/**
 * Complete property configuration
 */
export interface PropertyConfig {
  name: string;
  pattern: PropertyPattern;
  description: string;
  arguments: Record<string, PropertyArgument>;
  examples?: Record<string, string>;
}
