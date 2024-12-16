import { Composition } from "remotion";
import CodeVideoComposition from ".";
import { calculateCompositionDuration } from "../composition.utils";
import { compositionMetaData } from "./config";
import { type CompositionStore } from "./types.composition";

// const HARDCODED_STEPS: CompositionStore["scenes"] = [];
// const HARDCODED_STYLES = {
//   backgroundContainer: {
//     background: "#000000",
//   },
//   sceneContainer: {
//     inset: 10,
//     padding: 10,
//   },
// };

import data from "../../../debug.json";

const HARDCODED_STEPS: CompositionStore["scenes"] = [
  {
    title: "--duration=5",
    children: {
      key: null,
      props: {},
      _owner: null,
      _store: {},
    },
    code: {
      meta: "",
      value:
        'const a = () => {\n    // !mark --color=red --duration=1\n    return "HELLO"\n    // !mark(1:2) --color=red --delay=3 --duration=3\n    return "HELLO"\n    return "HELLO"\n    // !mark --color=blue --delay=0.3 --duration=0.5\n    return "HELLO"\n    \n}\n',
      lang: "javascript",
      code: 'const a = () => {\n    return "HELLO"\n    return "HELLO"\n    return "HELLO"\n    return "HELLO"\n    \n}\n',
      tokens: [
        ["const", "#FF7B72"],
        " ",
        ["a", "#D2A8FF"],
        " ",
        ["=", "#FF7B72"],
        " ",
        ["()", "#C9D1D9"],
        " ",
        ["=>", "#FF7B72"],
        " ",
        ["{", "#C9D1D9"],
        "\n    ",
        ["return", "#FF7B72"],
        " ",
        ['"HELLO"', "#A5D6FF"],
        "\n    ",
        ["return", "#FF7B72"],
        " ",
        ['"HELLO"', "#A5D6FF"],
        "\n    ",
        ["return", "#FF7B72"],
        " ",
        ['"HELLO"', "#A5D6FF"],
        "\n    ",
        ["return", "#FF7B72"],
        " ",
        ['"HELLO"', "#A5D6FF"],
        "\n    \n",
        ["}", "#C9D1D9"],
        "\n",
      ],
      annotations: [
        {
          name: "mark",
          query: "--color=red --duration=1",
          fromLineNumber: 2,
          toLineNumber: 2,
        },
        {
          name: "mark",
          query: "--color=red --delay=3 --duration=3",
          fromLineNumber: 3,
          toLineNumber: 4,
        },
        {
          name: "mark",
          query: "--color=blue --delay=0.3 --duration=0.5",
          fromLineNumber: 5,
          toLineNumber: 5,
        },
      ],
      themeName: "github-dark",
      style: {
        color: "#c9d1d9",
        background: "#0d1117",
        colorScheme: "dark",
      },
    },
    font: "",
    transition: "--type=slide --duration=3",
    codeBlockUtils: "",
    media: "",
  },
];
const HARDCODED_STYLES: CompositionStore["styles"] = {
  backgroundContainer: {
    background: {
      activeType: "color",
      color: "#000000",
      gradient: {
        angle: 0,
        colors: ["red", "green"],
      },
    },
  },
  sceneContainer: {
    inset: 0,
    padding: 80,
    borderRadius: 10,
  },
};

export default function CodeTransitionCompositionLoader() {
  const { fps, height, width } = compositionMetaData;
  return (
    <Composition
      id="code-transition-composition"
      component={CodeVideoComposition}
      defaultProps={{
        scenes: HARDCODED_STEPS,
        styles: HARDCODED_STYLES,
      }}
      calculateMetadata={({ props }) => {
        const duration = calculateCompositionDuration(props.scenes) || 30;

        return {
          durationInFrames: duration,
          width: width,
          height: height,
          fps: fps,
        };
      }}
    />
  );
}
