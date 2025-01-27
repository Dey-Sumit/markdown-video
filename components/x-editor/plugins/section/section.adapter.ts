// components/x-editor/plugins/section/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter.type";
import sectionConfig from "./section.config";

export class SectionAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, sectionConfig);
  }

  protected validateComponent(context: CommandContext): editor.IMarkerData[] {
    const { lineContent, position, model } = context;

    // First check if this line has required arguments
    const basicValidation = this.validateBasicRequirements(
      lineContent,
      position,
    );
    if (basicValidation.length > 0) return basicValidation;

    // Get the full section block
    const block = this.getBlockContent(model, position.lineNumber);
    if (!block) {
      return [
        {
          severity: this.monaco.MarkerSeverity.Error,
          message: "Invalid section structure",
          ...this.createRange(position),
        },
      ];
    }

    // Validate the section structure
    return this.validateSectionStructure(block, model);
  }

  private validateBasicRequirements(
    line: string,
    position: Position,
  ): editor.IMarkerData[] {
    // Check for required items property
    if (!line.includes("--items=")) {
      return [
        {
          severity: this.monaco.MarkerSeverity.Error,
          message: "Section requires items property",
          ...this.createRange(position),
        },
      ];
    }

    // Check for empty items parentheses
    if (line.includes("--items=()")) {
      return [
        {
          severity: this.monaco.MarkerSeverity.Error,
          message: "Items cannot be empty",
          ...this.createRange(position),
        },
      ];
    }

    // Check if items has opening parenthesis
    if (!line.includes("--items=(")) {
      return [
        {
          severity: this.monaco.MarkerSeverity.Error,
          message: "Items must be wrapped in parentheses",
          ...this.createRange(position),
        },
      ];
    }

    return [];
  }

  private validateSectionStructure(
    block: { content: string; startLine: number; endLine: number },
    model: editor.ITextModel,
  ): editor.IMarkerData[] {
    const { content, startLine, endLine } = block;
    const lines = content.split("\n");
    const markers: editor.IMarkerData[] = [];

    let depth = 0;
    let sectionDepth = 0;
    let insideQuotes = false;
    let lineNumber = startLine;
    let column = 1;
    let currentLineContent = "";

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      // Track current line content
      if (char === "\n") {
        // Check if current line is a component but not properly wrapped
        const trimmedLine = currentLineContent.trim();
        if (
          trimmedLine.startsWith("!") &&
          !trimmedLine.startsWith("!section") &&
          sectionDepth === 0
        ) {
          markers.push({
            severity: this.monaco.MarkerSeverity.Error,
            message: "Component must be wrapped in section items",
            startLineNumber: lineNumber,
            endLineNumber: lineNumber,
            startColumn: 1,
            endColumn: currentLineContent.length + 1,
          });
        }

        lineNumber++;
        column = 1;
        currentLineContent = "";
        continue;
      }

      currentLineContent += char;
      column++;

      // Handle quotes
      if (char === '"' && content[i - 1] !== "\\") {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (!insideQuotes) {
        if (char === "(") {
          depth++;
          const lookBehind = content.slice(Math.max(0, i - 8), i);
          if (lookBehind.includes("--items=")) {
            sectionDepth++;
          }
        }
        if (char === ")") {
          depth--;
          const lookAhead = content.slice(i + 1, i + 8);
          if (!lookAhead.includes("--items=")) {
            sectionDepth--;
          }
        }

        // Check for structure errors
        if (depth < 0 || sectionDepth < 0) {
          markers.push({
            severity: this.monaco.MarkerSeverity.Error,
            message: "Mismatched parentheses in section structure",
            startLineNumber: lineNumber,
            endLineNumber: lineNumber,
            startColumn: Math.max(1, column - 10),
            endColumn: column + 1,
          });
        }
      }
    }

    // Check last line
    const trimmedLastLine = currentLineContent.trim();
    if (
      trimmedLastLine.startsWith("!") &&
      !trimmedLastLine.startsWith("!section") &&
      sectionDepth === 0
    ) {
      markers.push({
        severity: this.monaco.MarkerSeverity.Error,
        message: "Component must be wrapped in section items",
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: 1,
        endColumn: currentLineContent.length + 1,
      });
    }

    // Check final state
    if (depth !== 0 || sectionDepth !== 0 || insideQuotes) {
      markers.push({
        severity: this.monaco.MarkerSeverity.Error,
        message:
          depth !== 0
            ? "Unclosed parentheses in section"
            : sectionDepth !== 0
              ? "Incomplete section structure"
              : "Unclosed string in section",
        ...this.createMultiLineRange(startLine, endLine, model),
      });
    }

    return markers;
  }
}
