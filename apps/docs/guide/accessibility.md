# Accessibility

Accessibility is part of doctui's public contract. Prefer the native HTML
semantics provided by each component and add an accessible name whenever the
visual UI alone is not enough.

## Forms

Use `label`, `description`, `error` and `required` consistently on input
components. doctui connects the label and help/error text to the native
control and exposes validation errors with `role="alert"`.

```vue
<TextInput
  v-model="email"
  label="Email"
  description="We will only use this for account messages."
  error="Enter a valid email address."
  required
/>
```

Icon-only actions require `ariaLabel`. Keep visible labels and accessible names
in sync, and use `disabled` rather than blocking interaction only with CSS.

## Checkbox, radio, switch and segmented controls

`Checkbox`, `Radio` and `Switch` preserve native input behavior. Do not add
custom key handlers around them: Space toggles checkbox-like controls and
radios in one native group share the same `name`. Use a visible `label` whenever
possible, and keep disabled controls actually disabled rather than only styling
them as unavailable.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Checkbox, Group, Radio, Switch } from "@doctui/core";

const accepted = ref(false);
const plan = ref<string | number>("free");
const alerts = ref(true);
</script>

<template>
  <Checkbox v-model="accepted" label="Accept terms" />

  <Group gap="sm">
    <Radio v-model="plan" name="plan" value="free" label="Free" />
    <Radio v-model="plan" name="plan" value="team" label="Team" disabled />
    <Radio v-model="plan" name="plan" value="pro" label="Pro" />
  </Group>

  <Switch v-model="alerts" label="Product alerts" />
</template>
```

`SegmentedControl` is a composite radio group, so it uses a roving tab stop:
only one enabled segment is in the page Tab order. When `modelValue` is empty,
missing from `data`, or points to a disabled option, the first enabled segment
becomes the keyboard entry point without changing the controlled value.

Once focus is inside the group:

- Arrow Right/Down selects and focuses the next enabled segment.
- Arrow Left/Up selects and focuses the previous enabled segment.
- Home selects and focuses the first enabled segment.
- End selects and focuses the last enabled segment.
- Enter and Space select the focused enabled segment.
- Disabled segments are skipped. A disabled group has no tabbable segment.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SegmentedControl } from "@doctui/core";

const view = ref<string | number | undefined>();

const views = [
  { value: "list", label: "List", disabled: true },
  { value: "grid", label: "Grid" },
  { value: "board", label: "Board" },
  { value: "table", label: "Table", disabled: true },
];
</script>

<template>
  <SegmentedControl
    v-model="view"
    aria-label="View"
    :data="views"
  />
</template>
```

For controlled usage, update the value passed back through `v-model`. The
rendered `aria-checked` state follows that controlled value, while keyboard
navigation still guarantees one enabled entry point whenever the group itself
is enabled and contains at least one enabled option.

## Overlays and selection

`Modal` and `Drawer` use dialog semantics, trap focus while open, restore focus
to the trigger when closed, and close on Escape by default. Provide `title` or
`ariaLabel`; do not put critical information in a tooltip.

`Select`, `Autocomplete`, `MultiSelect` and `Combobox` expose combobox/listbox
relationships and support keyboard navigation. Keep option labels meaningful,
mark unavailable options with `disabled`, and test the complete keyboard flow.

Tooltips appear on both hover and focus, but their content is supplemental.
Every important action must remain understandable without a pointer or hover.

## Testing checklist

- Navigate controls with Tab, Shift+Tab and the relevant arrow keys.
- Confirm composite controls keep exactly one enabled Tab entry point.
- Verify Home/End and Arrow navigation skip disabled options and synchronize selection.
- Confirm focus is visible and never leaks behind an active dialog.
- Verify an accessible name, label association and error/help relationship.
- Test disabled, loading, empty and error states without relying on color alone.
