# Overlays

`Overlay`, `Modal`, and `Drawer` share one layering contract: semantic backdrop colors, token-backed z-index values, deterministic dismissal, focus restoration, reference-counted page scroll locking, and theme-safe rendering through Vue Teleport.

## Portal and theme behavior

Overlay-family components render into `body` by default. Teleport moves DOM nodes away from the `DoctuiProvider` element, so doctui copies the active theme CSS variables onto each teleported overlay root. Semantic colors, spacing, radii, shadows and z-index values therefore keep working even though the layer is no longer a DOM descendant of the provider.

Use `portalTarget` when a layer must render into another DOM target:

```vue
<Modal v-model="open" title="Preview" portal-target="#overlay-root">
  Preview content
</Modal>
```

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

`Modal` keeps a `Dialog` fallback if neither naming path is supplied, but applications should prefer an explicit title or `aria-label` with domain context.

### Size

The token sizes `xs`, `sm`, `md`, `lg`, and `xl` map to real dialog widths through `--dui-modal-width`:

| size | width |
| --- | --- |
| `xs` | `20rem` |
| `sm` | `26rem` |
| `md` | `32rem` |
| `lg` | `42rem` |
| `xl` | `56rem` |

`size` also accepts a CSS width string or a number. Numbers are interpreted as pixels.

```vue
<Modal v-model="open" title="Compact" size="xs">...</Modal>
<Modal v-model="open" title="Custom" size="38rem">...</Modal>
<Modal v-model="open" title="Pixels" :size="720">...</Modal>
```

`centered` controls vertical alignment on the shared overlay and `radius` maps to the doctui radius scale.

### Backdrop

`withOverlay` controls whether the visual backdrop is painted. The layer remains mounted when the backdrop is disabled, so focus, Escape handling and outside-dismissal behavior remain predictable.

Use `overlayProps` to customize semantic backdrop color and opacity:

```vue
<Modal
  v-model="open"
  title="Danger zone"
  :overlay-props="{ color: 'danger', opacity: 0.35 }"
>
  ...
</Modal>
```

```vue
<Modal v-model="open" title="No backdrop" :with-overlay="false">
  ...
</Modal>
```

### Behavior props

`closeOnEscape` and `closeOnClickOutside` are independent. `lockScroll`, `trapFocus`, and `returnFocus` are enabled by default and can be disabled for specialized composition.

```vue
<Modal
  v-model="editorOpen"
  title="Unsaved editor"
  :close-on-escape="false"
  :close-on-click-outside="false"
  :lock-scroll="true"
  :trap-focus="true"
  :return-focus="true"
>
  Use an explicit Save or Cancel action.
</Modal>
```

Modal/Drawer outside dismissal is handled by the shared dismissable-layer stack. The backdrop itself does not register a second dismissal path, preventing one pointer interaction from producing duplicate close events.

## Drawer

`Drawer` uses the same Overlay, focus, dismissal and scroll-lock contract as `Modal`, but positions a fixed side panel at the left or right edge.

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

Token drawer widths are:

| size | width |
| --- | --- |
| `xs` | `16rem` |
| `sm` | `20rem` |
| `md` | `28rem` |
| `lg` | `36rem` |
| `xl` | `48rem` |

Like `Modal`, Drawer accepts custom CSS widths/numeric pixel widths and supports `withOverlay`, `overlayProps`, `lockScroll`, `trapFocus`, `returnFocus`, and `portalTarget`.

Drawer uses a single Portal path through the shared Overlay. Do not wrap Drawer in another Portal.

## Focus and nested dialogs

The shared focus trap is stack-aware. Only the top active dialog may cycle Tab/Shift+Tab or redirect focus that tries to escape. Closing the child restores focus to the child's trigger before the parent trap becomes active again.

```vue
<Modal v-model="reviewOpen" title="Review order">
  <Button @click="detailsOpen = true">Edit delivery details</Button>

  <Drawer v-model="detailsOpen" title="Delivery details">
    ...
  </Drawer>
</Modal>
```

When both layers are open, Escape closes Drawer first. A second Escape closes Modal.

## Scroll locking

Page scroll locking is reference-counted per active overlay instance. Opening a second dialog adds another lock; closing one nested layer does not unlock the document while another remains open. The original inline `body.style.overflow` value is restored only after the final lock releases.

Set `lockScroll=false` when the layer intentionally must not modify body overflow.

## Overlay primitive

`Overlay` is a layering primitive, not a dialog. It does not provide dialog naming or focus management by itself.

```vue
<Overlay
  v-model="visible"
  color="neutral"
  :opacity="0.55"
  :with-backdrop="true"
>
  <div>Custom surface</div>
</Overlay>
```

Public Overlay props are:

- `modelValue` — controlled visibility.
- `color` — semantic backdrop color.
- `opacity` — backdrop opacity from `0` through `1`.
- `closeOnClick` — emit `update:modelValue=false` when the backdrop root itself is clicked.
- `withBackdrop` — keep the layer mounted while disabling its visual backdrop.
- `portalTarget` — Teleport target, defaulting to `body`.

Backdrop opacity affects only the backdrop color; child content is not faded. The root exposes `--dui-overlay-color` and `--dui-overlay-opacity` and carries the active doctui theme variables for teleported descendants.

## Layering tokens

Do not hard-code overlay z-index values. doctui uses the theme z-index scale:

- `--dui-z-index-overlay` for the teleported backdrop/layer root,
- `--dui-z-index-modal` for modal and drawer surfaces,
- `--dui-z-index-popover` for contextual popovers and menus,
- `--dui-z-index-tooltip` for tooltips.

Override the theme z-index scale through normal doctui theme configuration instead of patching component selectors with numeric z-index values.

## Storybook

Overlay, Modal, and Drawer each have a dedicated Storybook page with a `Playground` story. Public visual and behavior props are represented as Controls rather than being hidden behind hard-coded launcher demos. Additional stories cover size geometry, custom/no backdrop states and nested `Modal` → `Drawer` composition.
