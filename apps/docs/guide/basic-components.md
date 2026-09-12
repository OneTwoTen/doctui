<script setup lang="ts">
import {
  ActionIcon,
  Box,
  Badge,
  Button,
  Center,
  Checkbox,
  Code,
  Container,
  Divider,
  DoctuiProvider,
  Flex,
  Group,
  Kbd,
  Loader,
  NumberInput,
  Paper,
  PasswordInput,
  Radio,
  SegmentedControl,
  Skeleton,
  Space,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  UnstyledButton,
} from "@doctui/core";
import { ref } from "vue";

const email = ref("");
const modalOpen = ref(false);
</script>

# Basic components

Phase 2 introduces the first public visual components in `@doctui/core`. They intentionally reuse the theme contract from Phase 1 instead of defining component-specific token systems.

## Styles

Import the package stylesheet once in your application entrypoint:

```ts
import "@doctui/core/styles.css";
```

When working inside this monorepo, Storybook receives the same styles from the workspace source entry.

The examples below are live previews rendered with the same public exports documented in the code blocks.

## Layout

`Box` is the low-level container. `Flex`, `Stack`, and `Group` add opinionated flexbox behavior while keeping native CSS semantics visible.

<DoctuiProvider>
  <Box padding="md" style="border: 1px solid var(--dui-color-border); border-radius: var(--dui-radius-md);">
    <Stack gap="md">
      <Title :order="3">Profile settings</Title>
      <Text muted>Use layout primitives to create predictable spacing and alignment.</Text>
      <Group justify="flex-end">
        <Button variant="subtle" color="neutral">Cancel</Button>
        <Button>Save changes</Button>
      </Group>
    </Stack>
  </Box>
</DoctuiProvider>

```vue
<script setup lang="ts">
import { Box, Button, Group, Stack, Text, Title } from "@doctui/core";
</script>

<template>
  <Box as="section" padding="lg">
    <Stack gap="md">
      <Title :order="2">Account</Title>
      <Text muted>Manage your public profile and preferences.</Text>

      <Group justify="flex-end">
        <Button variant="subtle" color="neutral">Cancel</Button>
        <Button>Save changes</Button>
      </Group>
    </Stack>
  </Box>
</template>
```

### Box

- `as`: rendered HTML element, default `div`
- `padding`: `xs | sm | md | lg | xl`
- `margin`: `xs | sm | md | lg | xl`

Spacing values resolve to `--dui-spacing-*` tokens.

### Flex

- `gap`: doctui size token
- `direction`: `row | row-reverse | column | column-reverse`
- `align`: cross-axis alignment
- `justify`: main-axis alignment
- `wrap`: native flex-wrap value
- `as`: rendered HTML element

<DoctuiProvider>
  <Flex gap="sm" align="center" justify="space-between" wrap="wrap" style="padding: 1rem; border: 1px solid var(--dui-color-border);">
    <Text>Responsive toolbar</Text>
    <Button size="sm">Continue</Button>
  </Flex>
</DoctuiProvider>

```vue
<Flex gap="sm" align="center" justify="space-between" wrap="wrap">
  <Text>Left</Text>
  <Button size="sm">Right</Button>
</Flex>
```

### Stack and Group

`Stack` fixes direction to a vertical column. `Group` fixes direction to a horizontal row and wraps by default.

<DoctuiProvider>
  <Stack gap="sm" style="padding: 1rem; border: 1px solid var(--dui-color-border);">
    <Title :order="4">Stacked content</Title>
    <Group>
      <Button size="sm">Confirm</Button>
      <Button size="sm" variant="light">Later</Button>
    </Group>
  </Stack>
</DoctuiProvider>

```vue
<Stack gap="lg">
  <Title :order="3">Settings</Title>
  <Group gap="sm">
    <Button>Confirm</Button>
    <Button variant="light">Later</Button>
  </Group>
</Stack>
```

## Typography

`Text` renders a `p` by default and supports `as`, `size`, `muted`, and `weight`. `Title` renders the matching native heading element for `order` 1 through 6.

<DoctuiProvider>
  <Stack gap="xs" style="padding: 1rem; border: 1px solid var(--dui-color-border);">
    <Title :order="2">Billing</Title>
    <Text>Your next invoice is generated automatically.</Text>
    <Text size="sm" muted>Taxes may vary by region.</Text>
  </Stack>
