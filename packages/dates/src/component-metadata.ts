export const DOCTUI_DATES_METADATA = [
  {
    name: "Calendar",
    package: "@doctui/dates",
    category: "inputs",
    description: "Month calendar that emits ISO date selections.",
    props: [
      "modelValue",
      "month",
      "minDate",
      "maxDate",
      "locale",
      "firstDayOfWeek",
    ],
    accessibility: [
      "Uses labeled native buttons and exposes selected dates with aria-pressed.",
    ],
  },
  {
    name: "DateInput",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "Native date input with doctui field labeling and clear behavior.",
    props: [
      "modelValue",
      "label",
      "error",
      "minDate",
      "maxDate",
      "disabled",
      "clearable",
    ],
    accessibility: [
      "Uses a native date input associated with its visible label.",
    ],
  },
  {
    name: "DatePicker",
    package: "@doctui/dates",
    category: "inputs",
    description: "Date input with an optional calendar selection panel.",
    props: ["modelValue", "label", "minDate", "maxDate", "clearable"],
    accessibility: [
      "The calendar toggle exposes expanded state and calendar buttons are keyboard accessible.",
    ],
  },
  {
    name: "DateTimePicker",
    package: "@doctui/dates",
    category: "inputs",
    description: "Native date-time input with Vue v-model support.",
    props: ["modelValue", "label", "disabled"],
  },
  {
    name: "MonthPicker",
    package: "@doctui/dates",
    category: "inputs",
    description: "Month selection control that emits YYYY-MM values.",
    props: ["modelValue", "year", "locale"],
  },
  {
    name: "YearPicker",
    package: "@doctui/dates",
    category: "inputs",
    description: "Year selection control over a configurable range.",
    props: ["modelValue", "minYear", "maxYear"],
  },
] as const;
