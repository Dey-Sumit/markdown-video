export interface TextInputProps {
  content: string;
  size: number;
  weight: string;
  family: string;
  color: string;
  blend: string;
  delay: number;
  animation: string;
  order?: number;
  // animationApplyTo: string;
}

// Output type (includes computed properties)
export interface TextOutputProps extends TextInputProps {
  delayInFrames: number;
  id: string;
}
