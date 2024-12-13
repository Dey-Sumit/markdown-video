import { EDITOR_PROPERTIES } from "@/components/x-editor/config/scene-properties.config";
import type {
  LinterContext,
  LinterError,
  SceneProperty,
} from "@/components/x-editor/types.x-editor";
import { argumentRules } from "./argument-rules";

interface Rule {
  code: string;
  validate: (context: LinterContext) => LinterError | null;
}

export const propertyRules: Rule[] = [
  {
    code: "PV001",
    validate: ({ line, lineNumber }: LinterContext): LinterError | null => {
      if (!line.trimStart().startsWith("!")) return null;

      const propertyMatch = line.match(/^!(\w+)/);
      if (!propertyMatch) return null;

      const propertyName = propertyMatch[1];
      if (!EDITOR_PROPERTIES[propertyName]) {
        return {
          line: lineNumber,
          startColumn: 1,
          endColumn: propertyMatch[0].length + 1,
          message: `Unknown property "!${propertyName}"`,
          severity: "error",
          code: "PV001",
        };
      }
      return null;
    },
  },
  {
    code: "PV002",
    validate: ({ line, lineNumber }: LinterContext): LinterError | null => {
      let propertyName: string;
      let property: SceneProperty;

      // Check for scene
      if (line.startsWith("## !!scene")) {
        propertyName = "scene";
        property = EDITOR_PROPERTIES["scene"];
      } else {
        // Check for other properties
        const propertyMatch = line.match(/^!(\w+)/);
        if (!propertyMatch) return null;
        propertyName = propertyMatch[1];
        property = EDITOR_PROPERTIES[propertyName];
      }

      if (!property) return null;

      // Check required arguments
      const requiredArgs = Object.entries(property.arguments)
        .filter(([_, arg]) => arg.required)
        .map(([key]) => key);
      console.log({ requiredArgs });

      for (const arg of requiredArgs) {
        if (!line.includes(`--${arg}=`)) {
          return {
            line: lineNumber,
            startColumn: 1,
            endColumn: line.length,
            message: `Missing required argument "--${arg}" for ${propertyName}`,
            severity: "error",
            code: "PV002",
          };
        }
      }
      return null;
    },
  },
  {
    code: "PV003",
    validate: (context: LinterContext): LinterError | null => {
      const { line, lineNumber } = context;
      const propertyMatch = line.match(/^!(\w+)/);
      if (!propertyMatch) return null;

      const propertyName = propertyMatch[1];
      const property = EDITOR_PROPERTIES[propertyName];
      if (!property) return null;

      // Run all argument rules
      for (const rule of argumentRules) {
        const error = rule.validate(context, property);
        if (error) return error;
      }

      return null;
    },
  },
];
