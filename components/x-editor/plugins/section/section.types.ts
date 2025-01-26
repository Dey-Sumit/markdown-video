// section.types.ts
export interface SectionInputProps {
  cols?: number;
  rows?: number;
  gap?: number;
  header?: string;
  footer?: string;
}

export interface SectionOutputProps
  extends Required<Omit<SectionInputProps, "header" | "footer">> {
  header?: string;
  footer?: string;
}

export interface ComponentBase {
  type: string;
  data: Record<string, any>;
}

export interface Section extends ComponentBase {
  type: "section";
  id: string;
  data: SectionOutputProps & {
    items: Component[];
  };
}

export type Component = Section | ComponentBase;

export interface ParserResult<T> {
  data: T;
  errors?: string[];
}
