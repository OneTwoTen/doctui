<script setup lang="ts">
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  YearPicker,
} from "@doctui/dates";
import { DoctuiProvider, Stack, Text } from "@doctui/core";
import { ref } from "vue";

const date = ref<string | null>("2026-09-14");
const month = ref("2026-09");
const year = ref<number | null>(2026);
</script>

# Dates

`@doctui/dates` is the date-domain package for doctui. It does not pull in a
date library, but it intentionally uses `@doctui/core` as a peer so date fields
share the same geometry, sizing, radius, focus, error and disabled states as the
rest of the component system.

Import the public styles for both packages in applications that consume the
packages directly:

```ts
import '@doctui/core/styles.css';
import '@doctui/dates/styles.css';
```

## DatePicker

`DatePicker` is a fully doctui-owned picker surface. It does **not** render a
browser-native `input[type="date"]`; the visible field is a readonly text input
with a locale-formatted value, SVG actions and an accessible custom calendar.
Use `DateInput` when browser-native date chrome is preferred.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DatePicker
      v-model="date"
      label="Release date"
      description="Choose a date between September 10 and September 25."
      placeholder="Choose a release date"
      min-date="2026-09-10"
      max-date="2026-09-25"
      size="md"
      radius="md"
      clearable
    />
    <Text size="sm" muted>Selected: {{ date ?? "none" }}</Text>
  </Stack>
</DoctuiProvider>

```vue
<script setup lang="ts">
import { DatePicker } from '@doctui/dates';
import { ref } from 'vue';

const date = ref<string | null>('2026-09-14');
</script>

<template>
  <DatePicker
    v-model="date"
    label="Release date"
    description="Choose a publishing date"
    placeholder="Select date"
    size="md"
    radius="md"
    clearable
  />
</template>
```

The field and calendar actions expose `aria-expanded`, `aria-controls` and
`aria-haspopup="grid"`. Opening moves focus into the active calendar day.
`Escape` closes the popup and restores focus to the calendar action; pointer
input outside closes it without moving focus. `disabled` is forwarded to the
field, actions and calendar.

## Native date fields

`DateInput` and `DateTimePicker` keep native `date` / `datetime-local` browser
semantics while reusing the core `TextInput` field contract. Both support
`size`, `radius`, `label`, `description`, `error`, `disabled`, `clearable` and
`ariaLabel`.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DateInput
      v-model="date"
      label="Start date"
      description="Native date input with doctui field geometry."
      size="md"
      radius="md"
      clearable
    />
    <DateInput
      :model-value="null"
      label="End date"
      error="End date is required"
    />
    <DateTimePicker
      model-value="2026-09-14T09:00"
      label="Publish at"
      description="Local date and time"
      clearable
    />
  </Stack>
</DoctuiProvider>

When no visible `label` is supplied, pass `ariaLabel`. Label, description and
error relationships are provided by the same SSR-safe core field structure used
by other doctui inputs.

## Calendar surface

<DoctuiProvider>
  <Calendar
    v-model="date"
    month="2026-09"
    min-date="2026-08-20"
    max-date="2026-10-20"
    :first-day-of-week="1"
  />
</DoctuiProvider>

The calendar renders a stable six-week grid and keeps adjacent-month days
visible in a muted state. Calendar, `MonthPicker` and `YearPicker` share the
same token-driven date surface, so light/dark mode and theme overrides stay
consistent without component-specific dark-mode CSS.

The calendar uses `grid` → `row` → `gridcell` semantics with one roving tab
stop. The selected date uses `aria-selected`; today uses `aria-current="date"`.

| Key | Behavior |
| --- | --- |
| Arrow Left / Right | Move one day |
| Arrow Up / Down | Move one week |
| Home / End | Move to the first / last day in the configured week |
| PageUp / PageDown | Move to the previous / next month |
| Enter / Space | Select the focused native day button |

`firstDayOfWeek` accepts `0` for Sunday through `6` for Saturday. `locale`
controls weekday, month and formatted picker values. `minDate` and `maxDate`
disable out-of-range dates and keyboard movement does not focus those disabled
dates.

## Month and year surfaces

<DoctuiProvider>
  <Stack gap="md" style="max-width: 24rem;">
    <MonthPicker v-model="month" :year="2026" />
    <YearPicker v-model="year" :min-year="2024" :max-year="2030" />
  </Stack>
</DoctuiProvider>

Month and year pickers use `listbox` / `option` semantics with `aria-selected`.
Arrow keys move between options and Home/End jump to the first/last option.
Both controls support `disabled` and a custom `ariaLabel`.

## Value validation

Date values are strict `YYYY-MM-DD` strings. Invalid or overflowing values such
as `2026-02-31`, `2026-13-01` or strings with trailing content are rejected by
`dateValue.parseDate()`. Calendar range checks use validated dates rather than
JavaScript's overflowing `new Date(year, month, day)` behavior.
