<script setup lang="ts">
import {
  Box,
  Button,
  DoctuiProvider,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@doctui/core";
import { ref } from "vue";

const email = ref("");
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

## Storybook

The live Storybook includes isolated examples for layout, typography, button variants/states, plus an advanced composition built from multiple exported doctui components:

https://onetwoten.github.io/doctui/storybook/
