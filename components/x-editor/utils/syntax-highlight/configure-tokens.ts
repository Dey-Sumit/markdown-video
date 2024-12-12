import type { Monaco } from "@monaco-editor/react";

export const configureTokenizer = (monaco: Monaco) => {
  monaco.languages.setMonarchTokensProvider("markdown", {
    tokenizer: {
      root: [
        // Keep existing markdown rules
        [/^#\s+.*$/, "heading"],
        [/\*\*(.*?)\*\*/, "strong"],
        [/\*(.*?)\*/, "emphasis"],
        [/\[.*?\]\(.*?\)/, "link"],

        // Add our custom syntax rules
        [/^##\s*!!scene/, "sceneProperty"],
        [/^!\w+/, "property"],
        [/--[\w]+/, "argumentKey"],
        [/=/, "argumentOperator"],
        // Just use a simple token for value without state change
        [/=[^\s--]+/, "argumentValue"],
      ],
    },
  });
};
