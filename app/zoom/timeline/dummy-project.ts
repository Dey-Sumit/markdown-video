import type { NestedCompositionProjectType } from "./timeline.types";

export const EMPTY_PROJECT_4: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      "layer-zoom": {
        id: "layer-zoom",
        name: "Layer 1",
        liteItems: [],
        isVisible: true,
        layerType: "normal",
      },
    },
    layerOrder: ["layer-zoom"],
    sequenceItems: {},
    compositionMetaData: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 1500,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};
