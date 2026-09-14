import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  YearPicker,
} from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/Accessible pickers",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ControlledPicker: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-14");
      return h(DatePicker, {
        label: "Release date",
        description: "Choose a date between September 10 and September 25.",
        modelValue: date.value,
        minDate: "2026-09-10",
        maxDate: "2026-09-25",
        clearable: true,
        "onUpdate:modelValue": (value: string | null) => (date.value = value),
      });
    }),
};

export const FieldStates: Story = {
  render: () =>
    preview(() =>
      h("div", { style: { display: "grid", gap: "1rem", maxWidth: "28rem" } }, [
        h(DateInput, {
          label: "Start date",
          description: "Native date input with SSR-safe relationships.",
          modelValue: "2026-09-14",
          clearable: true,
        }),
        h(DateInput, {
          label: "End date",
          modelValue: null,
          error: "End date is required",
        }),
        h(DateTimePicker, {
          label: "Publish at",
          description: "Uses your local date and time.",
          modelValue: "2026-09-14T08:30",
          clearable: true,
        }),
        h(DatePicker, {
          label: "Disabled date picker",
          modelValue: "2026-09-14",
          disabled: true,
          clearable: true,
        }),
      ]),
    ),
};

export const KeyboardCalendar: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-14");
      const month = ref("2026-09");
      return h(
        "div",
        { style: { display: "grid", gap: "0.75rem", maxWidth: "22rem" } },
        [
          h(
            "p",
            { style: { margin: 0 } },
            "Focus a day and use Arrow keys, Home/End, or PageUp/PageDown.",
          ),
          h(Calendar, {
            modelValue: date.value,
            month: month.value,
            minDate: "2026-08-20",
            maxDate: "2026-10-20",
            firstDayOfWeek: 1,
            "onUpdate:modelValue": (value: string) => (date.value = value),
            "onUpdate:month": (value: string) => (month.value = value),
          }),
        ],
      );
    }),
};

export const MonthAndYearListboxes: Story = {
  render: () =>
    preview(() => {
      const month = ref("2026-09");
      const year = ref<number | null>(2026);
      return h(
        "div",
        { style: { display: "grid", gap: "1rem", maxWidth: "24rem" } },
        [
          h(MonthPicker, {
            modelValue: month.value,
            year: 2026,
            "onUpdate:modelValue": (value: string) => (month.value = value),
          }),
          h(YearPicker, {
            modelValue: year.value,
            minYear: 2024,
            maxYear: 2030,
            "onUpdate:modelValue": (value: number) => (year.value = value),
          }),
        ],
      );
    }),
};

export const AdvancedComposition: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-14");
      const month = ref("2026-09");
      const year = ref<number | null>(2026);
      return h(
        "section",
        {
          style: {
            display: "grid",
            gap: "1rem",
            maxWidth: "28rem",
            padding: "1rem",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-md)",
          },
        },
        [
          h("strong", null, "Schedule a release"),
          h(DatePicker, {
            label: "Release date",
            description:
              "Calendar popup closes on Escape and outside pointer input.",
            modelValue: date.value,
            clearable: true,
            "onUpdate:modelValue": (value: string | null) =>
              (date.value = value),
          }),
          h(DateTimePicker, {
            label: "Release time",
            modelValue: "2026-09-14T09:00",
          }),
          h(MonthPicker, {
            modelValue: month.value,
            year: 2026,
            "onUpdate:modelValue": (value: string) => (month.value = value),
          }),
          h(YearPicker, {
            modelValue: year.value,
            "onUpdate:modelValue": (value: number) => (year.value = value),
          }),
        ],
      );
    }),
};
