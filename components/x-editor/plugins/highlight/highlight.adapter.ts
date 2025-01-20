// plugins/highlight/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, IRange, MarkerSeverity } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import highlightConfig from "./highlight.config";
import {
  validateHighlight,
  type HighlightValidationIssue,
} from "./highlight.utils";
import type { CommandContext } from "../../core/types/adapter.type";

interface CommentFormat {
  start: string;
  end?: string;
}

/**
 * Parses highlight range from command string
 * @param command The highlight command string
 * @returns Parsed range or null if invalid format
 */
interface ParsedRange {
  type: "block" | "inline";
  start: number;
  end: number;
}

const parseHighlightRange = (command: string): ParsedRange | null => {
  // Match block range format (1:5)
  const blockMatch = command.match(/\((\d+):(\d+)\)/);
  if (blockMatch) {
    return {
      type: "block",
      start: parseInt(blockMatch[1], 10),
      end: parseInt(blockMatch[2], 10),
    };
  }

  // Match inline range format [3:10]
  const inlineMatch = command.match(/\[(\d+):(\d+)\]/);
  if (inlineMatch) {
    return {
      type: "inline",
      start: parseInt(inlineMatch[1], 10),
      end: parseInt(inlineMatch[2], 10),
    };
  }

  return null;
};

export class HighlightAdapter extends AbstractAdapter {
  private languageComments: Record<string, CommentFormat> = {
    javascript: { start: "//" },
    typescript: { start: "//" },
    python: { start: "#" },
    html: { start: "<!--", end: "-->" },
    css: { start: "/*", end: "*/" },
    sql: { start: "--" },
  };

  /**
   * Converts validation issue severity to Monaco marker severity
   */
  private getMarkerSeverity(
    severity: HighlightValidationIssue["severity"],
  ): MarkerSeverity {
    switch (severity) {
      case "error":
        return this.monaco.MarkerSeverity.Error;
      case "warning":
        return this.monaco.MarkerSeverity.Warning;
      default:
        return this.monaco.MarkerSeverity.Info;
    }
  }

  /**
   * Creates a diagnostic range for the highlight command
   */
  private getDiagnosticRange(
    context: CommandContext,
    range: ParsedRange | null,
    type: "command" | "range",
  ): IRange {
    const { lineContent, position } = context;

    // For range-specific issues, highlight the range part
    if (type === "range" && range) {
      const rangeMatch = lineContent.match(/[[(]\d+:\d+[\])]/);
      if (rangeMatch) {
        return {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: rangeMatch.index! + 1,
          endColumn: rangeMatch.index! + rangeMatch[0].length + 1,
        };
      }
    }

    // For command issues or fallback, highlight the whole command
    const commandMatch = lineContent.match(/!highlight[^-]*/);
    if (commandMatch) {
      return {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: commandMatch.index! + 1,
        endColumn: commandMatch.index! + commandMatch[0].length + 1,
      };
    }

    // Fallback to current position
    return {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: position.column,
      endColumn: position.column + 1,
    };
  }

  private editor?: editor.IStandaloneCodeEditor;

  constructor(monaco: Monaco) {
    super(monaco, highlightConfig);
  }

  setupEditor(editor: editor.IStandaloneCodeEditor) {
    this.editor = editor;
    this.initializeContextMenu();
  }

  private initializeContextMenu() {
    if (!this.editor) return;

    this.editor.addAction({
      id: "add.highlight",
      label: "Add Highlight",
      contextMenuGroupId: "1_modification",
      contextMenuOrder: 1,
      keybindings: [this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KeyH],
      precondition: "editorHasSelection",
      run: () => this.handleAddHighlight(),
    });
  }

  private detectCodeBlockLanguage(
    model: editor.ITextModel,
    lineNumber: number,
  ): string {
    // Search upwards for the code block start
    let currentLine = lineNumber;
    while (currentLine > 1) {
      const line = model.getLineContent(currentLine);
      // Look for code block start with language specification
      const match = line.match(/^```(\w+)/);
      if (match) {
        return match[1];
      }
      // If we hit a code block end or start without language, stop searching
      if (line.trim() === "```") {
        break;
      }
      currentLine--;
    }
    return "javascript"; // default to javascript if no language found
  }

