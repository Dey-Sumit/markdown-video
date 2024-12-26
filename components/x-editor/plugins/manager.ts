import type { Monaco } from "@monaco-editor/react";
import type { editor, IDisposable, languages, Position } from "monaco-editor";
import type {
  EditorContext,
  ICompletionProvider,
  IDiagnosticsProvider,
} from "./types";
import type BasePropertyAdapter from "./adapters/base";

/**
 * Main plugin manager class
 */
class MarkdownVideoPlugin {
  private propertyAdapters: Map<string, BasePropertyAdapter> = new Map();
  private disposables: IDisposable[] = [];

  constructor(
    private readonly monaco: Monaco,
    private readonly model: editor.ITextModel,
  ) {}

  /**
   * Register a new property adapter
   */
  registerProperty(adapter: BasePropertyAdapter): void {
    this.propertyAdapters.set(adapter.name, adapter);
  }

  /**
   * Activate the plugin and register all providers
   */
  activate(): IDisposable {
    // Register completion provider
    const completionDisposable =
      this.monaco.languages.registerCompletionItemProvider("markdown", {
        triggerCharacters: ["!", " ", "-", "="],
        provideCompletionItems: (model, position) => {
          return this.handleCompletions(model, position);
        },
      });

    // Register diagnostics listener
    const diagnosticsDisposable = this.model.onDidChangeContent(() => {
      this.handleDiagnostics();
    });

    this.disposables.push(completionDisposable, diagnosticsDisposable);

    // Run initial diagnostics
    this.handleDiagnostics();

    // Return a disposable for cleanup
    return {
      dispose: () => {
        this.disposables.forEach((d) => d?.dispose());
      },
    };
  }

  /**
   * Handle completion requests
   */
  private handleCompletions(
    model: editor.ITextModel,
    position: Position,
  ): languages.CompletionList {
    const wordUntilPosition = model.getWordUntilPosition(position);
    const wordRange = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: wordUntilPosition.startColumn,
      endColumn: wordUntilPosition.endColumn,
    };

    const context: EditorContext = {
      lineContent: model.getLineContent(position.lineNumber),
      position,
      model,
      wordRange,
    };

    const suggestions: languages.CompletionItem[] = [];

    for (const adapter of this.propertyAdapters.values()) {
      if ("provideCompletions" in adapter) {
        suggestions.push(
          ...(adapter as ICompletionProvider).provideCompletions(context),
        );
      }
    }

    return { suggestions };
  }

  /**
   * Handle diagnostics updates
   */
  private handleDiagnostics(): void {
    const markers: editor.IMarkerData[] = [];

    for (
      let lineNumber = 1;
      lineNumber <= this.model.getLineCount();
      lineNumber++
    ) {
      const context: EditorContext = {
        lineContent: this.model.getLineContent(lineNumber),
        position: new this.monaco.Position(lineNumber, 1),
        model: this.model,
      };

      for (const adapter of this.propertyAdapters.values()) {
        if ("provideDiagnostics" in adapter) {
          markers.push(
            ...(adapter as IDiagnosticsProvider).provideDiagnostics(context),
          );
        }
      }
    }

    this.monaco.editor.setModelMarkers(this.model, "markdown-video", markers);
  }
}

export default MarkdownVideoPlugin;
