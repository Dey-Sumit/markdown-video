import type {
  LinterContext,
  LinterError,
  SceneProperty,
} from "@/components/x-editor/types.x-editor";

interface ArgumentRule {
  code: string;
  validate: (
    context: LinterContext,
    property: SceneProperty,
  ) => LinterError | null;
}
export const argumentRules: ArgumentRule[] = [
  {
    code: "ARG001",
    validate: ({ line, lineNumber }, property) => {
      const args = line.match(/--(\w+)=([^\s]+)/g) || [];

      for (const arg of args) {
        const [key, value] = arg.replace("--", "").split("=");
        const argConfig = property.arguments[key];

        // Find exact position of this argument
        const argStart = line.indexOf(`--${key}=`);
        const valueStart = argStart + key.length + 3; // 3 for "--" and "="
        const valueEnd = valueStart + value.length;

        if (!argConfig) {
          return {
            line: lineNumber,
            startColumn: argStart,
            endColumn: argStart + arg.length,
            message: `Unknown argument "${key}" for !${property.name}`,
            severity: "error",
            code: "ARG001",
          };
        }

        if (argConfig.type === "number" && isNaN(Number(value))) {
          return {
            line: lineNumber,
            startColumn: valueStart,
            endColumn: valueEnd,
            message: `Value must be a number for argument "${key}"`,
            severity: "error",
            code: "ARG001",
          };
        }

        if (argConfig.values && !argConfig.values.includes(value)) {
          return {
            line: lineNumber,
            startColumn: valueStart,
            endColumn: valueEnd,
            message: `Invalid value for "${key}". Allowed values: ${argConfig.values.join(", ")}`,
            severity: "error",
            code: "ARG001",
          };
        }
      }
      return null;
    },
  },
];
