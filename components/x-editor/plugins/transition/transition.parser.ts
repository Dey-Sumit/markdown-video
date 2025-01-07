// transition.parser.ts
import BaseParser from "../../core/base/parser";
import { transitionConfig, defaultTransitionValues } from "./transition.config";

interface TransitionInputProps {
  type: string;
  duration: number;
  direction: string;
}

export interface TransitionOutputProps extends TransitionInputProps {
  durationInFrames: number;
}

export class TransitionPropsParser {
  private baseParser: BaseParser<TransitionInputProps>;

  constructor() {
    this.baseParser = new BaseParser(transitionConfig, defaultTransitionValues);
  }

  parse(input: string | string[]): {
    data: TransitionOutputProps;
  } {
    // If array, take only first item
    const singleInput = Array.isArray(input) ? input[0] : input;

    const baseResult = this.baseParser.parse(singleInput);
    console.log({ baseResult, singleInput, input });

    // Transform the single result
    return {
      data: this.transformProps(baseResult.data as TransitionInputProps),
    };
  }

  private transformProps(input: TransitionInputProps): TransitionOutputProps {
    return {
      ...input,
      durationInFrames: this.baseParser.calculateFrames(input.duration),
    };
  }
}

const transitionPropsParser = new TransitionPropsParser();
export default transitionPropsParser;
