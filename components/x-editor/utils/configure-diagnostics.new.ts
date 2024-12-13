// utils/editor/linter/configure-diagnostics.ts

import type { Monaco } from "@monaco-editor/react";
import { EditorLinter } from "./linter";
import type { editor } from "monaco-editor";

export const configureDiagnostics = (
  monaco: Monaco,
  model: editor.ITextModel,
) => {
  const linter = new EditorLinter(monaco, model);

  const runDiagnostics = () => {
    const errors = linter.lint();

    const markers = errors.map((error) => ({
      severity:
        error.severity === "error"
          ? monaco.MarkerSeverity.Error
          : monaco.MarkerSeverity.Warning,
      startLineNumber: error.line,
      startColumn: error.startColumn,
      endLineNumber: error.line,
      endColumn: error.endColumn,
      message: error.message,
      code: error.code,
    }));

    // Set markers directly using Monaco's marker service
    monaco.editor.setModelMarkers(model, "markdown", markers);
  };

  const disposable = model.onDidChangeContent(() => {
    runDiagnostics();
  });

  runDiagnostics();
  return disposable;
};
