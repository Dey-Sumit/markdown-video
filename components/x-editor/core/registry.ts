// components/x-editor/core/registry.ts
import type { Monaco, OnMount } from "@monaco-editor/react";
import type { BaseAdapter } from "./types/adapter.type";
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

  registerHoverProvider(model: editor.ITextModel): void {
    this.monaco.languages.registerHoverProvider(EDITOR_LANGUAGE, {
      provideHover: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);

        for (const plugin of this.plugins.values()) {
          const hover = plugin.provideHover({
            lineContent,
            position,
            model,
          });
          if (hover) return hover;
        }
        return null;
      },
    });
  }

  registerDecorations(model: editor.ITextModel): void {
    const decorations: editor.IModelDeltaDecoration[] = [];

    // Update decorations on content change
    const updateDecorations = () => {
      const content = model.getValue();
      const lines = content.split("\n");

      decorations.length = 0;

      lines.forEach((line, index) => {
        // Decorate commands
        Array.from(this.plugins.values()).forEach((plugin) => {
          if (!plugin.matchesPattern(line)) return;

          // Command decoration (!!scene or !text)
          const cmdMatch = line.match(
            plugin.config.pattern.type === "directive" ? /!!\w+/ : /!\w+/,
          );
          if (cmdMatch) {
            decorations.push({
              range: new this.monaco.Range(
                index + 1,
                cmdMatch.index! + 1,
                index + 1,
                cmdMatch.index! + cmdMatch[0].length + 1,
              ),
              options: {
                inlineClassName: "hoverable-command",
                // hoverMessage: { value: "**Click to see command details**" },
              },
            });
          }

          // Arguments decoration (--arg=value)
          const argMatches = line.matchAll(/--(\w+)(?==)/g);
          for (const match of argMatches) {
            decorations.push({
              range: new this.monaco.Range(
                index + 1,
                match.index! + 3, // Skip '--'
                index + 1,
                match.index! + match[0].length + 1,
              ),
              options: {
                // inlineClassName: "hoverable-argument",
                // hoverMessage: { value: "Hover to see argument details" },
              },
            });
          }

          // Values decoration
          const valueMatches = line.matchAll(/--\w+=([^-\s"]+|"[^"]*")/g);
          for (const match of valueMatches) {
            const valueStart = match.index! + match[0].indexOf("=") + 1;
            decorations.push({
              range: new this.monaco.Range(
                index + 1,
                valueStart + 1,
                index + 1,
                valueStart + match[1].length + 1,
              ),
              options: {
                // inlineClassName: "hoverable-value",
                // hoverMessage: { value: "Hover to see value details" },
              },
            });
          }
        });
      });

      model.deltaDecorations([], decorations);
    };

    updateDecorations();
    model.onDidChangeContent(updateDecorations);
  }
}
