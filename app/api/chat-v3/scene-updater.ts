import type {
  AISceneConfigType,
  AISceneUpdates,
  AiSceneUpdatesOriginalScene,
} from "./shared-types";
type UpdateSceneInput = {
  id: string;
  updates: AISceneUpdates;
  originalScene: AiSceneUpdatesOriginalScene;
};
function updateScene({ id, updates, originalScene }: UpdateSceneInput) {
  const updatedScene = structuredClone(originalScene);
  console.log("updateScene", { id, updates, originalScene, updatedScene });

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
            throw new Error("Content and animation required for new text");
          }
          texts.push({
            content: update.content,
            animation: update.animation,
            id: update.id,
          });
          break;

        case "update": {
          if (!update.id) {
            throw new Error("Id required for update"); // TODO : we should not throw error here, we should call the LLM again to ask for the index
          }

          const index = texts.findIndex((t) => t.id === update.id);
          if (index === -1) {
            throw new Error("Text component not found");
          }

          const { action, ...leanUpdate } = update;

          texts[index] = {
            ...texts[index],
            ...leanUpdate,
          };
          break;
        }
        case "remove": {
          if (!update.id) {
            throw new Error("Id required for remove");
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
