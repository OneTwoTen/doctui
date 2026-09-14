# Selection controls

`Combobox` is the shared focus and listbox engine behind `Select`, `Autocomplete`, and `MultiSelect`. The family keeps DOM focus on the native input and uses `aria-activedescendant` to announce the active listbox option.

<script setup lang="ts">
import { ref } from "vue";
import {
  Autocomplete,
  Combobox,
  MultiSelect,
  Select,
  Stack,
  Text,
} from "@doctui/core";

const rawFramework = ref<string | number | null>("vue");
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

## Combobox

Use the public `Combobox` directly when an application needs the shared engine without one of the higher-level value adapters.

<div class="docs-preview docs-preview--narrow" data-docs-preview="combobox">
  <Stack gap="sm">
    <Combobox
      id="docs-raw-framework"
      v-model="rawFramework"
      label="Combobox engine"
      description="Searchable public Combobox; React is disabled."
      :data="frameworks"
      searchable
      clearable
    />
    <Text size="sm" muted>Value: {{ rawFramework ?? "none" }}</Text>
  </Stack>
</div>

```vue
<Combobox
  v-model="framework"
  label="Combobox"
  :data="frameworks"
  searchable
  clearable
/>
```

## Select

`Select` keeps one selected value and uses the same keyboard/listbox engine with a readonly visible editor.

<div class="docs-preview docs-preview--narrow" data-docs-preview="select">
  <Stack gap="sm">
    <Select
      id="docs-framework"
      v-model="framework"
      label="Framework"
      description="React is disabled in this example."
      :data="frameworks"
      clearable
    />
    <Text size="sm" muted>Selected: {{ framework ?? "none" }}</Text>
  </Stack>
</div>

```vue
<Select
  v-model="framework"
  label="Framework"
  :data="frameworks"
  clearable
/>
```

## Autocomplete

`Autocomplete` keeps a string model and filters the shared option list as the user types.

<div class="docs-preview docs-preview--narrow" data-docs-preview="autocomplete">
  <Stack gap="sm">
    <Autocomplete
      id="docs-framework-search"
      v-model="search"
      label="Search framework"
      :data="frameworks"
      nothing-found="No matching framework"
    />
    <Text size="sm" muted>Query: {{ search || "empty" }}</Text>
  </Stack>
</div>

```vue
<Autocomplete
  v-model="query"
  label="Search framework"
  :data="frameworks"
  nothing-found="No matching framework"
/>
```

## MultiSelect

`MultiSelect` keeps an array model. Search filters remaining choices and Backspace removes the last selected value when the query is empty.

<div class="docs-preview docs-preview--narrow" data-docs-preview="multi-select">
  <Stack gap="sm">
    <MultiSelect
      id="docs-framework-compare"
      v-model="compare"
      label="Compare with"
      :data="frameworks"
      clearable
    />
    <Text size="sm" muted>Selected: {{ compare.length ? compare.join(", ") : "none" }}</Text>
  </Stack>
</div>

```vue
<MultiSelect
  v-model="selected"
  label="Compare"
  :data="frameworks"
  clearable
/>
```

## State comparison

Error and disabled states reuse the same field geometry as the rest of doctui. Keeping them visible next to the interactive examples catches regressions that a single happy-path combobox cannot.

<div class="docs-preview docs-preview--compare" data-docs-preview="selection-states">
  <Select
    model-value="vue"
    label="Validation error"
    :data="frameworks"
    error="Choose a supported production framework."
  />
  <Select
    model-value="vue"
    label="Disabled"
    :data="frameworks"
    disabled
  />
  <MultiSelect
    :model-value="['vue', 'svelte']"
    label="Disabled multiple"
    :data="frameworks"
    disabled
  />
</div>

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
