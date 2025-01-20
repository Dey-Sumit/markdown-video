// plugins/highlight/parser.ts
import BaseParser from "../../core/base/parser";
import highlightConfig, { defaultHighlightArgValues } from "./highlight.config";

export interface HighlightInputProps {
  color: string;
  duration: number;
  delay: number;
}

export interface HighlightOutputProps extends HighlightInputProps {
  id: string;
  delayInFrames: number;
  durationInFrames: number;
}

export class HighlightParser {
  private baseParser: BaseParser<HighlightInputProps>;

  constructor() {
    this.baseParser = new BaseParser(
      highlightConfig,
      defaultHighlightArgValues,
    );
  }

  parse(input: string | string[]): {
    data: HighlightOutputProps;
  } {
    const baseResult = this.baseParser.parse(input);

    return {
      data: this.transformProps(baseResult.data as HighlightInputProps),
    };
  }

  private transformProps(input: HighlightInputProps): HighlightOutputProps {
    return {
      ...input,
      id: this.baseParser.generateId(),
      delayInFrames: this.baseParser.calculateFrames(input.delay),
      durationInFrames: this.baseParser.calculateFrames(input.duration),
    };
  }
}

const highlightParser = new HighlightParser();
export default highlightParser;
