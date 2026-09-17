# Dialog footer actions

Modal and Drawer expose a composable `footer` slot for persistent actions. Keep business actions in that slot instead of placing them at the end of scrolling body content.

<script setup lang="ts">
import { Button, Drawer, Group, Modal, Text } from "@doctui/core";
import { ref } from "vue";

const modalOpen = ref(false);
const drawerOpen = ref(false);
const destructiveOpen = ref(false);
const stateOpen = ref(false);
const narrowOpen = ref(false);
const customOpen = ref(false);
</script>

## Live examples

<div class="docs-preview docs-preview--row" data-docs-preview="dialog-standard-actions">
  <Button @click="modalOpen = true">Open modal actions</Button>
  <Button variant="default" @click="drawerOpen = true">Open drawer actions</Button>
</div>

<Modal v-model="modalOpen" title="Publish article" size="sm" centered>
  Review the article before publishing. The body can scroll independently while the footer stays available.

  <template #footer>
    <Group justify="flex-end">
      <Button variant="default" @click="modalOpen = false">Cancel</Button>
      <Button @click="modalOpen = false">Publish</Button>
    </Group>
  </template>
</Modal>

<Drawer v-model="drawerOpen" title="Product filters" size="sm">
  Change filter criteria without moving the action row out of view.

  <template #footer>
    <Group justify="flex-end">
      <Button variant="transparent">Clear all</Button>
      <Button variant="default" @click="drawerOpen = false">Cancel</Button>
      <Button @click="drawerOpen = false">Apply</Button>
    </Group>
  </template>
</Drawer>

## Recommended composition

Use ordinary doctui components inside the footer. Modal and Drawer intentionally do not expose `confirmLabel`, `cancelLabel`, `onConfirm`, or similar business-specific props.

```vue
<Modal v-model="open" title="Review changes">
  Review the pending changes before saving.

  <template #footer>
    <Group justify="flex-end">
      <Button variant="default" @click="open = false">Cancel</Button>
      <Button @click="save">Save changes</Button>
    </Group>
  </template>
</Modal>
```

This keeps the surface generic while allowing two actions, three actions, status text, progress states, destructive actions, or application-specific controls.

## Destructive actions

Keep the safe action visually neutral and make the destructive action explicit.

<div class="docs-preview docs-preview--row" data-docs-preview="dialog-destructive-actions">
  <Button color="danger" variant="light" @click="destructiveOpen = true">Preview destructive footer</Button>
</div>

<Modal v-model="destructiveOpen" title="Delete workspace" size="sm" centered>
  This action permanently removes the workspace and its saved views.

  <template #footer>
    <Group justify="flex-end">
      <Button variant="default" @click="destructiveOpen = false">Cancel</Button>
      <Button color="danger" @click="destructiveOpen = false">Delete permanently</Button>
    </Group>
  </template>
</Modal>

```vue
<template #footer>
  <Group justify="flex-end">
    <Button variant="default" @click="open = false">Cancel</Button>
    <Button color="danger" @click="removeWorkspace">Delete permanently</Button>
  </Group>
</template>
```

Do not make a destructive button the only obvious way to leave the dialog.

## Loading and disabled actions

`Button` already owns loading and disabled semantics, so compose those states rather than adding action-state props to Modal or Drawer.

<div class="docs-preview docs-preview--row" data-docs-preview="dialog-loading-disabled-actions">
  <Button variant="outline" @click="stateOpen = true">Preview saving state</Button>
</div>

<Modal v-model="stateOpen" title="Save settings" size="sm" centered>
  While the save is in flight, the action row keeps its position and communicates the temporary state.

  <template #footer>
    <Group justify="flex-end">
      <Button variant="default" disabled>Cancel</Button>
      <Button loading>Saving</Button>
    </Group>
  </template>
</Modal>

```vue
<template #footer>
  <Group justify="flex-end">
    <Button variant="default" :disabled="saving" @click="open = false">
      Cancel
    </Button>
    <Button :loading="saving" @click="save">Saving</Button>
  </Group>
</template>
```

A disabled primary action should remain in its expected location when users need to understand what becomes available after completing required inputs.

## Long content and persistent actions

Modal and Drawer are flex-column surfaces. Their body region is the scroll container while header and footer remain stable inside the surface. This prevents action buttons from disappearing below long content.

Do not add another full-height scroll container around the whole Modal or Drawer. If a nested region needs scrolling, constrain that region explicitly so there is only one clear vertical scrolling owner at each level.

## Narrow surfaces and action wrapping

The footer itself supports wrapping. Use `Group` with its default `wrap=true` when several actions may not fit on one row.

<div class="docs-preview docs-preview--row" data-docs-preview="dialog-narrow-wrapping-actions">
  <Button variant="light" @click="narrowOpen = true">Preview xs footer</Button>
</div>

<Modal v-model="narrowOpen" title="Continue setup" size="xs" centered>
  The action group can wrap naturally instead of forcing horizontal overflow.

  <template #footer>
    <Group justify="flex-end" wrap>
      <Button variant="transparent">Back</Button>
      <Button variant="default">Save draft</Button>
      <Button @click="narrowOpen = false">Continue</Button>
    </Group>
  </template>
</Modal>

```vue
<template #footer>
  <Group justify="flex-end" wrap>
    <Button variant="transparent">Back</Button>
    <Button variant="default">Save draft</Button>
    <Button>Continue</Button>
  </Group>
</template>
```

Avoid forcing a single no-wrap action row inside `xs` Modal or Drawer sizes.

## Custom footer layouts

The slot can contain status text and actions together. Keep the full-width layout inside your slot so doctui does not need business-specific footer props.

<div class="docs-preview docs-preview--row" data-docs-preview="dialog-custom-footer">
  <Button variant="subtle" @click="customOpen = true">Preview status + actions</Button>
</div>

<Modal v-model="customOpen" title="Publish article" size="md" centered>
  Review the final article metadata before publishing.

  <template #footer>
    <Group justify="space-between" wrap style="width: 100%">
      <Text size="sm" muted>Saved 2 minutes ago</Text>
      <Group justify="flex-end">
        <Button variant="default">Preview</Button>
        <Button @click="customOpen = false">Publish</Button>
      </Group>
    </Group>
  </template>
</Modal>

```vue
<template #footer>
  <div class="publish-footer">
    <Text size="sm" muted>Saved 2 minutes ago</Text>
    <Group justify="flex-end">
      <Button variant="default">Preview</Button>
      <Button>Publish</Button>
    </Group>
  </div>
</template>
```

## When not to render a footer

Informational dialogs and read-only drawers often need only the close button in the header. If the `footer` slot is omitted, doctui does not render an empty footer element.

## Nested surfaces

Each surface owns its own actions. In a Modal → Drawer flow, put Drawer actions in the Drawer footer and parent actions in the Modal footer. Closing the Drawer restores focus into the parent Modal; the parent footer remains available afterward.

## Storybook coverage

Modal and Drawer Storybook pages include examples for:

- standard Cancel + primary action,
- destructive actions,
- loading and disabled primary actions,
- long content with persistent footer actions,
- narrow surfaces with wrapping actions,
- no-footer informational surfaces,
- custom status + actions footer layouts,
- left/right Drawer positioning and custom backdrops,
- nested Modal → Drawer compositions with actions on both layers.

Use those stories when changing footer spacing, Button states, scrolling behavior, or dialog composition.
