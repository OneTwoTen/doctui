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
- Confirm focus is visible and never leaks behind an active dialog.
- Verify an accessible name, label association and error/help relationship.
- Test disabled, loading, empty and error states without relying on color alone.
