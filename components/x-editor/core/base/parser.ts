import type { AdapterConfig, ArgumentConfig } from "../types/adapter.type";
import {
  ParserIssueCode,
  type ParseLocation,
  type ParseResult,
  type ParserIssue,
  type ValidationRule,
} from "../types/parser.type";

class BaseParser<T extends Record<string, any>> {
  private seenKeys: Set<string>;

  protected readonly FPS = 30; // Add FPS constant

  constructor(
    protected config: AdapterConfig,
    private defaultValues: T,
  ) {
    this.seenKeys = new Set();
  }

  parse(input: string | string[]): ParseResult<T | T[]> {
    return Array.isArray(input) ? this.parseMany(input) : this.parseOne(input);
  }

  public calculateFrames(duration: number): number {
    return Math.round(duration * this.FPS);
  }

  public generateId() {
    return this.config.id.toLowerCase().replace(/\s+/g, "-");
  }

  private parseMany(inputs: string[]): ParseResult<T[]> {
    const results = inputs.map((input, index) => {
      return this.parseOne(input);
    });

    return {
      data: results.map((r) => r.data),
      issues: results.flatMap((r) => r.issues),
    };
  }

  private parseOne(input: string): ParseResult<T> {
    this.seenKeys.clear();
    const normalizedInput = this.normalizeInput(input);
    const { args, issues } = this.extractArguments(normalizedInput);
    return this.validateAndTransform(args, issues);
  }

  private extractArguments(input: string): {
    args: Record<string, string>;
    issues: ParserIssue[];
  } {
    const args: Record<string, string> = {};
    const issues: ParserIssue[] = [];
    let currentPos = 0;

    while (currentPos < input.length) {
      const argMatch = /--(\w+)(?:=(?:"([^"]*)"|([\S]+)))?/.exec(
        input.slice(currentPos),
      );

      if (!argMatch) break;

      const [fullMatch, key, quotedValue, unquotedValue] = argMatch;
      const value = quotedValue ?? unquotedValue;

      if (this.seenKeys.has(key)) {
        issues.push({
          type: "warning",
          code: ParserIssueCode.DUPLICATE_ARGUMENT,
          field: key,
          message: `Duplicate argument '${key}' found`,
        });
      } else if (value === undefined) {
        issues.push({
          type: "error",
          code: ParserIssueCode.MISSING_VALUE,
          field: key,
          message: `No value provided for argument '${key}'`,
        });
      } else {
        args[key] = this.processValue(value);
        this.seenKeys.add(key);
      }

      currentPos += argMatch.index + fullMatch.length;
    }

    return { args, issues };
  }

  private validateAndTransform(
    args: Record<string, string>,
    parseIssues: ParserIssue[],
  ): ParseResult<T> {
    const data = { ...this.defaultValues };
    const issues = [...parseIssues];

    for (const [key, argConfig] of Object.entries(this.config.arguments)) {
      try {
        const rawValue = args[key];
        const value =
          rawValue !== undefined
            ? this.coerceValue(rawValue, argConfig.type)
            : argConfig.default;

        issues.push(...this.validateValue(key, value, argConfig));
        (data as any)[key] = value;
      } catch (err) {
        const error = err as Error;
        issues.push({
          type: "error",
          code: this.getCoercionErrorCode(argConfig.type),
          field: key,
          message: error.message,
          value: args[key],
        });
      }
    }

    return { data, issues };
  }

  private getCoercionErrorCode(type: string): ParserIssueCode {
    switch (type) {
      case "number":
        return ParserIssueCode.INVALID_NUMBER;
      case "boolean":
        return ParserIssueCode.INVALID_BOOLEAN;
      default:
        return ParserIssueCode.INVALID_VALUE;
    }
  }

  private validateValue(
    key: string,
    value: any,
    config: ArgumentConfig,
  ): ParserIssue[] {
    const issues: ParserIssue[] = [];

    if (!config.validations) return issues;

    for (const rule of config.validations) {
      const isValid = this.checkValidationRule(rule, value);

      if (!isValid) {
        issues.push({
          type: rule.severity || "error",
          code: this.getValidationErrorCode(rule.type),
          field: key,
          message: rule.message,
          value: value,
        });
      }
    }

    return issues;
  }

  private getValidationErrorCode(type: string): ParserIssueCode {
    switch (type) {
      case "required":
        return ParserIssueCode.REQUIRED_FIELD;
      case "pattern":
        return ParserIssueCode.PATTERN_MISMATCH;
      case "range":
        return ParserIssueCode.RANGE_VIOLATION;
      case "enum":
        return ParserIssueCode.ENUM_VIOLATION;
      default:
        return ParserIssueCode.INVALID_VALUE;
    }
  }

  private normalizeInput(input: string): string {
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("--"))
      .join(" ");
  }

  private processValue(value: string): string {
    return value
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }

  private coerceValue(value: string, type: string): any {
    switch (type) {
      case "number": {
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error(`Invalid number value: ${value}`);
        }
        return num;
      }
      case "boolean": {
        if (value !== "true" && value !== "false") {
          throw new Error(`Invalid boolean value: ${value}`);
        }
        return value === "true";
      }
      default:
        return value;
    }
  }

  private checkValidationRule(rule: ValidationRule, value: any): boolean {
    switch (rule.type) {
      case "required":
        return value !== undefined && value !== "";
      case "pattern":
        return rule.pattern
          ? new RegExp(rule.pattern).test(String(value))
          : true;
      case "range":
      case "enum":
      case "custom":
        return rule.validate?.(value) ?? true;
      default:
        return true;
    }
  }
}

export default BaseParser;
