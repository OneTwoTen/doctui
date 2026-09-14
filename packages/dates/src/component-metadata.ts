export const DOCTUI_DATES_METADATA = [
  {
    name: "Calendar",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "Accessible month grid with ISO date values, range constraints and keyboard navigation.",
    props: [
      "id",
      "modelValue",
      "month",
      "minDate",
      "maxDate",
      "locale",
      "firstDayOfWeek",
      "disabled",
      "ariaLabel",
    ],
    accessibility: [
      "Uses grid/row/gridcell semantics with one roving tab stop.",
      "Arrow keys move by day/week, Home and End move within the week, and PageUp/PageDown move across months.",
      "The current date uses aria-current=date and the selected date uses aria-selected.",
    ],
  },
  {
    name: "DateInput",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "SSR-safe native date field with label, description, error and clear behavior.",
    props: [
      "id",
      "modelValue",
      "label",
      "description",
      "error",
      "ariaLabel",
      "minDate",
      "maxDate",
      "disabled",
      "clearable",
    ],
    accessibility: [
      "Uses Vue useId for stable label/description/error relationships during SSR hydration.",
      "Errors are referenced with aria-describedby and announced with role=alert.",
      "When no visible label is supplied, ariaLabel or the default Date accessible name is used.",
    ],
  },
  {
    name: "DatePicker",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "Date field with an accessible calendar popup and controlled ISO date value.",
    props: [
      "id",
      "modelValue",
      "label",
      "description",
      "error",
      "ariaLabel",
      "minDate",
      "maxDate",
      "disabled",
      "clearable",
      "locale",
      "firstDayOfWeek",
    ],
    accessibility: [
      "The popup trigger exposes aria-expanded, aria-controls and aria-haspopup=grid.",
      "Escape closes the popup and restores trigger focus; pointer input outside closes it without stealing focus.",
      "Disabled state is forwarded to the native field, trigger and calendar.",
    ],
  },
  {
    name: "DateTimePicker",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "SSR-safe native date-time field with shared label, description, error and clear behavior.",
    props: [
      "id",
      "modelValue",
      "label",
      "description",
      "error",
      "ariaLabel",
      "disabled",
      "clearable",
    ],
    accessibility: [
      "Uses the same stable described-by and alert relationships as DateInput.",
    ],
  },
  {
    name: "MonthPicker",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "Keyboard-navigable month listbox that emits YYYY-MM values.",
    props: ["modelValue", "year", "locale", "disabled", "ariaLabel"],
    accessibility: [
      "Uses listbox/option semantics with aria-selected and roving keyboard focus.",
    ],
  },
  {
    name: "YearPicker",
    package: "@doctui/dates",
    category: "inputs",
    description:
      "Keyboard-navigable year listbox over a configurable range.",
    props: [
      "modelValue",
      "minYear",
      "maxYear",
      "disabled",
      "ariaLabel",
    ],
    accessibility: [
      "Uses listbox/option semantics with aria-selected and roving keyboard focus.",
    ],
  },
] as const;
