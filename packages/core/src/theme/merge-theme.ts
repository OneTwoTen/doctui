import type { DoctuiTheme, DoctuiThemeOverride } from "./types";

export function mergeTheme(
  base: DoctuiTheme,
  override: DoctuiThemeOverride = {},
): DoctuiTheme {
  return {
    ...base,
    ...override,
    spacing: { ...base.spacing, ...override.spacing },
    radius: { ...base.radius, ...override.radius },
    fontSizes: { ...base.fontSizes, ...override.fontSizes },
    lineHeights: { ...base.lineHeights, ...override.lineHeights },
    shadows: { ...base.shadows, ...override.shadows },
    breakpoints: { ...base.breakpoints, ...override.breakpoints },
    zIndex: { ...base.zIndex, ...override.zIndex },
    colors: {
      light: { ...base.colors.light, ...override.colors?.light },
      dark: { ...base.colors.dark, ...override.colors?.dark },
    },
  };
}
