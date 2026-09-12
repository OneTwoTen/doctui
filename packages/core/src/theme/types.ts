export const DOCTUI_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export type Size = (typeof DOCTUI_SIZES)[number];
export type Radius = "none" | Size | "full";
export type Color = "primary" | "neutral" | "success" | "warning" | "danger";
export type Variant =
  | "filled"
  | "light"
  | "outline"
  | "subtle"
  | "default"
  | "transparent";

export type DoctuiColorScheme = "light" | "dark";

export interface DoctuiSemanticColors {
  body: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  primaryFilled: string;
  primaryFilledHover: string;
  primaryLight: string;
  focusRing: string;
  dangerFilled: string;
}

export interface DoctuiZIndexScale {
  dropdown: number;
  overlay: number;
  modal: number;
  popover: number;
  toast: number;
  tooltip: number;
}

export interface DoctuiTheme {
  fontFamily: string;
  fontFamilyMonospace: string;
  spacing: Record<Size, string>;
  radius: Record<Radius, string>;
  fontSizes: Record<Size, string>;
  lineHeights: Record<Size, string>;
  shadows: Record<Size, string>;
  breakpoints: Record<Size, string>;
  zIndex: DoctuiZIndexScale;
  colors: Record<DoctuiColorScheme, DoctuiSemanticColors>;
}

export interface DoctuiThemeOverride {
  fontFamily?: string;
  fontFamilyMonospace?: string;
  spacing?: Partial<Record<Size, string>>;
  radius?: Partial<Record<Radius, string>>;
  fontSizes?: Partial<Record<Size, string>>;
  lineHeights?: Partial<Record<Size, string>>;
  shadows?: Partial<Record<Size, string>>;
  breakpoints?: Partial<Record<Size, string>>;
  zIndex?: Partial<DoctuiZIndexScale>;
  colors?: Partial<Record<DoctuiColorScheme, Partial<DoctuiSemanticColors>>>;
}
