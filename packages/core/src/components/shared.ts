import type { CSSProperties } from "vue";
import type { Radius, Size } from "../theme/types";

export function spacingToken(value: Size | undefined): string | undefined {
  return value ? `var(--dui-spacing-${value})` : undefined;
}

export function radiusToken(value: Radius | undefined): string | undefined {
  return value ? `var(--dui-radius-${value})` : undefined;
}

export function fontSizeToken(value: Size | undefined): string | undefined {
  return value ? `var(--dui-font-size-${value})` : undefined;
}

export function lineHeightToken(value: Size | undefined): string | undefined {
  return value ? `var(--dui-line-height-${value})` : undefined;
}

export function boxSpacingStyle(
  padding: Size | undefined,
  margin: Size | undefined,
): CSSProperties {
  return {
    padding: spacingToken(padding),
    margin: spacingToken(margin),
  };
}
