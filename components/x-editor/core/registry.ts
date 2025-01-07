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
    let prevDecorationIds: string[] = []; // Track previous decoration IDs

    const updateDecorations = () => {
      const content = model.getValue();
      const lines = content.split("\n");
      const newDecorations: editor.IModelDeltaDecoration[] = [];
      let inScene = false;
      let sceneStartLine = 0;

      lines.forEach((line, index) => {
        if (line.trim().startsWith("## !scene")) {
          if (inScene) {
            let lastContentLine = index - 1;
            while (
              lastContentLine > sceneStartLine &&
              !lines[lastContentLine].trim()
            ) {
              lastContentLine--;
            }

            newDecorations.push({
              range: new this.monaco.Range(
                sceneStartLine,
                1,
                lastContentLine + 1,
                1,
              ),
              options: {
                isWholeLine: true,
                className: "scene-block",
                stickiness:
                  this.monaco.editor.TrackedRangeStickiness
                    .AlwaysGrowsWhenTypingAtEdges,
              },
            });
          }
          sceneStartLine = index + 1;
          inScene = true;
        }
      });

      // Second loop: Command and quoted string decorations
      lines.forEach((line, index) => {
        Array.from(this.plugins.values()).forEach((plugin) => {
          if (!plugin.matchesPattern(line)) return;

          // Command decoration (only the command portion)
          const cmdMatch = line.match(
            plugin.config.pattern.type === "directive" ? /!!\w+/ : /!\w+/,
          );
          if (cmdMatch) {
            newDecorations.push({
              range: new this.monaco.Range(
                index + 1,
                cmdMatch.index! + 1,
                index + 1,
                cmdMatch.index! + cmdMatch[0].length + 1,
              ),
              options: {
                inlineClassName: `command-${plugin.config.id}`, // command-text, command-transition, etc.
              },
            });
          }

          // Args in italic
          const argMatches = line.matchAll(/--\w+=([^-\s"]+|"[^"]*")/g);
          for (const match of argMatches) {
            const [fullMatch] = match;
            newDecorations.push({
              range: new this.monaco.Range(
                index + 1,
                match.index! + 1,
                index + 1,
                match.index! + fullMatch.length + 1,
              ),
              options: {
                inlineClassName: "command-arg",
              },
            });
          }
        });
      });

      // Clear old decorations and set new ones
      prevDecorationIds = model.deltaDecorations(
        prevDecorationIds,
        newDecorations,
      );
    };

    updateDecorations();
    model.onDidChangeContent(updateDecorations);
  }
}
