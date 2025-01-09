import type { SceneProperty } from "../types.x-editor";

export const EDITOR_PROPERTIES: Record<string, SceneProperty> = {
  section: {
    name: "section",
    prefix: "!",
    description: "Adds a section to the scene",
    arguments: {
      cols: {
        name: "cols",
        type: "number",
        required: false,
        description: "Number of columns in the grid",
      },
      rows: {
        name: "rows",
        type: "number",
        required: false,
        description: "Number of rows in the grid",
      },
      direction: {
        name: "direction",
        type: "string",
        required: false,
        description: "Direction of the grid",
        values: ["row", "column"],
      },
      gap: {
        name: "gap",
        type: "number",
        required: false,
        description: "Gap between grid items",
      },
      items: {
        name: "items",
        //@ts-ignore
        type: "array",
        required: true,
        description: "Array of items in the grid",
      },
    },
  },
};
