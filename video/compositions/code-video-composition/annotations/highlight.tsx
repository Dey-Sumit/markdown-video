import {
  type AnnotationHandler,
  type CodeAnnotation,
  type InlineAnnotation,
  InnerLine,
} from "codehike/code";
import {
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { parseColorToRGBA } from "@/utils/utils";
import { convertSecondsToFramerate } from "../../composition.utils";
import highlightParser from "@/components/x-editor/plugins/highlight/highlight.parser";
import { validateHighlight } from "@/components/x-editor/plugins/highlight/highlight.utils";

export const highlight: AnnotationHandler = {
  name: "highlight",

  transform: (annotation: CodeAnnotation) => {
    return annotation;
    /*    // Validate the annotation
    const { annotation: validatedAnnotation, issues } =
      validateHighlight(annotation);

    // You can log or handle validation issues
    if (issues.length > 0) {
      console.warn("Highlight validation issues:", issues);
    }

    // Return the validated annotation (will have fallback values if needed)
    return validatedAnnotation; */
  },

  AnnotatedLine: ({ annotation, ...props }) => {
    const { fps } = useVideoConfig();
    const {
      data: { color, delayInFrames, durationInFrames },
    } = highlightParser.parse(annotation.query);
    console.log("color", color, "delayInFrames", delayInFrames);

    const { r: red, g: green, b: blue } = parseColorToRGBA(color);

    const MARK_TRANSITION_DURATION_IN_FRAMES = convertSecondsToFramerate(
      0.9,
      fps,
    );

    const frame = useCurrentFrame();
    const progress = interpolate(
      frame,
      [delayInFrames, delayInFrames + MARK_TRANSITION_DURATION_IN_FRAMES],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", `rgba(${red}, ${green}, ${blue}, 0.25)`],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", `rgba(${red}, ${green}, ${blue}, 1)`],
    );

    return (
      <div
        {...props}
        style={{
          backgroundColor,
          padding: "0.25rem 0.75rem",
          margin: "0 0 0 -0.5rem ",
          borderLeft: `4px solid ${borderColor}`,
        }}
      >
        <InnerLine merge={props} className="highlight" />
      </div>
    );
  },

  Inline: ({ children, annotation }) => {
    const {
      data: { color, delayInFrames, durationInFrames },
    } = highlightParser.parse(annotation.query);
    const { r: red, g: green, b: blue } = parseColorToRGBA(color);
    const { fps } = useVideoConfig();

    const MARK_TRANSITION_DURATION_IN_FRAMES = convertSecondsToFramerate(
      0.9,
      fps,
    );

    const frame = useCurrentFrame();

    const progress = interpolate(
      frame,
      [delayInFrames, delayInFrames + MARK_TRANSITION_DURATION_IN_FRAMES],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    const backgroundColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", `rgba(${red}, ${green}, ${blue}, 0.25)`],
    );

    const borderColor = interpolateColors(
      progress,
      [0, 1],
      ["rgba(0, 0, 0, 0)", `rgba(${red}, ${green}, ${blue}, 1)`],
    );

    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          borderRadius: 4,
          padding: "0.25rem 0.75rem",
          margin: "0 -.125rem",
          border: `2px solid ${borderColor}`,
        }}
      >
        {children}
      </div>
    );
  },
};
