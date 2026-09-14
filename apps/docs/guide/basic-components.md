<script setup lang="ts">
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Code,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  InputWrapper,
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
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from "@doctui/core";
import { ref } from "vue";

const email = ref("ada@example.com");
const notes = ref("Ship with keyboard support and useful defaults.");
const seats = ref<number | null>(8);
const password = ref("doctui-preview");
const accepted = ref(true);
const plan = ref("pro");
const enabled = ref(true);
const view = ref("grid");
</script>

# Basic components

Phase 2 introduces the first public visual components in `@doctui/core`. They intentionally reuse the theme contract from Phase 1 instead of defining component-specific token systems.

## Styles

Import the package stylesheet once in your application entrypoint:

```ts
import "@doctui/core/styles.css";
```

When working inside this monorepo, Storybook receives the same styles from the workspace source entry. The examples below are live previews rendered with the same public exports documented in the code blocks.

## Layout

`Box` is the low-level container. `Flex`, `Stack`, and `Group` add opinionated flexbox behavior while keeping native CSS semantics visible.

<div class="docs-preview">
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
</div>

```vue
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

<div class="docs-preview">
  <Flex gap="sm" align="center" justify="space-between" wrap="wrap">
    <Text>Responsive toolbar</Text>
    <Button size="sm">Continue</Button>
  </Flex>
</div>

```vue
<Flex gap="sm" align="center" justify="space-between" wrap="wrap">
  <Text>Left</Text>
  <Button size="sm">Right</Button>
</Flex>
```

### Stack and Group

`Stack` fixes direction to a vertical column. `Group` fixes direction to a horizontal row and wraps by default.

<div class="docs-preview">
  <Stack gap="sm">
    <Title :order="4">Stacked content</Title>
    <Group>
      <Button size="sm">Confirm</Button>
      <Button size="sm" variant="light">Later</Button>
    </Group>
  </Stack>
</div>

```vue
<Stack gap="lg">
  <Title :order="3">Settings</Title>
  <Group gap="sm">
    <Button>Confirm</Button>
    <Button variant="light">Later</Button>
  </Group>
</Stack>
```

### Grid and layout helpers

`Container` constrains content to a theme breakpoint, `Center` centers content, `Space` adds explicit spacing, `Divider` exposes a separator to assistive technology, and `Grid` provides token-driven CSS grid geometry.

<div class="docs-preview docs-preview--stack">
  <Container size="lg">
    <Center style="min-height: 4rem">
      <Text>Centered inside a responsive container.</Text>
    </Center>
    <Divider label="or" />
    <Space size="md" />
    <Text size="sm" muted>Content after explicit vertical space.</Text>
  </Container>
  <Grid :columns="3" gap="sm">
    <Paper v-for="label in ['One', 'Two', 'Three']" :key="label" with-border style="padding: 0.75rem">
      <Text>{{ label }}</Text>
    </Paper>
  </Grid>
</div>

```vue
<Container size="lg">
  <Center style="min-height: 8rem">
    <Text>Centered inside a responsive container.</Text>
  </Center>
  <Divider label="or" />
  <Space size="md" />
</Container>

<Grid :columns="3" gap="sm">
  <Paper with-border>One</Paper>
  <Paper with-border>Two</Paper>
  <Paper with-border>Three</Paper>
</Grid>
```

`Space` accepts `orientation="horizontal"` for inline layouts. `Divider` uses `role="separator"` and reports its orientation with `aria-orientation`.

## Typography

`Text` renders a `p` by default and supports `as`, `size`, `muted`, and `weight`. `Title` renders the matching native heading element for `order` 1 through 6.

<div class="docs-preview">
  <Stack gap="xs">
    <Title :order="2">Billing</Title>
    <Text>Your next invoice is generated automatically.</Text>
    <Text size="sm" muted>Taxes may vary by region.</Text>
  </Stack>
</div>

```vue
<Title :order="2">Billing</Title>
<Text size="md">Your next invoice is generated automatically.</Text>
<Text size="sm" muted>Taxes may vary by region.</Text>
```

Using a real heading element is intentional: visual hierarchy should not replace document semantics.

## TextInput

`TextInput` is a native single-line input with a shared label, description, error, required, disabled and read-only contract.

<div class="docs-preview docs-preview--compare">
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
    description="The description remains available with an error."
    error="Enter a valid email address."
    model-value="not-an-email"
  />
  <TextInput label="Read-only reference" readonly model-value="DOCTUI-001" />
  <TextInput label="Disabled field" disabled model-value="Unavailable" />
</div>

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

Use `error` for validation feedback. The error is announced through an alert region while supporting description text remains associated with the native control. `leftSection` and `rightSection` provide compact adornments, while named `leftSection` and `rightSection` slots support richer content.

```vue
<TextInput label="Website" left-section="https://" right-section=".com" />
<TextInput label="Username" error="This name is already taken." />
<TextInput label="Reference" readonly model-value="DOCTUI-001" />
```

## InputWrapper

`InputWrapper` is the low-level public field shell used by doctui inputs. Its scoped slot exposes the generated control ID and `aria-describedby` relationship so custom controls can use the same label, description, error, and required structure.

<div class="docs-preview docs-preview--narrow">
  <InputWrapper label="Custom field" description="A custom native control using doctui field relationships." required>
    <template #default="{ id, describedBy }">
      <input
        :id="id"
        :aria-describedby="describedBy"
        class="docs-preview-native-control"
        value="Custom value"
      />
    </template>
  </InputWrapper>
</div>

```vue
<InputWrapper label="Custom field" description="Helpful context" required>
  <template #default="{ id, describedBy }">
    <input :id="id" :aria-describedby="describedBy" />
  </template>
