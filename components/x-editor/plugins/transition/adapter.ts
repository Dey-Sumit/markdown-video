// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import transitionConfig from "./config";

export class TransitionAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, transitionConfig);
  }
}
