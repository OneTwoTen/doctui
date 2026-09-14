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
  DoctuiProvider,
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

The core package exposes semantic Vue components that share the same doctui theme contract. Every public visual component documented on this page has a live preview below; fenced examples remain separate so they can still be copied into an application.

## Styles

Import the package stylesheet once in your application entrypoint:

```ts
import "@doctui/core/styles.css";
```

## Layout

`Box` is the low-level container. `Flex`, `Stack`, and `Group` add predictable flexbox behavior while keeping native CSS semantics visible.

<div class="docs-preview">
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

### Flex

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

### Grid and layout helpers

`Container` constrains content, `Center` centers it, `Space` adds explicit spacing, `Divider` exposes a semantic separator, and `Grid` provides token-driven CSS grid geometry.

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
  <Center><Text>Centered content</Text></Center>
  <Divider label="or" />
  <Space size="md" />
</Container>

<Grid :columns="3" gap="sm">
  <Paper with-border>One</Paper>
  <Paper with-border>Two</Paper>
  <Paper with-border>Three</Paper>
</Grid>
```

`Space` also accepts `orientation="horizontal"`. `Divider` reports its orientation with `aria-orientation`.

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
<Text>Your next invoice is generated automatically.</Text>
<Text size="sm" muted>Taxes may vary by region.</Text>
```

Using a real heading element is intentional: visual hierarchy should not replace document semantics.

## TextInput

`TextInput` is a native single-line input with the shared field contract.

<div class="docs-preview docs-preview--narrow">
  <Stack gap="md">
    <TextInput
      v-model="email"
      label="Email"
      description="We will never share it."
      type="email"
      placeholder="ada@example.com"
      required
    />
    <TextInput label="Invalid value" error="Enter a valid email address." model-value="not-an-email" />
  </Stack>
</div>

```vue
<script setup lang="ts">
import { TextInput } from "@doctui/core";
import { ref } from "vue";

const email = ref("");
</script>

<TextInput v-model="email" label="Email" type="email" required />
```

## InputWrapper

`InputWrapper` is the public low-level field shell used by doctui inputs. Its scoped slot provides the generated input ID and `aria-describedby` relationship when a custom control needs the same label/description/error structure.

<div class="docs-preview docs-preview--narrow">
  <InputWrapper label="Custom field" description="A native input wrapped with doctui field relationships." required>
    <template #default="{ id, describedBy }">
      <input :id="id" :aria-describedby="describedBy" value="Custom value" />
    </template>
  </InputWrapper>
</div>

```vue
<InputWrapper label="Custom field" description="Helpful context">
  <template #default="{ id, describedBy }">
    <input :id="id" :aria-describedby="describedBy" />
  </template>
</InputWrapper>
```

## Other input controls

`Textarea`, `NumberInput`, and `PasswordInput` share the same label, description, error, required, disabled, and `v-model` conventions as `TextInput`.

<div class="docs-preview docs-preview--narrow">
  <Stack gap="md">
    <Textarea v-model="notes" label="Notes" :rows="3" />
    <NumberInput v-model="seats" label="Seats" :min="1" :max="100" />
    <PasswordInput v-model="password" label="Password" clearable />
  </Stack>
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

These controls keep native input semantics. Give radios in one group the same `name`; `Switch` adds `role="switch"` and keeps `aria-checked` synchronized.

<div class="docs-preview docs-preview--narrow">
  <Stack gap="sm">
    <Checkbox v-model="accepted" label="Accept terms" required />
    <Group>
      <Radio v-model="plan" name="docs-plan" value="free" label="Free" />
      <Radio v-model="plan" name="docs-plan" value="pro" label="Pro" />
    </Group>
    <Switch v-model="enabled" label="Enable notifications" />
  </Stack>
</div>

```vue
<Checkbox v-model="accepted" label="Accept terms" required />
<Radio v-model="plan" name="plan" value="free" label="Free" />
<Radio v-model="plan" name="plan" value="pro" label="Pro" />
<Switch v-model="enabled" label="Enabled" />
```

## SegmentedControl

`SegmentedControl` accepts `{ value, label, disabled? }[]` and supports Arrow keys, Home, End, Enter, and Space.

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

`Select`, `Autocomplete`, `MultiSelect`, and the underlying `Combobox` have their interactive previews and keyboard contract in [Selection controls](/guide/selection-controls). Keeping those live examples in the dedicated guide avoids duplicating stateful combobox demos here.

```vue
<Select v-model="framework" label="Framework" :data="frameworks" clearable />
<Autocomplete v-model="query" label="Search" :data="frameworks" />
<MultiSelect v-model="selected" label="Compare" :data="frameworks" clearable />
```

## Button

`Button` remains a native `<button>`, defaults to `type="button"`, and supports shared doctui `color`, `variant`, `size`, and `radius` types.

<div class="docs-preview docs-preview--row">
  <Button color="primary" variant="filled">Primary</Button>
  <Button color="success" variant="light">Success</Button>
  <Button color="warning" variant="outline">Review</Button>
  <Button color="danger" variant="subtle">Delete</Button>
</div>

```vue
<Button color="primary" variant="filled">Primary</Button>
<Button color="success" variant="light">Success</Button>
<Button color="warning" variant="outline">Review</Button>
<Button color="danger" variant="subtle">Delete</Button>
```

### Loading and disabled states

<div class="docs-preview docs-preview--row">
  <Button loading>Saving</Button>
  <Button disabled>Unavailable</Button>
</div>

```vue
<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>
```

While loading, the button is disabled and exposes `aria-busy="true"`.

## Display and feedback

`Code` and `Kbd` use semantic inline elements, `Badge` is a compact status label, and `Paper` is a themed surface.

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
<Paper shadow="sm" with-border>
  <Text>Build status <Badge color="success">Live</Badge></Text>
  <Text>Run <Code>bun run build</Code> or press <Kbd>⌘ K</Kbd>.</Text>
</Paper>
<Skeleton height="1rem" width="60%" />
<Loader type="dots" />
```

Use `Skeleton` while content is unavailable and set `visible="false"` to reveal its default slot. `Loader` supports `oval`, `dots`, and `bars`.

## Compact actions

`ActionIcon` is a native icon-only button and requires an accessible label. `UnstyledButton` keeps native button keyboard and disabled behavior while leaving visual styling to the consumer.

<div class="docs-preview docs-preview--row">
  <ActionIcon aria-label="Close">×</ActionIcon>
  <UnstyledButton>Open details</UnstyledButton>
</div>

```vue
<ActionIcon aria-label="Close">×</ActionIcon>
<UnstyledButton @click="open = true">Open details</UnstyledButton>
```

## Overlays

`Overlay`, `Modal`, `Drawer`, `Popover`, `Menu`, and `Tooltip` have interactive triggers in the dedicated [Overlays guide](/guide/overlays). That guide is the primary place to test open/close, dismissal, focus, and nested-surface behavior.

```vue
<Button @click="modalOpen = true">Open dialog</Button>
<Modal v-model="modalOpen" title="Publish release">...</Modal>
```

## TagsInput

`TagsInput` has its interactive free-form token preview, keyboard behavior, separator handling, and form semantics in the dedicated [TagsInput guide](/guide/tags-input).

```vue
<TagsInput v-model="topics" label="Topics" placeholder="Add a topic" clearable />
```

## Storybook

VitePress live previews and Storybook remain separate documentation surfaces. Storybook keeps isolated controls, state matrices, and larger compositions for visual/manual regression work:

https://onetwoten.github.io/doctui/storybook/
