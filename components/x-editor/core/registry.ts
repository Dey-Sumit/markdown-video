// components/x-editor/core/registry.ts
import type { Monaco } from "@monaco-editor/react";
import type { BaseAdapter } from "./types/adapter.type";
import type { editor, IDisposable, languages } from "monaco-editor";
import { EDITOR_LANGUAGE } from "../const";
interface FoldingRange {
  start: number;
  end: number;
  kind?: languages.FoldingRangeKind;
}

/* const configureMonacoLanguage = (monaco: Monaco) => {
  monaco.languages.setMonarchTokensProvider(EDITOR_LANGUAGE, {
    tokenizer: {
      root: [
        // Handle the entire quoted string content as a single token
        [/(--\w+=)(".*?")/, ["argument", "string"]],

        // Command tokens
        [/![\w-]+/, "keyword"],

        // Argument names (when not part of the full argument pattern above)
        [/--[\w-]+/, "argument"],

        // Only apply markdown emphasis outside of quotes and command arguments
        [/(?<!["\\])[_](.*?)[_](?!["\\])/, "emphasis"],
      ],
    },
  });
}; */

export class PluginRegistry {
  private plugins: Map<string, BaseAdapter> = new Map();

  constructor(private readonly monaco: Monaco) {
    // Configure language when registry is initialized
    //  configureMonacoLanguage(monaco);
  }

  register(plugin: BaseAdapter): void {
    this.plugins.set(plugin.config.id, plugin);
  }

  registerCompletions(model: editor.ITextModel): void {
    console.log("Registering plugins:", Array.from(this.plugins.keys()));

    this.monaco.languages.registerCompletionItemProvider(EDITOR_LANGUAGE, {
      triggerCharacters: ["!", "-", "=", "#", "`"],
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
          const argMatches = line.matchAll(/--(\w+)(?==)/g);
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

      // Handle the last scene block if exists
      if (inScene) {
        newDecorations.push({
          range: new this.monaco.Range(sceneStartLine, 1, lines.length, 1),
          options: {
            isWholeLine: true,
            className: "scene-block",
            stickiness:
              this.monaco.editor.TrackedRangeStickiness
                .AlwaysGrowsWhenTypingAtEdges,
          },
        });
      }

      // Clear old decorations and set new ones
      prevDecorationIds = model.deltaDecorations(
        prevDecorationIds,
        newDecorations,
      );
    };

    updateDecorations();
    model.onDidChangeContent(updateDecorations);
  }

  registerFoldingRanges(monaco: Monaco): void {
    monaco.languages.registerFoldingRangeProvider(EDITOR_LANGUAGE, {
      provideFoldingRanges: (model) => {
        const ranges: FoldingRange[] = [];
        const lineCount = model.getLineCount();
        let sceneStart = -1;
        let codeBlockStart = -1;

        const isEmptyLine = (ln: number) =>
          model.getLineContent(ln).trim() === "";
        // const findNextNonEmpty = (from: number): number => {
        //   let ln = from;
        //   while (ln <= lineCount && isEmptyLine(ln)) ln++;
        //   return ln;
        // };
        const findPrevNonEmpty = (from: number): number => {
          let ln = from;
          while (ln > 0 && isEmptyLine(ln)) ln--;
          return ln;
        };

        for (let ln = 1; ln <= lineCount; ln++) {
          const line = model.getLineContent(ln);

          if (line.match(/^##\s*!scene\s+.+/)) {
            if (sceneStart !== -1) {
              ranges.push({
                start: sceneStart,
                end: findPrevNonEmpty(ln - 1),
                kind: monaco.languages.FoldingRangeKind.Region,
              });
            }
            sceneStart = ln;
          }

          if (line.match(/^```\w+/)) {
            codeBlockStart = ln;
          } else if (line.match(/^```$/) && codeBlockStart !== -1) {
            ranges.push({
              start: codeBlockStart,
              end: ln,
              kind: monaco.languages.FoldingRangeKind.Comment,
            });
            codeBlockStart = -1;
          }
        }

        if (sceneStart !== -1) {
          ranges.push({
            start: sceneStart,
            end: findPrevNonEmpty(lineCount),
            kind: monaco.languages.FoldingRangeKind.Region,
          });
        }

        return ranges;
      },
    });
  }
}
