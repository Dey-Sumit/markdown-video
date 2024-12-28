import { editor, languages, Range } from "monaco-editor";
export function provideCodeActions(
  model: editor.ITextModel,
  range: Range,
  context: languages.CodeActionContext,
): languages.CodeActionList {
  const actions: languages.CodeAction[] = [];

  context.markers.forEach((marker) => {
    console.log("Marker:", {
      code: marker.code,
      message: marker.message,
      severity: marker.severity,
      startLineNumber: marker.startLineNumber,
    });
    switch (marker.code) {
      case "invalid-code-block-format":
        actions.push(createCodeBlockFormatFix(model, marker));
        break;
    }
  });

  return {
    actions,
    dispose: () => {},
  };
}

function createCodeBlockFormatFix(
  model: editor.ITextModel,
  marker: editor.IMarkerData,
): languages.CodeAction {
  const lineContent = model.getLineContent(marker.startLineNumber);
  const match = lineContent.match(/^```(\w+)(.*)/);

  if (!match) {
    return {
      title: "Fix code block format",
      kind: "quickfix",
      diagnostics: [marker],
      edit: { edits: [] },
    };
  }

  const [, lang, rest] = match;
  const newText = `\`\`\`${lang} !${rest}`;

  return {
    title: "Fix code block format",
    kind: "quickfix",
    diagnostics: [marker],
    edit: {
      edits: [
        {
          resource: model.uri,
          textEdit: {
            range: {
              startLineNumber: marker.startLineNumber,
              startColumn: 1,
              endLineNumber: marker.startLineNumber,
              endColumn: lineContent.length + 1,
            },
            text: newText,
          },
          versionId: model.getVersionId(),
        },
      ],
    },
  };
}
