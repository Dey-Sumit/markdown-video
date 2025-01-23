export class SceneUpdater {
  updateScene({ id, update, originalScene }: UpdateSceneInput): SceneConfig {
    const sceneConfig = originalScene.sceneConfig;
    const updatedScene = structuredClone(sceneConfig);

    // Update scene props
    if (update.sceneProps) {
      updatedScene.sceneProps = {
        ...updatedScene.sceneProps,
        ...update.sceneProps,
      };
    }

    // Update components
    if (update.components) {
      updatedScene.components = updatedScene.components || {};

      // Update text components
      if (update.components.text) {
        updatedScene.components.text = updatedScene.components.text || [];
        update.components.text.forEach((textUpdate) => {
          if (updatedScene.components.text[textUpdate.index]) {
            updatedScene.components.text[textUpdate.index] = {
              ...updatedScene.components.text[textUpdate.index],
              ...textUpdate,
            };
          }
        });
      }

      // Update transition
      if (update.components.transition) {
        updatedScene.components.transition = update.components.transition;
      }
    }

    this.validate(updatedScene);
    return updatedScene;
  }

  private validate(scene: SceneConfig) {
    const { duration } = scene.sceneProps;
    if (duration < 0.5 || duration > 30) {
      throw new Error("Duration must be between 0.5 and 30 seconds");
    }

    if (scene.components.transition?.length > 1) {
      throw new Error("Maximum one transition allowed");
    }

    if (scene.components.text?.length > 10) {
      throw new Error("Maximum 10 text components allowed");
    }
  }
}

export const updater = new SceneUpdater();
