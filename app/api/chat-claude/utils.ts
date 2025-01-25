import type { z } from "zod";
import type {
  BaseSceneConfigSchemaWithIds,
  BaseSceneConfigSchemaWithoutIds,
} from "./shared-types";

export const attachIdsToScenes = (
  scenes: Array<z.infer<typeof BaseSceneConfigSchemaWithoutIds>>,
): Array<z.infer<typeof BaseSceneConfigSchemaWithIds>> => {
  return scenes.map((scene) => {
    const withIds = {
      ...scene,
      id: crypto.randomUUID(),
      components: {
        text: scene.components.text?.map((t) => ({
          ...t,
          id: crypto.randomUUID(),
        })),
        image: scene.components.image?.map((i) => ({
          ...i,
          id: crypto.randomUUID(),
        })),
        transition: scene.components.transition?.map((t) => ({
          ...t,
          id: crypto.randomUUID(),
        })),
      },
    };
    return withIds;
  });
};
