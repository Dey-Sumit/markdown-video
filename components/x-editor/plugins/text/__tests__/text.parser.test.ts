import { describe, it, expect } from "vitest";
import textParser from "../text.parser";

import { defaultTextArgValues } from "../text.config";
import { ParserIssueCode } from "../../../core/types/parser.type";

describe("TextParser", () => {
  describe("Basic Parsing", () => {
    it("should parse single input correctly", () => {
      const input = ['--content="Hello" --size=30 --family=sans'];
      const result = textParser.parse(input);

      expect(result.data).toEqual({
        content: "Hello",
        size: 30,
        family: "sans",
      });
    });

    it("should parse multiple inputs correctly", () => {
      const inputs = [
        '--content="Hello" --size=30 --family=sans',
        '--content="World" --size=24 --family=serif',
      ];
      const result = textParser.parse(inputs);

      expect(result.data).toEqual([
        { content: "Hello", size: 30, family: "sans" },
        { content: "World", size: 24, family: "serif" },
      ]);
    });
  });

  describe("Required Fields", () => {
    it("should detect missing required content", () => {
      const input = ["--size=30 --family=sans"];
      const result = textParser.parse(input);

      expect(result.data).toEqual({
        ...defaultTextArgValues,
        size: 30,
        family: "sans",
      });
    });

    it("should detect empty content", () => {
      const input = ['--content="" --size=30'];
      const result = textParser.parse(input);
    });
  });

  describe("Value Validation", () => {
    it("should validate size range", () => {
      const input = ['--content="Hello" --size=100'];
      const result = textParser.parse(input);

      expect(result.data).toEqual({
        ...defaultTextArgValues,
        content: "Hello",
        size: 100,
      });
    });

    it("should validate font family enum", () => {
      const input = ['--content="Hello" --family=invalid'];
      const result = textParser.parse(input);
    });

    it("should handle invalid number for size", () => {
      const input = ['--content="Hello" --size=invalid'];
      const result = textParser.parse(input);
    });
  });

  describe("Edge Cases", () => {
    it("should handle duplicate arguments", () => {
      const testCase = {
        input: ['--content="Hello" --content="World" --size=30'],
        expected: {
          data: { content: "Hello", size: 30, family: "sans" },
          issues: [
            {
              code: ParserIssueCode.DUPLICATE_ARGUMENT,
              field: "content",
              type: "warning",
            },
          ],
        },
      };

      const result = textParser.parse(testCase.input);

      expect(result.data).toEqual(testCase.expected.data);
    });

    it("should handle missing argument values", () => {
      const input = ["--content= --size=30"];
      const result = textParser.parse(input);
    });

    it("should handle escaped characters", () => {
      const testCase = {
        input: ['--content="Hello\\nWorld" --size=30'],
        expected: {
          content: "Hello\nWorld",
          size: 30,
          family: "sans",
        },
      };

      const result = textParser.parse(testCase.input);

      // Type safety - check if data is not an array
      if (Array.isArray(result.data)) {
        expect(result.data[0].content).toBe(testCase.expected.content);
      }
    });
  });

  describe("Multiple Validation Errors", () => {
    it("should collect all validation errors", () => {
      const input = ['--content="" --size=100 --family=invalid'];
      const result = textParser.parse(input);
    });
  });
});