</DoctuiProvider>

```vue
<Title :order="2">Billing</Title>
<Text size="md">Your next invoice is generated automatically.</Text>
<Text size="sm" muted>Taxes may vary by region.</Text>
```

Using a real heading element is intentional: visual hierarchy should not replace document semantics.

## TextInput

`TextInput` is a native single-line input with a shared label, description, error, required, disabled and read-only contract.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem; padding: 1rem; border: 1px solid var(--dui-color-border);">
    <TextInput
      v-model="email"
      label="Email"
      description="We will never share it."
      type="email"
      placeholder="ada@example.com"
      required
    />
    <TextInput
      label="Invalid value"
      error="Enter a valid email address."
      model-value="not-an-email"
    />
  </Stack>
</DoctuiProvider>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextInput } from "@doctui/core";

const email = ref("");
</script>

<template>
  <TextInput
    id="email"
    v-model="email"
    label="Email"
    description="We will never share it."
    type="email"
    required
  />
</template>
```

Use `error` for validation feedback; it replaces the description and is announced through an alert region. `leftSection` and `rightSection` provide compact adornments, while named `leftSection` and `rightSection` slots support richer content.

```vue
<TextInput label="Website" left-section="https://" right-section=".com" />
<TextInput label="Username" error="This name is already taken." />
<TextInput label="Reference" readonly model-value="DOCTUI-001" />
```

## Other input controls

`Textarea`, `NumberInput`, and `PasswordInput` share the same label, description, error, required, disabled, and `v-model` conventions as `TextInput`.

```vue
<Stack gap="md">
  <Textarea v-model="notes" label="Notes" rows="4" />
  <NumberInput v-model="seats" label="Seats" :min="1" :max="100" />
  <PasswordInput v-model="password" label="Password" clearable />
</Stack>
```

`NumberInput` emits `number | null`, so an empty field is represented as `null` rather than `NaN`.

`Checkbox`, `Radio`, and `Switch` use native input semantics. Give radios in one group the same `name`; `Switch` adds `role="switch"` and keeps `aria-checked` synchronized.

```vue
<Stack gap="sm">
  <Checkbox v-model="accepted" label="Accept terms" required />
  <Group>
    <Radio v-model="plan" name="plan" value="free" label="Free" />
    <Radio v-model="plan" name="plan" value="pro" label="Pro" />
  </Group>
  <Switch v-model="enabled" label="Enabled" />
</Stack>
```

`SegmentedControl` accepts `{ value, label, disabled? }[]` through `data` and emits the selected value. It uses radio roles and supports Arrow keys, Home, End, Enter, and Space.

```vue
<SegmentedControl
  v-model="view"
  aria-label="View"
  :data="[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
  ]"
/>
```

## Select and search controls

`Select`, `Autocomplete`, and `MultiSelect` share one combobox engine for filtering, active-option state, listbox relationships, and keyboard navigation. `Select` emits one value or `null`; `MultiSelect` emits an array; `Autocomplete` keeps a string `v-model`.

```vue
<Select v-model="framework" label="Framework" :data="frameworks" clearable />
<Autocomplete v-model="query" label="Search" :data="frameworks" />
<MultiSelect v-model="selected" label="Compare" :data="frameworks" clearable />

<script setup lang="ts">
import { ref } from 'vue';
import { Autocomplete, MultiSelect, Select } from '@doctui/core';

const frameworks = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte', disabled: true },
];
const framework = ref<string | number | null>(null);
const query = ref('');
const selected = ref<readonly (string | number)[]>([]);
</script>
```

The shared combobox supports Arrow Up/Down, Home, End, Enter, Escape, and Backspace removal for multi-value selections. Use the `option` and `empty` slots on `Combobox` when the default labels are not enough.

## Button

`Button` remains a native `<button>`, defaults to `type="button"`, and supports shared doctui `color`, `variant`, `size`, and `radius` types.

<DoctuiProvider>
  <Group style="padding: 1rem; border: 1px solid var(--dui-color-border);">
    <Button color="primary" variant="filled">Primary</Button>
    <Button color="success" variant="light">Success</Button>
    <Button color="warning" variant="outline">Review</Button>
    <Button color="danger" variant="subtle">Delete</Button>
  </Group>
</DoctuiProvider>

```vue
<Group gap="sm">
  <Button color="primary" variant="filled">Primary</Button>
  <Button color="success" variant="light">Success</Button>
  <Button color="warning" variant="outline">Review</Button>
  <Button color="danger" variant="subtle">Delete</Button>
