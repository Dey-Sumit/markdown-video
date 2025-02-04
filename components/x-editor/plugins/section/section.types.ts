// section.types.ts

import type { TextOutputProps } from "../text/text.types";

export interface SectionInputProps {
  cols: number;
  rows: number;
  gap: number;
  items: string; // Raw items string with parentheses
  header?: string;
  footer?: string;
}

export interface SectionOutputProps extends Omit<SectionInputProps, "items"> {
  id: string;
  items: (SectionOutputProps | TextOutputProps)[]; // Will be populated later
}
