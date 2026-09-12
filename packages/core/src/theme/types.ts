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

export interface DoctuiColorTokens {
  readonly filled: string;
  readonly filledHover: string;
  readonly filledText: string;
  readonly light: string;
  readonly lightHover: string;
  readonly lightText: string;
  readonly outline: string;
  readonly outlineHover: string;
  readonly outlineText: string;
  readonly subtle: string;
  readonly subtleHover: string;
  readonly subtleText: string;
}

export interface DoctuiSemanticColors {
  readonly body: string;
  readonly surface: string;
  readonly surfaceRaised: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  readonly focusRing: string;
  readonly primary: DoctuiColorTokens;
  readonly neutral: DoctuiColorTokens;
  readonly success: DoctuiColorTokens;
  readonly warning: DoctuiColorTokens;
  readonly danger: DoctuiColorTokens;
}

export interface DoctuiSemanticColorsOverride {
  body?: string;
  surface?: string;
  surfaceRaised?: string;
  text?: string;
  textMuted?: string;
  border?: string;
  focusRing?: string;
  primary?: Partial<DoctuiColorTokens>;
  neutral?: Partial<DoctuiColorTokens>;
  success?: Partial<DoctuiColorTokens>;
  warning?: Partial<DoctuiColorTokens>;
  danger?: Partial<DoctuiColorTokens>;
}

export interface DoctuiZIndexScale {
  readonly dropdown: number;
  readonly overlay: number;
  readonly modal: number;
  readonly popover: number;
  readonly toast: number;
  readonly tooltip: number;
}

export interface DoctuiTheme {
  readonly fontFamily: string;
  readonly fontFamilyMonospace: string;
  readonly spacing: Readonly<Record<Size, string>>;
  readonly radius: Readonly<Record<Radius, string>>;
  readonly fontSizes: Readonly<Record<Size, string>>;
  readonly lineHeights: Readonly<Record<Size, string>>;
  readonly shadows: Readonly<Record<Size, string>>;
  readonly breakpoints: Readonly<Record<Size, string>>;
  readonly zIndex: DoctuiZIndexScale;
  readonly colors: Readonly<Record<DoctuiColorScheme, DoctuiSemanticColors>>;
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
  colors?: Partial<Record<DoctuiColorScheme, DoctuiSemanticColorsOverride>>;
}
