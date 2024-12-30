import type { Monaco } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import { EDITOR_LANGUAGE } from "../const";

interface FoldingRange {
  start: number;
  end: number;
  kind?: languages.FoldingRangeKind;
}

export const configureFoldingProvider = (monaco: Monaco) => {
  monaco.languages.registerFoldingRangeProvider(EDITOR_LANGUAGE, {
    provideFoldingRanges: (model) => {
      const ranges: FoldingRange[] = [];
      const lineCount = model.getLineCount();
      let sceneStart = -1;
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

        // Handle scene sections
        if (line.match(/^##\s*!!scene\s+.+/)) {
          if (sceneStart !== -1) {
            // End previous scene at the last non-empty line
            const endLine = findPreviousNonEmptyLine(lineNumber - 1);
            ranges.push({
              start: sceneStart,
              end: endLine,
              kind: monaco.languages.FoldingRangeKind.Region,
            });
          }
          // Start new scene from the first content line
          sceneStart = lineNumber;
        }

        // Handle code blocks within scenes
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

        // Handle last scene
        if (lineNumber === lineCount && sceneStart !== -1) {
          const endLine = findPreviousNonEmptyLine(lineCount);
          ranges.push({
            start: sceneStart,
            end: endLine,
            kind: monaco.languages.FoldingRangeKind.Region,
          });
        }
      }

      return ranges;
    },
  });
};
