import { MarkerSeverity } from "monaco-editor";
import { ValidationContext } from "../types";
import { XMONACO_CONSTANTS } from "../const";

const VALID_DIRECTIVES = [
  "duration",
  "transition",
  "fontUtils",
  "codeBlockUtils",
  "media",
  "transitionDuration",
] as const;
type DirectiveType = (typeof VALID_DIRECTIVES)[number];

interface DirectiveValidators {
  [key: string]: (
    value: string,
    context: ValidationContext,
    line: string,
    lineNumber: number
  ) => void;
}

const directiveValidators: DirectiveValidators = {
  duration: (value, context, line, lineNumber) => {
    const duration = parseInt(value);
    if (isNaN(duration) || duration < XMONACO_CONSTANTS.CODE_COMP_TRANSITION_DURATION) {
      addDirectiveIssue(context, {
        code: "invalid-duration",
        message: `Duration must be a number >= ${XMONACO_CONSTANTS.CODE_COMP_TRANSITION_DURATION}`,
        line: lineNumber,
        value,
        lineContent: line,
      });
    }
  },

  transition: (value, context, line, lineNumber) => {
    if (!XMONACO_CONSTANTS.VALID_TRANSITIONS.includes(value as any)) {
      addDirectiveIssue(context, {
        code: "invalid-transition",
        message: `Transition must be one of: ${XMONACO_CONSTANTS.VALID_TRANSITIONS.join(", ")}`,
        line: lineNumber,
        value,
        lineContent: line,
      });
    }
  },
};

export const validateDirective = (line: string, lineNumber: number, context: ValidationContext) => {
  if (!line.startsWith("!") || line.startsWith("!!steps")) return;

  const [directiveWithBang, value] = line.split(" ");
  const directive = directiveWithBang.substring(1) as DirectiveType;

  if (!VALID_DIRECTIVES.includes(directive)) {
    addDirectiveIssue(context, {
      code: "unknown-directive",
      message: `Unknown directive "${directive}". Valid directives are: ${VALID_DIRECTIVES.join(", ")}`,
      line: lineNumber,
      value: directive,
      lineContent: line,
    });
    return;
  }

  const validator = directiveValidators[directive];
  if (validator) {
    validator(value, context, line, lineNumber);
  }
};

interface DirectiveIssueParams {
  code: string;
  message: string;
  line: number;
  value: string;
  lineContent: string;
}

function addDirectiveIssue(context: ValidationContext, params: DirectiveIssueParams) {
  const { code, message, line, value, lineContent } = params;

  context.markers.push({
    severity: MarkerSeverity.Error,
    message,
    startLineNumber: line,
    startColumn: lineContent.indexOf(value) + 1,
    endLineNumber: line,
    endColumn: lineContent.indexOf(value) + (value?.length || 0) + 1,
    code,
  });
}
