import { describe, expect, it } from "vitest";
import ImageParser from "../ImageParser";

describe("ImageParser", () => {
  const parser = new ImageParser();

  describe("Basic Parsing", () => {
    it("parses basic image with required props", () => {
      const input = '--src="image.jpg"';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual({
        src: "image.jpg",
        description: "",
        animation: "slide-up",
        duration: 3,
        delay: 0,
        withMotion: true,
      });
    });

    it("parses image with all props", () => {
      const input =
        '--src="image.jpg" --description="Test Image" --animation=fade --duration=5 --delay=1 --withMotion=false';
      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual({
        src: "image.jpg",
        description: "Test Image",
        animation: "fade",
        duration: 5,
        delay: 1,
        withMotion: false,
      });
    });
  });

  describe("Animation Validation", () => {
    it("handles invalid animation type", () => {
      const input = '--src="image.jpg" --animation=invalid-type';
      const { data } = parser.parse(input);
      expect(data.animation).toBe("slide-up"); // fallback to default
    });

    it("accepts all valid animation types", () => {
      const animations = [
        "fade",
        "scale",
        "slide-left",
        "slide-right",
        "slide-up",
        "slide-down",
        "bounce-in",
        "spin-in",
        "flip-in",
        "zig-zag",
        "pop-in",
      ];

      animations.forEach((animation) => {
        const input = `--src="image.jpg" --animation=${animation}`;
        const { data, errors } = parser.parse(input);
        expect(errors).toHaveLength(0);
        expect(data.animation).toBe(animation);
      });
    });
  });

  describe("Error Handling", () => {
    it("requires src property", () => {
      const input = "--animation=fade";
      const { errors } = parser.parse(input);
      expect(errors).toContain("src is required");
    });

    it("handles invalid numeric values", () => {
      const input = '--src="image.jpg" --duration=invalid --delay=abc';
      const { data, errors } = parser.parse(input);

      expect(errors).toContain("Invalid number for duration: invalid");
      expect(errors).toContain("Invalid number for delay: abc");
      expect(data.duration).toBe(3); // default
      expect(data.delay).toBe(0); // default
    });

    it("handles negative numbers", () => {
      const input = '--src="image.jpg" --duration=-2 --delay=-1';
      const { data } = parser.parse(input);
      expect(data.duration).toBe(-2);
      expect(data.delay).toBe(-1);
    });
  });

  describe("Custom Defaults", () => {
    it("accepts custom default values", () => {
      const customParser = new ImageParser({
        defaultProps: {
          animation: "fade",
          duration: 5,
          delay: 1,
        },
      });

      const input = '--src="image.jpg"';
      const { data } = customParser.parse(input);

      expect(data).toEqual({
        src: "image.jpg",
        description: "",
        animation: "fade",
        duration: 5,
        delay: 1,
        withMotion: true,
      });
    });
  });
});
