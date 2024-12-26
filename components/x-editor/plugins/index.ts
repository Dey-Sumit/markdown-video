// index.ts
export * from "./types";
export * from "./adapters/base";
export * from "./adapters/transition";
export * from "./manager";

import type { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import MarkdownVideoPlugin from "./manager";
import { TransitionPropertyAdapter } from "./adapters/transition";
import { TextPropertyAdapter } from "./adapters/text";
// import { MarkdownVideoPlugin } from "./plugin/manager";
// import { TransitionPropertyAdapter } from "./adapters/transition";

export const configureMarkdownVideoPlugin = (
  monaco: Monaco,
  model: editor.ITextModel,
) => {
  const plugin = new MarkdownVideoPlugin(monaco, model);

  // Register property adapters
  plugin.registerProperty(new TransitionPropertyAdapter(monaco));
  plugin.registerProperty(new TextPropertyAdapter(monaco));

  return plugin.activate();
};
