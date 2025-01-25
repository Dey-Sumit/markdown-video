// text.parser.ts
import BaseParser from "../../core/base/parser";
import textConfig, { defaultTextArgValues } from "./text.config";
import type { TextInputProps, TextOutputProps } from "./text.types";

export class TextPropsParser {
  private baseParser: BaseParser<TextInputProps>;

  constructor() {
    this.baseParser = new BaseParser(textConfig, defaultTextArgValues);
  }

  parse(input: string[]): {
    data: TextOutputProps[];
  } {
    const baseResult = this.baseParser.parse(input);

    // Convert single input to array if needed
    const inputArray = Array.isArray(baseResult.data)
      ? (baseResult.data as TextInputProps[])
      : [baseResult.data as TextInputProps];

    // Transform each item
    return {
      data: inputArray.map(this.transformProps.bind(this)),
    };
  }

  private transformProps(input: TextInputProps): TextOutputProps {
    return {
      ...input,
      delayInFrames: this.baseParser.calculateFrames(input.delay),
      id: this.baseParser.generateId(),
    };
  }
}

const textParser = new TextPropsParser();
export default textParser;
