import type { AdapterConfig, ArgumentConfig } from "../types/adapter.type";
import type {
  ParsedValue,
  ParserResult,
  ParserOptions,
} from "../types/parser.type";

export class ComponentParser<T> {
  protected options?: ParserOptions;

  constructor(protected config: AdapterConfig) {
    this.options = {};
  }

  private validateValue(
    value: any,
    argConfig: ArgumentConfig,
  ): { error?: string; severity?: string } | null {
    if (!argConfig.validations) return null;

    for (const rule of argConfig.validations) {
      let isValid = true;

      switch (rule.type) {
        case "required":
          isValid = value !== undefined && value !== "";
          break;
        case "range":
          isValid = rule.validate?.(value) ?? true;
          break;
        case "enum":
          isValid = rule.validate?.(value) ?? true;
          break;
        case "custom":
          isValid = rule.validate?.(value) ?? true;
          break;
      }

      if (!isValid) {
        return {
          error: rule.message,
          severity: rule.severity,
        };
      }
    }

    return null;
  }

  parse(input: string): ParserResult<T> {
    const errors: ParserResult<T>["errors"] = [];
    const data = {} as T;

    // Set defaults for all fields first
    Object.entries(this.config.arguments).forEach(([key, argConfig]) => {
      if (this.options?.runtimeDefaults?.[key] !== undefined) {
        data[key] = this.options.runtimeDefaults[key];
      } else if (argConfig.default !== undefined) {
        data[key] = argConfig.default;
      }
    });

    // Parse input if not empty
    if (input.trim()) {
      const matches = input.matchAll(/--(\w+)=(?:"([^"]*?)"|([^\s]*))/g);

      for (const [, key, quotedValue, unquotedValue] of matches) {
        const value = quotedValue !== undefined ? quotedValue : unquotedValue;
        const argConfig = this.config.arguments[key];

        if (!argConfig) continue;

        let parsedValue: any = value;

        // Type conversion
        if (argConfig.type === "number") {
          parsedValue = Number(value);
          if (isNaN(parsedValue)) {
            errors.push({
              field: key,
              value,
              error: `Invalid number value: ${value}`,
              severity: "error",
            });
            continue;
          }
        }

        // Validation
        const validationResult = this.validateValue(parsedValue, argConfig);
        if (validationResult) {
          errors.push({
            field: key,
            value,
            error: validationResult.error as string,
            severity: validationResult.severity as "error" | "warning" | "info",
          });

          // For required fields, use default value
          if (argConfig.required) {
            parsedValue = argConfig.default;
          } else {
            // For optional fields that failed validation, skip setting the value
            continue;
          }
        }

        data[key] = parsedValue;
      }
    }

    // Check for missing required fields
    Object.entries(this.config.arguments).forEach(([key, argConfig]) => {
      if (argConfig.required && data[key] === undefined) {
        errors.push({
          field: key,
          error: `${key} is required`,
          severity: "error",
        });
        data[key] = argConfig.default;
      }
    });

    return { data, errors };
  }

  parseArray(inputs: string[]): ParserResult<T[]> {
    const results = inputs.map((input, index) => {
      const result = this.parse(input);
      return {
        ...result,
        errors: result.errors.map((error) => ({
          ...error,
          index,
          field: `[${index}].${error.field}`,
        })),
      };
    });

    return {
      data: results.map((r) => r.data),
      errors: results.flatMap((r) => r.errors),
    };
  }
}

export default ComponentParser;
