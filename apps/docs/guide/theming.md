# Theming

`@doctui/core` exposes a provider-driven theme contract. Visual components consume semantic `--dui-*` CSS variables instead of hard-coded palette values.

## Basic setup

Create only the overrides your application needs:

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
      primary: {
        filled: "#7c3aed",
        light: "#ede9fe",
      },
    },
    dark: {
      primary: {
        filled: "#a78bfa",
        light: "#2e1065",
      },
    },
  },
});
```

Then scope doctui with `DoctuiProvider`:

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

Resolved themes are deep-readonly. Treat the theme returned by `useDoctuiTheme()` and `DEFAULT_THEME` as immutable values; change the provider's `theme` input instead of mutating a resolved theme.

## Typography

The default doctui typography stack starts with `Be Vietnam Pro`, followed by native platform fallbacks:

```text
"Be Vietnam Pro", "Avenir Next", "Segoe UI Variable", "Segoe UI", ui-sans-serif, system-ui, ...
```

`DoctuiProvider` exposes that value as `--dui-font-family` and applies it to the provider root, so controls that inherit typography and components that reference the token stay consistent inside the doctui subtree.

`@doctui/core` intentionally does **not** download or bundle a webfont. Applications that want the exact default appearance should load `Be Vietnam Pro` themselves; otherwise the stack falls back to the best available platform sans-serif without introducing a hidden network dependency.

For example, an application may load the font through its own asset pipeline and keep the default theme untouched. It can also replace the typography contract completely:

```ts
import { createTheme } from "@doctui/core";

export const theme = createTheme({
  fontFamily:
    '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
  fontFamilyMonospace:
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
});
```

The doctui Docs and Storybook load Be Vietnam Pro only for documentation/showcase purposes so component examples display the intended design consistently, including Vietnamese diacritics.

## Switch light and dark mode

`DoctuiProvider` accepts `light` or `dark`. The provider updates semantic variables for its scope, so components do not need separate dark-mode styles.

```vue
<script setup lang="ts">
import { DoctuiProvider, type DoctuiColorScheme } from "@doctui/core";
import { ref } from "vue";

const colorScheme = ref<DoctuiColorScheme>("light");

function toggleColorScheme() {
  colorScheme.value = colorScheme.value === "light" ? "dark" : "light";
}
</script>

<template>
  <DoctuiProvider :color-scheme="colorScheme">
    <button type="button" @click="toggleColorScheme">
      Use {{ colorScheme === "light" ? "dark" : "light" }} mode
    </button>

    <App />
  </DoctuiProvider>
</template>
```

The provider also exposes `data-dui-color-scheme="light|dark"` for debugging and intentional CSS integration.

## Customize semantic colors

The shared `Color` type includes `primary`, `neutral`, `success`, `warning` and `danger`. Each semantic color provides tokens for color-dependent `filled`, `light`, `outline` and `subtle` variants, including hover and foreground/text values.

You can override only the tokens your design system needs:

```ts
import { createTheme } from "@doctui/core";

export const brandTheme = createTheme({
  colors: {
    light: {
      primary: {
        filled: "#6d28d9",
        filledHover: "#5b21b6",
        filledText: "#ffffff",
        light: "#ede9fe",
        lightHover: "#ddd6fe",
        lightText: "#5b21b6",
      },
      success: {
        filled: "#15803d",
        light: "#dcfce7",
        lightText: "#166534",
      },
      warning: {
        filled: "#b45309",
        light: "#fef3c7",
        lightText: "#92400e",
      },
    },
  },
});
```

Unspecified values continue to inherit from `DEFAULT_THEME`, including nested semantic color tokens.

`default` and `transparent` variants use shared surface/text tokens where appropriate rather than introducing another color palette.

## Nest providers for a local theme

Providers can be nested. A child provider inherits the parent's resolved theme and color scheme before applying its own overrides.

This is useful when one section of an application needs denser spacing or a different accent without changing the rest of the page:

```vue
<script setup lang="ts">
import { DoctuiProvider, createTheme } from "@doctui/core";

const compactTheme = createTheme({
  spacing: {
    sm: "0.5rem",
    md: "0.75rem",
  },
  radius: {
    md: "0.375rem",
  },
});
</script>

