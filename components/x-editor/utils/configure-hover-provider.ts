import type { Monaco } from "@monaco-editor/react";

const HOVER_DOCS = {
  steps: {
    title: "Step Declaration",
    description: "Defines a new step in the code transition sequence",
    example: "## !!steps step-name",
  },
  duration: {
    title: "Duration Configuration",
    description: "Sets the duration (in frames) for this step",
    example: "!duration 180",
  },
  transition: {
    title: "Transition Effect",
    description: "Configures how this step transitions in",
    example: "!transition name:fade duration:500ms delay:0ms",
  },
  fontUtils: {
    title: "Font Utilities",
    description: "Controls text appearance in this step",
    example: "!fontUtils fontSize:54px",
  },
  codeBlockUtils: {
    title: "Code Block Utilities",
    description: "Controls code block appearance and behavior",
    example: "!codeBlockUtils centered",
  },
  callout: {
    title: "Code Callout",
    description: "Highlights specific code with annotations",
    example: "// !callout[/pattern/] Your description here",
  },
};

export const configureHoverProvider = (monaco: Monaco) => {
  monaco.languages.register({ id: "markdown" });

  monaco.languages.registerHoverProvider("markdown", {
    provideHover: (model, position) => {
      const line = model.getLineContent(position.lineNumber);
      const word = model.getWordAtPosition(position);

      // Step declaration hover
      const stepsMatch = line.match(/##\s*!!steps\s+(.+)/);
      if (stepsMatch) {
        return {
          contents: [
            { value: "# " + HOVER_DOCS.steps.title },
            { value: HOVER_DOCS.steps.description },
            { value: "```markdown\n" + HOVER_DOCS.steps.example + "\n```" },
          ],
        };
      }

      // Directive hovers
      const directiveMatch = line.match(
        /!(duration|transition|fontUtils|codeBlockUtils)/,
      );
      if (directiveMatch) {
        const directive = directiveMatch[1];
        const doc = HOVER_DOCS[directive];
        return {
          contents: [
            { value: "# " + doc.title },
            { value: doc.description },
            { value: "```markdown\n" + doc.example + "\n```" },
          ],
        };
      }

      // Transition property hover
      const transitionPropMatch = line.match(
        /!transition.*?(name|duration|delay):/,
      );
      if (transitionPropMatch) {
        const prop = transitionPropMatch[1];
        return {
          contents: [
            { value: "## Transition Property: " + prop },
            { value: getTransitionPropDescription(prop) },
          ],
        };
      }

      // Callout hover
      const calloutMatch = line.match(/!callout\[(.+?)\]/);
      if (calloutMatch) {
        return {
          contents: [
            { value: "# " + HOVER_DOCS.callout.title },
            { value: HOVER_DOCS.callout.description },
            { value: "```markdown\n" + HOVER_DOCS.callout.example + "\n```" },
          ],
        };
      }

      return null;
    },
  });
};

function getTransitionPropDescription(prop: string): string {
  const descriptions = {
    name: "The type of transition effect (e.g., fade, slide-from-top)",
    duration: "How long the transition takes to complete",
    delay: "Time to wait before starting the transition",
  };
  return descriptions[prop] || "Transition property";
}
