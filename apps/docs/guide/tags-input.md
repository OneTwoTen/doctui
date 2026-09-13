# TagsInput

`TagsInput` is a free-form token field for collecting string values while keeping a native text input as the keyboard and form entry point.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TagsInput } from "@doctui/core";

const skills = ref(["Vue", "Accessibility"]);
</script>

<template>
  <TagsInput
    id="skills"
    name="skills"
    v-model="skills"
    label="Skills"
    description="Press Enter or comma to add a skill"
    :max-tags="5"
    clearable
  />
</template>
```

## Field relationships and accessible naming

- `id` is optional. When omitted, `InputWrapper` generates the same SSR-safe ID contract used by other doctui fields.
- A visible `label` is associated with the native input through `for`/`id`.
- `ariaLabel` provides the accessible name when no visible label is rendered.
- When neither is supplied, the native input receives the safe fallback accessible name `Tags`.
- `description`, `error`, and consumer `aria-describedby` values are composed rather than replacing each other.
- `name` and other native form attributes/listeners target the native input. Consumer `class` and `style` target the outer field root.

## Token normalization

Every committed token is trimmed. Empty strings and exact duplicates are ignored. Duplicate comparison is case-sensitive, so `Vue` and `vue` are distinct values.

`maxTags` applies to the complete next value, including a pasted batch. A batch produces one `update:modelValue` event and one `add` event for each accepted token. Values beyond the limit are ignored.

## Separators

`separator` defaults to `,`.

For a one-character separator, pressing that key commits the current draft. Enter always commits the draft. Multi-character separators such as `||` are parsed from typed or pasted input instead of being treated as a synthetic keyboard key.

```vue
<TagsInput
  v-model="topics"
  label="Topics"
  separator="||"
  placeholder="Vue || Rust || Accessibility"
/>
```

## Keyboard and focus behavior

Selected tokens are exposed as an accessible list and each removable token contains a native remove button.

- `Enter` commits the current non-empty draft.
- A one-character separator key commits the current draft.
- `Backspace` in an empty input removes the last token and keeps focus on the input.
- Activating a remove or clear button returns focus to the text input after the action.
- Remove and clear controls use native button keyboard semantics; doctui does not add a separate roving-focus model for tags.

## Disabled and read-only

`disabled` disables the native input and mutation buttons. `readonly` keeps the text input readable/focusable but prevents add, remove, clear, and Backspace mutation. Both states preserve the current token list.

## Storybook coverage

The TagsInput stories include interactive controls, normal/read-only/disabled/max states, a multi-character separator example, and a composed profile form example. Use those stories to validate focus, token wrapping, and application-level composition before changing the public contract.
