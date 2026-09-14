import { NativeDateInput } from "@doctui/dates";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Dates/NativeDateInput",
  component: NativeDateInput,
  args: {
    modelValue: "2026-09-14",
    label: "Native date",
    description:
      "Browser/OS date picker semantics with doctui field geometry. Use DateInput for a fully doctui-owned editable picker.",
    minDate: "2026-09-01",
    maxDate: "2026-10-31",
    disabled: false,
    clearable: true,
    size: "md",
    radius: "md",
  },
  argTypes: {
    id: { control: "text", table: { category: "Accessibility" } },
    modelValue: { control: "text", table: { category: "Value" } },
    label: { control: "text", table: { category: "Field" } },
    description: { control: "text", table: { category: "Field" } },
    error: { control: "text", table: { category: "Field" } },
    ariaLabel: { control: "text", table: { category: "Accessibility" } },
    minDate: { control: "text", table: { category: "Range" } },
    maxDate: { control: "text", table: { category: "Range" } },
    disabled: { control: "boolean", table: { category: "State" } },
    clearable: { control: "boolean", table: { category: "State" } },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
      table: { category: "Appearance" },
    },
    radius: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
      table: { category: "Appearance" },
    },
  },
} satisfies Meta<typeof NativeDateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h("div", { style: { maxWidth: "32rem", padding: "1.5rem" } }, [
        h(NativeDateInput, args),
      ]),
    ),
};
