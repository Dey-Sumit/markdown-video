// utils/editor/linter/index.ts
import { sceneRules } from "./rules/scene-rules";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { LinterError, LinterContext } from "../../types.x-editor";
import { propertyRules } from "./rules/property-rules";

export class EditorLinter {
  private monaco: Monaco;
  private model: editor.ITextModel;

  constructor(monaco: Monaco, model: editor.ITextModel) {
    this.monaco = monaco;
    this.model = model;
  }

  /**
   * Main lint method that runs all validations
   */
  public lint(): LinterError[] {
    const errors: LinterError[] = [];
    const lines = this.model.getLinesContent();

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const context: LinterContext = {
        content: this.model.getValue(),
        lineNumber,
        line,
      };

      // Run scene validations
      if (line.trimStart().startsWith("## !!scene")) {
        errors.push(...this.validateScene(context));
      }

      // Run property validations
      if (line.trimStart().startsWith("!")) {
        errors.push(...this.validateProperty(context));
      }
    });

    return errors;
  }

  /**
   * Validates a scene declaration line
   */
  private validateScene(context: LinterContext): LinterError[] {
    return sceneRules.reduce((errors: LinterError[], rule) => {
      const error = rule.validate(context);
      if (error) errors.push(error);
      return errors;
    }, []);
  }

  /**
   * Validates a property line
   */
  private validateProperty(context: LinterContext): LinterError[] {
    return propertyRules.reduce((errors: LinterError[], rule) => {
      const error = rule.validate(context);
      if (error) errors.push(error);
      return errors;
    }, []);
  }
}
