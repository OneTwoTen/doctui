<script setup lang="ts">
import {
  Button,
  Drawer,
  Group,
  Menu,
  Modal,
  Overlay,
  Paper,
  Popover,
  Stack,
  Text,
  Tooltip,
} from "@doctui/core";
import { ref } from "vue";

const modalOpen = ref(false);
const drawerOpen = ref(false);
const menuOpen = ref(false);
const popoverOpen = ref(false);
const overlayOpen = ref(false);
const selectedAction = ref("none");

const actions = [
  { value: "edit", label: "Edit" },
  { value: "archive", label: "Archive" },
  { value: "delete", label: "Delete", disabled: true },
];

function selectAction(value: string | number) {
  selectedAction.value = String(value);
}
</script>

# Overlays

`Overlay`, `Modal`, `Drawer`, `Popover`, `Menu`, and `Tooltip` share doctui-owned interaction primitives for predictable layering, dismissal, focus, accessible trigger relationships, and theme-safe rendering through Vue Teleport.

## Portal and theme behavior

Overlay-family modal layers render into `body` by default. Teleport moves DOM nodes away from the `DoctuiProvider` element, so doctui carries the active theme CSS variables onto each teleported Overlay root. Semantic colors, spacing, radii, shadows and z-index values therefore keep working after teleport.

Use `portalTarget` when Modal, Drawer, or Overlay must render into another DOM target:

```vue
<Modal v-model="open" title="Preview" portal-target="#overlay-root">
  Preview content
</Modal>
```

## Modal

Use a visible `title` whenever the dialog has a heading. doctui wires it to `aria-labelledby` automatically.

<div class="docs-preview docs-preview--row">
  <Button @click="modalOpen = true">Review changes</Button>
  <Modal v-model="modalOpen" title="Review changes" size="lg" centered>
    <Stack gap="md">
      <Text>Review the pending changes before publishing.</Text>
      <Group justify="flex-end">
        <Button variant="default" @click="modalOpen = false">Cancel</Button>
        <Button @click="modalOpen = false">Publish</Button>
      </Group>
    </Stack>
  </Modal>
</div>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Modal } from "@doctui/core";

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Review changes</Button>
  <Modal v-model="open" title="Review changes" size="lg" centered>
    Review the pending changes before publishing.
  </Modal>
</template>
```

When the dialog intentionally has no visible heading, provide `aria-label` instead. `Modal` keeps a `Dialog` fallback if neither naming path is supplied, but applications should prefer an explicit title or `aria-label` with domain context.

### Size and alignment

Token sizes map to real dialog widths through `--dui-modal-width`:

| size | width |
| --- | --- |
| `xs` | `20rem` |
| `sm` | `26rem` |
| `md` | `32rem` |
| `lg` | `42rem` |
| `xl` | `56rem` |

`size` also accepts a CSS width string or a number; numbers are interpreted as pixels. `centered` controls vertical alignment on the shared overlay and `radius` maps to the doctui radius scale.

```vue
<Modal v-model="open" title="Compact" size="xs">...</Modal>
<Modal v-model="open" title="Custom" size="38rem">...</Modal>
<Modal v-model="open" title="Pixels" :size="720">...</Modal>
```

### Backdrop and behavior props

`withOverlay` controls whether the visual backdrop is painted. The layer remains mounted when the backdrop is disabled. Use `overlayProps` to customize semantic backdrop color and opacity.

```vue
<Modal
  v-model="open"
  title="Danger zone"
  :overlay-props="{ color: 'danger', opacity: 0.35 }"
>
  ...
</Modal>

<Modal v-model="open" title="No backdrop" :with-overlay="false">
  ...
