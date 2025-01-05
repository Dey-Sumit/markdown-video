// components/x-editor/core/registry.ts
import type { Monaco, OnMount } from "@monaco-editor/react";
import type { BaseAdapter } from "./types/adapter";
import type { editor } from "monaco-editor";
import { EDITOR_LANGUAGE } from "../const";

export class PluginRegistry {
  private plugins: Map<string, BaseAdapter> = new Map();

  constructor(private readonly monaco: Monaco) {}

  register(plugin: BaseAdapter): void {
    this.plugins.set(plugin.id, plugin);
  }

  registerCompletions(model: editor.ITextModel): void {
    console.log("Registering completions provider");

    this.monaco.languages.registerCompletionItemProvider(EDITOR_LANGUAGE, {
      triggerCharacters: ["#", "-", "=", " "],

      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        console.log("Providing completions for:", {
          lineContent,
          position,
          triggerKind: "Add triggerKind from arguments here",
        });

        const wordInfo = model.getWordUntilPosition(position);

        const context = {
          lineContent,
          position,
          model,
          wordRange: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endColumn: wordInfo.endColumn,
          },
        };

        const suggestions = Array.from(this.plugins.values()).flatMap(
          (plugin) => plugin.provideCompletions(context),
        );

        console.log("Suggestions:", suggestions);

        return { suggestions };
      },
    });
  }
}
