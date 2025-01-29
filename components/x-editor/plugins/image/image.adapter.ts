// plugins/image/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter.type";
import imageConfig from "./image.config";

export class ImageAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, imageConfig);
  }
}
