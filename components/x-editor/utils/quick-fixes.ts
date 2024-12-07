import { editor, languages, Range } from "monaco-editor";
import { XMONACO_CONSTANTS } from "../const";

export function provideCodeActions(
  model: editor.ITextModel,
  range: Range,
  context: languages.CodeActionContext
): languages.CodeActionList {
  const actions: languages.CodeAction[] = [];

  context.markers.forEach((marker) => {
    switch (marker.code) {
      case "missing-step-name":
        actions.push(createStepNameFix(model, marker));
        break;

      case "invalid-duration":
        actions.push(createDurationFix(model, marker));
        break;

      case "invalid-transition":
        actions.push(...createTransitionFixes(model, marker));
        break;

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

function createStepNameFix(
  model: editor.ITextModel,
  marker: editor.IMarkerData
): languages.CodeAction {
  return {
    title: "Add step name",
    kind: "quickfix",
    diagnostics: [marker],
    isPreferred: true,
    edit: {
      edits: [
        {
          resource: model.uri,
          textEdit: {
            range: marker,
            text: `## !!steps step-${Date.now()}`,
          },
          versionId: model.getVersionId(),
        },
      ],
    },
  };
}

function createDurationFix(
  model: editor.ITextModel,
  marker: editor.IMarkerData
): languages.CodeAction {
  return {
    title: `Set duration to ${XMONACO_CONSTANTS.CODE_COMP_TRANSITION_DURATION}`,
    kind: "quickfix",
    diagnostics: [marker],
    isPreferred: true,
    edit: {
      edits: [
        {
          resource: model.uri,
          textEdit: {
            range: marker,
            text: `!duration ${XMONACO_CONSTANTS.CODE_COMP_TRANSITION_DURATION}`,
          },
          versionId: model.getVersionId(),
        },
      ],
    },
  };
}

function createTransitionFixes(
  model: editor.ITextModel,
  marker: editor.IMarkerData
): languages.CodeAction[] {
  return XMONACO_CONSTANTS.VALID_TRANSITIONS.map((transition) => ({
    title: `Change to '${transition}'`,
    kind: "quickfix",
    diagnostics: [marker],
    edit: {
      edits: [
        {
          resource: model.uri,
          textEdit: {
            range: marker,
            text: `!transition ${transition}`,
          },
          versionId: model.getVersionId(),
        },
      ],
    },
  }));
}

function createCodeBlockFormatFix(
  model: editor.ITextModel,
  marker: editor.IMarkerData
): languages.CodeAction {
  const line = model.getLineContent(marker.startLineNumber);
  const lang = line.match(/^```(\w+)/)?.[1] || "";

  return {
    title: "Fix code block format",
    kind: "quickfix",
    diagnostics: [marker],
    isPreferred: true,
    edit: {
      edits: [
        {
          resource: model.uri,
          textEdit: {
            range: marker,
            text: `\`\`\`${lang} !`,
          },
          versionId: model.getVersionId(),
        },
      ],
    },
  };
}