  private isInCodeBlock(model: editor.ITextModel, lineNumber: number): boolean {
    let inBlock = false;
    let currentLine = lineNumber;

    // Search upwards
    while (currentLine > 1) {
      const line = model.getLineContent(currentLine - 1);
      if (line.trim().startsWith("```")) {
        inBlock = true;
        break;
      }
      currentLine--;
    }

    if (!inBlock) return false;

    // Search downwards to ensure we're not after the code block end
    currentLine = lineNumber;
    while (currentLine <= model.getLineCount()) {
      const line = model.getLineContent(currentLine);
      if (line.trim() === "```") {
        return true;
      }
      if (line.trim().match(/^```\w*/)) {
        return false;
      }
      currentLine++;
    }

    return false;
  }

  private getCommentFormat(language: string): CommentFormat {
    return this.languageComments[language] || this.languageComments.javascript;
  }

  private handleAddHighlight() {
    if (!this.editor) return;

    const model = this.editor.getModel();
    if (!model) return;

    const selection = this.editor.getSelection();
    if (!selection) return;

    // Check if we're in a code block
    if (!this.isInCodeBlock(model, selection.startLineNumber)) {
      return; // Not in a code block
    }

    const language = this.detectCodeBlockLanguage(
      model,
      selection.startLineNumber,
    );
    const comment = this.getCommentFormat(language);

    // Get the line content for analyzing selection
    const lineContent = model.getLineContent(selection.startLineNumber);
    const indent = lineContent.match(/^\s*/)?.[0] || "";

    // Determine highlight type based on selection and line content
    const highlightType = this.determineHighlightType(selection, lineContent);
    const highlightCommand = this.createHighlightCommand(
      selection,
      comment,
      highlightType,
      lineContent,
    );

    // Insert the highlight command
    this.editor.executeEdits("highlight", [
      {
        range: {
          startLineNumber: selection.startLineNumber,
          endLineNumber: selection.startLineNumber,
          startColumn: 1,
          endColumn: 1,
        },
        text: `${indent}${highlightCommand}\n`,
      },
    ]);
  }

  private determineHighlightType(
    selection: IRange,
    lineContent: string,
  ): "single" | "multi" | "partial" {
    // First check if multiple lines are selected
    if (selection.startLineNumber !== selection.endLineNumber) {
      return "multi";
    }

    // For single line selections:
    const indentMatch = lineContent.match(/^\s*/);
    const indentLength = indentMatch ? indentMatch[0].length : 0;

    // Check if selection covers entire line content (excluding whitespace)
    const isEntireLine =
      selection.startColumn <= indentLength + 1 &&
      selection.endColumn >= lineContent.length + 1;

    // If it's a single line and covers the entire line (or almost entire line)
    // OR if the selection is very small (like just clicking on the line)
    if (isEntireLine || selection.endColumn - selection.startColumn <= 1) {
      return "single";
    }

    // Otherwise it's a partial line selection
    return "partial";
  }

  private createHighlightCommand(
    selection: IRange,
    comment: CommentFormat,
    type: "single" | "multi" | "partial",
    lineContent: string,
  ): string {
    const baseCommand = `${comment.start} !highlight`;
    const args = ` --color=red --duration=1${comment.end ? " " + comment.end : ""}`;

    // Get line's whitespace
    const indentMatch = lineContent.match(/^\s*/);
    const indentLength = indentMatch ? indentMatch[0].length : 0;

    switch (type) {
      case "multi": {
        // Calculate number of lines selected
        const numLines =
          selection.endLineNumber - selection.startLineNumber + 1;
        return `${baseCommand}(1:${numLines})${args}`;
      }
      case "partial": {
        // Adjust column positions by subtracting indentation
        const startCol = selection.startColumn - indentLength;
        const endCol = selection.endColumn - indentLength - 1;
        return `${baseCommand}[${startCol}:${endCol}]${args}`;
      }
      default:
        return `${baseCommand}${args}`;
    }
  }

  /**
   * Provides diagnostics for highlight commands
   */
  provideDiagnostics(context: CommandContext): editor.IMarkerData[] {
    const { lineContent, model, position } = context;

    // Only process highlight commands
    if (!this.matchesPattern(lineContent)) {
      return [];
    }

    // Parse the range from command
    const range = parseHighlightRange(lineContent);

    // Get total lines in model for validation context
    const totalLines = model.getLineCount();

    // Create validation context
    const validationContext = {
      totalLines,
      lineContent: range?.type === "inline" ? lineContent : undefined,
    };

    // Create test annotation based on range
    const testAnnotation =
      range?.type === "block"
        ? {
            name: "highlight",
            query: lineContent,
            fromLineNumber: range.start,
            toLineNumber: range.end,
          }
        : {
            name: "highlight",
            query: lineContent,
            lineNumber: position.lineNumber,
            fromColumn: range?.start ?? 1,
            toColumn: range?.end ?? 1,
          };

    // Validate the highlight
    const { issues } = validateHighlight(testAnnotation);

    // Convert validation issues to marker data
    return issues.map((issue) => ({
      severity: this.getMarkerSeverity(issue.severity),
      message: issue.message,
      ...this.getDiagnosticRange(
        context,
        range,
        ["LINE_RANGE", "LINE_BOUNDS", "COLUMN_RANGE", "COLUMN_BOUNDS"].includes(
          issue.type,
        )
          ? "range"
          : "command",
      ),
    }));
  }

  matchesPattern(lineContent: string): boolean {
    const baseMatch = super.matchesPattern(lineContent);
    if (!baseMatch) return false;
    return true;
  }
}
