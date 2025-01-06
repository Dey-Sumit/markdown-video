import BaseParser from "../../core/base/parser";
import { defaultSceneArgValues, sceneConfig } from "./scene.config";

const sceneParser = new BaseParser(sceneConfig, defaultSceneArgValues);

export default sceneParser;
