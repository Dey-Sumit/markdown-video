// plugins/image/image.types.ts
export interface ImageInputProps {
  src: string;
  width: number;
  height: number;
  animation:
    | "none"
    | "fadeIn"
    | "zoomIn"
    | "slideInLeft"
    | "slideInRight"
    | "slideInTop"
    | "slideInBottom";
  delay: number;
  duration: number;
}

export interface ImageOutputProps extends ImageInputProps {
  id: string;
  delayInFrames: number;
  durationInFrames: number;
}