<template>
  <DoctuiProvider color-scheme="dark">
    <MainApplication />

    <DoctuiProvider :theme="compactTheme">
      <CompactAdminPanel />
    </DoctuiProvider>
  </DoctuiProvider>
</template>
```

The nested provider above remains dark because it inherits the parent's `colorScheme`.

## Read the resolved theme

Use `useDoctuiTheme()` and `useDoctuiColorScheme()` when application code or a doctui component needs the resolved provider context.

```vue
<script setup lang="ts">
import { useDoctuiColorScheme, useDoctuiTheme } from "@doctui/core";
import { computed } from "vue";

const theme = useDoctuiTheme();
const colorScheme = useDoctuiColorScheme();

const debugSummary = computed(() => ({
  colorScheme: colorScheme.value,
  mediumSpacing: theme.value.spacing.md,
  mediumBreakpoint: theme.value.breakpoints.md,
  primaryFilled: theme.value.colors[colorScheme.value].primary.filled,
}));
</script>

<template>
  <pre>{{ debugSummary }}</pre>
</template>
```

Do not mutate `theme.value`. Update the provider input instead.

## Public CSS variables

Theme values used directly by component styles are mapped to public variables such as:

```text
--dui-font-family
--dui-font-family-monospace
--dui-color-primary-filled
--dui-color-primary-filled-hover
--dui-color-primary-filled-text
--dui-color-success-light
--dui-color-text
--dui-color-border
--dui-spacing-md
--dui-radius-md
--dui-font-size-sm
--dui-line-height-md
--dui-shadow-md
--dui-z-index-modal
```

### Override variables for one subtree

Consumers can override a documented variable at a narrower scope without depending on component internals:

```vue
<template>
  <DoctuiProvider>
    <section class="compact-panel">
      <PanelContent />
    </section>
  </DoctuiProvider>
</template>

<style scoped>
.compact-panel {
  --dui-spacing-md: 0.75rem;
  --dui-radius-md: 0.375rem;
  --dui-color-primary-filled: #0f766e;
  --dui-color-primary-filled-hover: #115e59;
}
</style>
```

Only the subtree under `.compact-panel` sees those overrides. The provider theme object itself is unchanged.

### Consume variables in application CSS

Application styles can consume the same public tokens:

```css
.settings-card {
  padding: var(--dui-spacing-lg);
  color: var(--dui-color-text);
  background: var(--dui-color-surface-raised);
  border: 1px solid var(--dui-color-border);
  border-radius: var(--dui-radius-md);
  box-shadow: var(--dui-shadow-sm);
}
```

CSS variables are the supported styling boundary. Internal component class names are not a compatibility contract. Interactive components may expose documented `data-*` state attributes such as `data-disabled`, `data-active` or `data-loading` where state styling is useful.

## Breakpoints

Breakpoints remain part of the theme object (`theme.breakpoints`) but are intentionally **not** emitted as `--dui-breakpoint-*` custom properties. CSS custom properties cannot be used as media-query conditions such as `@media (min-width: var(--dui-breakpoint-md))`.

You can still inspect the configured scale from the resolved theme:

```ts
import { useDoctuiTheme } from "@doctui/core";

const theme = useDoctuiTheme();

console.log(theme.value.breakpoints.sm); // "40rem" by default
console.log(theme.value.breakpoints.lg); // "64rem" by default
```

Responsive doctui components should consume the breakpoint scale through doctui's component/style implementation rather than promising runtime media-query customization through CSS variables.

## Internal class names

Internal component classes follow `dui-<Component>-<part>`, for example `dui-Button-root`, `dui-Button-label` and `dui-Button-section`.

This convention is for maintainability and debugging only. Internal classes are not public styling API and may change between releases; consumers should use documented CSS variables and state `data-*` attributes instead.

## Shared style types

Core exports shared `Size`, `Radius`, `Color` and `Variant` types. Components should reuse these instead of defining incompatible local unions.

```ts
import type { Color, Radius, Size, Variant } from "@doctui/core";

interface ExampleControlProps {
  size?: Size;
  radius?: Radius;
  color?: Color;
  variant?: Variant;
}
```

## Baseline policy

Phase 1 does **not** inject a global CSS reset. `DoctuiProvider` establishes scoped theme variables, the active color-scheme attribute, and the provider-root font family. This keeps doctui safe to adopt inside existing applications while making typography consistent inside the doctui subtree; component-level baseline styles remain local to doctui components.
