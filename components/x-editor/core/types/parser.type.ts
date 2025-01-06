// core/parsers/base/types.ts
export interface ParsedValue<T> {
  value: T;
  isValid: boolean;
  fallback?: boolean;
  error?: string;
  severity?: "error" | "warning" | "info";
}
export interface ParserResult<T> {
  data: T;
  errors: Array<{
    field: string;
    value: string;
    error: string;
    fallbackUsed?: boolean;
    severity: "error" | "warning" | "info";
  }>;
}

export interface ParserOptions {
  runtimeDefaults?: Record<string, any>;
}
