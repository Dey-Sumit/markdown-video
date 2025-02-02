// section.types.ts

import type { CommonAnimationType } from "@/video/compositions/animation.config";
import type { TextOutputProps } from "../text/text.types";

export interface SectionInputProps {
  cols: number;
  rows: number;
  gap: number;
  items: string[]; // Raw items string with parentheses
  header?: string;
  footer?: string;
  background?: string;
  animation?: CommonAnimationType;
}

export interface SectionOutputProps extends Omit<SectionInputProps, "items"> {
  id: string;
  items: (SectionOutputProps | TextOutputProps)[]; // Will be populated later
}
