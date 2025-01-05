// components/x-editor/core/registry.ts
import type { Monaco, OnMount } from "@monaco-editor/react";
import type { BaseAdapter } from "./types/adapter";
import type { editor, IDisposable } from "monaco-editor";
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

        const suggestions = Array.from(this.plugins.values()).flatMap(
          (plugin) =>
            plugin.provideCompletions({
              lineContent,
              position,
              model,
            }),
        );

        return { suggestions };
      },
    });
  }

  registerDiagnostics(model: editor.ITextModel): IDisposable {
    console.log("Registering diagnostics");

    const validateContent = () => {
      const markers = Array.from(this.plugins.values()).flatMap((plugin) => {
        const lines = model.getValue().split("\n");

        return lines.flatMap((lineContent, index) => {
          // Only run diagnostics if the line matches the plugin's pattern
          if (!plugin.matchesPattern(lineContent)) {
            return [];
          }

          return plugin.provideDiagnostics({
            lineContent,
            position: new this.monaco.Position(index + 1, 1),
            model,
          });
        });
      });

      this.monaco.editor.setModelMarkers(model, EDITOR_LANGUAGE, markers);
    };

    // Run initial validation
    validateContent();

    // Return disposable for content changes
    return model.onDidChangeContent(validateContent);
  }
}
