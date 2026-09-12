# Theming

`@doctui/core` exposes a provider-driven theme contract. Visual components consume semantic `--dui-*` CSS variables instead of hard-coded palette values.

## Create a theme

Use `createTheme()` to define only the values you want to override:

```ts
import { createTheme } from "@doctui/core";

export const theme = createTheme({
  spacing: {
    md: "1.25rem",
  },
  radius: {
    md: "0.75rem",
  },
  colors: {
    light: {
      primaryFilled: "#7c3aed",
    },
    dark: {
      primaryFilled: "#a78bfa",
    },
  },
});
```

Then scope it with `DoctuiProvider`:

```vue
<script setup lang="ts">
import { DoctuiProvider } from "@doctui/core";
import { theme } from "./theme";
</script>

<template>
  <DoctuiProvider :theme="theme" color-scheme="light">
    <App />
  </DoctuiProvider>
</template>
```

Providers can be nested. A nested provider inherits its parent's resolved theme and then applies its own overrides.

## Color schemes

`DoctuiProvider` supports `light` and `dark` color schemes. The active scheme changes semantic color variables on the provider scope; components do not need per-component dark-mode overrides.

The provider exposes `data-dui-color-scheme="light|dark"` for debugging and intentional CSS integration.

## Public CSS variables

Theme values are mapped to variables such as:

```text
--dui-color-primary-filled
--dui-color-primary-light
--dui-color-text
--dui-color-border
--dui-spacing-md
--dui-radius-md
--dui-font-size-sm
--dui-line-height-md
--dui-shadow-md
--dui-breakpoint-md
--dui-z-index-modal
```

Consumers can override a documented variable at a narrower scope without depending on component internals:

```css
.compact-panel {
  --dui-spacing-md: 0.75rem;
  --dui-radius-md: 0.375rem;
}
```

CSS variables are the supported styling boundary. Internal component class names are not a compatibility contract. Interactive components may expose documented `data-*` state attributes such as `data-disabled`, `data-active` or `data-loading` where state styling is useful.

## Shared style types

Core exports shared `Size`, `Radius`, `Color` and `Variant` types. Components should reuse these instead of defining incompatible local unions.

## Baseline policy

Phase 1 does **not** inject a global CSS reset. `DoctuiProvider` only establishes scoped theme variables and the active color-scheme attribute. This keeps doctui safe to adopt inside existing applications; component-level baseline styles will remain local to doctui components.
