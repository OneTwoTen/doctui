# TagsInput

`TagsInput` is a free-form token field for collecting string values while keeping a native text input as the keyboard and focus entry point.

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
- A visible `label` is associated with the native text editor through `for`/`id`.
- `ariaLabel` provides the accessible name when no visible label is rendered.
- When neither is supplied, the native text editor receives the safe fallback accessible name `Tags`.
- `description`, `error`, and consumer `aria-describedby` values are composed rather than replacing each other.
- Native editor attributes/listeners target the real text input. Consumer `class` and `style` target the outer field root.

## Native form submission

When `name` is provided, the committed tags are represented by repeated hidden inputs with that name. This keeps the unfinished editor draft out of form submission and preserves every selected value without inventing a string serialization format.

```ts
const data = new FormData(formElement);
const skills = data.getAll("skills");
// ["Vue", "Accessibility"]
```

`readonly` tags remain part of form submission. `disabled` tags are excluded, matching native disabled-control semantics. The visible text editor intentionally does not carry `name`; it remains the labelled keyboard/focus target and native validation target when `required` is used.

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
- Clicking a non-interactive area of the TagsInput control focuses the text editor.
- Activating a remove or clear button returns focus to the text input after the action.
- Remove and clear controls use native button keyboard semantics; doctui does not add a separate roving-focus model for tags.

## Disabled and read-only

`disabled` disables the native input and mutation buttons. `readonly` keeps the text input readable/focusable but prevents add, remove, clear, and Backspace mutation. Both states preserve the current token list.

## Visual contract

The control uses the shared field size variables for height and inline padding. Tags wrap inside the field, remove/clear controls have focus-visible treatment, and error/disabled states use semantic theme tokens. The public `size` values therefore change field geometry rather than only text size.

## Storybook coverage

The TagsInput stories include interactive controls, a size matrix, normal/read-only/disabled/max states, native form submission, a multi-character separator example, and a composed profile form example. Use those stories to validate focus, token wrapping, form values, and application-level composition before changing the public contract.
