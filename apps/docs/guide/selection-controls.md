# Selection controls

`Combobox` is the shared focus and listbox engine behind `Select`, `Autocomplete`, and `MultiSelect`. The family keeps DOM focus on the native input and uses `aria-activedescendant` to announce the active listbox option.

<script setup lang="ts">
import { ref } from "vue";
import { Autocomplete, MultiSelect, Select, Stack } from "@doctui/core";

const framework = ref<string | number | null>("vue");
const search = ref("");
const compare = ref<readonly (string | number)[]>(["vue", "svelte"]);

const frameworks = [
  { value: "vue", label: "Vue" },
  { value: "react", label: "React", disabled: true },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];
</script>

## Live example

<Stack gap="md" style="max-width: 32rem">
  <Select
    id="docs-framework"
    v-model="framework"
    label="Framework"
    description="React is disabled in this example."
    :data="frameworks"
    clearable
  />

  <Autocomplete
    id="docs-framework-search"
    v-model="search"
    label="Search framework"
    :data="frameworks"
    nothing-found="No matching framework"
  />

  <MultiSelect
    id="docs-framework-compare"
    v-model="compare"
    label="Compare with"
    :data="frameworks"
    clearable
  />
</Stack>

## Shared public contract

All four controls support a public `id`. When `id` is omitted, the shared `InputWrapper` creates a Vue SSR-safe ID. The same ID is used by the visible label and the native combobox input; the listbox ID is `${id}-listbox`.

A visible `label` is preferred. For controls without a visible label, pass `ariaLabel`. As a final safety net, doctui supplies `Select option` for single-value controls and `Select options` for multiple-value controls so the native combobox never renders unnamed.

`Select`, `Autocomplete`, and `MultiSelect` all forward the shared `clear` event in addition to their existing `v-model` update event.

```vue
<Select
  id="assignee"
  v-model="assignee"
  :data="people"
  aria-label="Assignee"
  clearable
  @clear="trackCleared"
/>
```

## Focus model

The input retains DOM focus while the popup is open. Options are not separate tab stops. The active option is exposed through `aria-activedescendant`, and doctui scrolls the active option into view as keyboard navigation changes it.

- `ArrowDown` opens at the first enabled option, then moves to the next enabled option.
- `ArrowUp` opens at the last enabled option, then moves to the previous enabled option.
- `Home` moves to the first enabled option.
- `End` moves to the last enabled option.
- `Enter` selects the active enabled option.
- `Escape` closes the listbox and keeps focus on the input.
- Disabled options are never keyboard-active and pointer hover does not make them active.
- When filtering or `data` changes, the active option is preserved by value when possible; otherwise it falls back to the first enabled visible option.
- When filtering produces no results, `aria-activedescendant` is removed and `nothingFound` is rendered as a status message.

## Search and controlled values

`Autocomplete` and `MultiSelect` use the same filtering path. Filtering cannot leave `aria-activedescendant` pointing to an option that no longer exists. Controlled `modelValue` updates immediately update `aria-selected` state when the listbox is rendered.

For `MultiSelect`, Backspace removes the last selected value when the search query is empty. Clear emits an empty array; single-value controls clear to `null`, with `Autocomplete` adapting that back to its string `v-model` contract.

## Native attributes

Like the rest of doctui's field family, consumer `class` and `style` target the outer field root. Native attributes and listeners such as `name`, `autocomplete`, `data-*`, `aria-*`, and keyboard/input listeners are forwarded to the actual combobox input.
