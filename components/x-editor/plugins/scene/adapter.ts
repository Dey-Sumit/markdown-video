// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import { sceneConfig } from "./config";

export class SceneAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    console.log("Scene config:", sceneConfig.arguments.duration.validations);
    super(monaco, sceneConfig);
  }
}
