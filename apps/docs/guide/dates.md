<script setup lang="ts">
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  NativeDateInput,
  YearPicker,
} from "@doctui/dates";
import { DoctuiProvider, Stack, Text } from "@doctui/core";
import { ref } from "vue";

const date = ref<string | null>("2026-09-14");
const dateTime = ref("2026-09-14T09:30");
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

## DateInput

`DateInput` is the editable custom date field. Users can type a localized date
directly or open the doctui-owned day → month → year picker. The public model
value remains a strict `YYYY-MM-DD` string, while the visible text follows
`locale` (for example `14/09/2026` with `en-GB`).

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DateInput
      v-model="date"
      label="Release date"
      description="Type a date or use the custom picker."
      locale="en-GB"
      :first-day-of-week="1"
      min-date="2026-01-01"
      max-date="2027-12-31"
      clearable
    />
    <Text size="sm" muted>Selected: {{ date ?? "none" }}</Text>
  </Stack>
</DoctuiProvider>

Typed values are parsed according to the locale's day/month/year order and are
committed only when they form a valid in-range date. Invalid partial text stays
editable while the field is focused; on blur it returns to the last valid model
value. The calendar action exposes `aria-expanded`, `aria-controls` and
`aria-haspopup="dialog"`.

## DatePicker

`DatePicker` is the readonly/select-oriented counterpart to `DateInput`. It does
**not** render browser-native `input[type="date"]` chrome; the visible field is
a readonly text input with a locale-formatted value, SVG actions and an
accessible custom picker. Use `DateInput` when direct typing is required.

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

The picker has three connected views. It opens on the day grid; activating the
month/year title switches to the month list, and activating the year title from
there switches to the paged year list. Selecting a year returns to month
selection, then selecting a month returns to the day grid.

The field and calendar action expose `aria-expanded`, `aria-controls` and
`aria-haspopup="dialog"`. Opening moves focus into the active option. `Escape`
closes the popup and restores focus to the picker action; pointer input outside
closes it without moving focus. `disabled` is forwarded to the field, actions
and all picker views.

## NativeDateInput

`NativeDateInput` is the explicit browser-native escape hatch. It renders
`input[type="date"]` and reuses the core `TextInput` geometry, labels, errors,
sizing and clear behavior, but the browser or operating system owns the popup
UI. Use it when native semantics/platform integration matter more than visual
consistency.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <NativeDateInput
      v-model="date"
      label="Native start date"
      description="Browser/OS date picker with doctui field geometry."
      size="md"
      radius="md"
      clearable
    />
  </Stack>
</DoctuiProvider>

When no visible `label` is supplied, pass `ariaLabel`. Label, description and
error relationships are provided by the same SSR-safe core field structure used
by other doctui inputs.

## DateTimePicker

`DateTimePicker` uses a fully custom doctui surface instead of
`input[type="datetime-local"]`. It reuses the same day → month → year navigation
as `DatePicker`, then adds explicit hour and minute controls with `Now` and
`Apply` actions. This keeps the popup visually consistent across browsers and
platforms.

<DoctuiProvider>
  <Stack gap="md" style="max-width: 28rem;">
    <DateTimePicker
      v-model="dateTime"
      label="Publish at"
      description="Choose a local date and time"
      min-date="2026-01-01"
      max-date="2027-12-31"
      :first-day-of-week="1"
      clearable
    />
    <Text size="sm" muted>Selected: {{ dateTime }}</Text>
  </Stack>
</DoctuiProvider>

The public value remains a local `YYYY-MM-DDTHH:mm` string. Date and time edits
are kept as a draft while the popup is open; `Apply` commits the combined value.
Hour and minute inputs expose explicit accessible names, and `Escape` closes the
popup while restoring focus to the trigger.

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
    <YearPicker
      v-model="year"
      :min-year="1900"
      :max-year="2100"
      :page-size="12"
    />
  </Stack>
</DoctuiProvider>

Month and year pickers use `listbox` / `option` semantics with `aria-selected`.
Arrow keys move between options and Home/End jump to the first/last option.
`YearPicker` shows a bounded page of years and provides Previous years / Next
years controls, so large ranges do not become a long hidden scroll area.
`pageSize` defaults to 12 and is clamped to a practical 4–24 option window.

## Value validation

Date values are strict `YYYY-MM-DD` strings. Invalid or overflowing values such
as `2026-02-31`, `2026-13-01` or strings with trailing content are rejected by
`dateValue.parseDate()`. Calendar range checks use validated dates rather than
JavaScript's overflowing `new Date(year, month, day)` behavior.
