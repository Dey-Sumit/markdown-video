// core/parsers/components/scene.ts

import { sceneConfig } from "./scene.config";
import ComponentParser from "../../core/base/parser";
import type { ParserOptions } from "../../core/types/parser.type";

export interface SceneProps {
  title?: string;
  duration: number;
  background?: string;
}

export class SceneParser extends ComponentParser<SceneProps> {
  constructor(options?: ParserOptions) {
    super(sceneConfig);
    this.options = options;
  }
}