</InputWrapper>
```

## Other input controls

`Textarea`, `NumberInput`, and `PasswordInput` share the same label, description, error, required, disabled, and `v-model` conventions as `TextInput`.

<div class="docs-preview docs-preview--compare">
  <Textarea v-model="notes" label="Notes" :rows="3" />
  <NumberInput v-model="seats" label="Seats" :min="1" :max="100" />
  <PasswordInput v-model="password" label="Password" clearable />
  <PasswordInput label="Disabled password" model-value="secret" disabled />
</div>

```vue
<Stack gap="md">
  <Textarea v-model="notes" label="Notes" :rows="4" />
  <NumberInput v-model="seats" label="Seats" :min="1" :max="100" />
  <PasswordInput v-model="password" label="Password" clearable />
</Stack>
```

`NumberInput` emits `number | null`, so an empty field is represented as `null` rather than `NaN`.

## Checkbox, Radio, and Switch

`Checkbox`, `Radio`, and `Switch` use native input semantics. Give radios in one group the same `name`; `Switch` adds `role="switch"` and keeps `aria-checked` synchronized.

<div class="docs-preview docs-preview--compare">
  <Stack gap="sm">
    <Text size="sm" weight="600">Interactive</Text>
    <Checkbox v-model="accepted" label="Accept terms" required />
    <Group>
      <Radio v-model="plan" name="docs-plan" value="free" label="Free" />
      <Radio v-model="plan" name="docs-plan" value="pro" label="Pro" />
    </Group>
    <Switch v-model="enabled" label="Enable notifications" />
  </Stack>
  <Stack gap="sm">
    <Text size="sm" weight="600">Disabled</Text>
    <Checkbox model-value label="Accepted" disabled />
    <Radio model-value="pro" name="docs-disabled-plan" value="pro" label="Pro" disabled />
    <Switch model-value label="Notifications enabled" disabled />
  </Stack>
</div>

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

## SegmentedControl

`SegmentedControl` accepts `{ value, label, disabled? }[]` through `data` and emits the selected value. It uses radio roles and supports Arrow keys, Home, End, Enter, and Space.

<div class="docs-preview docs-preview--narrow">
  <SegmentedControl
    v-model="view"
    aria-label="View"
    :data="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
      { value: 'board', label: 'Board', disabled: true },
    ]"
  />
</div>

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

`Select`, `Autocomplete`, `MultiSelect`, and `Combobox` share one combobox engine for filtering, active-option state, listbox relationships, and keyboard navigation. `Select` emits one value or `null`; `MultiSelect` emits an array; `Autocomplete` keeps a string `v-model`.

Their complete interactive previews live in [Selection controls](/guide/selection-controls), including the public `Combobox`, disabled options, search, clearing, multi-value selection, and keyboard behavior.

```vue
<Select v-model="framework" label="Framework" :data="frameworks" clearable />
<Autocomplete v-model="query" label="Search" :data="frameworks" />
<MultiSelect v-model="selected" label="Compare" :data="frameworks" clearable />
```

The shared combobox supports Arrow Up/Down, Home, End, Enter, Escape, and Backspace removal for multi-value selections. Use the `option` and `empty` slots on `Combobox` when the default labels are not enough.

## Button

`Button` remains a native `<button>`, defaults to `type="button"`, and supports shared doctui `color`, `variant`, `size`, and `radius` types.

<div class="docs-preview docs-preview--row">
  <Button color="primary" variant="filled">Primary</Button>
  <Button color="success" variant="light">Success</Button>
  <Button color="warning" variant="outline">Review</Button>
  <Button color="danger" variant="subtle">Delete</Button>
</div>

```vue
<Group gap="sm">
  <Button color="primary" variant="filled">Primary</Button>
  <Button color="success" variant="light">Success</Button>
  <Button color="warning" variant="outline">Review</Button>
  <Button color="danger" variant="subtle">Delete</Button>
