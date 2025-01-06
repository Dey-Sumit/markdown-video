// core/parsers/components/__tests__/scene.test.ts
import { describe, it, expect } from "vitest";
import { SceneParser } from "../scene.parser";

describe("SceneParser", () => {
  const parser = new SceneParser();

  describe("parse", () => {
    it("should parse valid scene input correctly", () => {
      const input = '--duration=5 --title="Scene 1" --background=transparent';
      const result = parser.parse(input);

      expect(result.data).toEqual({
        duration: 5,
        title: "Scene 1",
        background: "transparent",
      });
      expect(result.errors).toHaveLength(0);
    });

    it("should use fallback value for required duration when missing", () => {
      const input = '--title="Scene 1"';
      const result = parser.parse(input);

      expect(result.data.duration).toBe(5); // Default from config
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        field: "duration",
        error: "Duration is required",
        severity: "error",
      });
    });

    it("should validate duration range", () => {
      const input = '--duration=70 --title="Scene 1"';
      const result = parser.parse(input);

      expect(result.data.duration).toBe(5); // Fallback to default
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        field: "duration",
        value: "70",
        error: "Duration must be between 0 and 60 seconds",
        severity: "error",
      });
    });

    it("should handle quoted and unquoted values", () => {
      const input = '--duration=5 --title="Scene 1" --background=white';
      const result = parser.parse(input);

      expect(result.data).toEqual({
        duration: 5,
        title: "Scene 1",
        background: "white",
      });
      expect(result.errors).toHaveLength(0);
    });

    it("should validate background color enum", () => {
      const input = '--duration=5 --title="Scene 1" --background=blue';
      const result = parser.parse(input);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        field: "background",
        value: "blue",
        error: "Invalid background value",
        severity: "warning",
      });
      // Since background is optional and validation failed, it should be undefined
      expect(result.data.background).toBeUndefined();
    });

    it("should parse numeric values correctly", () => {
      const input = '--duration=3.5 --title="Scene 1"';
      const result = parser.parse(input);

      expect(result.data.duration).toBe(3.5);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle multiple errors", () => {
      const input = "--duration=invalid --background=invalid";
      const result = parser.parse(input);

      expect(result.errors).toHaveLength(2);
      expect(result.data).toEqual({
        duration: 5, // Fallback for required field
        // background should be undefined since it's invalid but optional
      });
    });

    it("should handle empty input", () => {
      const input = "";
      const result = parser.parse(input);

      expect(result.data).toEqual({
        duration: 5, // Default value for required field
      });
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        field: "duration",
        error: "Duration is required",
      });
    });

    it("should handle runtime defaults if provided", () => {
      const parserWithDefaults = new SceneParser({
        runtimeDefaults: {
          title: "runtime-default",
        },
      });

      const input = "--duration=5";
      const result = parserWithDefaults.parse(input);

      expect(result.data.title).toBe("runtime-default");
    });
  });
});
