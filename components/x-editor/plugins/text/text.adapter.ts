// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import textConfig from "./config";

export class TextAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, textConfig);
  }
}
