// utils/editor/linter/index.ts
import { sceneRules } from "./rules/scene-rules";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type {
  LinterError,
  LinterContext,
  LinterRule,
} from "../../types.x-editor";
import { propertyRules } from "./rules/property-rules";

const codeBlockRules: LinterRule[] = [
  {
    validate: ({ line, lineNumber }) => {
      if (!line.trimStart().startsWith("```")) return null;

      const match = line.match(/^```(\w+)(!?)(\s*)(!?)/);
      if (!match) return null;

      const [, lang, , whitespace, exclamation] = match;
      const hasSpaceWithoutBang = whitespace && !exclamation;

      if ((!whitespace && exclamation) || !exclamation || hasSpaceWithoutBang) {
        return {
          message: "Code block requires a space followed by ! after language",
          severity: "error",
          line: lineNumber,
          startColumn: line.indexOf(lang) + lang.length + 1,
          endColumn: line.length,
          code: "invalid-code-block-format", // Unique code for this error, this will be used for code actions (quick fixes)
        };
      }

      return null;
    },
  },
];
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

      if (line.trimStart().startsWith("```")) {
        errors.push(...this.validateCodeBlock(context));
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

  private validateCodeBlock(context: LinterContext): LinterError[] {
    return codeBlockRules.reduce((errors: LinterError[], rule) => {
      const error = rule.validate(context);
      if (error) errors.push(error);
      return errors;
    }, []);
  }
}
