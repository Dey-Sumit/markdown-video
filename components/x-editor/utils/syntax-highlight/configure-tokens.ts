import type { Monaco } from "@monaco-editor/react";

export const configureTokenizer = (monaco: Monaco) => {
  monaco.languages.setMonarchTokensProvider("markdown", {
    defaultToken: "",
    tokenizer: {
      root: [
        // Only our custom syntax
        [
          /^##\s*!!scene/,
          {
            token: "sceneProperty",
            log: "Found scene property", // For debugging
          },
        ],
        [
          /^!\w+/,
          {
            token: "property",
            log: "Found property",
          },
        ],
        [/--[\w]+/, "argumentKey"],
        [/=/, "argumentOperator"],
        [/=[^\s--]+/, "argumentValue"],
      ],
    },
  });
};
