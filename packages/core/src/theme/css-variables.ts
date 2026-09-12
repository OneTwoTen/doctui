import type { DoctuiColorScheme, DoctuiTheme } from "./types";

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function getThemeCssVariables(
  theme: DoctuiTheme,
  colorScheme: DoctuiColorScheme,
): Record<string, string> {
  const variables: Record<string, string> = {
    "--dui-font-family": theme.fontFamily,
    "--dui-font-family-monospace": theme.fontFamilyMonospace,
  };

  for (const [name, value] of Object.entries(theme.spacing)) {
    variables[`--dui-spacing-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.radius)) {
    variables[`--dui-radius-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.fontSizes)) {
    variables[`--dui-font-size-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.lineHeights)) {
    variables[`--dui-line-height-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.shadows)) {
    variables[`--dui-shadow-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.breakpoints)) {
    variables[`--dui-breakpoint-${name}`] = value;
  }

  for (const [name, value] of Object.entries(theme.zIndex)) {
    variables[`--dui-z-index-${toKebabCase(name)}`] = String(value);
  }

  for (const [name, value] of Object.entries(theme.colors[colorScheme])) {
    variables[`--dui-color-${toKebabCase(name)}`] = value;
  }

  return variables;
}
