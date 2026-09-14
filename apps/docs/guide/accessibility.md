<script setup lang="ts">
import {
  Checkbox,
  Group,
  Radio,
  SegmentedControl,
  Stack,
  Switch,
  TextInput,
} from "@doctui/core";
import { ref } from "vue";

const docsEmail = ref("billing@example.com");
const accepted = ref(false);
const plan = ref<string | number>("free");
const alerts = ref(true);
const view = ref<string | number | undefined>();

const views = [
  { value: "list", label: "List", disabled: true },
  { value: "grid", label: "Grid" },
  { value: "board", label: "Board" },
  { value: "table", label: "Table", disabled: true },
];
</script>

# Accessibility

Accessibility is part of doctui's public contract. Prefer the native HTML
semantics provided by each component and add an accessible name whenever the
visual UI alone is not enough.

## Forms

`TextInput`, `Textarea`, `NumberInput`, `PasswordInput`, `Checkbox`, `Radio`,
and `Switch` share one field relationship contract through `InputWrapper`.

### Label and message relationships

- A consumer-provided `id` is preserved. When `id` is omitted, `InputWrapper`
  creates a Vue SSR-safe ID and gives the same ID to the field slot.
- A visible `label` points to the native control ID.
- `description` and `error` can be present at the same time. Both remain in the
  DOM, and both IDs are included in the native control's `aria-describedby`.
- A consumer-provided `aria-describedby` is appended to doctui's IDs instead of
  replacing them.
- An error forces `aria-invalid="true"` on the native control and is rendered in
  a `role="alert"` region. The description remains available as supporting
  context.
- The required marker is visual only (`aria-hidden`); the native control still
  receives the real `required` attribute.

<div class="docs-preview docs-preview--compare" data-docs-preview="a11y-field-relationships">
  <TextInput
    id="docs-billing-email"
    v-model="docsEmail"
    label="Billing email"
    description="Invoices are sent to this address."
    required
  />
  <TextInput
    id="docs-invalid-email"
    model-value="not-an-email"
    label="Billing email with error"
    description="Company policy requires a shared billing inbox."
    error="Enter a valid email address."
    required
  />
</div>

```vue
<template>
  <TextInput
    id="billing-email"
    v-model="email"
    class="billing-field"
    name="email"
    autocomplete="email"
    label="Billing email"
    description="Invoices are sent to this address."
    error="Enter a valid email address."
    aria-describedby="billing-email-policy"
    required
  />

  <p id="billing-email-policy">
    Company policy requires a shared billing inbox.
  </p>
</template>
```

In this example the native input is described by the doctui description, the
validation error, and `billing-email-policy` in that order.

### Attribute forwarding

Field attributes have one predictable target:

- Consumer `class` and `style` customize the **outer field root**. Layout rules
  therefore apply to the label, control, description and error as one unit.
- Other fallthrough attributes and listeners customize the **native form
  control**. This includes `name`, `autocomplete`, `inputmode`, `form`, `data-*`,
  `aria-*`, and native event listeners.

For example, `class="billing-field"` is applied to the outer
`.dui-InputWrapper`, while `name="email"` and `autocomplete="email"` remain on
the native `<input>`. Components use explicit attribute ownership instead of
relying on Vue's automatic fallthrough.

This keeps form submission, browser autofill, test hooks, ARIA attributes and
native listeners on the semantic control while allowing normal layout CSS to
style the complete field.

### Size and state styling

Every field that exposes `size` changes meaningful geometry. The field family
uses shared `--dui-field-*` CSS variables for control height, inline padding,
choice-indicator size and Switch track/thumb dimensions. `xs`, `sm`, `md`, `lg`
and `xl` therefore scale the full control instead of only changing font size.

Text-like fields expose error, disabled and read-only state consistently.
Read-only inputs remain keyboard focusable and can still be copied. Disabled
controls use native `disabled` semantics and do not receive focus.

<div class="docs-preview docs-preview--compare" data-docs-preview="a11y-field-states">
  <TextInput label="Normal" model-value="Editable value" />
  <TextInput label="Read-only" model-value="Copyable value" readonly />
  <TextInput label="Disabled" model-value="Unavailable value" disabled />
  <TextInput label="Error" model-value="Invalid value" error="Check this value." />
</div>

