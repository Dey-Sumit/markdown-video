import { EDITOR_PROPERTIES } from "@/components/x-editor/config/scene-properties.config";
import type {
  LinterContext,
  LinterError,
} from "@/components/x-editor/types.x-editor";

interface Rule {
  code: string;
  validate: (context: LinterContext) => LinterError | null;
}
export const sceneRules: Rule[] = [
  {
    code: "SBV001",
    validate: (context: LinterContext): LinterError | null => {
      const { line, lineNumber } = context;
      const property = EDITOR_PROPERTIES["scene"];

      const requiredArgs = Object.entries(property.arguments)
        .filter(([_, arg]) => arg.required)
        .map(([key]) => key);

      for (const arg of requiredArgs) {
        if (!line.includes(`--${arg}=`)) {
          return {
            line: lineNumber,
            startColumn: 1,
            endColumn: line.length,
            message: `Scene must have required argument --${arg}`,
            severity: "error",
            code: "SBV001",
          };
        }
      }
      return null;
    },
  },
];
