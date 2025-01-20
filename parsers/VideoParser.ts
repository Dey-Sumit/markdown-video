interface VideoProps {
  src: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  volume?: number;
  muted?: boolean;
  loop?: boolean;
  playbackRate?: number;
  borderRadius?: number;
  border?: number;
}

interface VideoParserConfig {
  defaultProps?: Partial<VideoProps>;
  fps?: number;
}

interface VideoParserResponse {
  startTimeInFrames: number;
  endTimeInFrames?: number;
  durationInFrames: number;
  src: string;
  volume: number;
  muted: boolean;
  loop: boolean;
  playbackRate: number;
  borderRadius: number;
  border: number;
}

class VideoParser {
  private defaultConfig: VideoProps;
  private framerate: number;

  constructor(config?: VideoParserConfig) {
    this.framerate = config?.fps || 30;
    this.defaultConfig = {
      src: "",
      duration: 5,
      startTime: 0,
      volume: 1,
      muted: false,
      loop: false,
      playbackRate: 1,
      borderRadius: 0,
      border: 0,
      ...config?.defaultProps,
    };
  }

  private secondsToFrames(seconds: number): number {
    return Math.floor(seconds * this.framerate);
  }

  private processValue(
    key: keyof VideoProps,
    value: string,
    errors: string[],
  ): any {
    try {
      switch (key) {
        case "duration":
        case "startTime":
        case "endTime":
        case "volume":
        case "playbackRate":
        case "borderRadius":
        case "border": {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`Invalid number for ${key}: ${value}`);
            return this.defaultConfig[key];
          }
          return num;
        }
        case "muted":
        case "loop":
          return value === "true";
        default:
          return value;
      }
    } catch (error) {
      errors.push(`Error processing ${key}: ${value}`);
      return this.defaultConfig[key];
    }
  }

  parse(input: string): { data: VideoParserResponse; errors: string[] } {
    const result: VideoProps = { ...this.defaultConfig };
    const errors: string[] = [];

    const matches = input.matchAll(/--(\w+)=(?:"([^"]*?)"|([^\s]*))/g);

    for (const [, key, quotedValue, unquotedValue] of matches) {
      if (key in this.defaultConfig) {
        const value = quotedValue || unquotedValue;
        // @ts-ignore - key is a string, but we know it's a key of VideoProps
        result[key as keyof VideoProps] = this.processValue(
          key as keyof VideoProps,
          value,
          errors,
        );
      }
    }

    if (!result.src) errors.push("src is required");
    if (result.volume && (result.volume < 0 || result.volume > 1)) {
      errors.push("Volume must be between 0 and 1");
      result.volume = this.defaultConfig.volume;
    }
    if (result.playbackRate && result.playbackRate <= 0) {
      errors.push("Playback rate must be greater than 0");
      result.playbackRate = this.defaultConfig.playbackRate;
    }

    return {
      data: {
        src: result.src,
        startTimeInFrames: this.secondsToFrames(result.startTime!),
        endTimeInFrames: result.endTime
          ? this.secondsToFrames(result.endTime)
          : undefined,
        durationInFrames: this.secondsToFrames(result.duration!),
        volume: result.volume!,
        muted: result.muted!,
        loop: result.loop!,
        playbackRate: result.playbackRate!,
        borderRadius: result.borderRadius!,
        border: result.border!,
      },
      errors,
    };
  }
}

export default VideoParser;
