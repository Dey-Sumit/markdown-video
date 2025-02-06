import { type Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MarkerSeverity } from "monaco-editor";
import type {
  MarkerData,
  ValidationContext,
  ValidationIssue,
} from "../types.x-editor";
import { validateDirective } from "./directive-validators";

export const configureJSX = (monaco: Monaco) => {
  monaco.languages.register({ id: "jsx" });
  monaco.languages.setLanguageConfiguration("jsx", {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
      ["<", ">"],
    ],
  });

  const monarchTokens = {
    defaultToken: "",
    tokenPostfix: ".jsx",
    keywords: ["const", "let", "var", "function", "return"],
    tokenizer: {
      root: [
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
        [/=>\s*/, "operator"],
        [/=(?!\>)/, "operator"],
        [/<(\w+)/, "tag"],
        [/<\/(\w+)/, "tag"],
        [/>/, "tag"],
        [
          /[a-z_$][\w$]*/,
          { cases: { "@keywords": "keyword", "@default": "identifier" } },
        ],
        [/[{}()\[\]]/, "@brackets"],
        [/[\+\-\*\/\%]/, "operator"],
        [/\d+/, "number"],
        [/"/, "string", "@string_double"],
        [/'/, "string", "@string_single"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
      string_double: [
        [/[^\\"]+/, "string"],
        [/\\./, "escape"],
        [/"/, "string", "@pop"],
      ],
      string_single: [
        [/[^\\']+/, "string"],
        [/\\./, "escape"],
        [/'/, "string", "@pop"],
      ],
    },
  };

  monaco.languages.setMonarchTokensProvider("jsx", monarchTokens);
};

export const configureKeyboardShortcuts = (
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
  options?: {
    onSave?: () => void;
    preventBrowserShortcuts?: boolean;
  },
) => {
  // Save command
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    options?.onSave?.();
  });

  // Quick Command Palette
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
    editor.trigger("", "editor.action.quickCommand", null);
  });

  // Prevent default browser shortcuts
  if (options?.preventBrowserShortcuts) {
    editor.createContextKey("preventBrowserDefaults", true);

    const shortcuts = ["p", "s"];
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && shortcuts.includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }
};

export function validateMarkdown(model: editor.ITextModel) {
  const context: ValidationContext = {
    model,
    markers: [],
    issues: new Map(),
    hasErrors: false,
    hasWarnings: false,
    usedStepNames: new Set(),
  };

  const lines = model.getValue().split("\n");
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    validateStep(line, lineNumber, context);
    validateDirective(line, lineNumber, context);
    validateCodeBlock(line, lineNumber, context);
  });

  return context;
}

export const configureLinting = (
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
) => {
  const updateMarkers = () => {
    const model = editor.getModel();
    if (!model) return;

    const { markers } = validateMarkdown(model);
    monaco.editor.setModelMarkers(model, "markdown-validator", markers);
  };

  // Initial validation
  updateMarkers();

  // Update markers on content change
  const disposable = editor.onDidChangeModelContent(() => {
    updateMarkers();
  });

  return disposable;
};

export const validateStep = (
  line: string,
  lineNumber: number,
  context: ValidationContext,
) => {
  const stepMatch = line.match(/^##\s*!!steps\s*(.*?)\s*$/);
  if (!stepMatch) return;

  const stepName = stepMatch[1];
  if (!stepName) {
    addIssue(
      context,
      {
        code: "missing-step-name",
        message: "Step name is required after !!steps",
        line: lineNumber,
        severity: MarkerSeverity.Error,
      },
      {
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        code: "missing-step-name",
        severity: MarkerSeverity.Error,
        message: "Step name is required after !!steps",
      },
    );
    return;
  }

  if (context.usedStepNames.has(stepName)) {
    addIssue(
      context,
      {
        code: "duplicate-step-name",
        message: `Duplicate step name: "${stepName}"`,
        line: lineNumber,
        severity: MarkerSeverity.Error,
      },
      {
        startLineNumber: lineNumber,
        startColumn: line.indexOf(stepName) + 1,
        endLineNumber: lineNumber,
        endColumn: line.indexOf(stepName) + stepName.length + 1,
        code: "duplicate-step-name",
        severity: MarkerSeverity.Error,
        message: `Duplicate step name: "${stepName}"`,
      },
    );
    return;
  }

  context.usedStepNames.add(stepName);
};

function addIssue(
  context: ValidationContext,
  issue: ValidationIssue,
  marker: MarkerData,
) {
  const existing = context.issues.get(issue.code) || [];
  existing.push(issue);
  context.issues.set(issue.code, existing);

  if (issue.severity === MarkerSeverity.Error) context.hasErrors = true;
  if (issue.severity === MarkerSeverity.Warning) context.hasWarnings = true;

  context.markers.push(marker);
}

export const validateCodeBlock = (
  line: string,
  lineNumber: number,
  context: ValidationContext,
) => {
  const codeBlockStart = line.match(/^```(\w+)\s*(!)?$/);
  const codeBlockWithMarker = line.match(/^```(\w+)\s+!$/);

  if (codeBlockStart) {
    const [, lang] = codeBlockStart;
    if (!codeBlockWithMarker) {
      context.markers.push({
        severity: MarkerSeverity.Warning,
        message: `Code block should be formatted as "\`\`\`${lang} !" (with space before !)`,
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        code: "invalid-code-block-format",
      });
    }
  }
};
