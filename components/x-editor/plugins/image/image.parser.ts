// plugins/image/image.parser.ts
import BaseParser from "../../core/base/parser";
import imageConfig, { defaultImageArgValues } from "./image.config";
import type { ImageInputProps, ImageOutputProps } from "./image.types";

export class ImagePropsParser {
  private baseParser: BaseParser<ImageInputProps>;

  constructor() {
    this.baseParser = new BaseParser(imageConfig, defaultImageArgValues);
  }

  parse(input: string[]): {
    data: ImageOutputProps[];
    isValid: boolean[];
  } {
    const baseResult = this.baseParser.parse(input);

    // Convert single input to array if needed
    const inputArray = Array.isArray(baseResult.data)
      ? (baseResult.data as ImageInputProps[])
      : [baseResult.data as ImageInputProps];

    // Transform each item
    const transformedData = inputArray.map(this.transformProps.bind(this));

    // Validate each item
    const validationResults = transformedData.map(this.validateMinimumCriteria);

    return {
      data: transformedData,
      isValid: validationResults,
    };
  }

  private transformProps(input: ImageInputProps): ImageOutputProps {
    return {
      ...input,
      id: this.baseParser.generateId(),
      delayInFrames: this.baseParser.calculateFrames(input.delay),
      durationInFrames: this.baseParser.calculateFrames(input.duration),
    };
  }

  private validateMinimumCriteria(props: ImageOutputProps): boolean {
    // Check for required fields and basic validation
    if (!props.src) return false;
    if (props.width < 50 || props.height < 50) return false;
    if (props.duration < 0.1) return false;

    // Validate URL format
    // Remove quotes if present
    const cleanSrc = props.src.replace(/^["']|["']$/g, "");

    try {
      new URL(cleanSrc);
      return true;
    } catch {
      // If it's not a valid URL, check if it's a valid file path
      return /^\/.*$/.test(cleanSrc);
    }
  }
}

const imageParser = new ImagePropsParser();
export default imageParser;