</Group>
```

### Loading and disabled states

```vue
<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>
```

While loading, the button is disabled and exposes `aria-busy="true"`. Focus styling uses the shared `--dui-color-focus-ring` theme token.

## Additional primitives

The remaining low-level primitives complete the Phase 2 building blocks while keeping their markup semantic and their visual behavior token-driven.

### Layout helpers

`Container` constrains content to a theme breakpoint, `Center` centers content, `Space` adds explicit spacing, and `Divider` exposes a separator to assistive technology.

```vue
<Container size="lg">
  <Center style="min-height: 8rem">
    <Text>Centered inside a responsive container.</Text>
  </Center>
  <Divider label="or" />
  <Space size="md" />
  <Divider orientation="vertical" />
</Container>
```

`Space` accepts `orientation="horizontal"` for inline layouts. `Divider` uses `role="separator"` and reports its orientation with `aria-orientation`.

### Display and feedback

`Code` and `Kbd` use semantic inline elements; set `block` on `Code` for a scrollable code block. `Badge` is a compact status label, and `Paper` is a themed surface.

```vue
<Paper shadow="sm" with-border style="padding: var(--dui-spacing-lg)">
  <Text>Build status <Badge color="success">Live</Badge></Text>
  <Text size="sm" muted>Run <Code> bun run build </Code> or press <Kbd>⌘ K</Kbd>.</Text>
</Paper>
```

Use `Skeleton` while content is unavailable and set `visible="false"` to reveal its default slot. `Loader` supports `type="oval"`, `"dots"`, and `"bars"` and exposes `role="status"` with a loading name.

```vue
<Stack gap="sm">
  <Skeleton height="1rem" width="60%" />
  <Skeleton height="4rem" />
  <Group gap="sm"><Loader type="dots" /><Text muted>Loading</Text></Group>
</Stack>
```

## Compact actions

`ActionIcon` is a native icon-only button and requires `aria-label` through its `ariaLabel` prop. `UnstyledButton` keeps native button keyboard and disabled behavior while leaving visual styling to the consumer.

```vue
<Group>
  <ActionIcon aria-label="Close">×</ActionIcon>
  <UnstyledButton @click="open = true">Open details</UnstyledButton>
</Group>
```

## Overlay and Modal

`Overlay` is a controlled, portal-backed backdrop. `Modal` composes it with `DismissableLayer`, `FocusTrap`, and scroll locking. While open, focus stays inside the dialog; Escape and backdrop clicks close it by default, and focus returns to the trigger.

```vue
<Button @click="modalOpen = true">Open dialog</Button>

<Modal v-model="modalOpen" title="Publish release">
  <Stack gap="md">
    <Text>Publish the current version to your registry?</Text>
    <Group justify="flex-end">
      <Button variant="subtle" color="neutral" @click="modalOpen = false">Cancel</Button>
      <Button color="success" @click="modalOpen = false">Publish</Button>
    </Group>
  </Stack>
</Modal>
```

If a dialog has no visible title, provide `aria-label` (the `ariaLabel` component prop). Do not use a bare overlay for critical content without an accessible surface and dismissal path.

## Storybook

The live Storybook includes isolated examples for layout, typography, button variants/states, plus an advanced composition built from multiple exported doctui components:

https://onetwoten.github.io/doctui/storybook/

## TagsInput

`TagsInput` collects free-form string values. Press Enter or the configured
separator to add a tag, Backspace on an empty field to remove the last tag, and
use the individual remove buttons for pointer and assistive technology users.

```vue
<script setup lang="ts">
import { ref } from "vue";

const topics = ref(["Vue"]);
</script>

<TagsInput
  v-model="topics"
  label="Topics"
  placeholder="Add a topic"
  clearable
/>
```
