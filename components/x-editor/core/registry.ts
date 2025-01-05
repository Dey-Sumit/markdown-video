// components/x-editor/core/registry.ts
import type { Monaco, OnMount } from "@monaco-editor/react";
import type { BaseAdapter } from "./types/adapter";
import type { editor } from "monaco-editor";
import { EDITOR_LANGUAGE } from "../const";

export class PluginRegistry {
  private plugins: Map<string, BaseAdapter> = new Map();

  constructor(private readonly monaco: Monaco) {}

  register(plugin: BaseAdapter): void {
    this.plugins.set(plugin.config.id, plugin);
  }
  registerCompletions(model: editor.ITextModel): void {
    console.log("Registering plugins:", Array.from(this.plugins.keys()));

    this.monaco.languages.registerCompletionItemProvider(EDITOR_LANGUAGE, {
      triggerCharacters: ["!", "-", "=", "#"],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        console.log("Completion triggered:", {
          line: lineContent,
          position,
        });

        const suggestions = Array.from(this.plugins.values()).flatMap(
          (plugin) =>
            plugin.provideCompletions({
              lineContent,
              position,
              model,
            }),
        );

        console.log("Suggestions:", suggestions);
        return { suggestions };
      },
    });
  }
}
