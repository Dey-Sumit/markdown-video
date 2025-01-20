import { describe, expect, it } from "vitest";
import SectionParser from "../SectionParser";

describe("ContentParser", () => {
  const parser = new SectionParser();

  describe("Basic Section Parsing", () => {
    it("parses empty section", () => {
      const input = "!section --gap=16 --items=()";
      const expected = {
        type: "section",
        data: {
          gap: 16,
          direction: "row",
          items: [],
        },
      };

      const result = parser.parse(input);
      expect(result).toEqual(expected);
    });

    it("parses section with text items", () => {
      const input = `!section
        --cols=2
        --gap=32
        --items=(
          !text --content="Hello",
          !text --content="World"
        )`;

      const result = parser.parse(input);
      expect(result.type).toBe("section");
      expect(result.data.cols).toBe(2);
      expect(result.data.gap).toBe(32);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.items[0].type).toBe("text");
      expect(result.data.items[0].data.content).toBe("Hello");
    });
  });

  describe("Nested Sections", () => {
    it("parses nested sections", () => {
      const input = `!section
        --cols=2
        --items=(
          !section
            --direction=column
            --gap=16
            --items=(
              !text --content="Nested"
            ),
          !text --content="Sibling"
        )`;

      const result = parser.parse(input);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.items[0].type).toBe("section");
      expect(result.data.items[0].data.items[0].type).toBe("text");
    });
  });

  /*  describe("Custom Components", () => {
    it("parses custom component with props", () => {
      const input = `!section --items=(
        !comp --name=chart(--data=[1,2,3] --title="Stats")
      )`;

      const result = parser.parse(input);
      const component = result.data.items[0];
      expect(component.type).toBe("component");
      expect(component.name).toBe("chart");
      expect(component.data.data).toEqual([1, 2, 3]);
      expect(component.data.title).toBe("Stats");
    });
  }); */

  describe("Mixed Content", () => {
    it("parses section with mixed content types", () => {
      const input = `!section
        --cols=3
        --gap=24
        --items=(
          !text --content="Title",
          !image --src="photo.jpg",
          !video --src="clip.mp4",
          !comp --name=custom(--prop=value)
        )`;

      const result = parser.parse(input);
      const items = result.data.items;
      expect(items).toHaveLength(4);
      expect(items.map((item: any) => item.type)).toEqual([
        "text",
        "image",
        "video",
        "component",
      ]);
    });
  });

  describe("Error Handling", () => {
    it("requires section start", () => {
      expect(() => parser.parse("--cols=2")).toThrow(
        "Content must start with !section",
      );
    });

    it("requires component name", () => {
      const input = "!section --items=(!comp(--prop=value))";
      expect(() => parser.parse(input)).toThrow("Component name is required");
    });
  });
});
