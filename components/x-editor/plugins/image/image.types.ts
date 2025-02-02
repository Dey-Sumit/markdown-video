import type { ImageAnimationsType } from "@/video/compositions/code-video-composition/components/composition-image";

// plugins/image/image.types.ts
export interface ImageInputProps {
  src: string;
  width?: number;
  height: number;
  animation: ImageAnimationsType;
  delay: number;
  duration: number;
  withMotion?: boolean;
}

export interface ImageOutputProps extends ImageInputProps {
  id: string;
  delayInFrames: number;
  durationInFrames: number;
}
