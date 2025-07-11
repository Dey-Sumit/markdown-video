import type {
  AIImageComponentType,
  AITextComponentType,
  AITransitionComponentType,
} from "@/app/api/chat-claude/shared-types";

interface SceneConfig {
  id: string;
  sceneProps: {
    duration: number;
    background?: string;
  };
  components: {
    text?: AITextComponentType[];
    image?: AIImageComponentType[];
    transition?: AITransitionComponentType[];
  };
}

class SceneReverseParser {
  private indent = "  ";

  parse(config: SceneConfig): string {
    try {
      const lines: string[] = [];
      lines.push(this.parseSceneDirective(config));
      lines.push(""); // Add empty line after scene directive

      if (config.components) {
        if (config.components.text) {
          config.components.text.forEach((text) => {
            lines.push(`  ${this.parseTextComponent(text)}`);
          });
        }

        if (config.components.image) {
          config.components.image.forEach((image) => {
            lines.push(`  ${this.parseImageComponent(image)}`);
          });
        }

        if (config.components.transition?.[0]) {
          lines.push(
            `  ${this.parseTransitionComponent(config.components.transition[0])}`,
          );
        }
      }

      return lines.join("\n");
    } catch (error) {
      throw new Error(
        `Failed to parse scene config: ${(error as Error).message}`,
      );
    }
  }

  private parseSceneDirective(config: SceneConfig): string {
    const props = [`--duration=${config.sceneProps.duration}`];

    if (config.sceneProps.background) {
      props.push(
        `--background=${this.formatValue(config.sceneProps.background)}`,
      );
    }

    return `# !scene ${props.join(" ")}`;
  }

  private parseTextComponent(text: AITextComponentType): string {
    return `!text --content=${this.formatValue(text.content)} --animation=${text.animation}`;
  }

  private parseImageComponent(image: AIImageComponentType): string {
    return `!image --src=${this.formatValue(image.src)} --animation=${image.animation}`;
  }

  private parseTransitionComponent(
    transition: AITransitionComponentType,
  ): string {
    return `!transition --type=${transition.type} --duration=${transition.duration}`;
  }

  private formatValue(value: string): string {
    return /[\s"'`!@#$%^&*()\[\]{}\\|;:,.<>?/~]/.test(value)
      ? `"${value.replace(/"/g, '\\"')}"`
      : value;
  }
}

export const sceneReverseParser = new SceneReverseParser();
