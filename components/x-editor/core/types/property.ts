// components/x-editor/core/types/property.ts
import type { CommandPattern } from "./adapter";

/**
 * Valid property value types
 */
type PropertyValueType = "string" | "number" | "boolean";

/**
 * Configuration for a property argument
 */
interface PropertyArgument {
  name: string;
  type: PropertyValueType;
  description?: string;
  required?: boolean;
  values?: string[];
  min?: number;
  max?: number;
  examples?: Record<string, string>;
}

/**
 * Complete property configuration
 */
interface PropertyConfig {
  name: string;
  pattern: CommandPattern;
  description: string;
  arguments: Record<string, PropertyArgument>;
  examples?: Record<string, string>;
}

export type { PropertyValueType, PropertyArgument, PropertyConfig };
