// transition.parser.ts
import BaseParser from "../../core/base/parser";
import { transitionConfig, defaultTransitionValues } from "./config";

interface TransitionInputProps {
  type: string;
  duration: number;
  direction: string;
}

interface TransitionOutputProps extends TransitionInputProps {
  durationInFrames: number;
}

export class TransitionPropsParser {
  private baseParser: BaseParser<TransitionInputProps>;

  constructor() {
    this.baseParser = new BaseParser(transitionConfig, defaultTransitionValues);
  }

  parse(input: string | string[]): {
    data: TransitionOutputProps[];
  } {
    const baseResult = this.baseParser.parse(input);

    // Convert single input to array if needed
    const inputArray = Array.isArray(baseResult.data)
      ? (baseResult.data as TransitionInputProps[])
      : [baseResult.data as TransitionInputProps];

    // Transform each item
    return {
      data: inputArray.map(this.transformProps.bind(this)),
    };
  }

  private transformProps(input: TransitionInputProps): TransitionOutputProps {
    return {
      ...input,
      durationInFrames: this.baseParser.calculateFrames(input.duration),
    };
  }
}

export default new TransitionPropsParser();
