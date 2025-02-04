// scene.parser.ts
import BaseParser from "../../core/base/parser";
import { sceneConfig, defaultSceneArgValues } from "./scene.config";
import type {
  SceneInputProps,
  SceneOutputProps,
  SceneValidationIssue,
} from "./scene.types";

export class ScenePropsParser {
  private baseParser: BaseParser<SceneInputProps>;
  private readonly FPS = 30; // Could be configurable

  constructor() {
    this.baseParser = new BaseParser(sceneConfig, defaultSceneArgValues);
  }

  parse(input: string): {
    data: SceneOutputProps;
  } {
    const baseResult = this.baseParser.parse(input);

    // Only transform what's needed
    const transformedData = this.transformProps(
      baseResult.data as SceneInputProps,
    );

    return {
      data: transformedData,
    };
  }

  private transformProps(input: SceneInputProps): SceneOutputProps {
    return {
      ...input,
      durationInFrames: this.baseParser.calculateFrames(input.duration),
      id: this.baseParser.generateId(),
    };
  }
}

const sceneParser = new ScenePropsParser();

export default sceneParser;
