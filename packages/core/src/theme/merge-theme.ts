import { deepFreeze } from "./deep-freeze";
import type {
  DoctuiSemanticColors,
  DoctuiSemanticColorsOverride,
  DoctuiTheme,
  DoctuiThemeOverride,
} from "./types";

function mergeSemanticColors(
  base: DoctuiSemanticColors,
  override: DoctuiSemanticColorsOverride = {},
): DoctuiSemanticColors {
  return {
    ...base,
    ...override,
    primary: { ...base.primary, ...override.primary },
    neutral: { ...base.neutral, ...override.neutral },
    success: { ...base.success, ...override.success },
    warning: { ...base.warning, ...override.warning },
    danger: { ...base.danger, ...override.danger },
  };
}

export function mergeTheme(
  base: DoctuiTheme,
  override: DoctuiThemeOverride = {},
): DoctuiTheme {
  return deepFreeze({
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
      light: mergeSemanticColors(base.colors.light, override.colors?.light),
      dark: mergeSemanticColors(base.colors.dark, override.colors?.dark),
    },
  });
}
