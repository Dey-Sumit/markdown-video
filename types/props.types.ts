import type { TextAnimationType } from "@/video/compositions/code-video-composition/components/composition-text";
import type { TransitionType } from "@/video/compositions/code-video-composition/types.composition";

export type IndividualReturnType = string | number | boolean;

type PostProcessor = (value: string) => IndividualReturnType;

export interface SceneMetaResult {
  name?: string;
  duration: number;
  background?: string;
}



export type PropsParserConfig = Record<
  | "transition"
  | "code"
  | "media"
  | "sceneMeta"
  | "mark"
  | "text"
  | "contentLayout",
  TypeConfig
>;

/* export interface ZoomResult {
  level: number;
  delay: number;
  point: { x: number; y: number };
} */

export interface TransitionResult {
  type: TransitionType;
  duration: number;
  delay?: number;
  easing?: string;
  direction: string;
}

export interface FontsResult {
  family: string;
  size: string;
  weight: string;
  lineHeight?: string;
}

export interface TypeConfig {
  defaults: Record<string, string>;
  validKeys: string[];
  processors?: Record<string, PostProcessor>;
}

export interface Mark {
  delay: number;
  duration: number;
  type: string;
  color: string;
}

export interface Media {
  src: string;
  duration: number;
  delay: number;
  animation: string;
  withMotion: boolean;
}

export interface TextProps {
  content: string;
  duration: number;
  animation: TextAnimationType;
  delay: number;
  fontSize: string;
  fontWeight: string;
  applyTo: string;
  color: string;
}
