import { describe, expect, it } from "vitest";
import TransitionParser from "../TransitionParser";

describe("TransitionParser", () => {
  const parser = new TransitionParser();

  it("parses basic transition", () => {
    const input = "--type=fade --duration=0.5 --direction=from-left";
    const { data, errors } = parser.parse(input);

    expect(errors).toHaveLength(0);
    expect(data).toEqual({
      type: "fade",
      duration: 0.5,
      delay: 0,
      easing: "ease",
      direction: "from-left",
    });
  });

  // Edge Cases
  it("handles empty input", () => {
    const { data, errors } = parser.parse("");
    expect(data).toEqual({
      type: "magic",
      duration: 0.3,
      delay: 0,
      easing: "ease",
      direction: "from-bottom",
    });
  });

  it("handles whitespace and special characters", () => {
    const input =
      "  --type=fade-special@2.0   --duration=0.5    --direction=from-left\n--delay=0.2  ";
    const { data, errors } = parser.parse(input);
    expect(errors).toHaveLength(0);
    expect(data.type).toBe("fade-special@2.0");
  });

  it("handles quoted values with spaces", () => {
    const input = '--type="complex fade" --duration=0.5';
    const { data } = parser.parse(input);
    expect(data.type).toBe("complex fade");
  });

  it("handles multiple decimal points in numeric values", () => {
    const input = "--duration=0.5.2 --delay=1.2.3";
    const { data, errors } = parser.parse(input);
    expect(errors).toContain("Invalid number for duration: 0.5.2");
    expect(errors).toContain("Invalid number for delay: 1.2.3");
  });

  it("handles negative numbers", () => {
    const input = "--duration=-0.5 --delay=-1";
    const { data, errors } = parser.parse(input);
    expect(errors).toHaveLength(0);
    expect(data.duration).toBe(-0.5);
    expect(data.delay).toBe(-1);
  });

  it("handles extremely small/large numbers", () => {
    const input = "--duration=0.0000001 --delay=999999";
    const { data } = parser.parse(input);
    expect(data.duration).toBe(0.0000001);
    expect(data.delay).toBe(999999);
  });

  it("handles duplicate properties", () => {
    const input = "--type=fade --type=slide --duration=0.5";
    const { data } = parser.parse(input);
    expect(data.type).toBe("slide"); // Last value wins
  });

  it("handles mixed valid and invalid properties", () => {
    const input = "--type=fade --invalidProp=123 --duration=0.5";
    const { data } = parser.parse(input);
    expect(data.type).toBe("fade");
    expect(data.duration).toBe(0.5);
    expect((data as any).invalidProp).toBeUndefined();
  });

  it("handles scientific notation", () => {
    const input = "--duration=1e-3 --delay=1e2";
    const { data } = parser.parse(input);
    expect(data.duration).toBe(0.001);
    expect(data.delay).toBe(100);
  });

  it("handles undefined and null-like values", () => {
    const input = "--type=undefined --duration=null --delay=undefined";
    const { data } = parser.parse(input);
    expect(data.type).toBe("undefined");
    expect(data.duration).toBe(0.3); // default
    expect(data.delay).toBe(0); // default
  });
});
