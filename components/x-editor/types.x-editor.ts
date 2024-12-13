import { editor, MarkerSeverity } from "monaco-editor";

export interface ValidationIssue {
  code: string;
  message: string;
  line: number;
  severity: MarkerSeverity;
}

export interface MarkerData extends editor.IMarkerData {
  code?: string;
}

export interface ValidationContext {
  model: editor.ITextModel;
  markers: MarkerData[];
  issues: Map<string, ValidationIssue[]>;
  hasErrors: boolean;
  hasWarnings: boolean;
  usedStepNames: Set<string>;
}

export interface ValidationResult {
  markers: MarkerData[];
  issues: Map<string, ValidationIssue[]>;
  hasErrors: boolean;
  hasWarnings: boolean;
}
export interface MarkerData extends editor.IMarkerData {
  code?: string;
}

// types/x-editor.ts
interface ScenePropertyArgument {
  name: string;
  type: "string" | "number";
  required?: boolean;
  values?: string[];
  description?: string;
  examples?: Record<string, string>;
}

export interface SceneProperty {
  name: string;
  prefix: "!!" | "!"; // !! for scenes, ! for other properties
  arguments: Record<string, ScenePropertyArgument>;
  description?: string;
}

// types/linter.ts
export interface LinterError {
  line: number; // Line where error occurs
  startColumn: number; // Start position
  endColumn: number; // End position
  message: string; // Error message
  severity: "error" | "warning";
  code: string; // Error code for reference
}

export interface LinterContext {
  content: string; // Full document content
  lineNumber: number; // Current line being checked
  line: string; // Current line content
}