</Group>
```

### Loading and disabled states

<div class="docs-preview docs-preview--row">
  <Button>Ready</Button>
  <Button loading>Saving</Button>
  <Button disabled>Unavailable</Button>
</div>

```vue
<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>
```

While loading, the button is disabled and exposes `aria-busy="true"`. Focus styling uses the shared `--dui-color-focus-ring` theme token.

## Additional primitives

The remaining low-level primitives complete the Phase 2 building blocks while keeping their markup semantic and their visual behavior token-driven.

### Display and feedback

`Code` and `Kbd` use semantic inline elements; set `block` on `Code` for a scrollable code block. `Badge` is a compact status label, and `Paper` is a themed surface.

<div class="docs-preview docs-preview--stack">
  <Paper shadow="sm" with-border style="padding: var(--dui-spacing-lg)">
    <Text>Build status <Badge color="success">Live</Badge></Text>
    <Text size="sm" muted>Run <Code>bun run build</Code> or press <Kbd>⌘ K</Kbd>.</Text>
  </Paper>
  <Stack gap="sm">
    <Skeleton height="1rem" width="60%" />
    <Skeleton height="4rem" />
    <Group gap="sm"><Loader type="dots" /><Text muted>Loading</Text></Group>
  </Stack>
</div>

```vue
<Paper shadow="sm" with-border style="padding: var(--dui-spacing-lg)">
  <Text>Build status <Badge color="success">Live</Badge></Text>
  <Text size="sm" muted>Run <Code>bun run build</Code> or press <Kbd>⌘ K</Kbd>.</Text>
</Paper>

<Stack gap="sm">
  <Skeleton height="1rem" width="60%" />
  <Skeleton height="4rem" />
  <Group gap="sm"><Loader type="dots" /><Text muted>Loading</Text></Group>
</Stack>
```

Use `Skeleton` while content is unavailable and set `visible="false"` to reveal its default slot. `Loader` supports `type="oval"`, `"dots"`, and `"bars"` and exposes `role="status"` with a loading name.

## Compact actions

`ActionIcon` is a native icon-only button and requires `aria-label` through its `ariaLabel` prop. `UnstyledButton` keeps native button keyboard and disabled behavior while leaving visual styling to the consumer.

<div class="docs-preview docs-preview--row">
  <ActionIcon aria-label="Close">×</ActionIcon>
  <UnstyledButton>Open details</UnstyledButton>
</div>

```vue
<Group>
  <ActionIcon aria-label="Close">×</ActionIcon>
  <UnstyledButton @click="open = true">Open details</UnstyledButton>
</Group>
```

## Overlay and Modal

`Overlay` is a controlled, portal-backed backdrop. `Modal` composes it with `DismissableLayer`, `FocusTrap`, and scroll locking. While open, focus stays inside the dialog; Escape and backdrop clicks close it by default, and focus returns to the trigger.

The complete interactive family lives in [Overlays](/guide/overlays), and persistent footer compositions live in [Dialog footer actions](/guide/dialog-actions). Those pages include real open/close triggers instead of static markup.

```vue
<Button @click="modalOpen = true">Open dialog</Button>
<Modal v-model="modalOpen" title="Publish release">...</Modal>
```

If a dialog has no visible title, provide `aria-label` (the `ariaLabel` component prop). Do not use a bare overlay for critical content without an accessible surface and dismissal path.

## TagsInput

`TagsInput` collects free-form string values. Press Enter or the configured separator to add a tag, Backspace on an empty field to remove the last tag, and use the individual remove buttons for pointer and assistive technology users.

Use the dedicated [TagsInput guide](/guide/tags-input) for the complete interactive preview, including add/remove/clear behavior, max tags, read-only/disabled states, form submission, and multi-character separators.

```vue
<TagsInput
  v-model="topics"
  label="Topics"
  placeholder="Add a topic"
  clearable
/>
```

## Storybook

VitePress documents usage and renders representative live states next to the API explanation. Storybook remains the deeper visual/manual regression surface with isolated controls, state matrices, and composed examples:

https://onetwoten.github.io/doctui/storybook/
