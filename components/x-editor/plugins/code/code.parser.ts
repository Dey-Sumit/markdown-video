// code.parser.ts
// import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import BaseParser from "../../core/base/parser";
import codeConfig, { defaultCodeArgValues } from "./code.config";

const a = 12;

export { a };

export interface CodeInputProps {
  theme: string;
  fontSize: number;
  align: string;
}

export interface CodeOutputProps extends CodeInputProps {
  id: string;
}

export class CodePropsParser {
  private baseParser: BaseParser<CodeInputProps>;

  constructor() {
    this.baseParser = new BaseParser(codeConfig, defaultCodeArgValues);
  }

  parse(input: string): {
    data: CodeOutputProps;
    validationIssues?: Array<{
      message: string;
      severity: "error" | "warning";
    }>;
  } {
    const baseResult = this.baseParser.parse(input);

    return {
      data: this.transformProps(baseResult.data as CodeInputProps),
      //   validationIssues: baseResult.issues,
    };
  }

  private transformProps(input: CodeInputProps): CodeOutputProps {
    return {
      ...input,
      id: this.baseParser.generateId(),
    };
  }
}

const codeParser = new CodePropsParser();
export default codeParser;
