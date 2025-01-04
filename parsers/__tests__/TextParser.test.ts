// src/parsers/__tests__/TextParser.test.ts
import { describe, expect, it } from "vitest";
import TextParser from "../TextParser";

describe("TextParser", () => {
  const parser = new TextParser();

  it("parses basic text with animation", () => {
    const input = '--content="Hello World" --animate=fadeIn --duration=2';
    const { data, errors } = parser.parse(input);

    expect(errors).toHaveLength(0);
    expect(data).toEqual({
      content: "Hello World",
      animation: "fadeIn",
      duration: 2,
      delay: 0,
      fontSize: 60,
      fontWeight: 700,
      applyTo: "word",
      color: "white",
    });
  });

  it("collects errors for invalid numeric values", () => {
    const input = '--content="Test" --duration=abc --fontSize=xyz';
    const { data, errors } = parser.parse(input);

    expect(errors).toContain("Invalid number for duration: abc");
    expect(errors).toContain("Invalid number for fontSize: xyz");
    expect(data.duration).toBe(3); // default value
    expect(data.fontSize).toBe(60); // default value
  });

  it("handles text stack with multiple entries", () => {
    const input = `
      --content="First" --animate=fadeIn --delay=0.5,
      --content="Second" --animate=slideUp --duration=1
    `;
    const { data, errors } = parser.parseStack(input);

    expect(errors).toHaveLength(0);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual(
      expect.objectContaining({
        content: "First",
        animation: "fadeIn",
        delay: 0.5,
      }),
    );
    expect(data[1]).toEqual(
      expect.objectContaining({
        content: "Second",
        animation: "slideUp",
        duration: 1,
      }),
    );
  });

  it("handles empty or invalid inputs", () => {
    const { data, errors } = parser.parse("");
    expect(errors).toContain("Missing content property");
    expect(data).toEqual(
      expect.objectContaining({
        content: "",
        animation: "none",
      }),
    );
  });
});
