// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import { transitionConfig } from "./transition.config";

export class TransitionAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, transitionConfig);
  }
}
