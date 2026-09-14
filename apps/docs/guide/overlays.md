# Overlays

`Overlay`, `Modal`, `Drawer`, `Popover`, `Menu`, and `Tooltip` share doctui-owned interaction primitives for predictable layering, dismissal, focus, and accessible trigger relationships.

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

## Menu

`Menu` follows the menu-button keyboard pattern. The element rendered by the `target` slot is the actual trigger: doctui adds `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` to that element instead of putting those attributes on an implementation wrapper.

```vue
<Menu
  v-model="actionsOpen"
  :data="[
    { value: 'edit', label: 'Edit' },
    { value: 'archive', label: 'Archive' },
    { value: 'delete', label: 'Delete', disabled: true },
  ]"
  @select="handleAction"
>
  <template #target>
    <Button>Actions</Button>
  </template>
</Menu>
```

From the trigger, `ArrowDown`, `Enter`, or `Space` opens the menu at the first enabled item and `ArrowUp` opens at the last enabled item. Inside the menu, `ArrowDown` and `ArrowUp` move DOM focus, `Home` and `End` jump to the first or last enabled item, and disabled items are skipped. `Enter` or `Space` selects the focused item. `Escape` closes the menu and restores focus to the trigger.

Menu items use roving `tabindex`: exactly one enabled item is in the tab order while the rest use `tabindex="-1"`. Pointer hover may update the active item, but keyboard navigation always moves actual focus rather than changing visual state alone.

Outside pointer interaction closes the menu when `closeOnClickOutside` is enabled. Outside-pointer dismissal does not steal focus back from the element the user clicked.

## Popover

`Popover` also treats the `target` slot root as the real trigger. The trigger receives a stable `id`, `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`; the controlled panel receives the matching stable panel `id` and uses `aria-labelledby` to take its accessible name from that real trigger. If the trigger already has an `id`, doctui preserves and reuses it.

```vue
<Popover v-model="detailsOpen" position="right">
  <template #target>
    <Button>Show details</Button>
  </template>

  <div>Contextual content</div>
</Popover>
```

Use a clear accessible name on the trigger because that same trigger names the contextual dialog. `closeOnEscape` and `closeOnClickOutside` are independent. Escape dismissal restores focus to the trigger. Outside-pointer dismissal keeps the user's new pointer/focus destination intact.

### Position and collision behavior

`position="top | right | bottom | left"` currently selects a deterministic CSS-anchored side relative to the Popover wrapper. The current 0.x contract does **not** automatically flip or shift the panel when it approaches a viewport edge. Choose a position that fits the surrounding layout when clipping is possible.

Core must not grow a custom JavaScript popper engine. If doctui promotes collision-aware positioning into the public contract, the project technology decision requires using the approved low-level floating-positioning abstraction instead of bespoke geometry code.

## Tooltip

`Tooltip` is for short, non-essential helper text. It opens on pointer hover and keyboard focus. The slotted root trigger receives `aria-describedby` only while the tooltip is visible, pointing to the rendered `role="tooltip"` element.

```vue
<Tooltip label="Save changes without publishing">
  <Button>Save draft</Button>
</Tooltip>
```

Prefer a single focusable root in the default slot so the element users actually focus receives the description. If the root is a composite wrapper containing several focusable descendants, focus moving between descendants does not close and reopen the tooltip; it closes only when focus leaves the composite root. For important instructions, validation, or required content, render visible text instead of relying on a tooltip.

Tooltip text wraps within a viewport-safe maximum width rather than forcing one unbroken line. Tooltip `position` uses the same deterministic CSS-side contract as Popover and does not currently auto-flip on collision.

## Dismissal behavior

`closeOnEscape` and `closeOnClickOutside` are independent where the component exposes them. Both default to `true` for modal and contextual dismissable surfaces.

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
<Popover v-model="workspaceOpen">
  <template #target>
    <Button>Workspace actions</Button>
  </template>

  <Menu v-model="menuOpen" :data="actions">
    <template #target>
      <Button>More actions</Button>
    </template>
  </Menu>
</Popover>
```

With both layers open, the first Escape closes the Menu and returns focus to `More actions`; a subsequent Escape closes the Popover and returns focus to `Workspace actions`.

## Focus and page scroll

`Modal` and `Drawer` trap focus while active and restore the previously focused element when they close. Page scroll locking is reference-counted per active overlay instance: opening a second dialog adds another lock, and closing one nested dialog does not unlock the page while another dialog is still open. The original inline `body.style.overflow` value is restored only after the final lock releases.

Menu and Popover do not trap focus. They instead preserve the normal document tab order and apply focused restoration only to dismissal paths where restoration is expected, such as Escape.

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

Storybook exposes dedicated `Drawer`, `Menu`, `Popover`, and `Tooltip` modules with the actual component registered in metadata and functional Controls for their meaningful public props. Controlled open state is synchronized both ways: changing `modelValue` in Controls updates the canvas, while clicks, hover/focus, Escape, and dismissal events write the new state back to Storybook args.

Composition stories are separate and intentionally disable Controls so they do not present a misleading panel for several independently controlled components. The Popover → Menu + Tooltip composition remains available for manually verifying nested Escape ordering and one-level-at-a-time focus restoration.
