// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import { sceneConfig } from "./scene.config";

export class SceneAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, sceneConfig);
  }
}
