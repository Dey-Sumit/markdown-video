import type {
  AISceneUpdates,
  AiSceneUpdatesOriginalScene__Claude,
} from "./shared-types";
type UpdateSceneInput = {
  id: string;
  updates: AISceneUpdates;
  originalScene: AiSceneUpdatesOriginalScene__Claude;
};
function updateScene({ id, updates, originalScene }: UpdateSceneInput) {
  const updatedScene = structuredClone(originalScene);
  console.log(
    "updateScene util function ",
    JSON.stringify({ id, updates, originalScene }),
  );

  // Update scene props
  if (updates.sceneProps) {
    updatedScene.sceneProps = {
      ...updatedScene.sceneProps,
      ...updates.sceneProps,
    };
  }

  // Update components
  if (updates.components?.text) {
    for (const update of updates.components.text) {
      const texts = updatedScene.components.text || [];

      switch (update.action) {
        case "add":
          if (!update.content || !update.animation) {
            return texts; // NO CHANGE
          }
          texts.push({
            content: update.content,
            animation: update.animation,
            id: update.id,
          });
          break;

        case "update": {
          if (!update.id) {
            return texts; // NO CHANGE
            // throw new Error("Id required for update"); // TODO : we should not throw error here, we should call the LLM again to ask for the index
          }

          const index = texts.findIndex((t) => t.id === update.id);
          if (index === -1) {
            return texts; // NO CHANGE
            // throw new Error("Text component not found");
          }

          const { action, ...leanUpdate } = update;
          console.log({ action });

          texts[index] = {
            ...texts[index],
            ...leanUpdate,
          };
          break;
        }
        case "remove": {
          if (!update.id) {
            // throw new Error("Id required for remove");
            return texts; // NO CHANGE
          }

          const index = texts.findIndex((t) => t.id === update.id);
          texts.splice(index, 1);
          break;
        }
      }

      updatedScene.components.text = texts;
    }
  }

  return updatedScene;
}

export default updateScene;
