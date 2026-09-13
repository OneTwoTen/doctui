# Overlays

`Overlay`, `Modal`, and `Drawer` share one layering contract: semantic backdrop colors, token-backed z-index values, deterministic dismissal, focus restoration, and reference-counted page scroll locking.

## Modal

Use a visible `title` whenever the dialog has a heading. doctui wires it to `aria-labelledby` automatically.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Modal } from '@doctui/core'

const open = ref(false)
</script>

<template>
  <Button @click="open = true">Review changes</Button>
  <Modal v-model="open" title="Review changes" size="lg" centered>
    Review the pending changes before publishing.
  </Modal>
</template>
```

When the dialog intentionally has no visible heading, provide `aria-label` instead:

```vue
<Modal
  v-model="confirmOpen"
  aria-label="Confirm publish"
  :close-on-click-outside="false"
>
  Publishing cannot be undone.
</Modal>
```

`Modal` still exposes a safe `Dialog` fallback when neither naming path is supplied, but applications should prefer an explicit visible title or `aria-label` because those names carry domain context.

### Size and alignment

`size` changes real dialog geometry for every core size: `xs`, `sm`, `md`, `lg`, and `xl`. The width is driven by the public `--dui-modal-width` CSS variable. `centered` controls vertical backdrop alignment rather than being a decorative prop.

```vue
<Modal v-model="open" title="Compact" size="xs">...</Modal>
<Modal v-model="open" title="Centered" size="md" centered>...</Modal>
<Modal v-model="open" title="Wide" size="xl">...</Modal>
```

`radius` maps to the shared `--dui-radius-*` theme scale.

## Drawer

`Drawer` uses the same dialog, dismissal, focus, and scroll-lock behavior as `Modal`. `position` selects the left or right edge and `size` changes the actual panel width across `xs` through `xl` using `--dui-drawer-width`.

```vue
<Drawer
  v-model="filtersOpen"
  title="Filters"
  position="right"
  size="md"
>
  Filter controls
</Drawer>
```

A visible `title` is exposed through `aria-labelledby`. For a titleless drawer, use `aria-label`; `Drawer` is only a safety fallback.

## Dismissal behavior

`closeOnEscape` and `closeOnClickOutside` are independent. Both default to `true`.

```vue
<Modal
  v-model="editorOpen"
  title="Unsaved editor"
  :close-on-escape="false"
  :close-on-click-outside="false"
>
  Use an explicit Save or Cancel action.
</Modal>
```

When overlays are nested, only the top dismissable layer handles Escape or outside pointer interaction. Closing the child restores focus to the control that opened it; closing the parent then restores focus to its own trigger.

```vue
<Modal v-model="reviewOpen" title="Review order">
  <Button @click="detailsOpen = true">Edit delivery details</Button>

  <Drawer v-model="detailsOpen" title="Delivery details">
    ...
  </Drawer>
</Modal>
```

## Focus and page scroll

`Modal` and `Drawer` trap focus while active and restore the previously focused element when they close. Page scroll locking is reference-counted per active overlay instance: opening a second dialog adds another lock, and closing one nested dialog does not unlock the page while another dialog is still open. The original inline `body.style.overflow` value is restored only after the final lock releases.

## Overlay backdrop

`Overlay` is a layering primitive, not a dialog. It does not provide dialog naming or focus management by itself.

```vue
<Overlay
  v-model="visible"
  color="neutral"
  :opacity="0.55"
>
  <div>Custom surface</div>
</Overlay>
```

`color` maps to doctui semantic color tokens and `opacity` affects only the backdrop color. Child content is not faded. The backdrop exposes `--dui-overlay-color` and `--dui-overlay-opacity` for the rendered contract.

## Layering tokens

Do not hard-code overlay z-index values. doctui uses the theme z-index scale:

- `--dui-z-index-overlay` for the backdrop layer,
- `--dui-z-index-modal` for modal and drawer surfaces,
- `--dui-z-index-popover` for contextual popovers and menus,
- `--dui-z-index-tooltip` for tooltips.

Override the theme z-index scale through the normal doctui theme configuration instead of patching component selectors with numeric z-index values.

## Storybook

Storybook includes interactive size/alignment launchers, dismissal examples, Drawer position/size coverage, and a nested `Modal` → `Drawer` composition for manually verifying top-layer Escape handling, focus restoration, and scroll locking.
