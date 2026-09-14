import { Calendar } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/Calendar",
  component: Calendar,
  args: {
    modelValue: "2026-09-14",
    month: "2026-09",
    minDate: "2026-08-20",
    maxDate: "2026-10-20",
    locale: "en-US",
    firstDayOfWeek: 1,
    disabled: false,
    ariaLabel: "Release calendar",
  },
  argTypes: {
    id: { control: "text", table: { category: "Accessibility" } },
    modelValue: { control: "text", table: { category: "Value" } },
    month: { control: "text", table: { category: "Value" } },
    minDate: { control: "text", table: { category: "Range" } },
    maxDate: { control: "text", table: { category: "Range" } },
    locale: { control: "text", table: { category: "Localization" } },
    firstDayOfWeek: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      table: { category: "Localization" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    ariaLabel: { control: "text", table: { category: "Accessibility" } },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { padding: "1.5rem" } }, [h(Calendar, args)]),
    ),
};