</Modal>
```

`closeOnEscape` and `closeOnClickOutside` are independent. `lockScroll`, `trapFocus`, and `returnFocus` are enabled by default and can be disabled for specialized composition.

Modal/Drawer outside dismissal is handled by the shared dismissable-layer stack. The backdrop itself does not register a second dismissal path, preventing one pointer interaction from producing duplicate close events.

For persistent dialog actions, use the named `footer` slot. See [Dialog footer actions](/guide/dialog-actions) for standard, destructive, loading, disabled, long-content, responsive and nested action patterns.

## Drawer

`Drawer` uses the same Overlay, focus, dismissal and scroll-lock contract as `Modal`, but positions a fixed side panel at the left or right edge.

<div class="docs-preview docs-preview--row">
  <Button variant="default" @click="drawerOpen = true">Open filters</Button>
  <Drawer v-model="drawerOpen" title="Filters" position="right" size="md">
    <Stack gap="md">
      <Text>Filter controls can stay in this side surface.</Text>
      <Button @click="drawerOpen = false">Apply filters</Button>
    </Stack>
  </Drawer>
</div>

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

Like `Modal`, Drawer accepts custom CSS widths or numeric pixel widths and supports `withOverlay`, `overlayProps`, `lockScroll`, `trapFocus`, `returnFocus`, and `portalTarget`.

Drawer uses a single Portal path through the shared Overlay. Do not wrap Drawer in another Portal.

## Menu

`Menu` follows the menu-button keyboard pattern. The element rendered by the `target` slot is the actual trigger: doctui adds `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` to that element instead of putting those attributes on an implementation wrapper.

<div class="docs-preview docs-preview--stack docs-preview--narrow">
  <Menu v-model="menuOpen" :data="actions" @select="selectAction">
    <template #target>
      <Button>Actions</Button>
    </template>
  </Menu>
  <Text size="sm" muted>Last action: {{ selectedAction }}</Text>
</div>

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

`Popover` treats the `target` slot root as the real trigger. The trigger receives a stable `id`, `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`; the controlled panel receives the matching stable panel `id` and uses `aria-labelledby` to take its accessible name from that real trigger. If the trigger already has an `id`, doctui preserves and reuses it.

<div class="docs-preview docs-preview--row">
  <Popover v-model="popoverOpen" position="right">
    <template #target>
      <Button variant="light">Show details</Button>
    </template>
    <Paper with-border style="padding: 0.75rem; max-width: 16rem">
      <Text size="sm">Contextual content stays associated with the real trigger.</Text>
    </Paper>
  </Popover>
</div>

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

Core must not grow a custom JavaScript popper engine. If doctui promotes collision-aware positioning into the public contract, use the approved low-level floating-positioning abstraction instead of bespoke geometry code.

## Tooltip

`Tooltip` is for short, non-essential helper text. It opens on pointer hover and keyboard focus. The slotted root trigger receives `aria-describedby` only while the tooltip is visible, pointing to the rendered `role="tooltip"` element.

<div class="docs-preview docs-preview--row">
  <Tooltip label="Save changes without publishing">
    <Button variant="outline">Save draft</Button>
  </Tooltip>
</div>

```vue
<Tooltip label="Save changes without publishing">
  <Button>Save draft</Button>
</Tooltip>
```

Prefer a single focusable root in the default slot so the element users actually focus receives the description. If the root is a composite wrapper containing several focusable descendants, focus moving between descendants does not close and reopen the tooltip; it closes only when focus leaves the composite root. For important instructions, validation, or required content, render visible text instead of relying on a tooltip.

Tooltip text wraps within a viewport-safe maximum width rather than forcing one unbroken line. Tooltip `position` uses the same deterministic CSS-side contract as Popover and does not currently auto-flip on collision.

## Dismissal behavior

`closeOnEscape` and `closeOnClickOutside` are independent where the component exposes them. Both default to `true` for modal and contextual dismissable surfaces.

When overlays are nested, only the top dismissable layer handles Escape or outside pointer interaction. A nested Modal → Drawer closes the Drawer first. A nested Popover → Menu similarly closes the Menu first and restores focus one level at a time.

```vue
<Modal v-model="reviewOpen" title="Review order">
  <Button @click="detailsOpen = true">Edit delivery details</Button>
  <Drawer v-model="detailsOpen" title="Delivery details">...</Drawer>
</Modal>
```

```vue
<Popover v-model="workspaceOpen">
  <template #target><Button>Workspace actions</Button></template>
  <Menu v-model="menuOpen" :data="actions">
    <template #target><Button>More actions</Button></template>
  </Menu>
</Popover>
```

## Focus and page scroll

Modal and Drawer use the shared stack-aware focus trap. Only the top active dialog may cycle Tab/Shift+Tab or redirect focus that tries to escape. Closing the child restores focus to the child's trigger before the parent trap becomes active again.

Page scroll locking is reference-counted per active overlay instance. Opening a second dialog adds another lock; closing one nested layer does not unlock the document while another remains open. The original inline `body.style.overflow` value is restored only after the final lock releases. Set `lockScroll=false` when the layer intentionally must not modify body overflow.

Menu and Popover do not trap focus. They preserve normal document tab order and apply focus restoration only to dismissal paths where restoration is expected, such as Escape.

## Overlay primitive

`Overlay` is a layering primitive, not a dialog. It does not provide dialog naming or focus management by itself.

<div class="docs-preview docs-preview--row">
  <Button variant="subtle" @click="overlayOpen = true">Open custom overlay</Button>
  <Overlay v-model="overlayOpen" color="neutral" :opacity="0.55" :with-backdrop="true" :close-on-click="true">
    <Paper with-border style="padding: 1rem; max-width: 20rem; margin: auto">
      <Stack gap="sm">
        <Text>This is custom overlay content, not a dialog abstraction.</Text>
        <Button @click="overlayOpen = false">Close</Button>
      </Stack>
    </Paper>
  </Overlay>
</div>

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

Overlay, Modal and Drawer each have a dedicated Storybook module with the actual component registered in metadata and functional Controls for meaningful public props. Controlled open state in the primary Playgrounds is synchronized both ways: changing `modelValue` in Controls updates the canvas, while component dismissal writes the new value back to Storybook args.

Menu, Popover and Tooltip also have dedicated Storybook modules with functional Controls. Composition stories are separate so several independently controlled components do not present a misleading shared Controls panel.

The dialog stories additionally cover footer/action composition, long-content scrolling, responsive action wrapping, destructive/loading/disabled states, no-footer surfaces and nested Modal → Drawer actions. Contextual overlay composition keeps Popover → Menu + Tooltip available for manually verifying nested Escape ordering and one-level-at-a-time focus restoration.
