import { MonthPicker } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/MonthPicker",
  component: MonthPicker,
  args: {
    modelValue: "2026-09",
    year: 2026,
    locale: "en-US",
    disabled: false,
    ariaLabel: "Choose release month",
  },
  argTypes: {
    modelValue: { control: "text", table: { category: "Value" } },
    year: { control: "number", table: { category: "Value" } },
    locale: { control: "text", table: { category: "Localization" } },
    disabled: { control: "boolean", table: { category: "State" } },
    ariaLabel: { control: "text", table: { category: "Accessibility" } },
  },
} satisfies Meta<typeof MonthPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { padding: "1.5rem" } }, [h(MonthPicker, args)]),
    ),
};
