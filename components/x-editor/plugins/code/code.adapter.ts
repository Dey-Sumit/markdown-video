import type { Monaco } from "@monaco-editor/react";
import { AbstractAdapter } from "../../core/base/adapter";
import type { CommandContext } from "../../core/types/adapter.type";
import { languages } from "monaco-editor";
import codeConfig from "./code.config";

export class CodeAdapter extends AbstractAdapter {
  private codeTemplates = {
    js: {
      label: "```js !",
      insertText:
        "```js ! --theme=${1:midnight} --font-size=${2:14}\nconst example = () => {\n  ${3}\n}\n```",
    },
    jsx: {
      label: "```jsx !",
      insertText:
        "```jsx ! --theme=${1:midnight} --font-size=${2:14}\nconst Component = () => {\n  return (\n    <div>\n      ${3}\n    </div>\n  )\n}\n```",
    },
    python: {
      label: "```python !",
      insertText:
        "```python ! --theme=${1:midnight} --font-size=${2:14}\ndef example():\n    ${3}\n```",
    },
    swift: {
      label: "```swift !",
      insertText:
        "```swift ! --theme=${1:midnight} --font-size=${2:14}\nfunc example() {\n    ${3}\n}\n```",
    },
  };

  constructor(monaco: Monaco) {
    super(monaco, codeConfig);
  }

  provideCompletions(context: CommandContext): languages.CompletionItem[] {
    const { lineContent, position } = context;

    if (this.isCodeBlockStart(lineContent)) {
      return this.getCodeBlockCompletions(context);
    }

    if (this.matchesPattern(lineContent)) {
      const type = this.getCompletionType(context);
      console.log("Completion type:", type);
    }

    return super.provideCompletions(context);
  }

  protected getCompletionType(
    context: CommandContext,
  ): "command" | "value" | "argument" | null {
    const { lineContent, position } = context;
    const type = super.getCompletionType(context);

    return type;
  }

  private isCodeBlockStart(lineContent: string): boolean {
    const trimmed = lineContent.trim();
    return /^`{1,4}$/.test(trimmed) || /^`{3,4}\w*$/.test(trimmed);
  }

  private isClosingCodeBlock(lineContent: string): boolean {
    return lineContent.trim() === "```";
  }

  matchesPattern(lineContent: string): boolean {
    const matches = new RegExp(this.config.pattern.pattern).test(lineContent);

    return matches;
  }

  private getCodeBlockCompletions(
    context: CommandContext,
  ): languages.CompletionItem[] {
    const { position, lineContent } = context;

    return Object.entries(this.codeTemplates).map(([lang, template]) => ({
      label: template.label,
      kind: this.monaco.languages.CompletionItemKind.Snippet,
      insertText: template.insertText.replace(/```$/, (match) =>
        match.slice(0, -1),
      ),
      insertTextRules:
        this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: "0" + lang,
      detail: "Code Block Template",
      documentation: {
        value: `Create a ${lang} code block`,
        isTrusted: true,
      },
      range: this.createRange(
        position,
        position.column - lineContent.trim().length,
        position.column,
      ),
    }));
  }
}
