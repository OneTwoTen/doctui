import type { CSSProperties } from "vue";

export type FieldStylePart =
  | "root"
  | "label"
  | "required"
  | "description"
  | "error"
  | "control"
  | "wrapper"
  | "input"
  | "section"
  | "leftSection"
  | "rightSection"
  | "clearButton"
  | "body"
  | "indicator"
  | "track"
  | "thumb"
  | "labelText";

export type FieldClassNames = Partial<Record<FieldStylePart, string>>;
export type FieldStyles = Partial<Record<FieldStylePart, CSSProperties>>;
