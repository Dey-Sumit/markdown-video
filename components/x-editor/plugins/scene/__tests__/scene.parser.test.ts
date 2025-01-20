import { describe, it, expect } from "vitest";
import scenePropsParser from "../scene.parser";
import { defaultSceneArgValues } from "../scene.config";

describe("SceneParser", () => {
  describe("Basic Scene Parsing", () => {
    it("should parse basic scene with duration and title", () => {
      const input = "--duration=5 --title=intro";
      const result = scenePropsParser.parse(input);
      expect(result.data).toEqual({
        duration: 5,
        title: "intro",
        background: "transparent", // default
      });
    });

    it("should parse scene with all properties", () => {
      const input = "--duration=10 --title=main --background=black";
      const result = scenePropsParser.parse(input);
      expect(result.data).toEqual({
        duration: 10,
        title: "main",
        background: "black",
      });
    });
  });

  describe("Defaults", () => {
    it("should use defaults for missing optional fields", () => {
      const input = "--duration=5";
      const result = scenePropsParser.parse(input);
      expect(result.data).toEqual({
        duration: 5,
        title: defaultSceneArgValues.title,
        background: defaultSceneArgValues.background,
      });
    });
  });
});