Checkbox, Radio and Switch use custom visual indicators, but their real native
inputs remain in the DOM and continue to own keyboard focus, form submission,
`required`, `disabled`, checked state and native events. Focus-visible state is
projected from the native input onto the visual indicator or Switch track.

### Styling individual field parts

Use regular `class`/`style` for the outer field root. For supported internal
parts, fields expose typed `classNames` and `styles` maps. This is the supported
alternative to deep selectors.

```vue
<template>
  <TextInput
    v-model="email"
    label="Email"
    :class-names="{
      label: 'account-label',
      wrapper: 'account-control',
      input: 'account-input',
    }"
    :styles="{
      root: { marginBottom: '1rem' },
      wrapper: { '--dui-field-control-height': '3rem' },
      input: { letterSpacing: '0.01em' },
    }"
  />
</template>
```

Shared field parts include wrapper relationship regions such as `root`, `label`,
`description`, `error` and `control`, plus control-specific parts such as
`wrapper`, `input`, `section`, `indicator`, `track`, `thumb` and `labelText`.
Only documented part names and `--dui-*` variables should be treated as public
customization hooks.

### Disabled, read-only, and boolean semantics

Use `disabled` when a control must not receive focus or input. Text-like fields
also support native `readonly`; read-only controls remain focusable so users can
navigate to and copy their value. Checkbox, Radio and Switch intentionally use
native disabled semantics instead of inventing a read-only state.

Icon-only actions require `ariaLabel`. Keep visible labels and accessible names
in sync, and use `disabled` rather than blocking interaction only with CSS.

## Checkbox, radio, switch and segmented controls

`Checkbox`, `Radio` and `Switch` preserve native input behavior. Do not add
custom key handlers around them: Space toggles checkbox-like controls and
radios in one native group share the same `name`. Use a visible `label` whenever
possible, and keep disabled controls actually disabled rather than only styling
them as unavailable.

<div class="docs-preview docs-preview--compare" data-docs-preview="a11y-native-choice-controls">
  <Stack gap="sm">
    <Checkbox v-model="accepted" label="Accept terms" />
    <Group gap="sm">
      <Radio v-model="plan" name="docs-a11y-plan" value="free" label="Free" />
      <Radio v-model="plan" name="docs-a11y-plan" value="team" label="Team" disabled />
      <Radio v-model="plan" name="docs-a11y-plan" value="pro" label="Pro" />
    </Group>
    <Switch v-model="alerts" label="Product alerts" />
  </Stack>
  <Stack gap="sm">
    <Checkbox model-value label="Disabled checked" disabled />
    <Switch model-value label="Disabled switch" disabled />
  </Stack>
</div>

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

<div class="docs-preview docs-preview--narrow" data-docs-preview="a11y-segmented-keyboard">
  <SegmentedControl
    v-model="view"
    aria-label="View"
    :data="views"
  />
</div>

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
`ariaLabel`; do not put critical information in a tooltip. Test those behaviors
against the live triggers in [Overlays](/guide/overlays).

`Select`, `Autocomplete`, `MultiSelect` and `Combobox` expose combobox/listbox
relationships and support keyboard navigation. Keep option labels meaningful,
mark unavailable options with `disabled`, and test the complete keyboard flow in
[Selection controls](/guide/selection-controls).

Tooltips appear on both hover and focus, but their content is supplemental.
Every important action must remain understandable without a pointer or hover.

## Testing checklist

- Navigate controls with Tab, Shift+Tab and the relevant arrow keys.
- Confirm composite controls keep exactly one enabled Tab entry point.
- Verify Home/End and Arrow navigation skip disabled options and synchronize selection.
- Confirm read-only fields remain focusable and disabled fields do not.
- Verify custom IDs, visible labels and every `aria-describedby` target resolve
  to rendered DOM nodes.
- Verify consumer `class`/`style` affect the outer field root while native
  attributes such as `name`, autofill attributes and listeners stay on the real
  form control.
- Test description + error together instead of only testing their happy paths in
  isolation.
- Compare all supported sizes visually and confirm geometry changes, not only
  text size.
- For Checkbox, Radio and Switch, verify the native input still owns checked,
  disabled, required, name/value and keyboard-focus semantics even though the
  indicator is custom-rendered.
- Exercise representative `classNames`/`styles` parts and public CSS-variable
  overrides.
- Confirm focus is visible and never leaks behind an active dialog.
- Test disabled, loading, empty and error states without relying on color alone.
