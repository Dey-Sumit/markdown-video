// core/parsers/base/types.ts
export interface ParsedValue<T> {
  value: T;
  isValid: boolean;
  fallback?: boolean;
  error?: string;
  severity?: "error" | "warning" | "info";
}

export interface ParserOptions {
  runtimeDefaults?: Record<string, any>;
}

export enum ParserIssueCode {
  // Argument errors
  DUPLICATE_ARGUMENT = "DUPLICATE_ARGUMENT",
  MISSING_VALUE = "MISSING_VALUE",
  INVALID_VALUE = "INVALID_VALUE",

  // Validation errors
  REQUIRED_FIELD = "REQUIRED_FIELD",
  PATTERN_MISMATCH = "PATTERN_MISMATCH",
  RANGE_VIOLATION = "RANGE_VIOLATION",
  ENUM_VIOLATION = "ENUM_VIOLATION",

  // Type coercion errors
  INVALID_NUMBER = "INVALID_NUMBER",
  INVALID_BOOLEAN = "INVALID_BOOLEAN",

  // Parse errors
  MALFORMED_INPUT = "MALFORMED_INPUT",
  UNKNOWN_ARGUMENT = "UNKNOWN_ARGUMENT",
}

export interface ParseResult<T> {
  data: T;
  issues: ParserIssue[];
}
export interface ParseLocation {
  line: number;
  column: number;
  length: number;
}

export interface ParserIssue {
  code: ParserIssueCode;
  type: "error" | "warning";
  field?: string;
  message: string;
  value?: any;
}

export interface ValidationRule {
  type: "required" | "pattern" | "range" | "enum" | "custom";
  message: string;
  pattern?: string;
  validate?: (value: any) => boolean;
  severity?: "error" | "warning";
}
