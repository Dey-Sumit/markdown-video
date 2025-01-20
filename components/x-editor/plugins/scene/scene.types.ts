// scene.types.ts
export interface SceneInputProps {
  duration: number;
  title?: string;
  background?: string;
}

export interface SceneOutputProps extends SceneInputProps {
  durationInFrames: number;
  id: string; // Auto-generated from title or default
  // Add any other computed properties
}

// Could also add validation types if needed
export type SceneValidationIssue = {
  field: keyof SceneInputProps;
  message: string;
  type: "error" | "warning";
};
