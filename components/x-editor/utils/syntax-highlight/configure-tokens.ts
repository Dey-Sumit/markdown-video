import type { Monaco } from "@monaco-editor/react";
import { EDITOR_LANGUAGE } from "../../const";

export const configureTokenizer = (monaco: Monaco) => {
  monaco.languages.setMonarchTokensProvider(EDITOR_LANGUAGE, {
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
