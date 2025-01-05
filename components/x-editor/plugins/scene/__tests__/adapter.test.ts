/* // components/x-editor/plugins/scene/__tests__/adapter.test.ts

import { describe, expect, it, beforeEach } from "vitest";
import { SceneAdapter } from "../adapter";
import type { editor, IRange, Position, Range } from "monaco-editor";

// Step 1: Create mock helpers
const createMockMonaco = () => ({
  languages: {
    CompletionItemKind: {
      Snippet: 1,
      Property: 2,
      Value: 3,
    },
    CompletionItemInsertTextRule: {
      InsertAsSnippet: 4,
    },
  },
});

const createPosition = (lineNumber: number, column: number): Position => ({
  lineNumber,
  column,
  with: (newLineNumber?: number, newColumn?: number) =>
    createPosition(newLineNumber ?? lineNumber, newColumn ?? column),
  delta: (deltaLineNumber = 0, deltaColumn = 0) =>
    createPosition(lineNumber + deltaLineNumber, column + deltaColumn),
  equals: (other: Position) =>
    other.lineNumber === lineNumber && other.column === column,
  isBefore: (other: Position) =>
    lineNumber < other.lineNumber ||
    (lineNumber === other.lineNumber && column < other.column),
  isBeforeOrEqual: (other: Position) =>
    lineNumber < other.lineNumber ||
    (lineNumber === other.lineNumber && column <= other.column),
  clone: () => createPosition(lineNumber, column),
  toJSON: () => ({ lineNumber, column }),
});

const createRange = (
  startLineNumber: number,
  startColumn: number,
  endLineNumber: number,
  endColumn: number,
): Range => ({
  startLineNumber,
  startColumn,
  endLineNumber,
  endColumn,
  isEmpty: () => startLineNumber === endLineNumber && startColumn === endColumn,
  containsPosition: (position: Position) =>
    position.lineNumber >= startLineNumber &&
    position.lineNumber <= endLineNumber &&
    position.column >= startColumn &&
    position.column <= endColumn,
  containsRange: (range: IRange) =>
    range.startLineNumber >= startLineNumber &&
    range.endLineNumber <= endLineNumber &&
    range.startColumn >= startColumn &&
    range.endColumn <= endColumn,
  strictContainsRange: (range: IRange) =>
    range.startLineNumber > startLineNumber &&
    range.endLineNumber < endLineNumber &&
    range.startColumn > startColumn &&
    range.endColumn < endColumn,
  plusRange: (range: IRange) =>
    createRange(
      Math.min(startLineNumber, range.startLineNumber),
      Math.min(startColumn, range.startColumn),
      Math.max(endLineNumber, range.endLineNumber),
      Math.max(endColumn, range.endColumn),
    ),
  intersectRanges: (range: IRange) => {
    const resultStartLineNumber = Math.max(
      startLineNumber,
      range.startLineNumber,
    );
    const resultEndLineNumber = Math.min(endLineNumber, range.endLineNumber);
    const resultStartColumn = Math.max(startColumn, range.startColumn);
    const resultEndColumn = Math.min(endColumn, range.endColumn);
    if (
      resultStartLineNumber > resultEndLineNumber ||
      (resultStartLineNumber === resultEndLineNumber &&
        resultStartColumn > resultEndColumn)
    ) {
      return null;
    }
    return createRange(
      resultStartLineNumber,
      resultStartColumn,
      resultEndLineNumber,
      resultEndColumn,
    );
  },
  equalsRange: (range: IRange | null) =>
    !!range &&
    startLineNumber === range.startLineNumber &&
    startColumn === range.startColumn &&
    endLineNumber === range.endLineNumber &&
    endColumn === range.endColumn,
  getEndPosition: () => createPosition(endLineNumber, endColumn),
  getStartPosition: () => createPosition(startLineNumber, startColumn),
  setEndPosition: (endLineNumber: number, endColumn: number) =>
    createRange(startLineNumber, startColumn, endLineNumber, endColumn),
  setStartPosition: (startLineNumber: number, startColumn: number) =>
    createRange(startLineNumber, startColumn, endLineNumber, endColumn),
  collapseToStart: () =>
    createRange(startLineNumber, startColumn, startLineNumber, startColumn),
  toString: () =>
    `[${startLineNumber},${startColumn} -> ${endLineNumber},${endColumn}]`,
  fromPositions: (start: Position, end: Position = start) =>
    createRange(start.lineNumber, start.column, end.lineNumber, end.column),
});

const createMockModel = (content: string): editor.ITextModel => ({
  getLineContent: () => content,
  getValue: () => content,
  getValueInRange: () => content,
  getValueLength: () => content.length,
  getLineCount: () => 1,
  getLineLength: () => content.length,
  getLinesContent: () => [content],
  getWordAtPosition: () => null,
  getWordUntilPosition: () => ({
    word: "",
    startColumn: 1,
    endColumn: 1,
  }),
  getPositionAt: () => createPosition(1, 1),
  getOffsetAt: () => 0,
  getVersionId: () => 1,
  getAlternativeVersionId: () => 1,
  getEOL: () => "\n",
  getFullModelRange: () => createRange(1, 1, 1, content.length),

});

const createMockContext = (lineContent: string) => ({
  lineContent,
  position: createPosition(1, lineContent.length + 1),
  model: createMockModel(lineContent),
});
 */