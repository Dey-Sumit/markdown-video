// components/x-editor/plugins/section/adapter.ts
import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import sectionConfig from "./section.config";

export class SectionAdapter extends AbstractAdapter {
  constructor(monaco: Monaco) {
    super(monaco, sectionConfig);
  }
}
