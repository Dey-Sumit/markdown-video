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
