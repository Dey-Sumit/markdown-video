import { describe, expect, it } from "vitest";
import SceneMetaParser from "../SceneMetaParser";

describe("SceneMetaParser", () => {
  const parser = new SceneMetaParser();

  describe("Basic Parsing", () => {
    it("parses scene with all props", () => {
      const input =
        '!!scene --title="Step 1" --duration=5 --background=transparent';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual({
        title: "Step 1",
        duration: 5,
        background: "transparent",
      });
    });

    it("uses default values for missing props", () => {
      const input = '!!scene --title="Step 1"';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual({
        title: "Step 1",
        duration: 5,
        background: "transparent",
      });
    });
  });

  describe("Custom Defaults", () => {
    const customParser = new SceneMetaParser({
      defaultProps: {
        duration: 10,
        background: "#000000",
      },
    });

    it("uses custom default values", () => {
      const input = '!!scene --title="Custom"';
      const { data } = customParser.parse(input);

      expect(data).toEqual({
        title: "Custom",
        duration: 10,
        background: "#000000",
      });
    });
  });

  describe("Validation", () => {
    it("validates scene prefix", () => {
      const input = '--title="Wrong Prefix"';
      const { errors } = parser.parse(input);

      expect(errors).toContain("Input must start with !!scene");
    });

    it("handles invalid duration", () => {
      const input = '!!scene --title="Test" --duration=invalid';
      const { data, errors } = parser.parse(input);

      expect(errors).toContain("Invalid number for duration: invalid");
      expect(data.duration).toBe(5); // default value
    });

    it("handles quoted and unquoted values", () => {
      const input = '!!scene --title=unquoted --background="#fff" --duration=3';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual({
        title: "unquoted",
        background: "#fff",
        duration: 3,
      });
    });
  });

  describe("Complex Cases", () => {
    it("handles spaces in title", () => {
      const input = '!!scene --title="My Complex Title" --duration=5';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data.title).toBe("My Complex Title");
    });

    it("handles various background formats", () => {
      const inputs = [
        '!!scene --title="Test" --background=transparent',
        '!!scene --title="Test" --background="#fff"',
        '!!scene --title="Test" --background="rgb(255,255,255)"',
      ];

      inputs.forEach((input) => {
        const { errors } = parser.parse(input);
        expect(errors).toHaveLength(0);
      });
    });
  });
});
