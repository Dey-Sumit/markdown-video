import type {
  BlockAnnotation,
  InlineAnnotation,
  CodeAnnotation,
} from "codehike/code";

/**
 * Defines the types of validation issues that can occur in highlight annotations
 */
export type HighlightValidationIssueType =
  | "COLUMN_RANGE" // fromColumn > toColumn
  | "COLUMN_START" // fromColumn < 1
  | "COLUMN_BOUNDS" // columns exceed line length
  | "LINE_RANGE" // fromLineNumber > toLineNumber
  | "LINE_START"; // fromLineNumber < 1

/**
 * Represents a validation issue found during highlight validation
 */
export interface HighlightValidationIssue {
  type: HighlightValidationIssueType;
  message: string;
  severity: "warning" | "error";
}

/**
 * Result of validation containing both the potentially modified annotation
 * and any validation issues found
 */
export interface ValidationResult {
  annotation: CodeAnnotation;
  issues: HighlightValidationIssue[];
}

/**
 * Type guard to check if an annotation is an InlineAnnotation
 * @param annotation The annotation to check
 * @returns True if the annotation is an InlineAnnotation
 */
export const isInlineAnnotation = (
  annotation: CodeAnnotation,
): annotation is InlineAnnotation => {
  return (
    "lineNumber" in annotation &&
    "fromColumn" in annotation &&
    "toColumn" in annotation
  );
};

/**
 * Type guard to check if an annotation is a BlockAnnotation
 * @param annotation The annotation to check
 * @returns True if the annotation is a BlockAnnotation
 */
export const isBlockAnnotation = (
  annotation: CodeAnnotation,
): annotation is BlockAnnotation => {
  return "fromLineNumber" in annotation && "toLineNumber" in annotation;
};

/**
 * Validates an inline highlight annotation and returns fallback values if needed
 * @param annotation The inline annotation to validate
 * @returns ValidationResult containing potentially modified annotation and any validation issues
 */
export const validateInlineHighlight = (
  annotation: InlineAnnotation,
): ValidationResult => {
  const issues: HighlightValidationIssue[] = [];
  let { fromColumn, toColumn } = annotation;

  // Validate starting column
  if (fromColumn < 1) {
    issues.push({
      type: "COLUMN_START",
      message: "Starting column must be 1 or greater",
      severity: "error",
    });
    fromColumn = 1; // Fallback to 1
  }

  // Validate column range
  if (fromColumn >= toColumn) {
    issues.push({
      type: "COLUMN_RANGE",
      message: "Starting column must be less than ending column",
      severity: "warning",
    });
    // Fallback: extend by 1 from start
    toColumn = fromColumn + 1;
  }

  // Create modified annotation with fallback values if needed
  const modifiedAnnotation: InlineAnnotation = {
    ...annotation,
    fromColumn,
    toColumn,
  };

  return {
    annotation: modifiedAnnotation,
    issues,
  };
};

/**
 * Generates fallback values for an invalid inline highlight
 * @param annotation The original annotation
 * @returns Safe fallback values
 */
export const getInlineFallbackValues = (annotation: InlineAnnotation) => {
  const { fromColumn, toColumn } = annotation;

  return {
    fromColumn: fromColumn < 1 ? 1 : fromColumn,
    toColumn: fromColumn >= toColumn ? fromColumn + 1 : toColumn,
  };
};

/**
 * Applies validation and returns a safe version of the highlight annotation
 * @param annotation The annotation to validate and transform
 * @returns ValidationResult containing safe annotation and any validation issues
 */
/**
 * Validates a block highlight annotation and returns fallback values if needed
 * @param annotation The block annotation to validate
 * @returns ValidationResult containing potentially modified annotation and any validation issues
 */
export const validateBlockHighlight = (
  annotation: BlockAnnotation,
): ValidationResult => {
  const issues: HighlightValidationIssue[] = [];
  let { fromLineNumber, toLineNumber } = annotation;

  // Validate starting line
  if (fromLineNumber < 1) {
    issues.push({
      type: "LINE_START",
      message: "Starting line must be 1 or greater",
      severity: "error",
    });
    fromLineNumber = 1; // Fallback to 1
  }

  // Validate line range
  if (fromLineNumber > toLineNumber) {
    issues.push({
      type: "LINE_RANGE",
      message: "Starting line must be less than or equal to ending line",
      severity: "warning",
    });
    // Fallback: make it a single line highlight
    toLineNumber = fromLineNumber;
  }

  // Create modified annotation with fallback values if needed
  const modifiedAnnotation: BlockAnnotation = {
    ...annotation,
    fromLineNumber,
    toLineNumber,
  };

  return {
    annotation: modifiedAnnotation,
    issues,
  };
};

/**
 * Generates fallback values for an invalid block highlight
 * @param annotation The original annotation
 * @returns Safe fallback values
 */
export const getBlockFallbackValues = (annotation: BlockAnnotation) => {
  const { fromLineNumber, toLineNumber } = annotation;

  return {
    fromLineNumber: fromLineNumber < 1 ? 1 : fromLineNumber,
    toLineNumber: fromLineNumber > toLineNumber ? fromLineNumber : toLineNumber,
  };
};

export const validateHighlight = (
  annotation: CodeAnnotation,
): ValidationResult => {
  if (isInlineAnnotation(annotation)) {
    return validateInlineHighlight(annotation);
  }

  if (isBlockAnnotation(annotation)) {
    return validateBlockHighlight(annotation);
  }

  // Return as-is if unknown annotation type
  return { annotation, issues: [] };
};
