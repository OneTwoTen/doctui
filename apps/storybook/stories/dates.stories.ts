import { DoctuiProvider, Stack, Text } from "@doctui/core";
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  NativeDateInput,
  YearPicker,
} from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/Date system",
  component: DatePicker,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Visual state and composition examples. Use Dates/DatePicker, DateInput, NativeDateInput, DateTimePicker, Calendar, MonthPicker, or YearPicker Playground stories for interactive Controls.",
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasStyle = {
  display: "grid",
  gap: "1.25rem",
  maxWidth: "34rem",
  padding: "1.5rem",
} as const;

export const PickerStates: Story = {
  render: () =>
    preview(() =>
      h("div", { style: canvasStyle }, [
        h(Text, { as: "strong" }, () => "DatePicker states"),
        h(DatePicker, {
          label: "Empty",
          modelValue: null,
          placeholder: "Choose a release date",
        }),
        h(DatePicker, {
          label: "Selected",
          description:
            "Open the picker and click the month/year header to move through day, month, and year views.",
          modelValue: "2026-09-14",
          clearable: true,
        }),
        h(DatePicker, {
          label: "Error",
          modelValue: null,
          error: "A release date is required",
        }),
        h(DatePicker, {
          label: "Disabled",
          modelValue: "2026-09-14",
          disabled: true,
          clearable: true,
        }),
      ]),
    ),
};

export const SizesAndRadii: Story = {
  render: () =>
    preview(() =>
      h("div", { style: canvasStyle }, [
        h(DatePicker, {
          label: "Small",
          modelValue: "2026-09-14",
          size: "sm",
          radius: "sm",
          clearable: true,
        }),
        h(DatePicker, {
          label: "Medium",
          modelValue: "2026-09-14",
          size: "md",
          radius: "md",
          clearable: true,
        }),
        h(DatePicker, {
          label: "Large",
          modelValue: "2026-09-14",
          size: "lg",
          radius: "lg",
          clearable: true,
        }),
      ]),
    ),
};

export const DateInputVariants: Story = {
  render: () =>
    preview(() =>
      h("div", { style: canvasStyle }, [
        h(DateInput, {
          label: "Custom editable DateInput",
          description:
            "Type a localized date directly or open the same doctui day/month/year picker used by DatePicker.",
          modelValue: "2026-09-14",
          locale: "en-GB",
          clearable: true,
        }),
        h(NativeDateInput, {
          label: "NativeDateInput",
          description:
            "Use this explicit native variant only when browser/OS date picker semantics are preferred over visual consistency.",
          modelValue: "2026-09-14",
          clearable: true,
        }),
        h(DateTimePicker, {
          label: "Custom DateTimePicker",
          description:
            "DateTimePicker uses doctui date views and custom hour/minute controls instead of browser datetime chrome.",
          modelValue: "2026-09-14T09:00",
          clearable: true,
        }),
      ]),
    ),
};

export const CalendarSurface: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-14");
      const month = ref("2026-09");
      return h("div", { style: canvasStyle }, [
        h(
          Text,
          { muted: true, size: "sm" },
          () =>
            "Adjacent-month days stay visible and keyboard navigation keeps one roving tab stop.",
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
      ]);
    }),
};

export const MonthAndYearSurfaces: Story = {
  render: () =>
    preview(() => {
      const month = ref("2026-09");
      const year = ref<number | null>(2026);
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "1.5rem",
          },
        },
        [
          h(MonthPicker, {
            modelValue: month.value,
            year: 2026,
            "onUpdate:modelValue": (value: string) => (month.value = value),
          }),
          h(YearPicker, {
            modelValue: year.value,
            minYear: 1900,
            maxYear: 2100,
            pageSize: 12,
            "onUpdate:modelValue": (value: number) => (year.value = value),
          }),
        ],
      );
    }),
};

export const SchedulingComposition: Story = {
  render: () =>
    preview(() => {
      const date = ref<string | null>("2026-09-14");
      const time = ref("2026-09-14T09:00");
      return h(
        "section",
        {
          style: {
            background: "var(--dui-color-surface-raised)",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-lg)",
            boxShadow: "var(--dui-shadow-sm)",
            maxWidth: "32rem",
            padding: "1.5rem",
          },
        },
        [
          h(Stack, { gap: "md" }, () => [
            h(Text, { as: "strong" }, () => "Schedule release"),
            h(
              Text,
              { muted: true, size: "sm" },
              () =>
                "A realistic composition using the same field geometry and picker surfaces across date and datetime controls.",
            ),
            h(DateInput, {
              label: "Release date",
              modelValue: date.value,
              locale: "en-GB",
              clearable: true,
              "onUpdate:modelValue": (value: string | null) =>
                (date.value = value),
            }),
            h(DateTimePicker, {
              label: "Fallback publish time",
              modelValue: time.value,
              clearable: true,
              "onUpdate:modelValue": (value: string) => (time.value = value),
            }),
          ]),
        ],
      );
    }),
};

export const DarkMode: Story = {
  render: () =>
    defineComponent({
      setup() {
        return () =>
          h(
            DoctuiProvider,
            { colorScheme: "dark" },
            {
              default: () =>
                h(
                  "div",
                  {
                    style: {
                      background: "var(--dui-color-body)",
                      color: "var(--dui-color-text)",
                      minHeight: "34rem",
                      padding: "1.5rem",
                    },
                  },
                  [
                    h(DateInput, {
                      label: "Editable release date",
                      description: "Dark mode is entirely token driven.",
                      modelValue: "2026-09-14",
                      locale: "en-GB",
                      clearable: true,
                    }),
                    h("div", { style: { marginTop: "1rem" } }, [
                      h(DateTimePicker, {
                        label: "Publish at",
                        modelValue: "2026-09-14T09:30",
                        clearable: true,
                      }),
                    ]),
                  ],
                ),
            },
          );
      },
    }),
};
