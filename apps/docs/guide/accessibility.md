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

- Consumer `class` and `style` customize the **visual root**.
- Other fallthrough attributes and listeners customize the **native form
  control**. This includes `name`, `autocomplete`, `inputmode`, `data-*`,
  `aria-*`, and native event listeners.

The visual root is the bordered TextInput shell for `TextInput` and
`PasswordInput`; the native control itself for `Textarea` and `NumberInput`;
and the wrapping label for `Checkbox`, `Radio`, and `Switch`. Native form
attributes never need to be duplicated onto those wrapper elements.

This separation means layout classes can safely target the component root while
form submission, browser autofill, test hooks, ARIA attributes, and native event
listeners continue to reach the real control.

### Disabled, read-only, and size states

Use `disabled` when a control must not receive focus or input. Text-like fields
also support native `readonly`; read-only controls remain focusable so users can
navigate to and copy their value. Checkbox, Radio, and Switch intentionally use
native disabled semantics instead of inventing a read-only state.

Every field that exposes `size` makes it observable. Text-like fields use the
shared font-size token, while Checkbox, Radio, and Switch scale their native
control and label together and expose the selected size through `data-size`.

Icon-only actions require `ariaLabel`. Keep visible labels and accessible names
in sync, and use `disabled` rather than blocking interaction only with CSS.

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
- Confirm read-only fields remain focusable and disabled fields do not.
- Verify custom IDs, visible labels and every `aria-describedby` target resolve
  to rendered DOM nodes.
- Verify consumer `class`/`style` affect the visual root while native attributes
  such as `name` stay on the form control.
- Test description + error together instead of only testing their happy paths in
  isolation.
- Confirm focus is visible and never leaks behind an active dialog.
- Test disabled, loading, empty and error states without relying on color alone.
