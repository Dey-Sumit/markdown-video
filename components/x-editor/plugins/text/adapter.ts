// components/x-editor/plugins/scene/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter";
import textConfig from "./config";

export class TextAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, textConfig);
  }
}
