# Dates

`@doctui/dates` provides small, dependency-free date components that use
local calendar semantics and emit ISO values (`YYYY-MM-DD`).

```vue
<script setup lang="ts">
import { Calendar, DatePicker } from '@doctui/dates';
import { ref } from 'vue';

const date = ref<string | null>('2026-09-12');
</script>

<template>
  <DatePicker v-model="date" label="Release date" />
  <Calendar v-model="date" min-date="2026-01-01" />
</template>
```

The package also exports `DateInput`, `DateTimePicker`, `MonthPicker`, and
`YearPicker`. `minDate` and `maxDate` constrain calendar selection; native
date inputs retain the browser's familiar keyboard and locale behavior.
