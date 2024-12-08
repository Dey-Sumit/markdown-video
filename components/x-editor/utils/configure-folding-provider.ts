import type { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";

interface FoldingRange {
  start: number;
  end: number;
  kind?: languages.FoldingRangeKind;
}

export const configureFoldingProvider = (monaco: Monaco) => {
  monaco.languages.registerFoldingRangeProvider("markdown", {
    provideFoldingRanges: (model) => {
      const ranges: FoldingRange[] = [];
      const lineCount = model.getLineCount();
      let stepStart = -1;
      let nestedCodeBlockStart = -1;

      const isEmptyLine = (lineNumber: number): boolean => {
        return model.getLineContent(lineNumber).trim() === "";
      };

      const findNextNonEmptyLine = (from: number): number => {
        let lineNumber = from;
        while (lineNumber <= lineCount && isEmptyLine(lineNumber)) {
          lineNumber++;
        }
        return lineNumber;
      };

      const findPreviousNonEmptyLine = (from: number): number => {
        let lineNumber = from;
        while (lineNumber > 0 && isEmptyLine(lineNumber)) {
          lineNumber--;
        }
        return lineNumber;
      };

      for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const line = model.getLineContent(lineNumber);

        // Handle step sections
        if (line.match(/^##\s*!!steps\s+.+/)) {
          if (stepStart !== -1) {
            // End previous step at the last non-empty line
            const endLine = findPreviousNonEmptyLine(lineNumber - 1);
            ranges.push({
              start: stepStart,
              end: endLine,
              kind: monaco.languages.FoldingRangeKind.Region,
            });
          }
          // Start new step from the first content line
          stepStart = lineNumber;
        }

        // Handle code blocks within steps
        if (line.match(/^```\w+/)) {
          nestedCodeBlockStart = lineNumber;
        } else if (line.match(/^```$/) && nestedCodeBlockStart !== -1) {
          ranges.push({
            start: nestedCodeBlockStart,
            end: lineNumber,
            kind: monaco.languages.FoldingRangeKind.Comment,
          });
          nestedCodeBlockStart = -1;
        }

        // Handle last step
        if (lineNumber === lineCount && stepStart !== -1) {
          const endLine = findPreviousNonEmptyLine(lineCount);
          ranges.push({
            start: stepStart,
            end: endLine,
            kind: monaco.languages.FoldingRangeKind.Region,
          });
        }
      }

      return ranges;
    },
  });
};
