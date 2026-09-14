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

`@doctui/dates` provides dependency-free date controls that emit strict ISO
values. Date fields use Vue SSR-safe IDs for label, description and error
relationships, while calendar/listbox controls expose keyboard models directly
instead of relying on pointer interaction.

## Date picker

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DatePicker
      v-model="date"
      label="Release date"
      description="Choose a date between September 10 and September 25."
      min-date="2026-09-10"
      max-date="2026-09-25"
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
    min-date="2026-09-10"
    max-date="2026-09-25"
    clearable
  />
</template>
```

The toggle exposes `aria-expanded`, `aria-controls` and `aria-haspopup="grid"`.
Opening moves focus into the active calendar day. `Escape` closes the popup and
restores focus to the toggle; pointer input outside closes it without moving
focus. `disabled` is forwarded to the native input, toggle and calendar.

## Field states

`DateInput` and `DateTimePicker` share the same `label`, `description`, `error`,
`disabled`, `clearable` and `ariaLabel` behavior. Error text is connected with
`aria-describedby`, marks the field invalid and uses `role="alert"`.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DateInput
      v-model="date"
      label="Start date"
      description="Native date input with SSR-safe relationships."
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

When no visible `label` is supplied, pass `ariaLabel`. A safe default accessible
name is used otherwise, but an explicit product-specific name is preferred.

## Calendar keyboard model

<DoctuiProvider>
  <Calendar
    v-model="date"
    month="2026-09"
    min-date="2026-08-20"
    max-date="2026-10-20"
    :first-day-of-week="1"
  />
</DoctuiProvider>

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
controls weekday and month labels. `minDate` and `maxDate` disable out-of-range
dates and keyboard movement does not focus those disabled dates.

## Month and year listboxes

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
